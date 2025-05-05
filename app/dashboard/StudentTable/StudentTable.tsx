import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { Student } from "@/lib/types/types";
import { formatNextDeadline } from "@/lib/utils";

import Link from "next/link";
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

import { useState } from "react"
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import AssignmentsList from "@/app/students/[id]/AssignmentsList";
import { Skeleton } from "@/components/ui/skeleton";

interface StudentTableProps {
    students: Student[];
    loading: boolean;
}

const StudentTable = ({students, loading}: StudentTableProps) => {
    const user = useSelector((state: RootState)=> state.user)

    // State to manage sorting by column and order
    const [sortBy, setSortBy] = useState("name")
    const [sortOrder, setSortOrder] = useState("asc")
    
    // Handle sorting logic when column header is clicked
    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        } else {
            setSortBy(column)
            setSortOrder("asc")
        }
    }

    const sortedStudents = [...students].sort((a,b) => {
        let comparison = 0

        // Determine comparison based on column selected with sortBy
        switch (sortBy) {
            case "name":
                comparison = a.personalInformation.firstName.localeCompare(b.personalInformation.firstName)
                break
            case "pending":
                comparison = (a.stats?.pendingAssignmentsCount || 0) - (b.stats?.pendingAssignmentsCount || 0)
                break
            case "nextDeadline":
                const aDeadline = a.stats?.nextDeadline ? a.stats?.nextDeadline.toDate() : new Date(0)
                const bDeadline = b.stats?.nextDeadline ? b.stats?.nextDeadline.toDate() : new Date(0)
                comparison = aDeadline.getTime() - bDeadline.getTime()
                break
        }

        // If sortOrder is descending, reverse the comparison result
        return sortOrder === "desc" ? -comparison : comparison
    })

    const getSortIcon = (column: string) => {
        if (sortBy != column) {
            return <ArrowUpDown className="h-4 w-4"/>
        }

        return sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4"/>
    }

    // Show loading screen while students are fetching
    if (loading) {
        return (
            Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
            )
        ))
    }

    return (
        <div>
            {user.role === 'consultant' ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[300px]">
                                <Button variant="ghost" onClick={() => handleSort("name")} className="h-auto p-0 font-semibold hover:bg-transparent">
                                    Student {getSortIcon("name")}
                                </Button>
                            </TableHead>
                            <TableHead className="w-[300px]">
                                <Button variant="ghost" onClick={() => handleSort("pending")} className="h-auto p-0 font-semibold hover:bg-transparent">
                                    Pending Tasks {getSortIcon("pending")}
                                </Button>
                            </TableHead>
                            <TableHead className="w-[300px]">
                                <Button variant="ghost" onClick={() => handleSort("nextDeadline")} className="h-auto p-0 font-semibold hover:bg-transparent">
                                    Next Deadline {getSortIcon("nextDeadline")}
                                </Button>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedStudents.map((student) => (
                            <TableRow key={student.id} className="cursor-pointer" onClick={() => window.location.href = `/students/${student.id}`}>
                                <TableCell>
                                        {student.personalInformation.firstName} {student.personalInformation.lastName}
                                </TableCell>
                                <TableCell>
                                    <span className="font-medium">{student.stats?.pendingAssignmentsCount || 0}</span>
                                </TableCell>
                                <TableCell>
                                    <span className="font-medium">{formatNextDeadline(student.stats?.nextDeadline)}</span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            ) : (
                <AssignmentsList />
            )}
        </div>
    )
}

export default StudentTable