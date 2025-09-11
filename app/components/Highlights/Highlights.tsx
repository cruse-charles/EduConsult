import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'
import { countOfInProgressStudents, countOverDueAssignmentsConsultantDashboard, getTasksDueThisWeekConsultantDashboard, findNextAssignmentDeadlineConsultantDashboard, getTasksDueThisWeekStudentDashboard, countCompletedAssignmentsStudentDashboard, countReviewedAssignmentsStudentDashboard, countTotalAssignmentsStudentDashboard } from '@/lib/queries/queryHighlights'
import { useEffect, useState } from 'react'

import HighlightCard from './HighlightCard'
import { getConsultantHighlightConfig, getStudentHighlightConfig } from './consultantHighlightsConfig'
import { Assignment } from '@/lib/types/types'

const Highlights = () => {

    // Retrieve user
    const user = useSelector((state: RootState) => state.user)

    // State to hold data for highlights and loading state
    // TODO: Add state to this that matches, create two different states which will match with role
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        
        // Function to load highlights based on user role
        const loadHighlights = async () => {
            setLoading(true)
            if (user.role === 'consultant') {
                const [tasksDueThisWeek, studentsInProgress, overDueAssignments, nextAssignment] = await Promise.all([
                    getTasksDueThisWeekConsultantDashboard(user.id),
                    countOfInProgressStudents(user.id),
                    countOverDueAssignmentsConsultantDashboard(user.id),
                    findNextAssignmentDeadlineConsultantDashboard(user.id)
                ])
                
                setData({
                    studentsInProgress: studentsInProgress,
                    tasksDueThisWeek: tasksDueThisWeek.size,
                    nextAssignment: nextAssignment,
                    overDueAssignments: overDueAssignments
                })
            } else if (user.role === 'student') {
                const [tasksDueThisWeek, completedAssignments, reviewedAssignments, totalAssignments] = await Promise.all([
                    getTasksDueThisWeekStudentDashboard(user.id),
                    countCompletedAssignmentsStudentDashboard(user.id),
                    countReviewedAssignmentsStudentDashboard(user.id),
                    countTotalAssignmentsStudentDashboard(user.id)
                ])

                setData({
                    tasksDueThisWeek: tasksDueThisWeek.size,
                    totalAssignments: totalAssignments,
                    underReview: reviewedAssignments,
                    completed: completedAssignments
                })
            }
            setLoading(false)
        }

        loadHighlights()

    }, [user.id])


    const highlightConfig = user.role === 'consultant' ? getConsultantHighlightConfig(data) : getStudentHighlightConfig(data);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {highlightConfig.map((item, i) => (
                <HighlightCard key={i} title={item.title} icon={item.icon} content={item.content} detail={item.detail} loading={loading}/>
            ))}
        </div>
    )
}

export default Highlights