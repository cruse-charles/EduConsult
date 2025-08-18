import { BookOpen, Calendar, Users, Flag, Clock, Search, CheckCircle } from "lucide-react"
import { formatNextDeadline } from "@/lib/utils"

// @ts-ignore
export const getConsultantHighlightConfig = (data) => [
  {
    title: "Students In-Progress",
    icon: Users,
    content: `${data.studentsInProgress} Students`,
    detail: "",
  },
  {
    title: "Tasks Due This Week",
    icon: BookOpen,
    content: `${data.tasksDueThisWeek} Due`,
    detail: "",
  },
  {
    title: "Next Deadline",
    icon: Calendar,
    content: formatNextDeadline(data.nextAssignment?.dueDate),
    detail: 
      formatNextDeadline(data.nextAssignment?.dueDate) !== "No upcoming deadlines"
        ? `${data.nextAssignment?.studentFirstName} ${data.nextAssignment?.studentLastName} / ${data.nextAssignment?.title}`
        : "",
  },
  {
    title: "Overdue Assignments",
    icon: Flag,
    content: data.overdue ?  `${data.overdue} Overdue` : `No Overdue Assignments`,
    detail: "",
  },
]


// @ts-ignore
export const getStudentHighlightConfig = (data) => [
  {
    title: "All Assignments",
    icon: BookOpen,
    content: `${data.totalAssignments} total assignments`,
    detail: "Across all applications",
  },
  {
    title: "Tasks Due This Week",
    icon: Clock,
    content: `${data.tasksDueThisWeek} ${data.tasksDueThisWeek === 1 ? "task" : "tasks"} due this week`,
    detail: "Total tasks you need to complete",
  },
  {
    title: "Under Review",
    icon: Search,
    content: `${data.underReview} ${data.underReview === 1 ? "task" : "tasks"} under review`,
    detail: "Being reviewed",
  },
  {
    title: "Completed",
    icon: CheckCircle,
    content: `${data.completed} assignments completed`,
    detail: "All done!",
  },
]

// @ts-ignore
export const getStudentProfileConsultantViewHighightConfig = (data) => [
  {
    title: "In-Progress Assignments",
    icon: BookOpen,
    content: `${data.inProgressAssignmentsCount} ${data.inProgressAssignmentsCount > 1 ? 'assignments' : 'assignment'}`,
    detail: "Across all applications!",
  },
  {
    title: "Next Deadline",
    icon: Calendar,
    content: `${data.nextDeadlineAssignment ? 'Next Deadline:' : 'No upcoming deadlines'} ${data.nextDeadlineAssignment ? data.nextDeadlineAssignment : ''}`,
    detail: `Assignment: ${data.nextDeadlineAssignmentTitle}`,
  },
  {
    title: "Completed",
    icon: CheckCircle,
    content: `${data.countOfCompletedTasks} assignments completed`,
    detail: "All done!",
  },
]