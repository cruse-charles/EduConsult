import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

import FileUploadView from '../CreateAssignmentModal/FileUploadView'
import AssignmentDetails from './AssignmentDetails'
import AssignmentTimeline from './AssignmentTimeline'
import CustomToast from '@/app/components/CustomToast'

import { fileUpload, uploadEntry, updateAssignment } from '@/lib/assignmentUtils'
import { Assignment, AssignmentFile } from '@/lib/types/types'
import { useFiles } from '@/hooks/useFiles'
import { nextStep } from '@/lib/onBoardingUtils'

import { addEntry, updateAssignmentSlice } from '@/redux/slices/currentStudentAssignmentsSlice'
import { completeStep, next } from '@/redux/slices/onboardingSlice'
import { setCurrentAssignment } from '@/redux/slices/currentAssignmentSlice'
import { RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface ViewAssignmentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function ViewAssignmentModal({open, onOpenChange}: ViewAssignmentModalProps) {

    // Hook to manage file state, fetching studentId
    const { files, handleFileUpload, removeFile, clearFiles} = useFiles();
    const { id: studentId } = useParams<{id:string}>()
    
    // Retrieve data for current user, if onboarding is commplete and assignment being viewed
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user)
    const { isComplete } = useSelector((state: RootState) => state.onboarding)
    const assignment = useSelector((state: RootState) => state.currentAssignment)

    // Form data for user to submit feedback 
    const [formData, setFormData] = useState({
        note: '',
        files: []
    })

    // Manage loading state 
    const [isLoading, setIsLoading] = useState(false)
    if (!assignment) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>{
        const {name, value} = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const entryData = {
                files: [] as AssignmentFile[],
                note: formData.note,
                type: user.role === 'consultant' ? 'Feedback' : 'Submission',
                uploadedAt: new Date(),
                uploadedById: user.id,
                uploadedByName: user.firstName + ' ' + user.lastName
            }
    
            // TODO: Make this a red inline error
            // Error handling
            if (entryData.note.trim() === '') {
                if (user.role === 'consultant') {
                    alert('Please add a note to submit feedback.')
                } else {
                    alert('Please add a note to submit submission   .')
                }
    
                setIsLoading(false)
                return
            }
            
            // Upload files to firebase storage and attach files for entry form upload
            const filesData = await fileUpload(files, studentId)
            entryData.files = filesData
    
            // Upload entry to firestore
            await uploadEntry(entryData, assignment.id)
    
            // update redux state and reset form data
            dispatch(addEntry({ entryData, assignmentId: assignment.id }))
            setFormData({
                note: '',
                files: []
            })
    
            // Update local state to reflect new timeline entry, updating status if there is an entry from a student
            const updatedAssignment = {
                ...assignment,
                timeline: [...(assignment.timeline || []), entryData],
                status: user.role === 'student' ? 'Submitted' : assignment.status
            };
    
            // setCurrentAssignment(updatedAssignment);
            dispatch(updateAssignmentSlice({ assignmentId: assignment.id, updateData: updatedAssignment }));
            dispatch(setCurrentAssignment(updatedAssignment))
            // @ts-ignore
            await updateAssignment(updatedAssignment, assignment.id);
    
            // Next step in onboarding if not completed
            if (!isComplete) {
                dispatch(completeStep('createEntry'))
                await nextStep(user.id)
            }
    
            // CLear files, change loading state, success message
            clearFiles()
            setIsLoading(false)
            toast(<CustomToast title="Entry Added" description="" status="success"/>)

        } catch (error) {
            setIsLoading(false)
            toast(<CustomToast title='Entry Not Added' description='' status='error'/>)
        }

    }

    // Dynamic button label based on user role and loading state
    const baseButtonLabel = user.role === 'consultant' ? 'Send Feedback' : 'Submit Assignment';
    const buttonLabel = isLoading ? 'Submitting...' : baseButtonLabel;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {assignment?.title}
                    </DialogTitle>
                    <DialogDescription>Assignment details and timeline</DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Assignment Details Container*/}
                    <div className="lg:col-span-1 space-y-4">
                        <AssignmentDetails assignment={assignment} onOpenChange={onOpenChange} />
                    </div>

                    {/* Timeline & Feedback Submission Container*/}
                    <div className="lg:col-span-2 space-y-4">
                        <AssignmentTimeline assignment={assignment}/>


                        <Separator />
                        
                        {/* Send Feedback Section */}
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-3">
                                <h4 className="font-medium">Send Feedback</h4>
                                <Textarea
                                    placeholder="Add feedback or comments for the student..."
                                    name='note'
                                    value={formData.note}
                                    onChange={(e) => handleInputChange(e)}
                                    rows={3}
                                />
                            </div>
                            <FileUploadView handleFileUpload={handleFileUpload} removeFile={removeFile} files={files}/>
                            <Button type='submit' className='mt-2 .create-entry' disabled={isLoading}>
                                {buttonLabel}
                            </Button>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ViewAssignmentModal