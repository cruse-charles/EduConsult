'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FileText, Plus } from "lucide-react"
import { useState } from "react"
import { db, storage } from "@/lib/firebaseConfig";
import { ref, uploadBytesResumable, uploadBytes, getDownloadURL  } from "firebase/storage";
import TypeTitlePriority from "./TypeTitlePriority"
import FileUploadView from "./FileUploadView"
import AssignmentCalendar from "./AssignmentCalendar"
import { addDoc, collection } from "firebase/firestore"
import { useParams } from "next/navigation"
import FolderSelection from "./FolderSelection"
import Notes from "./Notes"
import { AssignmentFile } from "@/lib/types/types"

// TODO: get all folders from student and have them render as select items when creating an assignment
// link a student id and consultant id to an assignment, which will have those two fields and an array 
// of objects that are assignments holding the info from the other file and folder location


function AddAssignmentModal() {
    const [dueDate, setDueDate] = useState<Date | null>(null)
    const [files, setFiles] = useState<File[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [newFolder, setNewFolder] = useState(false)
    const { id: studentId } = useParams<{id:string}>()

    const [formData, setFormData] = useState({
        title: "",
        type: "essay",
        priority: "medium",
        assignedStudent: "",
        dueDate: null,
        notes: "",
    })

    const removeFile = (index: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
    }

    // handle file upload, upload each file to Firebase Storage
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event?.target.files
        console.log(files);

        if (!files) {
            console.error('No files selected');
            return;
        }

        setFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);

        // Reset the input value to allow re-uploading the same file
        event.target.value = "";
    }

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()

        const assignmentData = {
            title: formData.title,
            type: formData.type,
            priority: formData.priority,
            dueDate: dueDate,
            notes: formData.notes,
            files: [] as AssignmentFile[],
            createdAt: new Date(),
            student: studentId,
            folderName: '',
        }

        for (const file of Array.from(files) as File[]) {
            // Generate a unique file name to avoid conflicts
            const uniqueName = `${Date.now()}-${file.name}`;

            const storagePath = `assignments/${studentId}/${uniqueName}`
            
            // Create a storage reference
            const storageRef = ref(storage, storagePath);

            
            // Upload the file to the storage reference
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

        try {
            await addDoc(collection(db, "assignments"), assignmentData)
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
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Assignment
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">

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
                            <FolderSelection newFolder={newFolder} handleInputChange={handleInputChange} setNewFolder={setNewFolder} formData={formData}/>

                            {/* Calendar Due Date Container */}
                            <AssignmentCalendar dueDate={dueDate} setDueDate={setDueDate}/>
                            
                            {/* Notes Container */}
                            <Notes formData={formData} handleInputChange={handleInputChange} />

                            {/* File Upload Container */}
                            <FileUploadView handleFileUpload={handleFileUpload} removeFile={removeFile} files={files}/>
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Assignment"}
                        </Button>
                    </form>
                    <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                        Close
                        </Button>
                    </DialogClose>
                    </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddAssignmentModal