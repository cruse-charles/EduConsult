'use client'

import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getConsultantCalendarAssignments } from '@/lib/querys'
import { Assignment } from '@/lib/types/types'
import { formatNextDeadline } from '@/lib/utils'
import { RootState } from '@/redux/store'
import { BookOpen, Check, Clock, Download, FileText, Upload } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const page = () => {
    const [assignments, setAssignments] = useState<Assignment[]>([])
    
    const user = useSelector((state: RootState) => state.user)

    useEffect(() => {
        getConsultantCalendarAssignments(user.id).then(setAssignments)
    }, [])


    return (
        <div className="flex min-h-screen flex-col">
            <main className="container flex-1 p-4 md:p-6 space-y-6">
                <h1>Manage Assignments</h1>
                    <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Assignment</TableHead>
                            <TableHead>Student</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {assignments.map((assignment) => (
                            <TableRow key={assignment.id}>
                            <TableCell className="font-medium">{assignment.title}</TableCell>
                            {/* TODO: Change student to an object with id, firstName, lastName */}
                            <TableCell>{assignment.student}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    {assignment.type === "Essay" && <FileText className="h-4 w-4 text-blue-500" />}
                                    {assignment.type === "Document" && <BookOpen className="h-4 w-4 text-green-500" />}
                                    {assignment.type === "Portfolio" && <Upload className="h-4 w-4 text-purple-500" />}
                                    {assignment.type === "Payment" && <Download className="h-4 w-4 text-red-500" />}
                                    {assignment.type === "Application" && <FileText className="h-4 w-4 text-orange-500" />}
                                {assignment.type}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={assignment.status === "completed" ? "success" : "outline"}>
                                {assignment.status === "completed" ? (
                                    <div className="flex items-center gap-1">
                                    <Check className="h-3 w-3" />
                                    Completed
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Pending
                                    </div>
                                )}
                                </Badge>
                            </TableCell>
                            <TableCell>{formatNextDeadline(assignment.dueDate)}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    {assignments.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12">
                        <p className="text-muted-foreground">No assignments found matching your criteria.</p>
                        </div>
                    )}
                    </div>
            </main>
        </div>
    )
}

export default page