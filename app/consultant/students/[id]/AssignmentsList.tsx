'use client'

import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, BookOpen, CheckCircle, ChevronDown, ChevronRight, Clock, Eye, FileText, Folder, FolderOpen, Hourglass, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import ViewAssignmentModal from "./ViewAssignmentModal/ViewAssignmentModal";

import { fetchAssignments, setAssignments } from "@/redux/slices/studentAssignmentsSlice";
import { Assignment, Student } from "@/lib/types/types";
import { AppDispatch, RootState } from "@/redux/store";
import { formatDueDate, formatDueDateAndTime } from "@/lib/utils";
import { fetchStudent, updateFolders } from "@/redux/slices/studentSlice";

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { Timestamp } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CreateAssignmentModal from "./CreateAssignmentModal/CreateAssignmentModal";

function AssignmentsList() {
    const dispatch = useDispatch<AppDispatch>()
    // const assignments = useSelector((state: RootState) => state.assignments.assignments) as Assignment[]
    // const folders = useSelector((state: RootState) => state.student.folders) as string[]
    const {id: studentId} = useParams()

    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)

    const assignments = useSelector((state: RootState) => state.studentAssignments)

    // const folders = useSelector((state: RootState) => {
    //     const studentState = state.student as Student
    //     return studentState?.folders || []
    // })

    const [folders, setFolders] = useState<string[]>(useSelector((state: RootState) => {
        const studentState = state.student as Student
        return studentState?.folders || []
    }))



    const student = useSelector((state: RootState) => state.student)

    const [openedFolders, setOpenedFolders] = useState<string[]>([])
    const [folderSort, setFolderSort] = useState("")
    const [assignmentSort, setAssignmentSort] = useState("")

    const [loading, setLoading] = useState(true);

    // TODO NOW: Add student state to redux right away if student log in, this will let us to fetch their assignments
    // TODO: When I delete an assignment, it deletes from database and redux, it fulfills. But if I refresh
    // I get this error: fetchAssignments rejected: Assignment with ID XXXXX not found. Why does it do this?
    // In this console.log below, I see that the studentState does show the assignmentDocId that was deleted, why?

    // TODO: switching tabs in the tabs for dashboard re-runs this assignmentsList, but it really shouldn't, so cache
    // this info and re-use it
    useEffect(() => {
        // TODO: Need to dispatch a clear folders/assignments action when studentId changes
        setLoading(true)
        // console.log('HELLO')

        const studentState = student as Student
        
        if (studentState?.assignmentDocIds) {
            dispatch(fetchAssignments(studentState.assignmentDocIds)).finally(() => setLoading(false));
        } else {
            dispatch(setAssignments([]))
            setLoading(false)
        }
    }, [dispatch, studentId, student]);

    const getFilteredAssignments = (folder: string) => {
        if (!assignments) return []
        return assignments.filter((assignment) => assignment.folder === folder)
    }

    useEffect(() => {
        console.log(assignments)
        if (assignments && assignments.length > 0) {
            setLoading(false);
        }
    }, [assignments]);

    // TODO: Finish this function
    const getCompletedCount = (assignmentsInFolder: Assignment[]) => {
        let count = 0
        // assignmentsInFolder.forEach((assignment) => assignment.status == 'Complete' ? count++ : null)
        return count
    }

    // TODO: EXPORT THIS OUT, HAVE THIS IN A FEW PLACES
    const getStatusBadge = (status: string, dueDate: Date | Timestamp | undefined) => {
        if (!dueDate) return null

        if (status === 'Pending' && dueDate < Timestamp.fromDate(new Date())) {
            return (
                <Badge className="gap-1 bg-red-100 text-red-800 font-bold hover:bg-red-100 hover:text-red-800">
                    <Clock className="h-3 w-3" />
                    Overdue
                </Badge>
            )
        }

        switch (status) {
            case "Pending":
            return (
                <Badge className="gap-1  bg-orange-100 text-orange-800 font-bold hover:bg-orange-100 hover:text-orange-800">
                    <Hourglass className="h-3 w-3" />
                    Assigned
                </Badge>
            )

            case "Completed":
            return (
                <Badge className="gap-1 bg-green-100 text-green-800 font-bold hover:bg-green-100 hover:text-green-800">
                    <CheckCircle className="h-3 w-3" />
                    Completed
                </Badge>
            )

            case "Submitted":
            return (
                <Badge className="gap-1 bg-blue-100 text-blue-800 font-bold hover:bg-blue-100 hover:text-blue-800">
                    <Upload className="h-3 w-3" />
                    Submitted
                </Badge>
            )

            case "Under Review":
            return (
                <Badge className="gap-1 bg-purple-100 text-purple-800 font-bold hover:bg-purple-100 hover:text-purple-800">
                    <Eye className="h-3 w-3" />
                    Reviewing
                </Badge>
            )
        }

        return null
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

        // TODO: Needs to sort folders by the closest due date starting from todays date and onward
            // Find the closest date in each folder, sort the folders by that date 
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

    // TODO: A new folder isn't appearing when i create a new assignment with a new folder, but does on refresh
    return (
        <>
            {/* Sorting Controls */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Sort folders by:</span>
                    {/* <Select value={folderSort} onValueChange={(value) => setFolderSort(value)}> */}
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
                <CreateAssignmentModal/>
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
                                        <div onClick={() => setSelectedAssignment(assignment)} key={assignment.id} className="flex items-center justify-between p-4 pl-12 hover:bg-muted/30 cursor-pointer border-b border-muted">    
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
                                            <div className="flex items-center gap-3">{getStatusBadge(assignment.status, assignment?.dueDate)}</div>
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
            <ViewAssignmentModal assignment={selectedAssignment} open={!!selectedAssignment} onOpenChange={(open: boolean) => !open && setSelectedAssignment(null)} />
        </>
    )
}

export default AssignmentsList