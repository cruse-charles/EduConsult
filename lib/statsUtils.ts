import { doc, getDoc, increment, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Function to update the next deadline for a student
export const updateNextDeadlineForStudent = async (studentId: string, dueDate: Date | Timestamp | undefined) => {
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

        // Extract the current nextDeadline from the student's stats
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

        const now = Timestamp.fromDate(new Date());

        // If the current next deadline is in the past and the new due date is in the future, update it
        if (nextDeadline.seconds < now.seconds && dueDateTs.seconds >= now.seconds) {
            await updateDoc(studentDocRef, { "stats.nextDeadline": dueDateTs });
        // If the new due date is earlier than the current next deadline and both are in the future, update it
        } else if (
            nextDeadline.seconds >= now.seconds &&
            dueDateTs.seconds >= now.seconds &&
            dueDateTs.seconds < nextDeadline.seconds
        ) {
            await updateDoc(studentDocRef, { "stats.nextDeadline": dueDateTs });
        }

        // TODO: Next deadline should be updated to N/A when all assignments are completed

    } catch (error) {
        console.log("Error updating nextDeadline:", error)
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
        if (newStatus === 'InProgress' && !oldStatus) {
            await updateDoc(studentDocRef, {
                "stats.inProgressAssignmentsCount": increment(1)
            })
            return
        }
        
        // Changing status from InProgress to non-InProgress
        if (oldStatus === 'InProgress' && newStatus != 'InProgress') {
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