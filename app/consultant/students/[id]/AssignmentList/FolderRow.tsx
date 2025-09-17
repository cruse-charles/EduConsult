import AssignmentRow from './AssignmentRow'

import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChevronDown, ChevronRight, Edit, Folder, FolderOpen, MoreHorizontal, Trash2 } from 'lucide-react'

import { Assignment } from '@/lib/types/types'
import { useContext, useState } from 'react'
import { deleteFolder } from '@/lib/assignmentUtils'
import { removeAssignmentDocId, removeFolder } from '@/redux/slices/currentStudentSlice'
import { deleteAssignmentSlice } from '@/redux/slices/currentStudentAssignmentsSlice'
import { deleteDashboardAssignment } from '@/redux/slices/consultantAssignmentSlice'
import { toast } from 'sonner'
import CustomToast from '@/app/components/CustomToast'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { useParams } from 'next/navigation'
import { onboardingSteps } from '@/lib/onboardingSteps'
import { completeStep } from '@/redux/slices/onboardingSlice'
import { nextStep } from '@/lib/onBoardingUtils'
import { DeleteConfirmContext } from './DeleteConfirmContext'

interface FolderRowProps {
    folder: string
    assignments: Assignment[]
    completedCount: number
    setSelectedFolder: (folder: string) => void
}

// TODO: Add opening state of folders into redux as well
const FolderRow = ({folder, setSelectedFolder, assignments, completedCount}: FolderRowProps) => {


    const deleteContext = useContext(DeleteConfirmContext)
    

    // Retrieve data from redux/URL
    const dispatch = useDispatch<AppDispatch>()
    const { id } = useParams()
    const studentId = id as string
    const user = useSelector((state: RootState) => state.user)
    const { isComplete, onboardingStep } = useSelector((state: RootState) => state.onboarding);

    // Determine if a folder has any unread assignments
    const hasUnread = assignments.some((assignment) => !assignment.hasRead)

    // Manage open/close of folder
    const [isOpen, setIsOpen] = useState(false)

    const handleToggle = async () => {
        setIsOpen(!isOpen)

        const currentStep = onboardingSteps[onboardingStep]?.actionRequired
        if (!isComplete && currentStep === 'openFolder') {
            dispatch(completeStep("openFolder"))
            await nextStep(user.id)
        }
    }

    // Function to delete a folder and assignments within it
    const handleDeleteFolder = async (folderName: string) => {
        try {
            // Delete folder and assignments in database
            await deleteFolder(studentId, folderName, user.id)
            
            // Remove folder from redux, studentSlice
            dispatch(removeFolder(folderName))

            // Remove assignments from student slice, studentAssignmentsSlice, DashboardAssignmentsSlice
            const assignmentsInFolder = assignments.filter((assignment: Assignment) => assignment.folder == folderName)
            assignmentsInFolder.forEach((assignment) => {
                dispatch(removeAssignmentDocId(assignment.id))
                dispatch(deleteAssignmentSlice(assignment.id))
                dispatch(deleteDashboardAssignment(assignment.id))
            })

            toast(<CustomToast title='Folder deleted successfully.' description="" status='success'/>)
        } catch (error) {
            console.error("Error deleting folder:", error);
            toast(<CustomToast title='Error deleting folders.' description="" status='error'/>)
        }
            
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
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedFolder(folder)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Rename Folder
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem className="text-red-600" onClick={(e) => handleDeleteFolder(folder)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Folder
                            </DropdownMenuItem> */}
                            <DropdownMenuItem className="text-red-600" onClick={(e) => {
                                console.log('selected folder')
                                e.preventDefault();
                                e.stopPropagation();
                                deleteContext?.openConfirm( async () => {
                                    await handleDeleteFolder(folder)
                                })
                            }}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Folder
                            </DropdownMenuItem>
                        </DropdownMenuContent>
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
                        <AssignmentRow key={assignment.id} assignment={assignment} />
                    ))}
                </div>
            </CollapsibleContent>
        
        </Collapsible>
    )
}

export default FolderRow