import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

// TODO: We don't really need to do all this. We can just see if assigmentDocIds is empty and put in 
// the deadline of the asssignment, if it is not empty then we just check the assignnment we are creating
// and compare it with the current nextDeadline

// TODO: Need to not count dates previous to today's current date
export const updateNextDeadline = async (studentId: string) => {
    try {
        // Get the student's doc reference and fetch snapshot
        const studentDocRef = doc(db, "studentUsers", studentId);
        const studentDocSnap = await getDoc(studentDocRef);

        // Check if document exists
        // TODO: See what a return here should be
        if (!studentDocSnap.exists()) {
            console.log("No such student document!");
            return null;
        }

        // Retrieve student's data and assignmentDocIds
        const studentData = studentDocSnap.data();
        const assignmentDocIds = studentData.assignmentDocIds || [];

        // Retrieve the due date for all assignments
        const dueDates = await Promise.all( 
            assignmentDocIds.map(async (assignmentDocId: string) => {
                const assignmentDocRef = doc(db, "assignments", assignmentDocId);
                const assignmentDocSnap = await getDoc(assignmentDocRef);

                if (!assignmentDocSnap.exists()) {
                    console.log('No assignment document found')
                    return
                }

                return assignmentDocSnap.data().dueDate;
            })
        )

        // Find the earliest due date
        const earliest = dueDates.reduce((min, timestamp) => 
            timestamp.seconds < min.seconds ? timestamp : min
        );

        // Update the student's nextDeadline field
        await updateDoc(studentDocRef, {
            "stats.nextDeadline": earliest
        });

    } catch (error) {
        console.log("Error updating nextDeadline:", error)
    }
}

export const updatePendingAssignments = async (studentId: string, status: string) => {
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

        // Update the pending assignments count, if added assignment is pending then add to count, if not then subtract
        if (status === 'pending') {
            await updateDoc(studentDocRef, {
                "stats.pendingAssignmentsCount": pendingAssignmentsCount + 1
            })
        } else {
            await updateDoc(studentDocRef, {
                "stats.pendingAssignmentsCount": Math.max(pendingAssignmentsCount - 1, 0)
            })
        }

    } catch (error) {
        console.log("Error updating pending assignments:", error)
    }
}