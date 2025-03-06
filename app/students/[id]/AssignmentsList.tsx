'use client'

import { collection, doc, getDoc } from "firebase/firestore"
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

// function AssignmentsList({student, refreshKey}) {
function AssignmentsList() {
    const dispatch = useDispatch()
    const assignments = useSelector(state => state.assignments.assignments)

    const student = useSelector(state => state.student)

    // const [assignments, setAssignments]  = useState(null)
    const [folders, setFolders] = useState(student.folders)

    const [openedFolders, setOpenedFolders] = useState([])
    
    // useEffect(() => {
    //     const fetchAssignments = async () => {
    //         const assignmentRef = doc(db, "assignments", student.assignmentsDocId)
    //         const assignmentSnapshot = await getDoc(assignmentRef)
    //         setAssignments(assignmentSnapshot.data().assignments || [])
    //     }

    //     if (student?.assignmentsDocId) {
    //         fetchAssignments();
    //     }

    //     // fetchAssignments()
        
    //     console.log('student', student)
    // }, [student])
    //     }, [student, refreshKey])

    useEffect(() => {
        const fetchFolders = async () => {
            const studentRef = doc(db, "studentUsers", student.id)
            const studentSnapshot = await getDoc(studentRef)
            setFolders(studentSnapshot.data().folders)
        }

        if (student?.id) {
            fetchFolders();
        }

        // fetchFolders()
    }, [student])
        //     }, [student, refreshKey])



    // Dispatch fetchAssignment
    useEffect(() => {
        dispatch(fetchAssignments(student.assignmentsDocId));
    }, [student?.id, dispatch]);


    useEffect(() => {
        if (assignments) {
            console.log('assignments', assignments);
            console.log('folders', folders)
        }
    }, [assignments]);

    const getAssignments = (folder) => {
        if (!assignments) return []
        return assignments.filter((assignment) => assignment.folderName === folder)
    }

    const getCompletedCount = (assignmentsInFolder) => {
        let count = 0
        assignmentsInFolder.forEach((assignment) => assignment.status == 'Complete' ? count++ : null)
        return count
    }

    return (
        <>
            <Card>
                <CardContent className="p-0">
                    <div className="space-y-2">
                        {folders?.map((folder) => (
                            <Collapsible
                                onOpenChange={() => setOpenedFolders((prev) => prev.includes(folder) ? prev.filter((f) => f != folder) : [...prev, folder])}
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
                                                    {getAssignments(folder).length} assignments • {getCompletedCount(getAssignments(folder))} completed
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                        <Badge variant="outline">
                                            {getCompletedCount(getAssignments(folder))}/{getAssignments(folder).length}
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
                                    {getAssignments(folder).map((assignment) => (
                                        <div className="flex items-center justify-between p-4 pl-12 hover:bg-muted/30 cursor-pointer border-b border-muted">
                                            <div className="flex items-center gap-3 flex-1">    
                                                <div className="flex items-center gap-2">
                                                    {assignment.type === "essay" && <FileText className="h-4 w-4 text-blue-500" />}
                                                    {assignment.type === "document" && <BookOpen className="h-4 w-4 text-green-500" />}
                                                    {assignment.type === "portfolio" && <Upload className="h-4 w-4 text-purple-500" />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium">{assignment.title}</div>
                                                    <div className="text-sm text-muted-foreground">Due: {format(assignment.dueDate.toDate(), "MMM d, yyyy")}</div>
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
        </>
    )
}

export default AssignmentsList