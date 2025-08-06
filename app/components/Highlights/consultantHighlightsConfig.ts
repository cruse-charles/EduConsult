import { BookOpen, Calendar, Users, Flag, Clock, Search, CheckCircle } from "lucide-react"
import { formatNextDeadline } from "@/lib/utils"

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
    content: 
        data.overdue ?  `${data.overdue} Overdue` : `No Overdue Assignments`,
        // console.log('data overdue', data.overdue),
    detail: "",
  },
]


export const getStudentHighlightConfig = (data) => [
  {
    title: "Total Assignments",
    icon: BookOpen,
    content: `${data.totalAssignments} Assignments total`,
    detail: "Across all applications",
  },
  {
    title: "In-Progress Tasks",
    icon: Clock,
    content: `${data.tasksDueThisWeek} ${data.tasksDueThisWeek === 1 ? "task" : "tasks"} due this week`,
    detail: "Your attention is needed",
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