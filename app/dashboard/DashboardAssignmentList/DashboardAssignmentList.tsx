import { ScrollArea } from '@/components/ui/scroll-area'
import { getTasksDueThisWeekConsultantDashboard } from '@/lib/querys'
import { Assignment } from '@/lib/types/types'
import { formatNextDeadline } from '@/lib/utils'
import { RootState } from '@/redux/store'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const DashboardAssignmentList = () => {
    const [currentStartDate, setcurrentStartDate] = useState(new Date())
    const [dashboardAssignments, setDashboardAssignments] = useState<Assignment>([])

    const user = useSelector((state: RootState) => state.user)
    
    useEffect(() => {
        getTasksDueThisWeekConsultantDashboard(user.id).then((snapshot) => {
            const assignments = snapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data()
                }
            })
            setDashboardAssignments(assignments)
        })
    }, [])

    useEffect(() => {
        dashboardAssignments.forEach((assignment) => {
            console.log('dashboardAssignments', formatNextDeadline(assignment.dueDate))
        })
    }, [dashboardAssignments])
    
    const getDays = () => {
        const daysArray = []
        for (let i = 0; i < 7; i++) {
            const day = new Date(currentStartDate)
            day.setDate(currentStartDate.getDate() + i)
            console.log('day', day)
            daysArray.push(day)
        }
        return daysArray
    }

    const days = getDays()

    const formatDay = (date: Date) => {
        const isToday = new Date().toDateString() === date.toDateString()
        return {
            dayName: date.toLocaleString("default", { weekday: "short" }),
            dayNumber: date.getDate(),
            isToday
        }
    }
    
    return (
        <div className="grid grid-cols-7 gap-4">
            {days.map((day, index) => {
                const dayInfo = formatDay(day)

                return (
                <div key={index} className="space-y-2">
                    <div className="text-center">
                        <div className="text-sm font-medium text-muted-foreground">{dayInfo.dayName}</div>
                        <div className={`text-lg font-semibold ${dayInfo.isToday ? "text-primary bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center mx-auto" : ""}`}>
                            {dayInfo.dayNumber}
                        </div>
                    </div>

                    {/* Event List */}
                    <ScrollArea>
                        {dashboardAssignments.map((assignment) => (
                            <div>
                                {formatNextDeadline(day) === formatNextDeadline(assignment.dueDate) ? assignment.title : null}
                            </div>
                        ))}
                    </ScrollArea>
                </div>
                )
            })}
        </div>
    )
}

export default DashboardAssignmentList