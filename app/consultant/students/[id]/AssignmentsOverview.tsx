    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

    import { countCompletedTasksForStudentConsultantView, nextDeadlineForStudent } from '@/lib/queries/querys'

    import { Assignment } from '@/lib/types/types'
    import { evaluateNextDeadline, formatNextDeadline } from '@/lib/utils'

    import { RootState } from '@/redux/store'
import { Timestamp } from 'firebase/firestore'
    import { useEffect, useState } from 'react'
    import { useSelector } from 'react-redux'

    function AssignmentsOverview() {
        // Retrieve student and user from redux
        // const student = useSelector((state: RootState) => state.student)
        const student = useSelector((state: RootState) => state.currentStudent)
        const user = useSelector((state: RootState) => state.user)

        const [countOfCompletedTasks, setCountOfCompletedTasks] = useState(0)
        const [nextDeadlineAssignment, setNextDeadlineAssignment] = useState<Assignment>()

        const deadline = student?.stats?.nextDeadline
        const ts = deadline?.seconds ? new Timestamp(deadline.seconds, deadline.nanoseconds) : deadline
        

        // TODO: If an assignment is changed from In-Progress by the user, this won't update until the page is refreshed
        useEffect(() => {
            if (!student.id) return
            countCompletedTasksForStudentConsultantView(student?.id, user.id).then(setCountOfCompletedTasks)
            nextDeadlineForStudent(student?.id, user.id).then(setNextDeadlineAssignment)
        }, [student.id])

        useEffect(() => {
            if (!student.id) return
            nextDeadlineForStudent(student?.id, user.id).then(setNextDeadlineAssignment)
        }, [student?.stats?.nextDeadline])

        return (
            // TODO: Need to style these a bit more, either font size or coloring
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{student?.stats?.inProgressAssignmentsCount} In-Progress Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                    {/* <p className="text-xs text-muted-foreground">Next due: {student.nextDeadline}</p> */}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{countOfCompletedTasks} Completed Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                    {/* <div className="text-2xl font-bold">{student.completedTasks}</div>
                    <p className="text-xs text-muted-foreground">
                    completion rate
                    </p> */}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                    {/* <CardTitle className="text-sm font-medium">Next Deadline: {formatNextDeadline(nextDeadlineAssignment?.dueDate)}</CardTitle> */}
                    <CardTitle className="text-sm font-medium">Next Deadline: {formatNextDeadline(ts)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                    {/* <div className="text-xl font-bold">{student.nextDeadline}</div> */}
                    <p className="text-xs text-muted-foreground">Assignment: {nextDeadlineAssignment?.title}</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    export default AssignmentsOverview