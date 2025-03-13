import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { CalendarIcon, Clock, Download, FileText, MessageSquare, Settings, Upload, User, UserCheck } from 'lucide-react'

import FileUploadView from '@/app/components/Assignments/FileUploadView'

import { fileUpload, uploadEntry } from '@/lib/assignmentUtils'
import { formatDueDate, formatDueDateAndTime } from '@/lib/utils'
import { AssignmentFile } from '@/lib/types/types'
import { useFiles } from '@/hooks/useFiles'

import { addEntry } from '@/redux/slices/assignmentsSlice'
import { RootState } from '@/redux/store'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

interface AssignmentDetailModalProps {
    assignmentId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
// TODO: View doesn't update right after creating an assignment, needs refresh
function AssignmentDetailModal({assignmentId, open, onOpenChange}: AssignmentDetailModalProps) {
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


    useEffect(() => {
        console.log('assignmentId', assignmentId)
    }, [assignmentId])

    // TODO: make status appear properly for icon usage here
    const getTimelineIcon = (type: string) => {
        switch (type) {
        case "submission":
            return <Upload className="h-4 w-4 text-blue-500" />
        case "feedback":
            return <MessageSquare className="h-4 w-4 text-orange-500" />
        case "edit":
            return <Settings className="h-4 w-4 text-purple-500" />
        case "creation":
            return <FileText className="h-4 w-4 text-green-500" />
        default:
            return <Clock className="h-4 w-4 text-gray-500" />
        }
    }

    // TODO: Currently file name downloaded is from storage path, need to convert to blob to download
    // it as the same name
    const downloadFile = (file: AssignmentFile) => {
        const link = document.createElement('a');
        link.href = file.downloadUrl;
        link.download = file.originalName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>{
        const {name, value} = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

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
        
        // Upload entry to firestore
        await uploadEntry(entryData, assignmentId)
        
        // update redux state and reset form data
        dispatch(addEntry({ entryData, assignmentId }))
        setFormData({
            note: '',
            files: []
        })
        clearFiles()
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

                    {/* Assignment Details */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="space-y-3">
                            <h4 className="font-medium">Assignment Overview</h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Student:</span>
                                    {/* <span className="text-sm">{assignment.student}</span> */}
                                </div>
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Type:</span>
                                    <Badge variant="outline">{assignment?.type}</Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Status:</span>
                                    <Badge variant={assignment?.status === "completed" ? "default" : "outline"}>
                                        {assignment?.status === "completed" ? "Completed" : assignment?.status}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Due Date:</span>
                                    <span className="text-sm">{formatDueDate(assignment?.dueDate)}</span>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                            <h4 className="font-medium">Instructions</h4>
                            <div className="p-3 bg-muted/50 rounded-md">
                                <p className="text-sm">{assignment?.note}</p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium">Assignment Timeline</h4>
                        </div>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {assignment?.timeline?.map((entry, index) => (
                                <div key={index} className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background border-2 border-muted">
                                            {getTimelineIcon(entry.type)}
                                        </div>
                                        
                                        {/* Bar on leftside for timeline styling */}
                                        {index < assignment?.timeline.length - 1 && <div className="w-px h-12 bg-muted mt-2" />}
                                    </div>

                                    {/* Entry Details */}
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            {/* <div className="flex items-center gap-1">
                                                {entry.authorType === "consultant" ? (
                                                <UserCheck className="h-3 w-3 text-blue-500" />
                                                ) : (
                                                <User className="h-3 w-3 text-green-500" />
                                                )}   */}
                                                <span className="text-sm font-medium">{entry.uploadedBy}</span>
                                            {/* </div> */}
                                            <Badge variant="outline" className="text-xs">
                                                {entry.type}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {formatDueDateAndTime(entry.uploadedAt)}
                                            </span>
                                        </div>
                                        
                                        {entry.note && <p className="text-sm text-muted-foreground">{entry.note}</p>}
                                    
                                        {entry.files.length > 0 && (
                                            <div className="space-y-2">
                                                {entry.files.map((file, fileIndex) => (
                                                <div
                                                    key={fileIndex}
                                                    className="flex items-center justify-between p-2 border rounded-md bg-background"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                                        <div className="text-sm font-medium">{file.originalName}</div>
                                                    </div>
                                                    <Button variant="outline" size="sm" className="gap-1" onClick={() => downloadFile(file)}>
                                                        <Download className="h-3 w-3" />
                                                        Download
                                                    </Button>
                                                </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

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
                            <Button type='submit' className='mt-2'>
                                {/* <MessageSquare className="mr-2 h-4 w-4" /> */}
                                Send Feedback
                            </Button>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AssignmentDetailModal