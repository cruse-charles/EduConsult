import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

// TODO: We don't really need to do all this. We can just see if assigmentDocIds is empty and put in 
// the deadline of the asssignment, if it is not empty then we just check the assignnment we are creating
// and compare it with the current nextDeadline

// TODO: Need to not count dates previous to today's current date
export const updateNextDeadline = async (studentId: string, dueDate: Date | Timestamp | undefined) => {
    try {
        console.log('Due Date', dueDate)

        if (!dueDate) {
            console.log("No due date provided")
            return
        }

        const studentDocRef = doc(db, "studentUsers", studentId);
        const studentDocSnap = await getDoc(studentDocRef);

        const studentData = studentDocSnap.data();
        console.log('studentData', studentDocSnap.data())
        const nextDeadline = studentData?.stats?.nextDeadline;
        console.log('Next deadline', nextDeadline)

        // If no next deadline exists, set it to the current assignment's due date
        if (!nextDeadline) {
            await updateDoc(studentDocRef, {
                        // @ts-ignore
                "stats.nextDeadline": dueDate
            });
        }

        // If the current assignment's due date is earlier than the next deadline and after current date, update it
                // @ts-ignore
        if (dueDate < nextDeadline && dueDate > Timestamp.fromDate(new Date())) {
            // console.log('Updating nextDeadline', dueDate)
            await updateDoc(studentDocRef, {
                                // @ts-ignore
                "stats.nextDeadline": dueDate
            });
        }












        // // Get the student's doc reference and fetch snapshot
        // const studentDocRef = doc(db, "studentUsers", studentId);
        // const studentDocSnap = await getDoc(studentDocRef);

        // // Check if document exists
        // // TODO: See what a return here should be
        // if (!studentDocSnap.exists()) {
        //     console.log("No such student document!");
        //     return null;
        // }

        // // Retrieve student's data and assignmentDocIds
        // const studentData = studentDocSnap.data();
        // const assignmentDocIds = studentData.assignmentDocIds || [];

        // // Retrieve the due date for all assignments
        // const dueDates = await Promise.all( 
        //     assignmentDocIds.map(async (assignmentDocId: string) => {
        //         const assignmentDocRef = doc(db, "assignments", assignmentDocId);
        //         const assignmentDocSnap = await getDoc(assignmentDocRef);

        //         if (!assignmentDocSnap.exists()) {
        //             console.log('No assignment document found')
        //             return
        //         }

        //         return assignmentDocSnap.data().dueDate;
        //     })
        // )

        // // Find the earliest due date
        // const earliest = dueDates.reduce((min, timestamp) => 
        //     timestamp.seconds < min.seconds ? timestamp : min
        // );

        // // Update the student's nextDeadline field
        // await updateDoc(studentDocRef, {
        //     "stats.nextDeadline": earliest
        // });

    } catch (error) {
        console.log("Error updating nextDeadline:", error)
    }
}

export const updatePendingCount = async (studentId: string, status: string) => {
    try {
        // Get the student's doc reference and fetch snapshot
        const studentDocRef = doc(db, "studentUsers", studentId);
        const studentDocSnap = await getDoc(studentDocRef);

        // Check if document exists
        if (!studentDocSnap.exists()) {
            console.log("No student document found!");
            return;
        }

        // Retrieve student's data and pending assignments count
        const studentData = studentDocSnap.data();
        const pendingAssignmentsCount = studentData.stats?.pendingAssignmentsCount || 0;
        console.log(pendingAssignmentsCount, 'Pending Assignment Count')

        // Update the pending assignments count, if added assignment is pending then add to count, if not then subtract
        if (status === 'Pending') {
            console.log('Entering pending clause')
            await updateDoc(studentDocRef, {
                "stats.pendingAssignmentsCount": pendingAssignmentsCount + 1
            })
        } else {
            console.log('Entering other clause')
            await updateDoc(studentDocRef, {
                "stats.pendingAssignmentsCount": Math.max(pendingAssignmentsCount - 1, 0)
            })
        }

    } catch (error) {
        console.log("Error updating pending assignments:", error)
    }
}