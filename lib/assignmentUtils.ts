import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "@/lib/firebaseConfig";
import { arrayRemove, arrayUnion, deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { AssignmentUpload, Entry, UpdateAssignment } from "./types/types";
import { User } from "firebase/auth";
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
    
            console.log('Uploaded a blob or file!', snapshot);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }

    return filesData
}

// TODO: ADDING AN ASSIGNMENT TO A NEW FOLDER

export const uploadAssignment = async (assignmentData: AssignmentUpload, studentId: string, consultant: User | null) => {
    try {
        const assignmentDocId = nanoid()
    

        // Create a new Doc
        const assignmentDocRef = doc(db, "assignments", assignmentDocId)
        await setDoc(assignmentDocRef, assignmentData)    
    
        // Update folder names in student's doc
        await updateDoc(doc(db, "studentUsers", studentId), {
            assignmentDocIds: arrayUnion(assignmentDocId),
            // folders: arrayUnion(assignmentData.folderName)
            folders: arrayUnion(assignmentData.folder)
        })
    
        return assignmentDocId
    } catch (error) {
        console.log("Error adding assignment: ", error)
    }

}

export const updateAssignment = async (assignmentData: UpdateAssignment, assignmentId: string) => {
    try {
        // Get reference to the assignment document
        const assignmentDocRef = doc(db, "assignments", assignmentId);

        // Update doc
        // @ts-ignore
        await updateDoc(assignmentDocRef, assignmentData);
    } catch (error) {
        console.log('Error updating assignment', error)
    }
}

export const uploadEntry = async (entryData: Entry, assignmentDocId: string) => {
    try {
        await updateDoc(doc(db, "assignments", assignmentDocId), {
            timeline: arrayUnion(entryData)
        })
    } catch (error) {
        console.log("Error updating assignment", error)
    }
}

export const deleteAssignment = async (assignmentId: string, studentId: string) => {
    try {
        await deleteDoc(doc(db, "assignments", assignmentId))

        const studentDocRef = doc(db, "studentUsers", studentId)
        console.log('STUDENT REF', studentDocRef)
        console.log('ASSIGNMENT ID', assignmentId)
        await updateDoc(studentDocRef, {
            assignmentDocIds: arrayRemove(assignmentId)
        })

        console.log("Assignment deleted successfully")
    } catch (error) {
        console.log("Error deleting assignment", error)
    }
}