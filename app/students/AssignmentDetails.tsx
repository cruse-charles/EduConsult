import { Badge } from '@/components/ui/badge'
import { formatDueDate } from '@/lib/utils'
import { CalendarIcon, Clock, FileText, User } from 'lucide-react'
import React from 'react'

function AssignmentDetails({assignment}) {
    return (
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
    )
}

export default AssignmentDetails