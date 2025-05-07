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

import { AssignmentFile, AssignmentFormData } from "@/lib/types/types"
import { fileUpload, uploadAssignment } from "@/lib/assignmentUtils"

import { useDispatch, useSelector } from "react-redux"
import { updateFolders, updateAssignmentDocIds } from "@/redux/slices/studentSlice"
import { RootState } from "@/redux/store";
import { addAssignment } from "@/redux/slices/studentAssignmentsSlice"
import { Timestamp } from "firebase/firestore";
import { useFiles } from "@/hooks/useFiles"
import { updatePendingCount } from "@/lib/statsUtils"


import { toast } from "sonner"


// TODO: Error when adding a doc ref to redux, which is the consultant ref in student
function CreateAssignmentModal() {

    const dispatch = useDispatch()
    
    // Extract functions for file uploads
    const { files, handleFileUpload, removeFile, clearFiles} = useFiles();

    
    // Retrieve student and consultant
    const { id: studentId } = useParams<{id:string}>()
    const user = useSelector((state: RootState) => state.user);

    // State to manage assignment details
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
    const [newFolder, setNewFolder] = useState(false)

    // State to manage loading state, formData for form submission, and errors
    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState<AssignmentFormData>({
        title: "",
        type: "",
        priority: "",
        folder: "",
        student: studentId,
        dueDate: undefined,
        note: "",
        files: [],
        createdAt: null,
        status: 'Pending',
    })
    const [errors, setErrors] = useState<{title?: string; type?: string; priority?: string; folder?: string; dueDate?: string;}>({})

    // Reset the form data
    const resetForm = () => {
        setFormData({
            title: "",
            type: "",
            priority: "",
            folder: "",
            student: studentId,
            dueDate: undefined,
            note: "",
            files: [],
            createdAt: null,
            status: 'Pending'
        });
        clearFiles()
        setDueDate(undefined);
        setNewFolder(false);
    };

    // Validate form inputs and set error messages
    const validateForm = () => {
        const newErrors: { title?: string; type?: string; priority?: string; folder?: string; dueDate?: string;} = {}

        if (!formData.title) {
            newErrors.title = 'A title is required.'
        }

        if (!formData.type) {
            newErrors.type = 'A type is required.'
        }

        if (!formData.folder) {
            newErrors.folder = 'Please select a folder or input a new folder name.'
        }

        if (!dueDate) {
            newErrors.dueDate = 'Please select a due date.'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        console.log(formData)

        const isValid = validateForm();
        if (!isValid) {
            setIsLoading(false);
            return;
        }

        // set dueDate to 11:59pm of the day selected
        // @ts-ignore
        const dueDateAt1159pm = new Date(dueDate);
        dueDateAt1159pm.setHours(23, 59, 0, 0); 

        // Data to create a new assignment
        const assignmentData = {
            title: formData.title,
            type: formData.type,
            priority: formData.priority,
            dueDate: Timestamp.fromDate(dueDateAt1159pm),
            note: formData.note,
            createdAt: Timestamp.fromDate(new Date()),
            student: studentId,
            folder: formData.folder,
            status: formData.status,
            timeline: [{
                files: [] as AssignmentFile[],
                type: 'Assignment Created',
                uploadedAt: Timestamp.fromDate(new Date()),
                uploadedBy: `${user.firstName} ${user.lastName}`,
                note: 'Assignment created and assigned to student.'
            }]
        }

        // Upload files to Firebase Storage
        const filesData = await fileUpload(files, studentId)
        assignmentData.timeline[0].files = filesData

        // Create Assignment
        if (!user.role) return console.log('No consultant found')
        const assignmentDocId = await uploadAssignment(assignmentData, studentId, user.id)
        
        // Create assignment with ID to add to redux for proper ordering
        const assignmentWithId = {
            id: assignmentDocId,
            ...assignmentData,
        }
        dispatch(addAssignment(assignmentWithId))

        // Clean up UI
        setIsLoading(false)
        setOpen(false)
        resetForm()

        // Update redux to include new folder if any and add assignment to student's profile
        dispatch(updateFolders(formData.folder))
        dispatch(updateAssignmentDocIds(assignmentDocId))
        updatePendingCount(studentId, 'Pending')
        toast("Assignment Created")
    }

    const handleInputChange = (name: string, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))

        setErrors({})
    }

    // TODO: Currently imported into SelectViewTabs, should be imported into AssignmentsList and moved to top left
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
                        <TypeTitlePriority formData={formData} handleInputChange={handleInputChange} setErrors={setErrors} errors={errors}/>
                            
                        {/* Folder Selection Container */}
                        <FolderSelection newFolder={newFolder} handleInputChange={handleInputChange} setNewFolder={setNewFolder} formData={formData} setErrors={setErrors} errors={errors}/>

                        {/* Calendar Due Date Container */}
                        <AssignmentCalendar dueDate={dueDate} setDueDate={setDueDate} setErrors={setErrors} errors={errors}/>
                            
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

export default CreateAssignmentModal