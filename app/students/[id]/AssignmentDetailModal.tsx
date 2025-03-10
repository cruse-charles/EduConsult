import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { formatDueDate } from '@/lib/utils'
import { CalendarIcon, Clock, FileText, User } from 'lucide-react'
import React from 'react'

function AssignmentDetailModal({assignment, open, onOpenChange}) {
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
            </div>
        </div>

        </DialogContent>
    </Dialog>
  )
}

export default AssignmentDetailModal