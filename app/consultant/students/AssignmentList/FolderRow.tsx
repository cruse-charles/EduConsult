import AssignmentRow from './AssignmentRow'

import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChevronDown, ChevronRight, Edit, Folder, FolderOpen, MoreHorizontal, Trash2 } from 'lucide-react'

import { Assignment } from '@/lib/types/types'

interface FolderRowProps {
    folder: string
    assignments: Assignment[]
    completedCount: number
    isOpen: boolean
    handleOpenFolder: (folder: string) => void
    onAssignmentClick: (assignment: Assignment) => void
    setSelectedFolder: (folder: string) => void
    handleDeleteFolder: (folder: string) => void
}

const FolderRow = ({folder, handleOpenFolder, handleDeleteFolder, onAssignmentClick, setSelectedFolder, isOpen, assignments, completedCount}: FolderRowProps) => {
    return (
        <Collapsible key={folder} onOpenChange={() => handleOpenFolder(folder)}>
            <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer border-b w-full h-auto folder">
                    <div className="flex items-center gap-3">
                        {isOpen ? (
                                <FolderOpen className="h-5 w-5 text-primary" />
                        ) : (
                            <div className="relative">
                                <Folder className="h-5 w-5 text-muted-foreground" />
                                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500 ring-2 ring-white" />
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
                            <DropdownMenuItem className="text-red-600" onClick={(e) => handleDeleteFolder(folder)}>
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
                        <AssignmentRow key={assignment.id} assignment={assignment} onClick={onAssignmentClick}/>
                    ))}
                </div>
            </CollapsibleContent>
        
        </Collapsible>
    )
}

export default FolderRow