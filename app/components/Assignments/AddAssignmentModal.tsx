'use client'

import { FileText, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import TypeTitlePriority from "./TypeTitlePriority"
import FileUploadView from "./FileUploadView"
import AssignmentCalendar from "./AssignmentCalendar"
import FolderSelection from "./FolderSelection"
import Notes from "./Notes"

import { useState } from "react"
import { useParams } from "next/navigation"
import { ref, uploadBytesResumable, uploadBytes, getDownloadURL  } from "firebase/storage";
import { db, storage } from "@/lib/firebaseConfig";
import { addDoc, arrayUnion, collection, doc, updateDoc } from "firebase/firestore"

import { Assignment, AssignmentFile } from "@/lib/types/types"
import { useConsultant } from "@/hooks/useConsultant"
import { useStudent } from "@/hooks/useStudent"



function AddAssignmentModal() {
    // Retrieve the student ID from URL parameters
    const { id: studentId } = useParams<{id:string}>()
    const consultant = useConsultant()
    // Making multiple fetches, maybe get redux
    const student = useStudent(studentId)
    
    // State to manage assignment details
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
    const [files, setFiles] = useState<File[]>([])
    const [newFolder, setNewFolder] = useState(false)

    // State to manage loading state and formData for form submission
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState<Assignment>({
        title: "",
        type: "",
        priority: "",
        folderName: "",
        student: studentId,
        dueDate: undefined,
        notes: "",
        files: [],
        createdAt: null,
    })

    // Function to remove a file from the files array
    // TODO: Remove from storage and select based on file name
    const removeFile = (index: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
    }

    // handle file upload, upload each file to Firebase Storage
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event?.target.files

        // Check if files are uploaded
        if (!files) {
            console.error('No files selected');
            return;
        }

        // Add the selected files to the state
        setFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);

        // Reset the input value to allow re-uploading the same file
        event.target.value = "";
    }

    // TODO: Close modal when submission is successful, and provide error handling
    // Handles form submission, adds a new assignment document to Firestore
    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Data to create a new assignment
        const assignmentData = {
            title: formData.title,
            type: formData.type,
            priority: formData.priority,
            dueDate: dueDate,
            notes: formData.notes,
            files: [] as AssignmentFile[],
            createdAt: new Date(),
            student: studentId,
            folderName: formData.folderName,
        }

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

                assignmentData.files.push({
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

        // Add the assignment document to the Firestore collection
        try {
            const assignmentDocRef = await addDoc(collection(db, "assignments"), {
                student: studentId,
                consultant: consultant?.uid,
                assignments: assignmentData
            })

            await updateDoc(doc(db, "studentUsers", studentId), {
                assignmentsDocId: assignmentDocRef.id,
                folders: arrayUnion(formData.folderName)
            })
        } catch (error) {
            console.log("Error adding assignment: ", error)
        }
    }

    const handleInputChange = (name: string, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
        console.log(formData)
        // console.log(consultant)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Assignment
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">

                {/* Dialog Header */}
                    <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Create New Assignment
                    </DialogTitle>
                    <DialogDescription>Create a new assignment for a student. Fill out the details below.</DialogDescription>
                    </DialogHeader>

                    {/* Form to submit assignments */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Form Container */}
                        <div className="space-y-4">

                            {/* Type, Title, Priority Input Container */}
                            <TypeTitlePriority formData={formData} handleInputChange={handleInputChange}/>
                            
                            {/* Folder Selection Container */}
                            <FolderSelection student={student} newFolder={newFolder} handleInputChange={handleInputChange} setNewFolder={setNewFolder} formData={formData}/>

                            {/* Calendar Due Date Container */}
                            <AssignmentCalendar dueDate={dueDate} setDueDate={setDueDate}/>
                            
                            {/* Notes Container */}
                            <Notes formData={formData} handleInputChange={handleInputChange} />

                            {/* File Upload Container */}
                            <FileUploadView handleFileUpload={handleFileUpload} removeFile={removeFile} files={files}/>
                        </div>

                    <DialogFooter>
                        <DialogClose asChild>    
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </DialogClose>
                        {/* Submit Button */}
                        {/* TODO: Make button close when succssful, disable when loading */}
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Assignment"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddAssignmentModal