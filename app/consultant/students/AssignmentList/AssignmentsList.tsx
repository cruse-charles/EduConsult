'use client'

import { Card, CardContent } from "@/components/ui/card";

import ReadAssignmentModal from "../[id]/ReadAssignmentModal/ReadAssignmentModal";
import EditFolderModal from "../[id]/EditFolderModal";
import FolderRow from "./FolderRow";
import SortControls from "./SortControls";

import { completeStep } from "@/redux/slices/onboardingSlice";
import { onboardingSteps } from "@/lib/onboardingSteps";
import { AppDispatch, RootState } from "@/redux/store";
import { useSortedAssignments } from "@/hooks/useSortedAssignments";

import { nextStep } from "@/lib/onBoardingUtils";

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";


function AssignmentsList() {
    // Retrieve data from redux/URL
    const dispatch = useDispatch<AppDispatch>()
    const assignments = useSelector((state: RootState) => state.currentStudentAssignments)
    const user = useSelector((state: RootState) => state.user)
    const folders = useSelector((state: RootState) => state.currentStudent.folders) || []
    const { isComplete, onboardingStep } = useSelector((state: RootState) => state.onboarding);

    // State to manage modal popup for folders
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null)

    // State to manage which folders are open and sorting of folders/assignments
    const {folderSort, assignmentSort, setFolderSort, setAssignmentSort,
        getFilteredAssignments, sortedFolders, getCompletedCount
    } = useSortedAssignments(assignments, folders)

    // TODO: Could move this into FolderRow too
    // Handle opening folders for onboarding
    const handleOpenFolder = async () => {
        
        const currentStep = onboardingSteps[onboardingStep]?.actionRequired
        if (!isComplete && currentStep === 'openFolder') {
            dispatch(completeStep("openFolder"))
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
                        {sortedFolders?.map((folder) => {
                            const folderAssignments = getFilteredAssignments(folder)
                            return (
                                <FolderRow key={folder} onOpen={handleOpenFolder} completedCount={getCompletedCount(folderAssignments)} setSelectedFolder={setSelectedFolder} assignments={folderAssignments} folder={folder}/>
                            )
                        })}      
                    </div>  
                </CardContent>
            </Card>
            <ReadAssignmentModal />
            <EditFolderModal open={!!selectedFolder} onOpenChange={(open: boolean) => !open && setSelectedFolder(null)} oldFolderName={selectedFolder}/>
        </>
    )
}

export default AssignmentsList