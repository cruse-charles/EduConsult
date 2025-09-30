import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

import { nextDeadlineForStudent } from '@/lib/queries/querys'
import { Student } from '@/lib/types/types'
import { formatNextDeadline } from '@/lib/utils'
import { RootState } from '@/redux/store'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

interface StudentTableRowProps {
    student: Student;
    handleStudentClick: (id: string) => void;
}

const StudentTableRow = ({student, handleStudentClick}: StudentTableRowProps) => {

    const user = useSelector((state: RootState) => state.user)
    const [nextDeadline, setNextDeadline] = useState(student?.stats?.nextDeadline)
    const { loading } = useSelector((state: RootState) => state.students)

    useEffect(() => {
        const checkDeadline = async () => {
            const now = new Date()

            const next = student?.stats?.nextDeadline;
            if (!next || typeof next.toDate !== "function") return;

            // if (!student.stats || !student.stats.nextDeadline || student.stats.nextDeadline === undefined) return
            const deadlineDate = next.toDate();
            if (deadlineDate < now) {
                const assignment = await nextDeadlineForStudent(student.id, user.id)
                // @ts-ignore
                setNextDeadline(assignment?.dueDate)
            }
        }

        checkDeadline()

        // TODO: This just changes the UI but doesnt change the database like it probably should, so if this goes off
            // then we can have it also change the database
    }, [])

    return (
        <TableRow className="cursor-pointer student-row" onClick={() => handleStudentClick(student.id)} >
            <TableCell>
                {student.profile.firstName} {student.profile.lastName}
            </TableCell>
            <TableCell>
                <span className="font-medium">
                    {student.stats?.inProgressAssignmentsCount || 0}
                </span>
            </TableCell>
            <TableCell>
                <span>{formatNextDeadline(nextDeadline)}</span>
            </TableCell>
        </TableRow>
    );
}

export default StudentTableRow