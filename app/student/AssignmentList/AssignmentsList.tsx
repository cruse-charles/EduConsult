'use client'

import { Card, CardContent } from "@/components/ui/card";

import { fetchAssignments } from "@/redux/slices/currentStudentAssignmentsSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useSortedAssignments } from "@/hooks/useSortedAssignments";

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

    const {folderSort, assignmentSort, setFolderSort, setAssignmentSort,
        getFilteredAssignments, sortedFolders, getCompletedCount
    } = useSortedAssignments(assignments, folders)

    // Then fetch assignments when student data loads
    useEffect(() => {
        if (user?.assignmentDocIds) {
            dispatch(fetchAssignments(user.assignmentDocIds))
        }
    }, [user?.assignmentDocIds, dispatch])

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
                                <FolderRow key={folder} completedCount={getCompletedCount(folderAssignments)} assignments={folderAssignments} folder={folder} />
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