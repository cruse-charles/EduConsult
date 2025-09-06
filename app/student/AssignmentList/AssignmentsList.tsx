'use client'

import { Card, CardContent } from "@/components/ui/card";

import { fetchAssignments } from "@/redux/slices/currentStudentAssignmentsSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useSortedAssignments } from "@/hooks/useSortedAssignments";
import { onboardingSteps } from "@/lib/onboardingSteps";
import { completeStep } from "@/redux/slices/onboardingSlice";
import { nextStep } from "@/lib/onBoardingUtils";

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";

import ReadAssignmentModal from "../ViewAssignmentModal/ReadAssignmentModal";
import SortControls from "./SortControls";
import FolderRow from "./FolderRow";


function AssignmentsList() {
    // Retrieve data from redux/URL
    const dispatch = useDispatch<AppDispatch>()
    const assignments = useSelector((state: RootState) => state.currentStudentAssignments)
    const user = useSelector((state: RootState) => state.user)
    const folders = useSelector((state: RootState) => state.user.folders) || []
    const { isComplete, onboardingStep } = useSelector((state: RootState) => state.onboarding);

    // State to manage modal popup for folders
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null)

    // State to manage which folders are open and sorting of folders/assignments
    const [isModalOpen, setIsModalOpen] = useState(false)

    const {folderSort, assignmentSort, setFolderSort, setAssignmentSort,
        getFilteredAssignments, sortedFolders, getCompletedCount
    } = useSortedAssignments(assignments, folders)

    // Then fetch assignments when student data loads
    useEffect(() => {
        if (user?.assignmentDocIds) {
            dispatch(fetchAssignments(user.assignmentDocIds))
        }
    }, [user?.assignmentDocIds, dispatch])

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
                                <FolderRow key={folder} onOpen={handleOpenFolder} completedCount={getCompletedCount(folderAssignments)} setSelectedFolder={setSelectedFolder} assignments={folderAssignments} folder={folder} />
                            )
                        })}      
                    </div>  
                </CardContent>
            </Card>
            <ReadAssignmentModal />
        </>
    )














}

export default AssignmentsList