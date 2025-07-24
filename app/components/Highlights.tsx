import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Calendar, CheckCircle, Clock, Flag, Search, Users } from 'lucide-react'

import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'
import { countOfInProgressStudents, countOverDueAssignmentsConsultantDashboard, getTasksDueThisWeekConsultantDashboard, findNextAssignmentDeadlineConsultantDashboard, getTasksDueThisWeekStudentDashboard, countCompletedAssignmentsStudentDashboard, countReviewedAssignmentsStudentDashboard, countTotalAssignmentsStudentDashboard } from '@/lib/queries/queryHighlights'
import { useEffect, useState } from 'react'

import { formatNextDeadline } from '@/lib/utils'
import { Assignment } from '@/lib/types/types'

const Highlights = () => {

    const user = useSelector((state: RootState) => state.user)
    const [tasksDueThisWeek, setTasksDueThisWeek] = useState(0);
    const [studentsInProgress, setStudentsInProgress] = useState(0)
    const [overDueAssignments, setOverDueAssignments] = useState(0)
    const [nextAssignmentDeadline, setNextAssignmentDeadline] = useState<Assignment>()
    const [completedAssignments, setCompletedAssignments] = useState(0)
    const [underReviewAssignments, setUnderReviewAssignments] = useState(0)
    const [ totalAssignments, setTotalAssignments] = useState(0)

    // TODO: Might want to not make this callback
    useEffect(() => {
        if (user.role === 'consultant') {
            getTasksDueThisWeekConsultantDashboard(user.id).then((snapshot) => setTasksDueThisWeek(snapshot.size));
            countOfInProgressStudents(user.id).then(setStudentsInProgress)
            countOverDueAssignmentsConsultantDashboard(user.id).then(setOverDueAssignments)
            findNextAssignmentDeadlineConsultantDashboard(user.id).then(setNextAssignmentDeadline)
        } else if (user.role === 'student') {
            getTasksDueThisWeekStudentDashboard(user.id).then((snapshot) => setTasksDueThisWeek(snapshot.size))
            countCompletedAssignmentsStudentDashboard(user.id).then(setCompletedAssignments)
            countReviewedAssignmentsStudentDashboard(user.id).then(setUnderReviewAssignments)
            countTotalAssignmentsStudentDashboard(user.id).then((setTotalAssignments))
        }
    }, [user, tasksDueThisWeek])

    return (

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {user.role === 'consultant' ? (
                <>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Students In-Progress</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{studentsInProgress} Students</div>
                            {/* <p className="text-xs text-muted-foreground">Down X from last month</p> */}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tasks Due This Week</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{tasksDueThisWeek} Due</div>
                            {/* <p className="text-xs text-muted-foreground">X tasks total</p> */}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Next Deadline</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {/* TODO: Make sure styling stops name from going out of box */}
                            <div className="text-2xl font-bold">{formatNextDeadline(nextAssignmentDeadline?.dueDate)}</div>
                            {/* <p className="text-xs text-muted-foreground">{nextAssignmentDeadline?.student}/{nextAssignmentDeadline?.title}</p> */}
                            <p className="text-xs text-muted-foreground">{formatNextDeadline(nextAssignmentDeadline?.dueDate) != 'No upcoming deadlines'? `${nextAssignmentDeadline?.studentFirstName} ${nextAssignmentDeadline?.studentLastName}/${nextAssignmentDeadline?.title}` : ``}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Overdue Assignments</CardTitle>
                            <Flag className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{overDueAssignments} Overdue</div>
                            {/* <p className="text-xs text-muted-foreground">For: Student/Assignment</p> */}
                        </CardContent>
                    </Card>
                </>
            ) : (
                <>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalAssignments} Assignments total</div>
                            <p className="text-xs text-muted-foreground">Across all applications</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">In-Progress Tasks</CardTitle>
                            <Clock className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{tasksDueThisWeek} {tasksDueThisWeek == 1 ? 'task' : 'tasks'} due this week</div>
                            <p className="text-xs text-muted-foreground">Your attention is needed</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
                            <Search className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{underReviewAssignments} {underReviewAssignments == 1 ? 'task' : 'tasks'} under Review</div>
                            <p className="text-xs text-muted-foreground">Being Reviewed</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{completedAssignments} assignments completed</div>
                            <p className="text-xs text-muted-foreground">All done!</p>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    )
}

export default Highlights