import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const updateNextDeadline = async (studentId) => {
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
            assignmentDocIds.map(async (assignmentDocId) => {
                const assignmentDocRef = doc(db, "assignments", assignmentDocId);
                const assignmentDocSnap = await getDoc(assignmentDocRef);
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