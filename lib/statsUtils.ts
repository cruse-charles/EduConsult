import { doc, getDoc, increment, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";


export const updateNextDeadline = async (studentId: string, dueDate: Date | Timestamp | undefined) => {
    try {

        if (!dueDate) {
            console.log("No due date provided")
            return
        }

        const studentDocRef = doc(db, "studentUsers", studentId);
        const studentDocSnap = await getDoc(studentDocRef);

        const studentData = studentDocSnap.data();
        const nextDeadline = studentData?.stats?.nextDeadline;

        // If no next deadline exists, set it to the current assignment's due date
        if (!nextDeadline) {
            await updateDoc(studentDocRef, {
                "stats.nextDeadline": dueDate
            });
        }

        // If the current assignment's due date is earlier than the next deadline and after current date, update it
        if (dueDate < nextDeadline && dueDate > Timestamp.fromDate(new Date())) {
            await updateDoc(studentDocRef, {
                "stats.nextDeadline": dueDate
            });
        }

        // TODO: Next deadline should be updated to N/A when all assignments are completed

    } catch (error) {
        console.log("Error updating nextDeadline:", error)
    }
}

export const updatePendingCount = async (studentId: string, status: string) => {
    try {
        // Get the student's doc reference and fetch snapshot
        const studentDocRef = doc(db, "studentUsers", studentId);
        // const studentDocSnap = await getDoc(studentDocRef);

        // Check if document exists
        // if (!studentDocSnap.exists()) {
        //     console.log("No student document found!");
        //     return;
        // }

        // Retrieve student's data and pending assignments count
        // const studentData = studentDocSnap.data();
        // const pendingAssignmentsCount = studentData.stats?.pendingAssignmentsCount || 0;
        // console.log(pendingAssignmentsCount, 'Pending Assignment Count')

        // Update the pending assignments count, if added assignment is pending then add to count, if not then subtract
        // Use increment to update the count without reads
        if (status === 'Pending') {
            console.log('Entering pending clause')
            await updateDoc(studentDocRef, {
                // "stats.pendingAssignmentsCount": pendingAssignmentsCount + 1
                "stats.pendingAssignmentsCount": increment(1)
            })
        } else {
            console.log('Entering other clause')
            await updateDoc(studentDocRef, {
                // "stats.pendingAssignmentsCount": Math.max(pendingAssignmentsCount - 1, 0)
                "stats.pendingAssignmentsCount": increment(-1)
            })
        }

    } catch (error) {
        console.log("Error updating pending assignments:", error)
    }
}