import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Assignment, AssignmentFile } from '@/lib/types/types'
import { formatDueDateAndTime } from '@/lib/utils'
import { Clock, Download, FileText, MessageSquare, Settings, Upload } from 'lucide-react'
import React from 'react'

interface AssignmentTimelineProps {
    assignment?: Assignment
}

function AssignmentTimeline({assignment}: AssignmentTimelineProps) {

    // TODO: make status appear properly for icon usage here
    const getTimelineIcon = (type: string) => {
        switch (type) {
        case "Submission":
            return <Upload className="h-4 w-4 text-blue-500" />
        case "Feedback":
            return <MessageSquare className="h-4 w-4 text-orange-500" />
        case "Edit":
            return <Settings className="h-4 w-4 text-purple-500" />
        case "Creation":
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

    return (
        <>
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
        </>
    )
}

export default AssignmentTimeline