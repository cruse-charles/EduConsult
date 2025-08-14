import { getStudentProfileConsultantViewHighightConfig } from '@/app/components/Highlights/consultantHighlightsConfig'
import HighlightCard from '@/app/components/Highlights/HighlightCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { countCompletedTasksForStudentConsultantView, nextDeadlineForStudent } from '@/lib/queries/querys'

import { Assignment } from '@/lib/types/types'
import { evaluateNextDeadline, formatNextDeadline } from '@/lib/utils'

import { RootState } from '@/redux/store'
import { Timestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

// TODO: Use HighlightCard component to DRY this
function AssignmentsOverview() {
    // Retrieve student and user from redux
    const student = useSelector((state: RootState) => state.currentStudent)
    const user = useSelector((state: RootState) => state.user)
    const assignments = useSelector((state: RootState) => state.currentStudentAssignments)

    const [countOfCompletedTasks, setCountOfCompletedTasks] = useState(0)
    const [nextDeadlineAssignment, setNextDeadlineAssignment] = useState<Assignment>()
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(false)

    const deadline = student?.stats?.nextDeadline
    const ts = deadline?.seconds ? new Timestamp(deadline.seconds, deadline.nanoseconds) : deadline
        
    // TODO: the changing deadline logic from stats utils to redux so it updates right on change
    // TODO: Add loading states
    // useEffect(() => {
    //     if (!student.id) return
    //     countCompletedTasksForStudentConsultantView(student?.id, user.id).then(setCountOfCompletedTasks)
    //     nextDeadlineForStudent(student?.id, user.id).then(setNextDeadlineAssignment)
    // }, [student.id, assignments])

    useEffect(() => {
        
        const loadHighlights = async () => {
            if (!student.id) return
            setLoading(true)

            const [countOfCompletedTasks, nextDeadlineAssignment] = await Promise.all([
                countCompletedTasksForStudentConsultantView(student?.id, user.id),
                nextDeadlineForStudent(student?.id, user.id)
            ])

            setData({
                inProgressAssignmentsCount: student?.stats?.inProgressAssignmentsCount,
                countOfCompletedTasks: countOfCompletedTasks,
                nextDeadlineAssignment: formatNextDeadline(nextDeadlineAssignment?.dueDate) || 'N/A',
                nextDeadlineAssignmentTitle: nextDeadlineAssignment?.title || 'N/A'
            })

            setLoading(false)
        }

        loadHighlights()

    }, [student.id, assignments])

    const highlightConfig = getStudentProfileConsultantViewHighightConfig(data)

    return (
        // TODO: Need to style these a bit more, either font size or coloring
        // <div className="grid gap-4 md:grid-cols-3">
        //     <Card>
        //         <CardHeader className="pb-2">
        //         <CardTitle className="text-sm font-medium">{student?.stats?.inProgressAssignmentsCount} In-Progress Tasks</CardTitle>
        //         </CardHeader>
        //         <CardContent>
        //         {/* <p className="text-xs text-muted-foreground">Next due: {student.nextDeadline}</p> */}
        //         </CardContent>
        //     </Card>
        //     <Card>
        //         <CardHeader className="pb-2">
        //         <CardTitle className="text-sm font-medium">{countOfCompletedTasks} Completed Tasks</CardTitle>
        //         </CardHeader>
        //         <CardContent>
        //         {/* <div className="text-2xl font-bold">{student.completedTasks}</div>
        //         <p className="text-xs text-muted-foreground">
        //         completion rate
        //         </p> */}
        //         </CardContent>
        //     </Card>
        //     <Card>
        //         <CardHeader className="pb-2">
        //         {/* <CardTitle className="text-sm font-medium">Next Deadline: {formatNextDeadline(nextDeadlineAssignment?.dueDate)}</CardTitle> */}
        //         <CardTitle className="text-sm font-medium">Next Deadline: {formatNextDeadline(ts)}</CardTitle>
        //         </CardHeader>
        //         <CardContent>
        //         {/* <div className="text-xl font-bold">{student.nextDeadline}</div> */}
        //         <p className="text-xs text-muted-foreground">Assignment: {nextDeadlineAssignment?.title}</p>
        //         </CardContent>
        //     </Card>
        // </div>




        <div className="grid gap-4 md:grid-cols-3">
            {highlightConfig.map((item, i) => (
                <HighlightCard key={i} title={item.title} icon={item.icon} content={item.content} detail={item.detail} loading={loading}/>
            ))}
        </div>
    )
}

export default AssignmentsOverview