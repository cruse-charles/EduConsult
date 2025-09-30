import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton";

import { Button } from "@/components/ui/button"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

import { useState } from "react"
import { useRouter } from "next/navigation";

import StudentTableRow from "./StudentTableRow";

import { useDispatch, useSelector } from "react-redux";
import { completeStep } from "@/redux/slices/onboardingSlice";
import { RootState } from "@/redux/store";
import { nextStep } from "@/lib/onBoardingUtils";
import { onboardingSteps } from "@/lib/onboardingSteps";

const StudentTable = () => {
    const router = useRouter();
    const dispatch = useDispatch()

    const {studentList: students, loading} = useSelector((state: RootState) => state.students)
    const user = useSelector((state: RootState) => state.user)
    const { isComplete, onboardingStep } = useSelector((state: RootState) => state.onboarding)

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
                comparison = a.profile.firstName.localeCompare(b.profile.firstName)
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
        const currentStep = onboardingSteps[onboardingStep]?.actionRequired
        
        if (!isComplete && currentStep === 'fetchStudentProfile') {
            dispatch(completeStep("fetchStudentProfile"))
            await nextStep(user.id)
        } 
            
        router.push(`/consultant/students/${studentId}`);
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
                    {loading ? (
                        // Render skeleton rows when loading (even if students is empty)
                        Array.from({ length: 5 }).map((_, i) => ( 
                            <TableRow key={i}>
                                <TableCell>
                                    <Skeleton className="h-6 w-full rounded-md" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-6 w-full rounded-md" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-6 w-full rounded-md" />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        // Render actual rows when not loading
                        sortedStudents.map((student) => (
                            <StudentTableRow student={student} handleStudentClick={handleStudentClick} key={student.id} />
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default StudentTable