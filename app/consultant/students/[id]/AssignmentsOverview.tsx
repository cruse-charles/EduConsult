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

    
    // TODO: Adjust student schema to have completed tasks and pull from there for this info
    // useEffect(() => {
    //     console.log('student nextDeadline', student?.stats?.nextDeadline)
    //     const loadHighlights = async () => {
    //         if (!student.id) return
    //         setLoading(true)
            
    //         const [countOfCompletedTasks, nextDeadlineAssignment] = await Promise.all([
    //             countCompletedTasksForStudentConsultantView(student?.id, user.id),
    //             nextDeadlineForStudent(student?.id, user.id)
    //         ])

    //     const formattedDeadline = formatNextDeadline(student?.stats?.nextDeadline);
    //     console.log('Formatted deadline:', formattedDeadline); // Add this

    //         setData({
    //             inProgressAssignmentsCount: student?.stats?.inProgressAssignmentsCount,
    //             countOfCompletedTasks: countOfCompletedTasks,
    //             // nextDeadlineAssignment: formatNextDeadline(nextDeadlineAssignment?.dueDate) || 'N/A',
    //             nextDeadlineAssignment: formatNextDeadline(formattedDeadline) || 'N/A',
    //             nextDeadlineAssignmentTitle: nextDeadlineAssignment?.title || 'N/A'
    //         })

    //         setLoading(false)
    //     }

    //     loadHighlights()

    // }, [student, assignments])

    useEffect(() => {
        // if (!student?.id || !student?.stats?.nextDeadline) return;
        
        const loadHighlights = async () => {
            setLoading(true)
            
            const [countOfCompletedTasks, nextDeadlineAssignment] = await Promise.all([
                // @ts-ignore
                countCompletedTasksForStudentConsultantView(student.id, user.id),
                // @ts-ignore
                nextDeadlineForStudent(student.id, user.id)
            ])

            // const normalizedDeadline = student?.stats?.nextDeadline ?? null;
            // const formattedDeadline = formatNextDeadline(normalizedDeadline);

            setData({
                inProgressAssignmentsCount: student?.stats?.inProgressAssignmentsCount,
                countOfCompletedTasks: countOfCompletedTasks,
                nextDeadlineAssignment: formatNextDeadline(student?.stats?.nextDeadline),
                nextDeadlineAssignmentTitle: nextDeadlineAssignment?.title || 'N/A'
            })

            setLoading(false)
        }

        loadHighlights()

    }, [student.id, assignments])

    const highlightConfig = getStudentProfileConsultantViewHighightConfig(data)

    useEffect(() => {
        console.log('data', data)
    }, [data])

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {highlightConfig.map((item, i) => (
                <HighlightCard key={i} title={item.title} icon={item.icon} content={item.content} detail={item.detail} loading={loading}/>
            ))}
        </div>
    )
}

export default AssignmentsOverview