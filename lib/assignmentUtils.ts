import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "@/lib/firebaseConfig";
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, increment, query, setDoc, Timestamp, updateDoc, where, writeBatch } from "firebase/firestore";

import { Assignment, AssignmentUpload, Entry, UpdateAssignment } from "./types/types";
import { updateNextDeadlineForStudent } from "./statsUtils";

import { nanoid } from "@reduxjs/toolkit";

export const fileUpload = async (files: File[], studentId: string) => {
    const filesData = []

    // Iterate through the files and upload each one to Firebase Storage
    for (const file of Array.from(files) as File[]) {
        // Generate a unique file name to avoid naming conflicts
        const uniqueName = `${Date.now()}-${file.name}`;
                
        // Create a storage reference and define the path where the file will be stored
        const storagePath = `assignments/${studentId}/${uniqueName}`
        const storageRef = ref(storage, storagePath);
                
        // Upload file to the storage reference, create a downloadable URL, and store the file metadata
        try {
            const snapshot = await uploadBytes(storageRef, file)
            const downloadUrl = await getDownloadURL(storageRef)
    
            filesData.push({
                storagePath,
                downloadUrl,
                originalName: file.name,
                uploadedAt: new Date(),
            })
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }

    return filesData
}
// TODO: We are currently doing four separate writes, batch them to safegaurd against partial updates and improve performance
export const uploadAssignment = async (assignmentData: AssignmentUpload, studentId: string, consultantId: string) => {

    try {
        const assignmentDocId = nanoid()

        // Create a new Doc
        const assignmentDocRef = doc(db, "assignments", assignmentDocId)
        await setDoc(assignmentDocRef, assignmentData)

        // Update nextDeadline field for student
        await updateNextDeadlineForStudent(studentId, assignmentData.dueDate, consultantId)
    
        // Update folder names in student's doc
        await updateDoc(doc(db, "studentUsers", studentId), {
            assignmentDocIds: arrayUnion(assignmentDocId),
            folders: arrayUnion(assignmentData.folder)
        })

        // Update assignmentMetaData subcollection for consultant and student
        await setDoc(doc(db, "consultantUsers", consultantId, "assignmentMeta", assignmentDocId), {
            hasRead: true,
            lastSeenAt: Timestamp.now(),
            lastActivityAt: Timestamp.now()
        })

        // Update assignmentMetaData subcollection for consultant
        await setDoc(doc(db, "studentUsers", studentId, "assignmentMeta", assignmentDocId), {
            hasRead: false,
            lastSeenAt: Timestamp.now(),
            lastActivityAt: Timestamp.now()
        })
    
        return assignmentDocId
    } catch (error) {
        console.log("Error adding assignment: ", error)
        throw error
    }

}

// Update an assignment from consultant view
// TODO: This function needs to update the AssignmentMeta for student
export const updateAssignment = async (assignmentData: UpdateAssignment, assignmentId: string, studentId: string, consultantId: string) => {
    try {
        // Get reference to the assignment document
        const assignmentDocRef = doc(db, "assignments", assignmentId);

        // Update assignment doc
        // @ts-ignore
        await updateDoc(assignmentDocRef, assignmentData);

        // Update nextDeadline field for student
        await updateNextDeadlineForStudent(studentId, assignmentData.dueDate, consultantId);
    } catch (error) {
        console.log('Error updating assignment in updateAssignment', error)
        throw error
    }
}

// update Assignment status when student submits
export const updateAssignmentStatus = async (assignmentId: string, status: string, updatedAssignment: Assignment) => {
    try {
        // Get reference to the assignment document
        const assignmentDocRef = doc(db, "assignments", assignmentId);

        // Update doc
        // @ts-ignore
        await updateDoc(assignmentDocRef, {status});
    } catch (error) {
        console.log('Error updating assignment in updateAssignment', error)
        throw error
    }
}

// Adding an entry to an assignment's timeline
// TODO: This function needs permissions for the student to update the assignmentMetaData in consultantUsers 
export const uploadEntry = async (entryData: Entry, assignmentDocId: string, consultantId: string, studentId: string, userId: string) => {
    try {
        await updateDoc(doc(db, "assignments", assignmentDocId), {
            timeline: arrayUnion(entryData)
        })

        const isConsultant = userId === consultantId

        await updateDoc(doc(db, "consultantUsers", consultantId, "assignmentMeta", assignmentDocId), {
            hasRead: isConsultant,
            lastActivityAt: Timestamp.now(),
            lastSeenAt: Timestamp.now()
        })

        await updateDoc(doc(db, "studentUsers", studentId, "assignmentMeta", assignmentDocId), {
            hasRead: !isConsultant,
            lastActivityAt: Timestamp.now(),
            lastSeenAt: Timestamp.now()
        })

    } catch (error) {
        console.log("Error updating assignment in uploadEntry", error)
        throw error
    }
}

// Deleting an assignment
export const deleteAssignment = async (assignmentId: string, studentId: string, consultantId: string) => {
    try {
        // Retrieve assignment status to update in-progress count in highlights if needed
        const assignmentDocRef = doc(db, "assignments", assignmentId)
        const assignmentDocSnap = await getDoc(assignmentDocRef)
        const assignmentData = assignmentDocSnap.data()
        const assignmentStatus = assignmentData?.status

        if (assignmentStatus === "In-Progress") {
            await updateDoc(doc(db, "studentUsers", studentId), {
                "stats.inProgressAssignmentsCount": increment(-1)
            })
        }

        // Delete assignment document
        await deleteDoc(doc(db, "assignments", assignmentId))

        // Remove assignment ID from student document
        const studentDocRef = doc(db, "studentUsers", studentId)

        await updateDoc(studentDocRef, {
            assignmentDocIds: arrayRemove(assignmentId)
        })

        // Delete assignmentMetaData for consultant and student
        await deleteDoc(doc(db, "studentUsers", studentId, "assignmentMeta", assignmentId))
        await deleteDoc(doc(db, "consultantUsers", consultantId, "assignmentMeta", assignmentId))

        // TODO: Have a popup that confirms deleted assignment and created and updated
    } catch (error) {
        console.log("Error deleting assignment", error)
        throw error
    }
}

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
            folders: arrayRemove(folderName),
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
            folders: arrayRemove(oldFolderName)
        })
        batch.update(studentDocRef, {
            folders: arrayUnion(newFolderName)
        })

        await batch.commit()

    } catch (error) {
        console.log("Error renaming folder", error)
        throw error
    }
}

// When student opens an assignment, update the hasRead and lastSeenAt fields in the assignmentMeta subcollection for that assignment
export const readAssignment = async(assignmentId: string, database: string, userId: string) => {
    try {
        const metaDataDocRef = doc(db, database, userId, "assignmentMeta", assignmentId)
        
        await updateDoc(metaDataDocRef, {
            hasRead: true,
            lastSeenAt: Timestamp.now()
        })
    } catch (error) {
        console.log("Error updataing assignment metadata in readAssignment", error)
    }
}