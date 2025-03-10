import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { formatDueDate } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon, Clock, Download, FileText, MessageSquare, Settings, Upload, User, UserCheck } from 'lucide-react'
import React, { useEffect } from 'react'

function AssignmentDetailModal({assignment, open, onOpenChange}) {

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

// TODO: DUE DATE ISN'T SHOWING UP, CHECK DATA STRUCTURE AND HOW I KEY INTO IT
// TODO: GET FILES SHOWN FOR DOWNLOAD
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
                                    <Badge variant={assignment?.status === "completed" ? "success" : "outline"}>
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
                                <p className="text-sm">{assignment?.instructions}</p>
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
                                <div key={entry.id} className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background border-2 border-muted">
                                            {getTimelineIcon(entry.type)}
                                        </div>
                                            {index < assignment?.timeline.length - 1 && <div className="w-px h-12 bg-muted mt-2" />}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            {/* <div className="flex items-center gap-1">
                                                {entry.authorType === "consultant" ? (
                                                <UserCheck className="h-3 w-3 text-blue-500" />
                                                ) : (
                                                <User className="h-3 w-3 text-green-500" />
                                                )}   */}
                                                <span className="text-sm font-medium">{entry.author}</span>
                                            {/* </div> */}
                                            <Badge variant="outline" className="text-xs">
                                                {entry.type}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {formatDueDate(entry.dueDate)}
                                            </span>
                                        </div>
                                        
                                        {entry.note && <p className="text-sm text-muted-foreground">{entry.note}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AssignmentDetailModal