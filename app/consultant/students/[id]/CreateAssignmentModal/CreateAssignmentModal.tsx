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
import { useParams, usePathname } from "next/navigation"

import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store";

import { toast } from "sonner"
import CustomToast from "@/app/components/CustomToast"
import { completeStep } from "@/redux/slices/onboardingSlice"
import { nextStep } from "@/lib/onBoardingUtils"
import { onboardingSteps } from "@/lib/onboardingSteps"

import { createAssignment, createAssignmentForStudents, dispatchAssignmentUpdates } from "@/lib/services/createAssignment"
import { useAssignmentForm } from "@/hooks/assignments/useAssignmentForm"
import { StudentSelector } from "./StudentSelector"


// TODO: Error when adding a doc ref to redux, which is the consultant ref in student
function CreateAssignmentModal() {

    // Retrieve student and consultant
    const dispatch = useDispatch()
    const { id: studentId } = useParams<{id:string}>()
    const user = useSelector((state: RootState) => state.user);
    const student = useSelector((state: RootState) => state.currentStudent.data)
    const students = useSelector((state: RootState) => state.students.data)
    const {isComplete, onboardingStep } = useSelector((state: RootState) => state.onboarding)

    // State to manage loading state, formData for form submission, and errors
    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false)


    const { formData, setFormData, handleInputChange, resetForm, dueDate, setDueDate, 
        newFolder, setNewFolder, validate, errors, setErrors, files, handleFileUpload, removeFile, 
    } = useAssignmentForm(student, user)


    // NEW
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([])
    const pathname = usePathname()
    const isBulkMode = pathname === '/assignments'


    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            setIsLoading(true)
    
            // Validate form inputs and set error messages
            const isValid = validate(formData, dueDate, newFolder, student);
            if (!isValid) {
                return;
            }
    
            if (isBulkMode) {
                // 1. Persist to DB
                const selectedStudents = students.filter(s => selectedStudentIds.includes(s.id))
                const { succeeded, failed } = await createAssignmentForStudents({
                    formData, dueDate, files, students: selectedStudents, user
                })

                // Display success and or failure toast messages based on results
                if (failed.length > 0) {
                    const failedNames = failed.map(f => f.student.profile.firstName).join(', ')
                    toast(<CustomToast
                        title={`Created ${succeeded.length}/${selectedStudents.length}`}
                        description={`Failed for: ${failedNames}. Please try again for these students.`}
                        status="error"
                    />)
                } else {
                    const succeededNames = succeeded.map(s => s.student.profile.firstName).join(', ')
                    toast(<CustomToast
                        title="Assignments Created"
                        description={`Successfully created assignments for ${succeeded.length} students. ${succeededNames}.`}
                        status="success"
                    />)
                }
            } else {
                // 1. Persist to DB
                const { assignmentData, assignmentDocId } = await createAssignment({ formData, dueDate, files, studentId, student, user })

                // 2. Sync Redux
                dispatchAssignmentUpdates(dispatch, {
                    assignmentDocId, assignmentData, folder: formData.folder,
                    studentId, isComplete, userId: user.id
                })

                // Display confirmation email
                toast(<CustomToast title="Assignment Created" description="The assignment has been successfully created." status="success"/>)
            }

            // Clean up UI
            setOpen(false)
            resetForm()

            // TODO FIX THIS TO BE MORE COMPLETE
            // Updating onboarding if necessary
            if (!isComplete) {
                dispatch(completeStep("createAssignment"))
                await nextStep(user.id)
            }
        
        // Catch for single assignment failure or system failure
        } catch (error) {
            console.error("Error creating assignment:", error);
            toast(<CustomToast title="Failed to Create Assignment" description="Please refresh and try again." status="error"/>)
        } finally {
            setIsLoading(false)
        }
    }

    const handleNewAssignmentClick = () => {
        setOpen(true)

        // Proceed to next step for tooltip and update backend
        const currentStep = onboardingSteps[onboardingStep]?.actionRequired
        if (!isComplete && currentStep === 'clickCreateAssignmentButton') {
            dispatch(completeStep("clickCreateAssignmentButton"))
        }  
    }

    // TODO: Currently imported into SelectViewTabs, should be imported into AssignmentsList and moved to top left
    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen)
            if (!isOpen) resetForm()
        }}>
            <DialogTrigger asChild>
                <Button onClick={handleNewAssignmentClick} className="create-assignment-btn">
                    <Plus className="mr-2 h-4 w-4" />
                    New Assignment
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto create-assignment-modal">

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


                        {isBulkMode && (
                            <div className="space-y-2">
                                {/* <label className="text-sm font-medium">Students</label> */}
                                <StudentSelector
                                    selectedStudentIds={selectedStudentIds}
                                    onChange={setSelectedStudentIds}
                                    // error={errors.students}
                                />
                                {/* Folder conflict warning */}
                                {/* {studentsWithExistingFolder.length > 0 && formData.folder && (
                                    <p className="text-sm text-amber-600">
                                        {studentsWithExistingFolder.map(s => s.profile.firstName).join(', ')} already
                                        have a folder named "{formData.folder}" — assignments will be added to their existing folder.
                                    </p>
                                )} */}
                            </div>
                        )}


                        {/* Type, Title, Priority Input Container */}
                        <TypeTitlePriority formData={formData} handleInputChange={handleInputChange} setErrors={setErrors} errors={errors}/>
                            
                        {/* Folder Selection Container */}
                        <FolderSelection isBulkMode={isBulkMode} newFolder={newFolder} handleInputChange={handleInputChange} setNewFolder={setNewFolder} formData={formData} setErrors={setErrors} errors={errors}/>

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