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

import { useDispatch, useSelector } from "react-redux"
import { updateFolders, updateAssignmentDocIds, updateReduxInProgressCount, checkReduxNextDeadline } from "@/redux/slices/currentStudentSlice"
import { RootState } from "@/redux/store";
import { addAssignment } from "@/redux/slices/currentStudentAssignmentsSlice"
import { updateInProgressCount } from "@/lib/statsUtils"

import { toast } from "sonner"
import CustomToast from "@/app/components/CustomToast"
import { completeStep } from "@/redux/slices/onboardingSlice"
import { nextStep } from "@/lib/onBoardingUtils"
import { onboardingSteps } from "@/lib/onboardingSteps"

import { createAssignment, dispatchAssignmentUpdates } from "@/lib/services/createAssignment"
import { useAssignmentForm } from "@/hooks/assignments/useAssignmentForm"


// TODO: Error when adding a doc ref to redux, which is the consultant ref in student
function CreateAssignmentModal() {

    // Retrieve student and consultant
    const dispatch = useDispatch()
    const { id: studentId } = useParams<{id:string}>()
    const user = useSelector((state: RootState) => state.user);
    const student = useSelector((state: RootState) => state.currentStudent.data)
    const {isComplete, onboardingStep } = useSelector((state: RootState) => state.onboarding)

    // State to manage loading state, formData for form submission, and errors
    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false)


    const { formData, setFormData, handleInputChange, resetForm, dueDate, setDueDate, 
        newFolder, setNewFolder, validate, errors, setErrors, files, handleFileUpload, removeFile, 
    } = useAssignmentForm(student, user)


    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            setIsLoading(true)
    
            // Validate form inputs and set error messages
            const isValid = validate(formData, dueDate, newFolder, student);
            if (!isValid) {
                return;
            }
    
            // 1. Persist to DB
            const { assignmentData, assignmentDocId } = await createAssignment({ formData, dueDate, files, studentId, student, user })

            // Create assignment with ID to add to redux for proper ordering
            const assignmentWithId = {
                id: assignmentDocId,
                ...assignmentData,
                hasRead: true
            }

            // 2. Sync Redux
            dispatchAssignmentUpdates(dispatch, {
                assignmentDocId, assignmentData, folder: formData.folder,
                studentId, isComplete, userId: user.id
            })

            
            // Clean up UI
            setIsLoading(false)
            setOpen(false)
            resetForm()
            
            // // Add assignment to StudentAssignmentSlice
            // dispatch(addAssignment(assignmentWithId))

            // // Update redux to include new folder if any and add assignment to student's profile
            // dispatch(updateFolders(formData.folder))
            // dispatch(updateAssignmentDocIds(assignmentDocId))

            // // Increase In-Progress count on addition of new assignment and nextDeadline check
            // updateInProgressCount(studentId, 'In-Progress')
            // dispatch(updateReduxInProgressCount({newStatus: assignmentData.status}))
            // dispatch(checkReduxNextDeadline(assignmentData.dueDate))

            // TODO FIX THIS TO BE MORE COMPLETE
            // Updating onboarding if necessary
            if (!isComplete) {
                dispatch(completeStep("createAssignment"))
                await nextStep(user.id)
            }
            
            // Display confirmation email
            toast(<CustomToast title="Assignment Created" description="The assignment has been successfully created." status="success"/>)
        } catch (error) {
            console.error("Error creating assignment:", error);
            setIsLoading(false)
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