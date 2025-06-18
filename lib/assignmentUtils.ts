import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "@/lib/firebaseConfig";
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDocs, query, setDoc, Timestamp, updateDoc, where, writeBatch } from "firebase/firestore";

import { Assignment, AssignmentBase, AssignmentUpload, Entry, UpdateAssignment } from "./types/types";
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

export const uploadAssignment = async (assignmentData: AssignmentUpload, studentId: string, consultantId: string) => {

    try {
        const assignmentDocId = nanoid()
        console.log("Consultant on uplaoding assignment", consultantId)
    

        // Create a new Doc
        const assignmentDocRef = doc(db, "assignments", assignmentDocId)
        await setDoc(assignmentDocRef, assignmentData)

        // Update nextDeadline field for student
        await updateNextDeadlineForStudent(studentId, assignmentData.dueDate)
    
        // Update folder names in student's doc
        await updateDoc(doc(db, "studentUsers", studentId), {
            assignmentDocIds: arrayUnion(assignmentDocId),
            folders: arrayUnion(assignmentData.folder)
        })
    
        return assignmentDocId
    } catch (error) {
        console.log("Error adding assignment: ", error)
        throw error
    }

}

// Update an assignment from consultant view
export const updateAssignment = async (assignmentData: UpdateAssignment, assignmentId: string, studentId: string) => {
    try {
        // Get reference to the assignment document
        const assignmentDocRef = doc(db, "assignments", assignmentId);
        console.log('UpdateAssignmet in utils, assignmentData', assignmentData)

        // Update doc
        // @ts-ignore
        await updateDoc(assignmentDocRef, assignmentData);

        // Update nextDeadline field for student
        await updateNextDeadlineForStudent(studentId, assignmentData.dueDate)
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
export const uploadEntry = async (entryData: Entry, assignmentDocId: string) => {
    try {
        await updateDoc(doc(db, "assignments", assignmentDocId), {
            timeline: arrayUnion(entryData)
        })
    } catch (error) {
        console.log("Error updating assignment in uploadEntry", error)
        throw error
    }
}

// Deleting an assignment
export const deleteAssignment = async (assignmentId: string, studentId: string) => {
    try {
        await deleteDoc(doc(db, "assignments", assignmentId))

        const studentDocRef = doc(db, "studentUsers", studentId)

        await updateDoc(studentDocRef, {
            assignmentDocIds: arrayRemove(assignmentId)
        })

        // TODO: Have a popup that confirms deleted assignment and created and updated
        console.log("Assignment deleted successfully")
    } catch (error) {
        console.log("Error deleting assignment", error)
        throw error
    }
}

export const deleteFolder = async (studentId: string, folderName: string) => {
    try {
        // Reference for student
        const studentDocRef = doc(db, "studentUsers", studentId)
        
        // Query assignments in the specified folder for the student
        const q = query(
            collection(db, 'assignments'),
            where('folder', '==', folderName),
            where('studentId', '==', studentId)
        )
        const snapshot = await getDocs(q);

        // Initialize batch
        const batch = writeBatch(db)

        // Delete all assignments in the folder from assignments collection and remove their IDs from student doc
        snapshot.forEach((docSnapshot) => {
            batch.delete(docSnapshot.ref);
            batch.update(studentDocRef, {
                assignmentDocIds: arrayRemove(docSnapshot.id),
            });
        });

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

export const renameFolder = async (studentId: string, oldFolderName: string, newFolderName: string) => {
    try {
        // Reference for student
        const studentDocRef = doc(db, "studentUsers", studentId)
        
        // Query assignments in the specified folder for the student
        const q = query(
            collection(db, 'assignments'),
            where('folder', '==', oldFolderName),
            where('studentId', '==', studentId)
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

        batch.commit()

    } catch (error) {
        console.log("Error renaming folder", error)
        throw error
    }
}