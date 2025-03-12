import FileUploadView from '@/app/components/Assignments/FileUploadView'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { fileUpload, uploadEntry } from '@/lib/assignmentUtils'
import { Assignment, AssignmentFile } from '@/lib/types/types'
import { formatDueDate, formatDueDateAndTime } from '@/lib/utils'
import { CalendarIcon, Clock, Download, FileText, MessageSquare, Settings, Upload, User, UserCheck } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface AssignmentDetailModalProps {
    assignment: Assignment | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function AssignmentDetailModal({assignment, open, onOpenChange}: AssignmentDetailModalProps) {

    const [formData, setFormData] = useState({
        note: '',
        files: []
    })

    const [files, setFiles] = useState<File[]>([])
    const { id: studentId } = useParams<{id:string}>()

    useEffect(() => {
        console.log(assignment)
    }, [assignment])

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
        link.download = file.originalName; // Suggests filename to save as
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

    // TODO: EXTRACT THIS TO UTILS WITH THE ADDASSIGNMENTS AS WELL
    // Function to remove a file from the files array
    // TODO: Remove from storage and select based on file name
    const removeFile = (index: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
    }

    // TODO: add monitor uploading process, use these links: 
    // https://firebase.google.com/docs/storage/web/upload-files
    // https://www.youtube.com/watch?v=fgdpvwEWJ9M start at around 30:00

    // Handle file upload, upload each file to Firebase Storage
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

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('submitting...')

        const entryData = {
            files: [] as AssignmentFile[],
            note: formData.note,
            uploadedAt: new Date(),
            // TODO: Adjust below to be user name and feedback/submission based on user
            uploadedBy: 'User',
            type: 'Feedback'
        }

        const filesData = await fileUpload(files, studentId)
        entryData.files = filesData
        
        await uploadEntry(entryData, assignment?.id)
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
                            {assignment?.timeline.map((entry, index) => (
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