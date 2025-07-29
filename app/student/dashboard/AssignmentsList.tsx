'use client'

import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, BookOpen, ChevronDown, ChevronRight, FileText, Folder, FolderOpen, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import ViewAssignmentModal from "../ViewAssignmentModal/ViewAssignmentModal";
import StatusBadge from "@/app/components/StatusBadge";

import { fetchAssignments, setAssignments } from "@/redux/slices/currentStudentAssignmentsSlice";
import { Assignment, Student } from "@/lib/types/types";
import { AppDispatch, RootState } from "@/redux/store";
import { formatDueDate } from "@/lib/utils";

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { Timestamp } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { setCurrentAssignment } from "@/redux/slices/currentAssignmentSlice";

function AssignmentsList() {
    const dispatch = useDispatch<AppDispatch>()

    // Retrieve student and assignment information
    const assignments: Assignment[] = useSelector((state: RootState) => state.currentStudentAssignments)
    const student = useSelector((state: RootState) => state.currentStudent)
    
    // Manage state for assignment modal, folder rendering and opening, and loading state
    const [folders, setFolders] = useState<string[]>([])
    const [openedFolders, setOpenedFolders] = useState<string[]>([])
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Manage sorting for assignments and folders
    const [folderSort, setFolderSort] = useState("")
    const [assignmentSort, setAssignmentSort] = useState("")
    
    // Set folders on load
    useEffect(() => {
        setFolders(student?.folders || [])
    }, [student.folders])

    // TODO: When I delete an assignment, it deletes from database and redux, it fulfills. But if I refresh
    // I get this error: fetchAssignments rejected: Assignment with ID XXXXX not found. Why does it do this?

    // TODO: switching tabs in the tabs for dashboard re-runs this assignmentsList, but it really shouldn't, so cache
        // this info and re-use it
    useEffect(() => {
        // TODO: Need to dispatch a clear folders/assignments action when studentId changes
        setLoading(true)

        const studentState = student as Student
        
        if (studentState?.assignmentDocIds) {
            dispatch(fetchAssignments(studentState.assignmentDocIds)).finally(() => setLoading(false));
        } else {
            dispatch(setAssignments([]))
            setLoading(false)
        }
    }, [dispatch, student]);

    const getFilteredAssignments = (folder: string) => {
        if (!assignments) return []
        let folderAssignments = assignments.filter((assignment) => assignment.folder === folder)

        if (assignmentSort === 'name') {
            folderAssignments.sort((a,b) => a.title.localeCompare(b.title))
        }

        if (assignmentSort === 'due') {
            folderAssignments.sort((a,b) => {
                const dataA = a.dueDate instanceof Timestamp ? a.dueDate.toDate() : a.dueDate as Date
                const dataB = b.dueDate instanceof Timestamp ? b.dueDate.toDate() : b.dueDate as Date
                return dataA.getTime() - dataB.getTime()
            })
        }

        if (assignmentSort === 'status') {
            const statusOrder = ['Overdue', 'In-Progress', 'Submitted', 'Under Review', 'Completed']
            folderAssignments.sort((a,b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status))
        }

        return folderAssignments
    }

    // TODO: Finish this function
    const getCompletedCount = (assignmentsInFolder: Assignment[]) => {
        let count = 0
        // assignmentsInFolder.forEach((assignment) => assignment.status == 'Complete' ? count++ : null)
        return count
    }

    if (loading) {
        return (
            Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))
        )
    }

    const sortFolders = (value: string) => {
        let sortedFolders = [...folders]

        if (value === 'name') {
            sortedFolders.sort((a,b) => a.localeCompare(b))
        }

        if (value === "due") {
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

        setFolders(sortedFolders)
    }

    const handleAssignmentClick = (assignment: Assignment) => {
        setIsModalOpen(true)
        dispatch(setCurrentAssignment(assignment))
    }

    // TODO: A new folder isn't appearing when i create a new assignment with a new folder, but does on refresh
    return (
        <>
            {/* Sorting Controls */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Sort folders by:</span>
                    <Select value={folderSort} onValueChange={(value) => {setFolderSort(value); sortFolders(value)}}>
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
            </div>

            {/* List of Folders/Assignments */}
            <Card>
                <CardContent className="p-0">
                    <div className="space-y-2">
                        {folders?.map((folder) => (
                            <Collapsible
                                key={folder}
                                onOpenChange={() => setOpenedFolders((prev: string[]) => prev.includes(folder) ? prev.filter((f) => f != folder) : [...prev, folder])}
                            >
                                <CollapsibleTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer border-b w-full h-auto"
                                    >
                                        <div className="flex items-center gap-3">
                                            {openedFolders.includes(folder) ? (
                                                <FolderOpen className="h-5 w-5 text-primary" />
                                            ) : (
                                                <Folder className="h-5 w-5 text-muted-foreground" />
                                            )}
                                            <div className="text-left">
                                                <h3 className="font-medium">{folder}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {/* TODO: Add handling for just 1 assignment or no completed assignments */}
                                                    {getFilteredAssignments(folder).length} assignments • {getCompletedCount(getFilteredAssignments(folder))} completed
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                        <Badge variant="outline">
                                            {getCompletedCount(getFilteredAssignments(folder))}/{getFilteredAssignments(folder).length}
                                        </Badge>
                                        {openedFolders.includes(folder) ? (
                                            <ChevronDown className="h-4 w-4" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4" />
                                        )}
                                        </div>
                                    </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                <div className="space-y-1">
                                    {getFilteredAssignments(folder).map((assignment) => (
                                        <div onClick={() => handleAssignmentClick(assignment)} key={assignment.id} className="flex items-center justify-between p-4 pl-12 hover:bg-muted/30 cursor-pointer border-b border-muted">    
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="flex items-center gap-2">
                                                    {assignment.type === "essay" && <FileText className="h-4 w-4 text-blue-500" />}
                                                    {assignment.type === "document" && <BookOpen className="h-4 w-4 text-green-500" />}
                                                    {assignment.type === "portfolio" && <Upload className="h-4 w-4 text-purple-500" />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium">{assignment.title}</div>
                                                    <div className="text-sm text-muted-foreground">Due: {formatDueDate(assignment?.dueDate)}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">{StatusBadge(assignment.status, assignment?.dueDate)}</div>
                                        </div>
                                    ))}
                                </div>
                                </CollapsibleContent>
                            </Collapsible>
                        ))}      
                    </div>  
                </CardContent>
            </Card>
            {/* @ts-ignore */}
            <ViewAssignmentModal open={isModalOpen} onOpenChange={setIsModalOpen} />
        </>
    )
}

export default AssignmentsList