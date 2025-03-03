'use client'

import { collection, doc, getDoc } from "firebase/firestore"
import { use, useEffect, useState } from "react"
import { db, app } from "@/lib/firebaseConfig";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Folder, FolderOpen } from "lucide-react";

function AssignmentsList({student}) {
    const [assignments, setAssignments]  = useState(null)
    const [folders, setFolders] = useState(student.folders)

    const [openedFolders, setOpenedFolders] = useState([])
    
    useEffect(() => {
        const fetchAssignments = async () => {
            const ref = doc(db, "assignments", student.assignmentsDocId)
            const snapshot = await getDoc(ref)
            setAssignments(snapshot.data().assignments || [])
        }

        fetchAssignments()
        
        console.log('student', student)
    }, [student])

    useEffect(() => {
    if (assignments) {
        console.log('assignments', assignments);
        console.log('folders', folders)
    }
}, [assignments]);



    return (
        <>
            <Card>
                <CardContent className="p-0">
                    <div className="space-y-2">
                        {folders?.map((folder) => (
                            <Collapsible
                                // open={openedFolders.includes(folder)}
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
                                            </div>
                                        </div>
                                    </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    {assignments
                                        ?.filter((assignment) => assignment.folderName === folder)
                                        .map((assignment) => (
                                        <div key={assignment.title}>{assignment.title}</div>
                                        ))}
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