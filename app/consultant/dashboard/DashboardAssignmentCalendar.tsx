import ReadAssignmentModal from '../students/[id]/ReadAssignmentModal/ReadAssignmentModal'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

import { getConsultantDashboardAssignments } from '@/lib/queries/querys'

import { formatNextDeadline } from '@/lib/utils'
import { Assignment } from '@/lib/types/types'

import { fetchConsultantDashboardAssignments } from '@/redux/slices/consultantAssignmentSlice'
import { RootState } from '@/redux/store'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { openCurrentAssignmentModal, setCurrentAssignment } from '@/redux/slices/currentAssignmentSlice'

const DashboardAssignmentCalendar = () => {
    // State for current date and assignments
    const [currentStartDate, setCurrentStartDate] = useState(new Date())
    const { assignments, loadedThrough, loadedFrom } = useSelector((state: RootState) => state.consultantDashboardAssignments)

    const user = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch();
    
    // TODO: Adjust all queries to return data itself, not the snapshot
    useEffect(() => {
        // Start of fetch will be two days before today up to 10 days later
        const start = new Date()
        start.setDate(start.getDate() - 2)

        const end = new Date()
        end.setDate(end.getDate() + 12)

        // @ts-ignore
        dispatch(fetchConsultantDashboardAssignments({consultantId: user.id, startDate: start, endDate: end}))
    }, [])

    const handleAssignmentClick = (assignment: Assignment) => {
        dispatch(openCurrentAssignmentModal())
        dispatch(setCurrentAssignment(assignment))
    }

    
    const getDays = () => {
        const daysArray = []
        for (let i = 0; i < 7; i++) {
            const day = new Date(currentStartDate)
            day.setDate(currentStartDate.getDate() + i)
            daysArray.push(day)
        }
        return daysArray
    }
    
    const days = getDays()
    
    const formatDay = (date: Date) => {
        const isToday = new Date().toDateString() === date.toDateString()
        return {
            monthName: date.toLocaleString("default", {month: "short"}),
            dayName: date.toLocaleString("default", { weekday: "short" }),
            dayNumber: date.getDate(),
            isToday
        }
    }

    // Navigate by single day
    const CHUNK_DAYS = 10
    const PREFETCH_THRESHOLD = 6

    const navigate = (direction: "prev" | "next") => {
        const newDate = new Date(currentStartDate)
        newDate.setDate(currentStartDate.getDate() + (direction === "next" ? 1 : -1))
        setCurrentStartDate(newDate)

        if (direction === "next") {
            const threshold = new Date(loadedThrough!)
            threshold.setDate(threshold.getDate() - PREFETCH_THRESHOLD)

            if (newDate >= threshold) {
                const fetchStart = new Date(loadedThrough!)
                fetchStart.setDate(fetchStart.getDate() + 1)

                const fetchEnd = new Date(loadedThrough!)
                fetchEnd.setDate(fetchEnd.getDate() + CHUNK_DAYS)

                // @ts-ignore
                dispatch(fetchConsultantDashboardAssignments({
                    consultantId: user.id,
                    startDate: fetchStart,
                    endDate: fetchEnd
                }))
            }
        }

        if (direction === "prev") {
            const threshold = new Date(loadedFrom!)
            threshold.setDate(threshold.getDate() + PREFETCH_THRESHOLD)

            if (newDate <= threshold) {
                const fetchEnd = new Date(loadedFrom!)
                fetchEnd.setDate(fetchEnd.getDate() - 1)

                const fetchStart = new Date(loadedFrom!)
                fetchStart.setDate(fetchStart.getDate() - CHUNK_DAYS)

                // @ts-ignore
                dispatch(fetchConsultantDashboardAssignments({
                    consultantId: user.id,
                    startDate: fetchStart,
                    endDate: fetchEnd
                }))
            }
        }    
    }
    
    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            In-Progress Assignments
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
                                    <div className="text-sm font-medium text-muted-foreground">{dayInfo.monthName}</div>
                                    <div className="text-sm font-medium text-muted-foreground">{dayInfo.dayName}</div>
                                    <div className={`text-lg font-semibold ${dayInfo.isToday ? "text-primary bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center mx-auto" : ""}`}>
                                        {dayInfo.dayNumber}
                                    </div>
                                </div>

                                {/* Event List */}
                                <ScrollArea className="h-[225px]">
                                    {/* {dashboardAssignments */}
                                    {assignments
                                        .filter(assignment => formatNextDeadline(day) === formatNextDeadline(assignment.dueDate))
                                        .map((assignment) => (
                                            <div key={assignment.id} onClick={()=> handleAssignmentClick(assignment)} className="p-2 rounded-md border cursor-pointer hover:bg-muted/50 transition-colors border-blue-200 bg-blue-50">
                                                <div className="space-y-1">
                                                    <div className="text-sm font-medium truncate">
                                                        {assignment.title}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground truncate" title={assignment.studentFirstName}>
                                                        {assignment.studentFirstName} {assignment.studentLastName}
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
            {/* @ts-ignore */}
            <ReadAssignmentModal />
        </>
    )
}

export default DashboardAssignmentCalendar