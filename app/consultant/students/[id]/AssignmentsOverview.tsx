import { getStudentProfileConsultantViewHighightConfig } from '@/app/components/Highlights/consultantHighlightsConfig'
import HighlightCard from '@/app/components/Highlights/HighlightCard'

import { evaluateNextDeadline, formatNextDeadline } from '@/lib/utils'

import { RootState } from '@/redux/store'
import { Timestamp } from 'firebase/firestore'
import { countCompletedTasksForStudentConsultantView, nextDeadlineForStudent } from '@/lib/queries/querys'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

// TODO: Use HighlightCard component to DRY this
function AssignmentsOverview() {
    // Retrieve student and user from redux
    const student = useSelector((state: RootState) => state.currentStudent)
    const user = useSelector((state: RootState) => state.user)
    const assignments = useSelector((state: RootState) => state.currentStudentAssignments)

    // Highlight Data and loading variables
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(false)

    const deadline = student?.stats?.nextDeadline
    const ts = deadline?.seconds ? new Timestamp(deadline.seconds, deadline.nanoseconds) : deadline

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
        <div className="grid gap-4 md:grid-cols-3">
            {highlightConfig.map((item, i) => (
                <HighlightCard key={i} title={item.title} icon={item.icon} content={item.content} detail={item.detail} loading={loading}/>
            ))}
        </div>
    )
}

export default AssignmentsOverview