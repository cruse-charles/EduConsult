'use client'

import { Card, CardContent } from "@/components/ui/card";

import ReadAssignmentModal from "../ReadAssignmentModal/ReadAssignmentModal";
import UpdateFolderModal from "../UpdateFolderModal";
import FolderRow from "./FolderRow";
import SortControls from "./SortControls";

import { RootState } from "@/redux/store";
import { useSortedAssignments } from "@/hooks/useSortedAssignments";

import { createContext, useState } from "react"
import { useSelector } from "react-redux";
import ConfirmationDialog from "@/app/components/ConfirmationDialog";


export type DeleteConfirmFn = () => Promise<void> | void

export const DeleteConfirmContext = createContext<{ 
    openConfirm: (fn: DeleteConfirmFn) => void }>({openConfirm: () => {},
})


function AssignmentsList() {
    // Retrieve data from redux/URL
    const assignments = useSelector((state: RootState) => state.currentStudentAssignments)
    const folders = useSelector((state: RootState) => state.currentStudent.folders) || []

    // State to manage modal popup for folders
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null)

    // Context to delete assignments and folders, and state to manage confirmation dialog
    const [confirmAction, setConfirmAction] = useState<(() => Promise<void> | void) | null>(null)
    const openConfirm = (onConfirm: () => Promise<void> | void) => {
        setConfirmAction(() => onConfirm)
    }
    const closeConfirm = () => setConfirmAction(null)



    // State to manage which folders are open and sorting of folders/assignments
    const {folderSort, assignmentSort, setFolderSort, setAssignmentSort,
        getFilteredAssignments, sortedFolders, getCompletedCount
    } = useSortedAssignments(assignments, folders)

    return (
        <DeleteConfirmContext.Provider value={{ openConfirm }}>
            {/* Sorting Controls */}
            <SortControls folderSort={folderSort} assignmentSort={assignmentSort} setFolderSort={setFolderSort} setAssignmentSort={setAssignmentSort} />

            {/* List of Folders/Assignments */}
            <Card>
                <CardContent className="p-0">
                    <div className="space-y-2">
                        {sortedFolders?.map((folder) => {
                            const folderAssignments = getFilteredAssignments(folder)
                            return (
                                <FolderRow key={folder} completedCount={getCompletedCount(folderAssignments)} setSelectedFolder={setSelectedFolder} assignments={folderAssignments} folder={folder}/>
                            )
                        })}      
                    </div>  
                </CardContent>
            </Card>
            <ReadAssignmentModal />
            <UpdateFolderModal open={!!selectedFolder} onOpenChange={(open: boolean) => !open && setSelectedFolder(null)} oldFolderName={selectedFolder}/>
            <ConfirmationDialog
                open={!!confirmAction}
                onOpenChange={(open) => !open && closeConfirm()}
                onConfirm={async () => {
                    if (confirmAction) await confirmAction()
                    closeConfirm()
                }}
            />
        </DeleteConfirmContext.Provider>
    )
}

export default AssignmentsList