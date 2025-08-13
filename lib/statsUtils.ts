import { collection, doc, getDocs, increment, limit, orderBy, query, Timestamp, updateDoc, where } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const updateNextDeadlineForStudent = async (studentId: string, dueDate: Date | Timestamp | undefined, consultantId: string) => {
  try {

    const q = query(
      collection(db, 'assignments'),
      where('studentId', '==', studentId),
      where('consultantId', '==', consultantId),
      where('status', '==', 'In-Progress'),
      orderBy('dueDate', 'asc'),
      limit(1)
    )
    
    const snapshot = await getDocs(q);
    
    // If no upcoming assignments
    if (snapshot.empty) {
      await updateDoc(doc(db, "studentUsers", studentId), {
        "stats.nextDeadline": null,
      });
      return;
    }

    // Update the nextDeadline to the earliest pulled assignment
    const nextAssignment = snapshot.docs[0].data();
    
    await updateDoc(doc(db, "studentUsers", studentId), {
      "stats.nextDeadline": nextAssignment.dueDate,
    });
      } catch (error) {
    console.log("Error updating nextDeadline:", error);
    console.error("Full error:", error);
  }
}


// Function to update the InProgress assignments count for a student
export const updateInProgressCount = async (studentId: string, newStatus: string, oldStatus?: string) => {
    try {
        // Get the student's doc reference
        const studentDocRef = doc(db, "studentUsers", studentId);

        // Changing status from InProgress to non-InProgress
        if (oldStatus === 'In-Progress' && newStatus != 'In-Progress') {
            await updateDoc(studentDocRef, {
                "stats.inProgressAssignmentsCount": increment(-1)
            })
            return
        }

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