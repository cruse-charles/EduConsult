import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "@/lib/firebaseConfig";
import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";
import { Assignment } from "./types/types";
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
            const downloadURL = await getDownloadURL(storageRef)
    
            filesData.push({
                storagePath,
                downloadURL,
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

export const uploadAssignment = async (assignmentData: Assignment, assignmentsDocId: string | undefined, studentId: string, consultant: User | null) => {
    try {
        let newAssignmentsDocId = assignmentsDocId;
        const id = nanoid()
    
        // If we have assignments already and a ref to it for the student, just update this doc
        if (assignmentsDocId) {
            const assignmentsDocRef = doc(db, 'assignments', assignmentsDocId);
            await updateDoc(assignmentsDocRef, {
                assignments: arrayUnion(assignmentData)
            }) 
        } else {
            // If we don't have any previous assignments and no ref, create a new Doc
            const assignmentDocRef = doc(db, "assignments", id)
            await setDoc(assignmentDocRef, {
                student: studentId,
                consultant: consultant?.uid,
                assignments: [assignmentData]
            })
    
            // Create an assignment doc id with the new assignment doc 
            newAssignmentsDocId = assignmentDocRef.id
        }
    
        // Update folder names in student's doc
        await updateDoc(doc(db, "studentUsers", studentId), {
            assignmentsDocId: newAssignmentsDocId,
            folders: arrayUnion(assignmentData.folderName)
        })
    
    } catch (error) {
        console.log("Error adding assignment: ", error)
    }
}