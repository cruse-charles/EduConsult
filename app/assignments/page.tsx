'use client'

import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BookOpen, Check, CheckCircle, Clock, Download, Eye, FileText, Hourglass, Upload } from 'lucide-react'

import { formatNextDeadline } from '@/lib/utils'

import { RootState } from '@/redux/store'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { Timestamp } from 'firebase/firestore'

const page = () => {
    const assignments = useSelector((state: RootState) => state.studentAssignments)
    
    const user = useSelector((state: RootState) => state.user)

    // TODO: This is in AssignmentsList as well, export it
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
                                {/* <Badge variant={assignment.status === "completed" ? "success" : "outline"}> */}
                                {getStatusBadge(assignment.status, assignment?.dueDate)}
                                {/* {assignment.status} */}
                                {/* </Badge> */}
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