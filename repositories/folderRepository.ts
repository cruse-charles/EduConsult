import { db } from "@/lib/firebaseConfig";
import { arrayRemove, arrayUnion, collection, doc, getDocs, increment, query, where, writeBatch } from "firebase/firestore";


export const deleteFolder = async (studentId: string, folderName: string, consultantId: string) => {
    try {
        // Reference for student
        const studentDocRef = doc(db, "studentUsers", studentId)

        // Count for inProgress assignments as we delete 
        let inProgressCount = 0
        
        // Query assignments in the specified folder for the student
        const q = query(
            collection(db, 'assignments'),
            where('folder', '==', folderName),
            where('studentId', '==', studentId),
            where('consultantId', '==', consultantId)
        )
        const assignmentsSnapshot = await getDocs(q);

        // Initialize batch
        const batch = writeBatch(db)

        // Delete all assignments in the folder from assignments collection and remove their IDs from student doc
        assignmentsSnapshot.forEach((assignmentDocSnapshot) => {
            const assignmentData = assignmentDocSnapshot.data()

            // Increment count of in-progress assignments that we update stat highlights for later 
            if (assignmentData.status === "In-Progress") {
                inProgressCount++
                console.log('inProgressCount - ', inProgressCount)
            }

            // Delete assignment doc and remove from student assignmentDocIds array
            batch.delete(assignmentDocSnapshot.ref);
            batch.update(studentDocRef, {
                assignmentDocIds: arrayRemove(assignmentDocSnapshot.id),
            });
            
        });
        
        // Decrement in-progress count for student
        if (inProgressCount > 0) {
            batch.update(studentDocRef, {
                "stats.inProgressAssignmentsCount": increment(-inProgressCount),
            })
        }

        // TODO: DELETE ASSIGNMENT METADATA FROM BOTH USERS
        
        // Remove folder name from student doc
        batch.update(studentDocRef, {
            "system.folders": arrayRemove(folderName),
        });


        // Commit all at once
        await batch.commit();        
    } catch (error) {
        console.log("Error deleting folder", error)
        throw error
    }
}

export const renameFolder = async (studentId: string, oldFolderName: string, newFolderName: string, consultantId: string) => {
    try {

        // Reference for student
        const studentDocRef = doc(db, "studentUsers", studentId)
        
        // Query assignments in the specified folder for the student
        const q = query(
            collection(db, 'assignments'),
            where('folder', '==', oldFolderName),
            where('studentId', '==', studentId),
            where('consultantId', '==', consultantId)
        )
        
        // Initialize batch
        const batch = writeBatch(db)
        
        // Rename folder for all assignments in the folder
        const snapshot = await getDocs(q);
    
        snapshot.forEach((docSnapshot) => {
            batch.update(docSnapshot.ref, {
                folder: newFolderName
            });
        });

        // Remove old name, then add new name
        batch.update(studentDocRef, {
            "system.folders": arrayRemove(oldFolderName)
        })
        batch.update(studentDocRef, {
            "system.folders": arrayUnion(newFolderName)
        })

        await batch.commit()

    } catch (error) {
        console.log("Error renaming folder", error)
        throw error
    }
}