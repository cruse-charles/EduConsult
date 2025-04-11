import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

// TODO: We don't really need to do all this. We can just see if assigmentDocIds is empty and put in 
// the deadline of the asssignment, if it is not empty then we just check the assignnment we are creating
// and compare it with the current nextDeadline

// TODO: Need to not count dates previous to today's current date
export const updateNextDeadline = async (studentId: string) => {
    try {
        const studentDocRef = doc(db, "studentUsers", studentId);
        const studentDocSnap = await getDoc(studentDocRef);

        if (!studentDocSnap.exists()) {
            console.log("No such student document!");
            return null;
        }

        const studentData = studentDocSnap.data();
        const assignmentDocIds = studentData.assignmentDocIds || [];
        // CORRECT ABOVE

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

        // CORRECT ABOVE
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
        const studentDocRef = doc(db, "studentUsers", studentId);
        const studentDocSnap = await getDoc(studentDocRef);

        if (!studentDocSnap.exists()) {
            console.log("No student document found!");
            return;
        }

        const studentData = studentDocSnap.data();
        const pendingAssignmentsCount = studentData.stats?.pendingAssignmentsCount || 0;

        // Update the pending assignments count
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