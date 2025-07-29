import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import CustomToast from '@/app/components/CustomToast'
import { toast } from 'sonner'
import { CalendarIcon, Clock, FileText, Pencil, Save, Trash, User, X } from 'lucide-react'

import { deleteAssignment, updateAssignment } from '@/lib/assignmentUtils'
import { cn, formatDueDate } from '@/lib/utils'
import { updateInProgressCount } from '@/lib/statsUtils'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'next/navigation'
import { RootState } from '@/redux/store'
import { deleteAssignmentSlice, updateAssignmentsSlice } from '@/redux/slices/currentStudentAssignmentsSlice'
import { removeAssignmentDocId } from '@/redux/slices/currentStudentSlice'

interface AssignmentDetailProps {
    onOpenChange: (open: boolean) => void;
}

function AssignmentDetails({onOpenChange}: AssignmentDetailProps) {

    // Retrieve user and currentAssignment
    const user = useSelector((state: RootState) => state.user)
    const assignment = useSelector((state: RootState) => state.currentAssignment)

    return (
         <>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="font-medium">Assignment Overview</h4>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Consultant:</span>
                        <span className="text-sm">{assignment?.consultantFirstName} {assignment?.consultantLastName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Type:</span>
                        <Badge variant="outline">{assignment?.type}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Status:</span>
                        <Badge variant={assignment?.status === "Completed" ? "default" : "outline"}>
                            {assignment?.status}
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
        </>
    )
}

export default AssignmentDetails