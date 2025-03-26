'use client'

import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronDown, ChevronRight, FileText, Folder, FolderOpen, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import ViewAssignmentModal from "./ViewAssignmentModal/ViewAssignmentModal";

import { fetchAssignments } from "@/redux/slices/assignmentsSlice";
import { Assignment, Student } from "@/lib/types/types";
import { AppDispatch, RootState } from "@/redux/store";
import { formatDueDate } from "@/lib/utils";

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";

function AssignmentsList() {
    const dispatch = useDispatch<AppDispatch>()
    // const assignments = useSelector((state: RootState) => state.assignments.assignments) as Assignment[]
    // const folders = useSelector((state: RootState) => state.student.folders) as string[]
    const {id: studentId} = useParams()

    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)

    const assignments = useSelector((state: RootState) => state.assignments)

    const folders = useSelector((state: RootState) => {
        const studentState = state.student as Student
        return studentState?.folders || []
    })
    const student = useSelector((state: RootState) => state.student)

    const [openedFolders, setOpenedFolders] = useState<string[]>([])

    useEffect(() => {
        const studentState = student as Student
        if (studentState?.assignmentDocIds) {
            dispatch(fetchAssignments(studentState.assignmentDocIds));
        }
    }, [dispatch, studentId]);

    const getFilteredAssignments = (folder: string) => {
        if (!assignments) return []
        return assignments.filter((assignment) => assignment.folder === folder)
    }

    const getCompletedCount = (assignmentsInFolder: Assignment[]) => {
        let count = 0
        // assignmentsInFolder.forEach((assignment) => assignment.status == 'Complete' ? count++ : null)
        return count
    }

    return (
        <>
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
            <ViewAssignmentModal assignmentId={selectedAssignment?.id} open={!!selectedAssignment} onOpenChange={(open: boolean) => !open && setSelectedAssignment(null)} />
        </>
    )
}

export default AssignmentsList