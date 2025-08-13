import { collection, doc, getDoc, getDocs, increment, limit, orderBy, query, Timestamp, updateDoc, where } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { auth } from "firebase-admin";

// Function to update the next deadline for a student
// export const updateNextDeadlineForStudent = async (studentId: string, dueDate: Date | Timestamp | undefined) => {
//     try {

//         if (!dueDate) {
//             console.log("No due date provided")
//             return
//         }

//         const dueDateTs = dueDate instanceof Timestamp ? dueDate : Timestamp.fromDate(dueDate);


//         // Get the student's doc reference and data
//         const studentDocRef = doc(db, "studentUsers", studentId);
//         const studentDocSnap = await getDoc(studentDocRef);
//         const studentData = studentDocSnap.data();
//         console.log('StudentData in statUtils', studentData)

//         // Extract the current nextDeadline from the student's stats
//         const nextDeadlineRaw = studentData?.stats?.nextDeadline;
//         const nextDeadline = nextDeadlineRaw
//         ? new Timestamp(nextDeadlineRaw.seconds, nextDeadlineRaw.nanoseconds)
//         : null;

//         // If no next deadline exists, set it to the current assignment's due date
//         if (!nextDeadline) {
//             await updateDoc(studentDocRef, {
//                 // "stats.nextDeadline": dueDate
//                 "stats.nextDeadline": dueDateTs
//             });
//             return
//         }

//         const now = Timestamp.fromDate(new Date());
//         console.log('dueDateTs', dueDateTs)

//         // If the current next deadline is in the past and the new due date is in the future, update it
//         if (nextDeadline.seconds < now.seconds && dueDateTs.seconds >= now.seconds) {
//             await updateDoc(studentDocRef, { "stats.nextDeadline": dueDateTs });
//         // If the new due date is earlier than the current next deadline and both are in the future, update it
//         } else if (
//             nextDeadline.seconds >= now.seconds &&
//             dueDateTs.seconds >= now.seconds &&
//             dueDateTs.seconds < nextDeadline.seconds
//         ) {
//             await updateDoc(studentDocRef, { "stats.nextDeadline": dueDateTs });
//         }

//         // TODO: Next deadline should be updated to N/A when all assignments are completed

//     } catch (error) {
//         console.log("Error updating nextDeadline:", error)
//     }
// }


export const updateNextDeadlineForStudent = async (studentId: string, dueDate: Date | Timestamp | undefined, consultantId: string) => {
  try {
    // console.log('Starting updateNextDeadline for student:', studentId);
    // console.log('Current user:', auth.currentUser?.uid); // Add this import if needed
    
    const q = query(
      collection(db, 'assignments'),
      where('studentId', '==', studentId),
      where('consultantId', '==', consultantId),
      where('status', '==', 'In-Progress'),
      orderBy('dueDate', 'asc'),
      limit(1)
    )
    
    console.log('About to query assignments...');
    const snapshot = await getDocs(q);
    console.log('Query successful, snapshot empty?', snapshot.empty);
    
    // If no upcoming assignments
    if (snapshot.empty) {
      console.log('No upcoming assignments, setting nextDeadline to null');
      await updateDoc(doc(db, "studentUsers", studentId), {
        "stats.nextDeadline": null,
      });
      console.log('Successfully updated to null');
      return;
    }

    // Update the nextDeadline to the earliest pulled assignment
    const nextAssignment = snapshot.docs[0].data();
    console.log('nextAssignment:', nextAssignment);
    console.log('About to update student document...');
    
    await updateDoc(doc(db, "studentUsers", studentId), {
      "stats.nextDeadline": nextAssignment.dueDate,
    });
    
    console.log('Successfully updated nextDeadline');
  } catch (error) {
    console.log("Error updating nextDeadline:", error);
    console.error("Full error:", error); // This will show the full error stack
  }
}


// Function to update the InProgress assignments count for a student
export const updateInProgressCount = async (studentId: string, newStatus: string, oldStatus?: string) => {
    try {
        // Get the student's doc reference
        const studentDocRef = doc(db, "studentUsers", studentId);

        // Update the InProgress assignments count, if added assignment is InProgress then add to count, if not then subtract
        // Use increment to update the count without reads
        
        // Creating a document, automatically InProgress
        // if (newStatus === 'In-Progress' && !oldStatus) {
        //     await updateDoc(studentDocRef, {
        //         "stats.inProgressAssignmentsCount": increment(1)
        //     })
        //     return
        // }
        
        // Changing status from InProgress to non-InProgress
        if (oldStatus === 'In-Progress' && newStatus != 'In-Progress') {
            await updateDoc(studentDocRef, {
                "stats.inProgressAssignmentsCount": increment(-1)
            })
            return
        }
        
        // Changing status from non-InProgress to non-InProgress
        // if (newStatus != 'InProgress' && oldStatus != 'InProgress') return

        // Changing status from non-InProgress back to InProgress
        if (oldStatus !='In-Progress' && newStatus === 'In-Progress') {
            await updateDoc(studentDocRef, {
                "stats.inProgressAssignmentsCount": increment(1)
            })
            return
        }
    } catch (error) {
        console.log("Error updating In-Progress assignments:", error)
    }
}