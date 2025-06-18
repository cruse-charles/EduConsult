import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton";

import { Student } from "@/lib/types/types";

import { Button } from "@/components/ui/button"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

import { useState } from "react"
import { useRouter } from "next/navigation";
import StudentListRow from "./StudentListRow";
import { useDispatch, useSelector } from "react-redux";
import { completeStep } from "@/redux/slices/onboardingSlice";
import { nextStep } from "@/lib/onBoardingUtils";
import { RootState } from "@/redux/store";

interface StudentTableProps {
    students: Student[];
    loading: boolean;
}

const StudentTable = ({students, loading}: StudentTableProps) => {
    const router = useRouter();
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.user)
    const { isComplete } = useSelector((state: RootState) => state.onboarding)

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
            case "In-Progress":
                comparison = (a.stats?.inProgressAssignmentsCount || 0) - (b.stats?.inProgressAssignmentsCount || 0)
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

    // Navigate to the student's detailed page
    const handleStudentClick = async (studentId: string) => {
        if (!isComplete) dispatch(completeStep("fetchStudentProfile"))
        await nextStep(user.id)
        router.push(`/consultant/students/${studentId}`);
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
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px]">
                            <Button variant="ghost" onClick={() => handleSort("name")} className="h-auto p-0 font-semibold hover:bg-transparent">
                                Student {getSortIcon("name")}
                            </Button>
                        </TableHead>
                        <TableHead className="w-[300px]">
                            <Button variant="ghost" onClick={() => handleSort("In-Progress")} className="h-auto p-0 font-semibold hover:bg-transparent">
                                In-Progress Tasks {getSortIcon("In-Progress")}
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
                        <StudentListRow student={student} handleStudentClick={handleStudentClick} key={student.id}/>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default StudentTable