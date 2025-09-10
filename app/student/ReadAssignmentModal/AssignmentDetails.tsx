import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

import { CalendarIcon, Clock, FileText, User} from 'lucide-react'

import { formatDueDate } from '@/lib/utils'

import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'


function AssignmentDetails() {

    // Retrieve user and currentAssignment
    const assignment = useSelector((state: RootState) => state.currentAssignment.assignment)

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