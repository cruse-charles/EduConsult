import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Student } from '@/lib/types/types'

function TaskSummary({student}: {student: Student}) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{student.pendingTasks}</div>
                {/* <p className="text-xs text-muted-foreground">Next due: {student.nextDeadline}</p> */}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
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
                <CardTitle className="text-sm font-medium">Next Deadline</CardTitle>
                </CardHeader>
                <CardContent>
                {/* <div className="text-xl font-bold">{student.nextDeadline}</div> */}
                <p className="text-xs text-muted-foreground">Stanford Application Essay</p>
                </CardContent>
            </Card>
        </div>
    )
}

export default TaskSummary