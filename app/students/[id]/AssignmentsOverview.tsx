import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { countCompletedTasksForStudentConsultantView, countPendingTasksForStudentConsultantView, findNextAssignmentDeadlineStudentDashboard } from '@/lib/querys'
import { Assignment, Student } from '@/lib/types/types'
import { formatNextDeadline } from '@/lib/utils'
import { RootState } from '@/redux/store'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

function AssignmentsOverview({student}: {student: Student}) {
    const [countOfPendingTasks, setCountOfPendingTasks] = useState(0)
    const [countOfCompletedTasks, setCountOfCompletedTasks] = useState(0)
    const [nextDeadlineAssignment, setNextDeadlineAssignment] = useState<Assignment>()
    
    const user = useSelector((state: RootState) => state.user)

    // TODO: If an assignment is changed from pending by the user, this won't update until the page is refreshed
    useEffect(() => {
        countPendingTasksForStudentConsultantView(student.id, user.id).then(setCountOfPendingTasks)
        countCompletedTasksForStudentConsultantView(student.id, user.id).then(setCountOfCompletedTasks)
        findNextAssignmentDeadlineStudentDashboard(student.id, user.id).then(setNextDeadlineAssignment)
    }, [student])

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{countOfPendingTasks} Pending Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                {/* <div className="text-2xl font-bold">{student.pendingTasks}</div> */}
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
                {Math.round((student.completedTasks / (student.completedTasks + student.pendingTasks)) * 100)}%
                completion rate
                </p> */}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Next Deadline: {formatNextDeadline(nextDeadlineAssignment?.dueDate)}</CardTitle>
                </CardHeader>
                <CardContent>
                {/* <div className="text-xl font-bold">{student.nextDeadline}</div> */}
                <p className="text-xs text-muted-foreground">{nextDeadlineAssignment?.title}</p>
                </CardContent>
            </Card>
        </div>
    )
}

export default AssignmentsOverview