'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BookOpen, Download, FileText, Upload } from 'lucide-react'

import { formatNextDeadline } from '@/lib/utils'

import { RootState } from '@/redux/store'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getConsultantAssignments, getStudentAssignments } from '@/lib/queries/querys'
import { Assignment } from '@/lib/types/types'

import StatusBadge from '../components/StatusBadge'
import { setCurrentAssignment } from '@/redux/slices/currentAssignmentSlice'
import ReadAssignmentModal from '../consultant/students/[id]/ReadAssignmentModal/ReadAssignmentModal'

// TODO: Add loading state
const page = () => {
    const dispatch = useDispatch()

    // Retrieve user details and assignment state
    const user = useSelector((state: RootState) => state.user)
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Fetch user's assignments 
    useEffect(() => {
        const fetchAssignments = async () => {
            const assignmentData = user.role === 'consultant' ? await getConsultantAssignments(user.id) : await getStudentAssignments(user.id)
            setAssignments(assignmentData)
        }

        fetchAssignments()
    },[user.id])

    const handleAssignmentClick = (assignment: Assignment) => {
        setIsModalOpen(true)
        dispatch(setCurrentAssignment(assignment))
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
                            <TableHead>{user.role === 'consultant' ? 'Student' : 'Consultant'}</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {assignments.map((assignment) => (
                            <TableRow key={assignment.id} onClick={() => handleAssignmentClick(assignment)} className='cursor-pointer'>
                            <TableCell className="font-medium">{assignment.title}</TableCell>
                            {/* TODO: Change student to an object with id, firstName, lastName */}
                            {/* <TableCell>{assignment.studentFirstName} {assignment.studentLastName}</TableCell> */}
                            <TableCell>{user.role === 'consultant' ? `${assignment.studentFirstName} ${assignment.studentLastName}` : `${assignment.consultantFirstName} ${assignment.consultantLastName}`}</TableCell>
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
                                {StatusBadge(assignment.status, assignment.dueDate)}
                            </TableCell>
                            <TableCell>{formatNextDeadline(assignment.dueDate)}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    {assignments.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12">
                        <p className="text-muted-foreground">No assignments found.</p>
                        </div>
                    )}
                    </div>
            </main>
            <ReadAssignmentModal />
        </div>
    )
}

export default page