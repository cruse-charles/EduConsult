import { BookOpen, Calendar, Users, Flag } from "lucide-react"
import { formatNextDeadline } from "@/lib/utils"

export const getConsultantHighlightConfig = (data) => [
  {
    title: "Students In-Progress",
    // icon: <Users className="h-4 w-4 text-muted-foreground" />,
    content: `${data.studentsInProgress} Students`,
    detail: "",
  },
  {
    title: "Tasks Due This Week",
    // icon: <BookOpen className="h-4 w-4 text-muted-foreground" />,
    content: `${data.tasksDueThisWeek} Due`,
    detail: "",
  },
  {
    title: "Next Deadline",
    // icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
    content: formatNextDeadline(data.nextAssignment?.dueDate),
    detail: 
      formatNextDeadline(data.nextAssignment?.dueDate) !== "No upcoming deadlines"
        ? `${data.nextAssignment?.studentFirstName} ${data.nextAssignment?.studentLastName} / ${data.nextAssignment?.title}`
        : "",
  },
  {
    title: "Overdue Assignments",
    // icon: <Flag className="h-4 w-4 text-muted-foreground" />,
    content: `${data.overdue} Overdue`,
    detail: "",
  },
]
