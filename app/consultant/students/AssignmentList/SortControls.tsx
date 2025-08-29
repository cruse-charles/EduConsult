import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';
import React, { useState } from 'react'
import CreateAssignmentModal from '../[id]/CreateAssignmentModal/CreateAssignmentModal';
import { Assignment } from '@/lib/types/types';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Timestamp } from 'firebase/firestore';

interface SortControlsProps {
    folderSort: string
    assignmentSort: string
    setFolderSort: (value: string) => void
    setAssignmentSort: (value: string) => void
}

const SortControls = ({folderSort, assignmentSort, setFolderSort, setAssignmentSort}: SortControlsProps) => {

    const assignments = useSelector((state: RootState) => state.currentStudentAssignments)
    const folders = useSelector((state: RootState) => state.currentStudent.folders) || []
        
    // Sort assignments
    const getFilteredAssignments = (folder: string) => {
        if (!assignments) return []
            
        // Filter assignments by folder 
        let folderAssignments = assignments.filter((assignment: Assignment) => assignment.folder === folder)
    
        // Sort by assignment name
        if (assignmentSort === 'name') {
            folderAssignments.sort((a,b) => a.title.localeCompare(b.title))
        }
    
        // Sort by assignment dueDate
        if (assignmentSort === 'due') {
            folderAssignments.sort((a,b) => {
                const dataA = a.dueDate instanceof Timestamp ? a.dueDate.toDate() : a.dueDate as Date
                const dataB = b.dueDate instanceof Timestamp ? b.dueDate.toDate() : b.dueDate as Date
                return dataA.getTime() - dataB.getTime()
            })
        }
    
        // Sort by assignment status
        if (assignmentSort === 'status') {
            const statusOrder = ['Overdue', 'In-Progress', 'Submitted', 'Under Review', 'Completed']
            folderAssignments.sort((a,b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status))
        }
    
        return folderAssignments
    }

    // Function to sort folders
    const sortFolders = () => {
        let sortedFolders = [...folders]
    
        // Sort by folder name
        if (folderSort === 'name') {
            sortedFolders.sort((a,b) => a.localeCompare(b))
        }
    
        // Sort folders by earliest assignment dueDate
        if (folderSort === "due") {
            const now = new Date()
    
            sortedFolders.sort((a, b) => {
                const assignmentsA = getFilteredAssignments(a)
                const assignmentsB = getFilteredAssignments(b)
    
                // get soonest upcoming due date in folder A
                const soonestDueDateA = assignmentsA
                    .map(assignment => {
                        if (assignment.dueDate instanceof Timestamp) return assignment.dueDate.toDate()
                        return assignment.dueDate as Date
                    })
                    .filter(dueDate => dueDate >= now) // ignore past due dates
                    .sort((dueDate1, dueDate2) => dueDate1.getTime() - dueDate2.getTime())[0]
    
                // same for folder B
                const soonestDueDateB = assignmentsB
                    .map(assignment => {
                        if (assignment.dueDate instanceof Timestamp) return assignment.dueDate.toDate()
                        return assignment.dueDate as Date
                    })
                    .filter(dueDate => dueDate >= now)
                    .sort((dueDate1, dueDate2) => dueDate1.getTime() - dueDate2.getTime())[0]
    
                // handle cases where a folder has no future due dates
                if (!soonestDueDateA && !soonestDueDateB) return 0
                if (!soonestDueDateA) return 1
                if (!soonestDueDateB) return -1
    
                return soonestDueDateA.getTime() - soonestDueDateB.getTime()
            })
        }
    
        return sortedFolders
    }
    
    return (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Sort folders by:</span>
                    <Select value={folderSort} onValueChange={(value) => {setFolderSort(value); sortFolders()}}>
                    <SelectTrigger className="w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="due">Closest Due Date</SelectItem>
                    </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Sort assignments by:</span>
                    <Select value={assignmentSort} onValueChange={(value) => setAssignmentSort(value)}>
                    <SelectTrigger className="w-32">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="due">Due Date</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
            </div>
                
            <CreateAssignmentModal/>
        </div>
    )
}

export default SortControls