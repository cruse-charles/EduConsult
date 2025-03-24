import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

import FileUploadView from '@/app/components/Assignments/FileUploadView'

import { fileUpload, uploadEntry } from '@/lib/assignmentUtils'
import { AssignmentFile } from '@/lib/types/types'
import { useFiles } from '@/hooks/useFiles'

import { addEntry } from '@/redux/slices/assignmentsSlice'
import { RootState } from '@/redux/store'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AssignmentDetails from './AssignmentDetails'
import AssignmentTimeline from './AssignmentTimeline'

interface AssignmentViewModalProps {
    assignmentId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function AssignmentViewModal({assignmentId, open, onOpenChange}: AssignmentViewModalProps) {
    // Hook to manage file state, fetching studentId
    const { files, handleFileUpload, removeFile, clearFiles} = useFiles();
    const { id: studentId } = useParams<{id:string}>()
    const dispatch = useDispatch();

    // Find assignment from state by matching with selected assignment ID
    const assignment = useSelector((state: RootState) => state.assignments.find((a) => a.id === assignmentId))

    // Form data for user to submit feedback 
    const [formData, setFormData] = useState({
        note: '',
        files: []
    })

    const [isLoading, setIsLoading] = useState(false)


    useEffect(() => {
        console.log('assignmentId', assignmentId)
    }, [assignmentId])

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

        const entryData = {
            files: [] as AssignmentFile[],
            note: formData.note,
            uploadedAt: new Date(),
            // TODO: Adjust below to be user name and feedback/submission based on user
            uploadedBy: 'User',
            type: 'Feedback'
        }
        
        // Upload files to firebase storage and attach files for entry form upload
        const filesData = await fileUpload(files, studentId)
        entryData.files = filesData

        // TODO: Improve error handling
        if (entryData.note.trim() === '') {
            alert('Please add a note to submit feedback.')
            setIsLoading(false)
        }
        
        // Upload entry to firestore
        await uploadEntry(entryData, assignmentId)
        
        // update redux state and reset form data
        dispatch(addEntry({ entryData, assignmentId }))
        setFormData({
            note: '',
            files: []
        })
        clearFiles()
        setIsLoading(false)
    }

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
                                {!isLoading ? 'Send Feedback' : 'Sending Feedback...'}
                            </Button>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AssignmentViewModal