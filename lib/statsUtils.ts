import { doc, getDoc, increment, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Function to update the next deadline for a student
export const updateNextDeadline = async (studentId: string, dueDate: Date | Timestamp | undefined) => {
    try {

        if (!dueDate) {
            console.log("No due date provided")
            return
        }

        const dueDateTs = dueDate instanceof Timestamp ? dueDate : Timestamp.fromDate(dueDate);


        // Get the student's doc reference and data
        const studentDocRef = doc(db, "studentUsers", studentId);
        const studentDocSnap = await getDoc(studentDocRef);
        const studentData = studentDocSnap.data();
        // const nextDeadline = studentData?.stats?.nextDeadline;
        const nextDeadlineRaw = studentData?.stats?.nextDeadline;
        const nextDeadline = nextDeadlineRaw
        ? new Timestamp(nextDeadlineRaw.seconds, nextDeadlineRaw.nanoseconds)
        : null;

        // If no next deadline exists, set it to the current assignment's due date
        if (!nextDeadline) {
            await updateDoc(studentDocRef, {
                // "stats.nextDeadline": dueDate
                "stats.nextDeadline": dueDateTs
            });
            return
        }

        console.log('New Assignment DueDate', dueDate)
        console.log('Existing nextDeadline stat', nextDeadline)
        const now = Timestamp.fromDate(new Date());
        console.log('hello')
        console.log('compare due dates', dueDateTs.toMillis() < nextDeadline.toMillis() &&
                dueDateTs.toMillis() > now.toMillis())

        // If the current assignment's due date is earlier than the next deadline and after current date, update it
        // if (dueDate < nextDeadline && dueDate > Timestamp.fromDate(new Date())) {
        // if (
        //     dueDateTs.toMillis() < nextDeadline.toMillis() &&
        //     dueDateTs.toMillis() > now.toMillis()
        // ) {
        // await updateDoc(studentDocRef, {
        //     // "stats.nextDeadline": dueDate
        //     "stats.nextDeadline": dueDateTs
        // })}

        // Case 1: The current nextDeadline is in the past → always replace it with the new valid dueDate
        if (nextDeadline.toMillis() < now.toMillis() && dueDateTs.toMillis() >= now.toMillis()) {
            await updateDoc(studentDocRef, { "stats.nextDeadline": dueDateTs });
        } else if (
            // Case 2: The current nextDeadline is in the future → only replace if new dueDate is earlier (but still in future)
            nextDeadline.toMillis() >= now.toMillis() &&
            dueDateTs.toMillis() >= now.toMillis() &&
            dueDateTs.toMillis() < nextDeadline.toMillis()
        ) {
            await updateDoc(studentDocRef, { "stats.nextDeadline": dueDateTs });
        }

        // TODO: Next deadline should be updated to N/A when all assignments are completed

    } catch (error) {
        console.log("Error updating nextDeadline:", error)
    }
}

// Function to update the pending assignments count for a student
export const updatePendingCount = async (studentId: string, status: string) => {
    try {
        // Get the student's doc reference
        const studentDocRef = doc(db, "studentUsers", studentId);

        // Update the pending assignments count, if added assignment is pending then add to count, if not then subtract
        // Use increment to update the count without reads
        if (status === 'Pending') {
            await updateDoc(studentDocRef, {
                "stats.pendingAssignmentsCount": increment(1)
            })
        } else {
            await updateDoc(studentDocRef, {
                "stats.pendingAssignmentsCount": increment(-1)
            })
        }

    } catch (error) {
        console.log("Error updating pending assignments:", error)
    }
}