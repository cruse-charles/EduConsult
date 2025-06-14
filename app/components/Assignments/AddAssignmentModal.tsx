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

import { Assignment, AssignmentFile } from "@/lib/types/types"
import { useConsultant } from "@/hooks/useConsultant"
import { useStudent } from "@/hooks/useStudent"
import { fileUpload, uploadAssignment } from "@/lib/assignmentUtils"



function AddAssignmentModal() {
    // Retrieve student and consultant
    const { id: studentId } = useParams<{id:string}>()
    const consultant = useConsultant()
    const student = useStudent(studentId)
    
    // State to manage assignment details
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
    const [files, setFiles] = useState<File[]>([])
    const [newFolder, setNewFolder] = useState(false)

    // State to manage loading state and formData for form submission
    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false)
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

    const resetForm = () => {
        setFormData({
            title: "",
            type: "",
            priority: "",
            folderName: "",
            student: studentId,
            dueDate: undefined,
            notes: "",
            files: [],
            createdAt: null,
        });
        setFiles([]);
        setDueDate(undefined);
        setNewFolder(false);
    };

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

    // TODO: Improve error handling
    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        if (
            !formData.title ||
            !formData.type ||
            !formData.folderName ||
            !dueDate
        ) {
            alert ("Please fill out all required fields")
            setIsLoading(false)
            return
        }

        // Retreive the ref to the student's assigments
        let assignmentsDocId = student?.assignmentsDocId

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

        // Upload files to Firebase Storage
        const filesData = await fileUpload(files, studentId)
        assignmentData.files = filesData

        await uploadAssignment(assignmentData, assignmentsDocId, studentId, consultant)

        setIsLoading(false)
        setOpen(false)
        resetForm()
    }

    const handleInputChange = (name: string, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen)
            if (!isOpen) resetForm()
        }}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)}>
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
                            <Button type="button" variant="secondary" onClick={() => resetForm()}>
                                Cancel
                            </Button>
                        </DialogClose>
                        {/* Submit Button */}
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