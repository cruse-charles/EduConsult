'use client'

import { collection, doc, getDoc, Timestamp } from "firebase/firestore"
import { use, useEffect, useState } from "react"
import { db, app } from "@/lib/firebaseConfig";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronDown, ChevronRight, FileText, Folder, FolderOpen, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssignments } from "@/redux/slices/assignmentsSlice";
import { Assignment, AssignmentDoc, Student } from "@/lib/types/types";
import { AppDispatch, RootState } from "@/redux/store";
import AssignmentDetailModal from "./AssignmentDetailModal";
import { formatDueDate } from "@/lib/utils";

function AssignmentsList() {
    const dispatch = useDispatch<AppDispatch>()
    // const assignments = useSelector((state: RootState) => state.assignments.assignments) as Assignment[]
    // const folders = useSelector((state: RootState) => state.student.folders) as string[]

    const [selectedAssignment, setSelectedAssignment] = useState(null)

    // old
    // const assignments = useSelector((state: RootState) => {
    //     const assignmentsState = state.assignments as AssignmentDoc
    //     return assignmentsState?.assignments || []
    // })
    // old

    const assignments = useSelector((state: RootState) => {
        const assignmentsState = state.assignments as AssignmentDoc
        return assignmentsState || []
    })

    const folders = useSelector((state: RootState) => {
        const studentState = state.student as Student
        return studentState?.folders || []
    })
    const student = useSelector((state: RootState) => state.student)

    const [openedFolders, setOpenedFolders] = useState<string[]>([])

    // old
    // Dispatch fetchAssignment
    // useEffect(() => {
    //     const studentState = student as Student
    //     if (studentState?.assignmentsDocId) {
    //         dispatch(fetchAssignments(studentState.assignmentsDocId));
    //     }
    // }, [student, dispatch]);
    // old

    // new
    useEffect(() => {
        const studentState = student as Student
        if (studentState?.assignmentDocIds) {
            dispatch(fetchAssignments(studentState.assignmentDocIds));
        }



        const testGet = async () => {
            const ref1 = await getDoc(doc(db, "assignments", "timelineTest"));
            const ref2 = await getDoc(doc(db, "assignments", "timelineTest2"));
            console.log("Exists:", ref1.data(), ref2.data());
        };
        testGet()
    }, [student, dispatch]);


    // new

    // old function
    // const getFilteredAssignments = (folder: string) => {
    //     if (!assignments) return []
    //     return assignments.filter((assignment) => assignment.folderName === folder)
    // }
    // old

    // new function
    const getFilteredAssignments = (folder: string) => {
        if (!assignments) return []
        return assignments.filter((assignment) => assignment.folder === folder)
        // return assignments
    }
    // new

    // old
    // const getCompletedCount = (assignmentsInFolder: Assignment[]) => {
    //     let count = 0
    //     assignmentsInFolder.forEach((assignment) => assignment.status == 'Complete' ? count++ : null)
    //     return count
    // }
    // old

    // new
    const getCompletedCount = (assignmentsInFolder: Assignment[]) => {
        let count = 0
        // assignmentsInFolder.forEach((assignment) => assignment.status == 'Complete' ? count++ : null)
        return count
    }
    // new

    useEffect(() => {
        console.log(assignments)
    },[assignments])

    // const formatDueDate = (dueDate: Date | Timestamp | undefined) => {
    //     if (!dueDate || dueDate === undefined) return "No due date";
    //     const date = dueDate instanceof Date ? dueDate : dueDate.toDate();
    //     return format(date, "MMM d, yyyy");
    // }

    return (
        <>
            <Card>
                <CardContent className="p-0">
                    <div className="space-y-2">
                        {folders?.map((folder) => (
                            <Collapsible
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
                                        // <div className="flex items-center justify-between p-4 pl-12 hover:bg-muted/30 cursor-pointer border-b border-muted">
                                        <div onClick={() => setSelectedAssignment(assignment)} className="flex items-center justify-between p-4 pl-12 hover:bg-muted/30 cursor-pointer border-b border-muted">    
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
                                        </div>
                                    ))}
                                </div>
                                </CollapsibleContent>
                            </Collapsible>
                        ))}      
                    </div>  
                </CardContent>
            </Card>
            <AssignmentDetailModal assignment={selectedAssignment} open={!!selectedAssignment} onOpenChange={(open) => !open && setSelectedAssignment(null)} />
        </>
    )
}

export default AssignmentsList