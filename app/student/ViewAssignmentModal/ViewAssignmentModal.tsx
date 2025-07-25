import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import CustomToast from '@/app/components/CustomToast'

import FileUploadView from '../../consultant/students/[id]/CreateAssignmentModal/FileUploadView'
import AssignmentDetails from './AssignmentDetails'
import AssignmentTimeline from './AssignmentTimeline'

import { fileUpload, uploadEntry, updateAssignmentStatus } from '@/lib/assignmentUtils'
import { Assignment, AssignmentFile } from '@/lib/types/types'
import { useFiles } from '@/hooks/useFiles'

import { addEntry, updateAssignmentSlice } from '@/redux/slices/currentStudentAssignmentsSlice'
import { RootState } from '@/redux/store'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateCurrentAssignment } from '@/redux/slices/currentAssignmentSlice'

interface ViewAssignmentModalProps {
    // assignment: Assignment;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// function ViewAssignmentModal({assignment, open, onOpenChange}: ViewAssignmentModalProps) {
function ViewAssignmentModal({open, onOpenChange}: ViewAssignmentModalProps) {


    // Hook to manage file state, fetching studentId
    const { files, handleFileUpload, removeFile, clearFiles} = useFiles();
    const dispatch = useDispatch();
    
    const user = useSelector((state: RootState) => state.user)
    const student = useSelector((state: RootState) => state.currentStudent)
    // const [currentAssignment, setCurrentAssignment] = useState(assignment)
    const assignment = useSelector((state: RootState) => state.currentAssignment)

    // Form data for user to submit feedback 
    const [formData, setFormData] = useState({
        note: '',
        files: []
    })

    const [isLoading, setIsLoading] = useState(false)

    // useEffect(() => {
    //     setCurrentAssignment(assignment);
    // }, [assignment]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>{
        const {name, value} = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            setIsLoading(true)
            
            const entryData = {
                files: [] as AssignmentFile[],
                note: formData.note,
                uploadedAt: new Date(),
                uploadedByName: user.firstName + ' ' + user.lastName,
                uploadedById: user.id,
                type: 'Submission'
            }
               
            // Upload files to firebase storage and attach files for entry form upload
            // @ts-ignore
            const filesData = await fileUpload(files, student.id)
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
            // const updatedAssignment = {
            //     ...currentAssignment,
            //     timeline: [...(currentAssignment.timeline || []), entryData],
            //     status: 'Submitted'
            // };

            const updatedAssignment = {
                ...assignment,
                timeline: [...(assignment.timeline || []), entryData],
                status: 'Submitted'
            };
    
            // setCurrentAssignment(updatedAssignment);
            dispatch(updateCurrentAssignment(updatedAssignment))
    
            dispatch(updateAssignmentSlice({ assignmentId: assignment.id, updateData: updatedAssignment }));
            // @ts-ignore
            await updateAssignmentStatus(assignment.id, 'Submitted', updatedAssignment)
    
            clearFiles()
            setIsLoading(false)
            toast(<CustomToast title="Entry Added" description="" status="success"/>)
        } catch (error) {
            console.log('Error submitting entry:', error)
            setIsLoading(false)
            toast(<CustomToast title="Error submitting entry" description="" status="error"/>)
        }
    }

    const buttonLabel = isLoading ? 'Submitting...' : 'Submit Assignment';

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
                            <Button type='submit' className='mt-2' disabled={isLoading}>
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