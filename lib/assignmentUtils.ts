import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "@/lib/firebaseConfig";
import { addDoc, arrayUnion, collection, doc, updateDoc } from "firebase/firestore";

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


export const uploadAssignment = async (assignmentData, assignmentsDocId, studentId, consultant) => {
    try {
        let newAssignmentsDocId = assignmentsDocId;
    
        // If we have a ref for the student alraedy, just update this doc
        if (assignmentsDocId) {
            const assignmentsDocRef = doc(db, 'assignments', assignmentsDocId);
            await updateDoc(assignmentsDocRef, {
                assignments: arrayUnion(assignmentData)
            }) 
        } else {
            // If we don't have a ref, create a new Doc
            const assignmentDocRef = await addDoc(collection(db, "assignments"), {
                student: studentId,
                consultant: consultant?.uid,
                assignments: assignmentData
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