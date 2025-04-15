import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Calendar, CheckCircle, Clock, Flag, Search, Users } from 'lucide-react'

import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'
import { countOfInProgressStudents, countOverDueAssignments, countTasksDueThisWeek } from '@/lib/querys'
import { useEffect, useState } from 'react'

const Highlights = () => {

    const user = useSelector((state: RootState) => state.user)
    const [tasksDueThisWeek, setTasksDueThisWeek] = useState(0);
    const [studentsInProgress, setStudentsInProgress] = useState(0)
    const [overDueAssignments, setOverDueAssignments] = useState(0)

    // TODO: Might want to not make this callback
    useEffect(() => {
        if (user.role === 'consultant') {
            countTasksDueThisWeek(user.id).then(setTasksDueThisWeek);
            countOfInProgressStudents(user.id).then(setStudentsInProgress)
            countOverDueAssignments(user.id).then(setOverDueAssignments)
        }
    }, [user, tasksDueThisWeek])

    return (

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {user.role === 'consultant' ? (
                <>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Students In-Progress</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{studentsInProgress} Students</div>
                            {/* <p className="text-xs text-muted-foreground">Down X from last month</p> */}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{tasksDueThisWeek} due this week</div>
                            <p className="text-xs text-muted-foreground">X pending tasks total</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Next Deadline</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Date</div>
                            <p className="text-xs text-muted-foreground">For: Student/Assignment</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Overdue Assignments</CardTitle>
                            <Flag className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{overDueAssignments} assignments</div>
                            <p className="text-xs text-muted-foreground">For: Student/Assignment</p>
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
                            <div className="text-2xl font-bold"># of Assignments</div>
                            <p className="text-xs text-muted-foreground">Across all applications</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                            <Clock className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold"># of pending tasks</div>
                            <p className="text-xs text-muted-foreground">Need your attention</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
                            <Search className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold"># Tasks under Review</div>
                            <p className="text-xs text-muted-foreground">Being Reviewed</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold"># of assignments completed</div>
                            <p className="text-xs text-muted-foreground">All done!</p>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    )
}

export default Highlights