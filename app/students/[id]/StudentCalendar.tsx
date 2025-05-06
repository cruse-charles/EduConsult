import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { formatNextDeadline } from '@/lib/utils'
import { Assignment } from '@/lib/types/types'

import { useState } from 'react'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

import ViewAssignmentModal from './ViewAssignmentModal/ViewAssignmentModal'

const StudentCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date())
    const studentAssignments = useSelector((state: RootState) => state.studentAssignments)
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const current = new Date(startDate)

    for (let i = 0; i < 35; i++) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }

    const navigateMonth = (direction: "prev" | "next") => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev)
            if (direction === "prev") {
                newDate.setMonth(prev.getMonth() - 1)
            } else {
                newDate.setMonth(prev.getMonth() + 1)
            }
            return newDate
        })
    }

    const getViewTitle = () => {
        return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    }

    return (
        <>
    {/* <Card className="h-full">
      <CardHeader> */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* <CardTitle className="flex items-center gap-2"> */}
              {/* <CalendarIcon className="h-5 w-5" /> */}
              <p className='text-2xl font-bold"'>{getViewTitle()}</p>
            {/* </CardTitle> */}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      {/* </CardHeader>
    </Card> */}



        <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
            </div>
            ))}

            {days.map((day, index) => {
                const isCurrentMonth = day.getMonth() === month
                const isToday = day.toDateString() === new Date().toDateString()
                
                return (
                    <div
                        key={index}
                        className={`h-40 p-1 border hover:bg-muted/50 ${
                            !isCurrentMonth ? "text-muted-foreground bg-muted/20" : ""
                        } ${isToday ? "bg-primary/10 border-primary" : ""}`}
                        // onClick={() => handleDateClick(day)}
                    >
                        <div className="text-sm font-medium mb-1">{day.getDate()}</div>
                        <ScrollArea>
                            {studentAssignments
                                .filter(assignment => (
                                    formatNextDeadline(day) === formatNextDeadline(assignment.dueDate)
                                ))
                                .map((assignment) => (
                                    <div key={assignment.id} className="p-1 mb-1 cursor-pointer rounded-md border border-blue-200 bg-blue-50" onClick={()=> setSelectedAssignment(assignment)}>
                                        <div className="text-xs font-medium truncate">
                                            {assignment.title}
                                        </div>
                                    </div>
                                ))
                            }
                        </ScrollArea>
                    </div>
                )
            })}
        </div>
        {/* @ts-ignore */}
        <ViewAssignmentModal assignment={selectedAssignment} open={!!selectedAssignment} onOpenChange={(open: boolean) => !open && setSelectedAssignment(null)} />

    </>
    )
}

export default StudentCalendar