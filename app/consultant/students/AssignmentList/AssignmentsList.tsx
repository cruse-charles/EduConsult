'use client'

import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Edit, Folder, FolderOpen, MoreHorizontal, Trash2, Upload, Users } from "lucide-react";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";

import CustomToast from "@/app/components/CustomToast";
import ReadAssignmentModal from "../[id]/ReadAssignmentModal/ReadAssignmentModal";
import EditFolderModal from "../[id]/EditFolderModal";
import AssignmentRow from "./AssignmentRow";

import { deleteAssignmentSlice, readAssignmentSlice, renameFolderInStudentAssignmentsSlice } from "@/redux/slices/currentStudentAssignmentsSlice";
import { removeAssignmentDocId, removeFolder, renameFolderInStudentSlice } from "@/redux/slices/currentStudentSlice";
import { deleteDashboardAssignment } from "@/redux/slices/consultantAssignmentSlice";
import { completeStep } from "@/redux/slices/onboardingSlice";
import { onboardingSteps } from "@/lib/onboardingSteps";
import { setCurrentAssignment } from "@/redux/slices/currentAssignmentSlice";
import { AppDispatch, RootState } from "@/redux/store";

import { Assignment } from "@/lib/types/types";
import { deleteFolder, readAssignment, renameFolder } from "@/lib/assignmentUtils";
import { nextStep } from "@/lib/onBoardingUtils";

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";

import { readAssignmentUserSlice } from "@/redux/slices/userSlice";
import SortControls from "./SortControls";
import { useSortedAssignments } from "@/hooks/useSortedAssignments";
import FolderRow from "./FolderRow";

function AssignmentsList() {
    // Retrieve data from redux/URL
    const dispatch = useDispatch<AppDispatch>()
    const { id } = useParams()
    const studentId = id as string
    const assignments = useSelector((state: RootState) => state.currentStudentAssignments)
    const user = useSelector((state: RootState) => state.user)
    const folders = useSelector((state: RootState) => state.currentStudent.folders) || []
    const { isComplete, onboardingStep } = useSelector((state: RootState) => state.onboarding);

    // State to manage modal popup for folders
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null)


    // State to manage which folders are open and sorting of folders/assignments
    const [openedFolders, setOpenedFolders] = useState<string[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)

    const {folderSort, assignmentSort, setFolderSort, setAssignmentSort,
        getFilteredAssignments, sortedFolders, getCompletedCount
    } = useSortedAssignments(assignments, folders)

 

    // Function to delete a folder and assignments within it
    const handleDeleteFolder = async (folderName: string) => {
        try {
            // Delete folder and assignments in database
            await deleteFolder(studentId, folderName)
            
            // Remove folder from redux, studentSlice
            dispatch(removeFolder(folderName))

            // Remove assignments from student slice, studentAssignmentsSlice, DashboardAssignmentsSlice
            const assignmentsInFolder = assignments.filter((assignment: Assignment) => assignment.folder == folderName)
            assignmentsInFolder.forEach((assignment) => {
                dispatch(removeAssignmentDocId(assignment.id))
                dispatch(deleteAssignmentSlice(assignment.id))
                dispatch(deleteDashboardAssignment(assignment.id))
            })
        } catch (error) {
            console.error("Error deleting folder:", error);
            toast(<CustomToast title='Error deleting folders.' description="" status='error'/>)
        }
            
    }

    // Function to edit folder name
    const handleEditFolder = async (oldFolderName: string, newFolderName: string) => {

        try {
            // Update folder in Firebase
            await renameFolder(studentId, oldFolderName, newFolderName)

            // Update folder in redux
            // TODO: UPDATE REDUX ON CONSULTANTDASHBOARD ASSIGNMENTS
            dispatch(renameFolderInStudentSlice({oldFolderName, newFolderName}))
            dispatch(renameFolderInStudentAssignmentsSlice({oldFolderName, newFolderName}))
        } catch (error) {
            console.error("Error renaming folder:", error);
            toast(<CustomToast title='Error renaming folders.' description="Please refresh and try again." status="error"/>)
        }
    }

    // Handle opening folders and onboarding if necessary
    const handleOpenFolder = async (folder: string) => {
        setOpenedFolders((prev: string[]) => prev.includes(folder) ? prev.filter((f) => f != folder) : [...prev, folder])
        
        const currentStep = onboardingSteps[onboardingStep].actionRequired
        if (!isComplete && currentStep === 'openFolder') {
            dispatch(completeStep("openFolder"))
            await nextStep(user.id)
        }
    }

    // Handle clicking assignment to open modal for details
    const handleAssignmentClick = async (assignment: Assignment) => {
        setIsModalOpen(true)

        // Update redux with the click on assignment
        dispatch(setCurrentAssignment(assignment))

        // Update hasRead in assignmentMeta for the assignment clicked
        await readAssignment(assignment.id, "consultantUsers", user.id)

        // Update hasRead in studentAssignmentsSlice and userSlice
        dispatch(readAssignmentSlice(assignment.id))
        dispatch(readAssignmentUserSlice(assignment.id))

        // Check if onboarding is complete for tooltip to render
        const currentStep = onboardingSteps[onboardingStep].actionRequired
        if (!isComplete && currentStep === "viewAssignment") {
            dispatch(completeStep("viewAssignment"))
            await nextStep(user.id)
        }
    }

    return (
        <>
            {/* Sorting Controls */}
            <SortControls folderSort={folderSort} assignmentSort={assignmentSort} setFolderSort={setFolderSort} setAssignmentSort={setAssignmentSort} />

            {/* List of Folders/Assignments */}
            <Card>
                <CardContent className="p-0">
                    <div className="space-y-2">
                        {sortedFolders?.map((folder) => (
                            // <Collapsible
                            //     key={folder}
                            //     onOpenChange={() => handleOpenFolder(folder)}
                            // >
                            //     <CollapsibleTrigger asChild>
                            //         <div className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer border-b w-full h-auto folder">
                            //             <div className="flex items-center gap-3">
                            //                 {openedFolders.includes(folder) ? (
                            //                         <FolderOpen className="h-5 w-5 text-primary" />
                            //                 ) : (
                            //                     <div className="relative">
                            //                         <Folder className="h-5 w-5 text-muted-foreground" />
                            //                         <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500 ring-2 ring-white" />
                            //                     </div>
                            //                 )}
                            //                 <div className="text-left">                                                <h3 className="font-medium">{folder}</h3>
                            //                     <p className="text-sm text-muted-foreground">
                            //                         {/* TODO: Add handling for just 1 assignment or no completed assignments */}
                            //                         {getFilteredAssignments(folder).length} assignments • {getCompletedCount(getFilteredAssignments(folder))} completed
                            //                     </p>
                            //                 </div>
                            //             </div>
                            //             <div className="flex items-center gap-2">
                            //             <DropdownMenu>
                            //                 <DropdownMenuTrigger asChild>
                            //                     <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                            //                         <MoreHorizontal className="h-4 w-4" />
                            //                     </Button>
                            //                 </DropdownMenuTrigger>
                            //                 <DropdownMenuContent align="end">
                            //                     <DropdownMenuItem onClick={() => setSelectedFolder(folder)}>
                            //                         <Edit className="h-4 w-4 mr-2" />
                            //                         Rename Folder
                            //                     </DropdownMenuItem>
                            //                     <DropdownMenuItem className="text-red-600" onClick={(e) => handleDeleteFolder(folder)}>
                            //                         <Trash2 className="h-4 w-4 mr-2" />
                            //                         Delete Folder
                            //                     </DropdownMenuItem>
                            //                 </DropdownMenuContent>
                            //             </DropdownMenu>
                            //             {openedFolders.includes(folder) ? (
                            //                 <ChevronDown className="h-4 w-4" />
                            //             ) : (
                            //                 <ChevronRight className="h-4 w-4" />
                            //             )}
                            //             </div>
                            //         </div>
                            //     </CollapsibleTrigger>
                            //     <CollapsibleContent>
                            //     {/* Assignments */}
                            //     <div className="space-y-1">
                            //         {getFilteredAssignments(folder).map((assignment) => (
                            //             <AssignmentRow assignment={assignment} onClick={handleAssignmentClick}/>
                            //         ))}
                            //     </div>
                            //     </CollapsibleContent>
                            // </Collapsible>
                            <FolderRow folder={folder} onAssignmentClick={handleAssignmentClick} handleOpenFolder={handleOpenFolder} handleDeleteFolder={handleDeleteFolder}/>
                        ))}      
                    </div>  
                </CardContent>
            </Card>
            <ReadAssignmentModal open={isModalOpen} onOpenChange={setIsModalOpen} />
            <EditFolderModal open={!!selectedFolder} onOpenChange={(open: boolean) => !open && setSelectedFolder(null)} handleSave={handleEditFolder} oldFolderName={selectedFolder}/>
        </>
    )
}

export default AssignmentsList