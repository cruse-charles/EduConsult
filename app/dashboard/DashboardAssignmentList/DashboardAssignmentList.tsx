import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getConsultantDashboardAssignments } from '@/lib/querys'
import { Assignment } from '@/lib/types/types'
import { formatNextDeadline } from '@/lib/utils'
import { fetchConsultantDashboardAssignments } from '@/redux/slices/consultantAssignmentSlice'
import { RootState } from '@/redux/store'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const DashboardAssignmentList = () => {
    const [currentStartDate, setCurrentStartDate] = useState(new Date())
    const [dashboardAssignments, setDashboardAssignments] = useState<Assignment[]>([])

    const user = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch();
    
    useEffect(() => {
        getConsultantDashboardAssignments(user.id).then((snapshot) => {
            const assignments = snapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data()
                } as Assignment
            })
            setDashboardAssignments(assignments)
        })
    }, [])

    // useEffect(() => {
    //     dashboardAssignments.forEach((assignment) => {
    //         console.log('dashboardAssignments', assignment)
    //     })
    // }, [dashboardAssignments])

    // TODO: Adjust all queries to return data itself, not the snapshot
    useEffect(() => {
        // @ts-ignore
        dispatch(fetchConsultantDashboardAssignments(user.id))
    }, [])
    
    const getDays = () => {
        const daysArray = []
        for (let i = 0; i < 7; i++) {
            const day = new Date(currentStartDate)
            day.setDate(currentStartDate.getDate() + i)
            // console.log('day', day)
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

    // Navigate by single day
    const navigate = (direction: "prev" | "next") => {
        const newDate = new Date(currentStartDate)
        newDate.setDate(currentStartDate.getDate() + (direction === "next" ? 1 : -1))
        setCurrentStartDate(newDate)
    }
    
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Assignments
                </CardTitle>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigate("next")}>
                    <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                </div>
            </CardHeader>
            <CardContent>
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
                            <ScrollArea className="h-[225px]">
                                {dashboardAssignments
                                    .filter(assignment => formatNextDeadline(day) === formatNextDeadline(assignment.dueDate))
                                    .map((assignment) => (
                                        <div key={assignment.id} className="p-2 rounded-md border cursor-pointer hover:bg-muted/50 transition-colors border-blue-200 bg-blue-50">
                                            <div className="space-y-1">
                                                <div className="text-sm font-medium truncate">
                                                    {assignment.title}
                                                </div>
                                                <div className="text-xs text-muted-foreground truncate" title={assignment.student}>
                                                    {assignment.student}
                                                </div>
                                            </div>
                                        </div>
                                ))}
                            </ScrollArea>
                        </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}

export default DashboardAssignmentList

function dispatch(arg0: any) {
    throw new Error('Function not implemented.')
}
