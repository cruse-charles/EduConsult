import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Student } from "@/lib/types/types";
import { formatDueDateAndTime, nextDeadline } from "@/lib/utils";
import Link from "next/link";

import { useState } from "react"

interface StudentTableProps {
    students: Student[];
}

const StudentTable = ({students}: StudentTableProps) => {
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
        }

        // If sortOrder is descending, reverse the comparison result
        return sortOrder === "desc" ? -comparison : comparison
    })

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px]">
                            <Button variant="ghost" onClick={() => handleSort("name")} className="h-auto p-0 font-semibold hover:bg-transparent">
                                Student
                            </Button>
                        </TableHead>
                        <TableHead className="w-[300px]">
                            <Button variant="ghost" onClick={() => handleSort("pending")} className="h-auto p-0 font-semibold hover:bg-transparent">
                                Pending Tasks
                            </Button>
                        </TableHead>
                        <TableHead className="w-[300px]">
                            <Button variant="ghost" onClick={() => handleSort("deadline")} className="h-auto p-0 font-semibold hover:bg-transparent">
                                Next Deadline
                            </Button>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedStudents.map((student) => (
                        <TableRow key={student.id} className="cursor-pointer">
                            <TableCell>
                                <Link href={`/students/${student.id}`} className="flex items-center gap-3">
                                    {student.personalInformation.firstName} {student.personalInformation.lastName}
                                </Link>
                            </TableCell>
                            <TableCell>
                                <Link href={`/students/${student.id}`}>
                                <span className="font-medium">{student.stats?.pendingAssignmentsCount || 0}</span>
                                </Link>
                            </TableCell>
                            <TableCell>
                                <Link href={`/students/${student.id}`}>
                                <span className="font-medium">{nextDeadline(student.stats?.nextDeadline)}</span>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default StudentTable