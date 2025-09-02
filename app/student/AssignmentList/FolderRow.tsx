
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChevronDown, ChevronRight, Edit, Folder, FolderOpen, MoreHorizontal, Trash2 } from 'lucide-react'

import { Assignment } from '@/lib/types/types'
import { useState } from 'react'
import { deleteFolder } from '@/lib/assignmentUtils'
import { removeAssignmentDocId, removeFolder } from '@/redux/slices/currentStudentSlice'
import { deleteAssignmentSlice } from '@/redux/slices/currentStudentAssignmentsSlice'
import { deleteDashboardAssignment } from '@/redux/slices/consultantAssignmentSlice'
import { toast } from 'sonner'
import CustomToast from '@/app/components/CustomToast'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { useParams } from 'next/navigation'
import AssignmentRow from './AssignmentRow'

interface FolderRowProps {
    folder: string
    assignments: Assignment[]
    completedCount: number
    onAssignmentClick: (assignment: Assignment) => void
    setSelectedFolder: (folder: string) => void
    onOpen: () => void
}

const FolderRow = ({folder, onAssignmentClick, setSelectedFolder, assignments, completedCount, onOpen}: FolderRowProps) => {
    // Retrieve data from redux/URL
    const dispatch = useDispatch<AppDispatch>()
    const { id } = useParams()
    const studentId = id as string
    const user = useSelector((state: RootState) => state.user)

    // Determine if a folder has any unread assignments
    const hasUnread = assignments.some((assignment) => !assignment.hasRead)

    // Manage open/close of folder
    const [isOpen, setIsOpen] = useState(false)

    const handleToggle = () => {
        setIsOpen(!isOpen)
        if (!isOpen) onOpen()
    }
   
    return (
        <Collapsible key={folder} onOpenChange={handleToggle}>
            <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer border-b w-full h-auto folder">
                    <div className="flex items-center gap-3">
                        {isOpen ? (
                                <FolderOpen className="h-5 w-5 text-primary" />
                        ) : (
                            <div className="relative">
                                <Folder className="h-5 w-5 text-muted-foreground" />
                                {hasUnread && <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500 ring-2 ring-white" />}
                            </div>
                        )}
                        <div className="text-left">                                                
                            <h3 className="font-medium">{folder}</h3>
                            <p className="text-sm text-muted-foreground">
                                {/* TODO: Add handling for just 1 assignment or no completed assignments */}
                                {assignments.length} assignments • {completedCount} completed
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        {/* <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedFolder(folder)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Rename Folder
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={(e) => handleDeleteFolder(folder)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Folder
                            </DropdownMenuItem>
                        </DropdownMenuContent> */}
                    </DropdownMenu>
                    {isOpen ? (
                        <ChevronDown className="h-4 w-4" />
                    ) : (
                        <ChevronRight className="h-4 w-4" />
                    )}
                    </div>
                </div>
            </CollapsibleTrigger>
        
            {/* Assignments */}
            <CollapsibleContent>
                <div className="space-y-1">
                    {assignments.map((assignment) => (
                        <AssignmentRow key={assignment.id} assignment={assignment} onClick={onAssignmentClick}/>
                    ))}
                </div>
            </CollapsibleContent>
        
        </Collapsible>
    )
}

export default FolderRow