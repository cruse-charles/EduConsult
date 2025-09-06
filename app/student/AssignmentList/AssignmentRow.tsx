import { Assignment } from '@/lib/types/types'

import { formatDueDate } from '@/lib/utils'
import StatusBadge from '@/app/components/StatusBadge'
import { BookOpen, FileText, Upload } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { openCurrentAssignmentModal, setCurrentAssignment } from '@/redux/slices/currentAssignmentSlice'
import { readAssignment } from '@/lib/assignmentUtils'
import { readAssignmentSlice } from '@/redux/slices/currentStudentAssignmentsSlice'
import { readAssignmentUserSlice } from '@/redux/slices/userSlice'
import { onboardingSteps } from '@/lib/onboardingSteps'

interface AssignmentRowProps {
    assignment: Assignment
    // onClick: (assignment: Assignment) => void
}

// const AssignmentRow = ({assignment, onClick}: AssignmentRowProps) => {
const AssignmentRow = ({assignment}: AssignmentRowProps) => {

    const dispatch = useDispatch<AppDispatch>()
    const user = useSelector((state: RootState) => state.user)

    // Handle clicking assignment to open modal for details
    const handleAssignmentClick = async () => {
        // Open modal for assignment details
        dispatch(openCurrentAssignmentModal())

        // Update redux with the click on assignment
        dispatch(setCurrentAssignment(assignment))

        // Update hasRead in assignmentMeta for the assignment clicked
        await readAssignment(assignment.id, "studentUsers", user.id)

        // Update hasRead in studentAssignmentsSlice and userSlice
        dispatch(readAssignmentSlice(assignment.id))
        dispatch(readAssignmentUserSlice(assignment.id))

        // TODO: Adjust onboarding for student
        // Check if onboarding is complete for tooltip to render
        // const currentStep = onboardingSteps[onboardingStep]?.actionRequired
        // if (!isComplete && currentStep === "viewAssignment") {
        //     dispatch(completeStep("viewAssignment"))
        //     await nextStep(user.id)
        // }
    }

    return (
        <div onClick={handleAssignmentClick} key={assignment.id} className="flex items-center justify-between p-4 pl-12 hover:bg-muted/30 cursor-pointer border-b border-muted assignment">   
            <div className="flex items-center gap-3 flex-1">
                <div className="relative flex items-center gap-2">
                    {!assignment.hasRead && <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-white" />}
                    {assignment.type === "Essay" && <FileText className="h-6 w-6 text-blue-500" />}
                    {assignment.type === "Document" && <BookOpen className="h-6 w-6 text-green-500" />}
                    {assignment.type === "Portfolio" && <Upload className="h-6 w-6 text-purple-500" />}
                </div>
                <div className="flex-1">
                    <div className="font-medium">{assignment.title}</div>
                    <div className="text-sm text-muted-foreground">Due: {formatDueDate(assignment?.dueDate)}</div>
                </div>
            </div>
            <div className="flex items-center gap-3">{StatusBadge(assignment.status, assignment?.dueDate)}</div>
        </div>
    )
}

export default AssignmentRow