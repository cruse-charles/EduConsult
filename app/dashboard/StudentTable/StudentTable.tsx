import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Student } from "@/lib/types/types";

import { useState } from "react"

interface StudentTableProps {
    students: Student[];
}

const StudentTable = ({students}: StudentTableProps) => {
    const [sortBy, setSortBy] = useState("name")
    

    const handleSort = (string: string) => {

    }

    const sortedStudents = [...students].sort((a,b) => {
        switch (sortBy) {
            case "name":
                return a.personalInformation.firstName.localeCompare(b.personalInformation.firstName)
        }

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
                        <TableRow>
                            <TableCell>
                                {student.personalInformation.firstName} {student.personalInformation.lastName}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default StudentTable