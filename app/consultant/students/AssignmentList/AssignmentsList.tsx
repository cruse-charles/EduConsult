'use client'

import { Card, CardContent } from "@/components/ui/card";

import ReadAssignmentModal from "../[id]/ReadAssignmentModal/ReadAssignmentModal";
import EditFolderModal from "../[id]/EditFolderModal";
import FolderRow from "./FolderRow";
import SortControls from "./SortControls";

import { readAssignmentSlice } from "@/redux/slices/currentStudentAssignmentsSlice";
import { completeStep } from "@/redux/slices/onboardingSlice";
import { onboardingSteps } from "@/lib/onboardingSteps";
import { setCurrentAssignment } from "@/redux/slices/currentAssignmentSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { readAssignmentUserSlice } from "@/redux/slices/userSlice";
import { useSortedAssignments } from "@/hooks/useSortedAssignments";

import { Assignment } from "@/lib/types/types";
import { readAssignment } from "@/lib/assignmentUtils";
import { nextStep } from "@/lib/onBoardingUtils";

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";


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
    const [isModalOpen, setIsModalOpen] = useState(false)

    const {folderSort, assignmentSort, setFolderSort, setAssignmentSort,
        getFilteredAssignments, sortedFolders, getCompletedCount
    } = useSortedAssignments(assignments, folders)

    // TODO: Could move this into FolderRow too
    // Handle opening folders for onboarding
    const handleOpenFolder = async () => {
        
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
                        {sortedFolders?.map((folder) => {
                            const folderAssignments = getFilteredAssignments(folder)
                            return (
                                <FolderRow key={folder} onOpen={handleOpenFolder} completedCount={getCompletedCount(folderAssignments)} setSelectedFolder={setSelectedFolder} assignments={folderAssignments} folder={folder} onAssignmentClick={handleAssignmentClick}/>
                            )
                        })}      
                    </div>  
                </CardContent>
            </Card>
            <ReadAssignmentModal open={isModalOpen} onOpenChange={setIsModalOpen} />
            <EditFolderModal open={!!selectedFolder} onOpenChange={(open: boolean) => !open && setSelectedFolder(null)} oldFolderName={selectedFolder}/>
        </>
    )
}

export default AssignmentsList