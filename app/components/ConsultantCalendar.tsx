import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useState } from 'react'

const ConsultantCalendar = () => {

    const [currentDate, setCurrentDate] = useState(new Date())

    const formatDateRange = () => {
        return currentDate.toLocaleString("default", { month: "long", year: "numeric" })
    }

    const navigate = (direction: string) => {
        if (direction) return
    }

    const renderMonthView = () => {

        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
        const days = []

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 border bg-muted/20"></div>)
        }

        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
            const isToday = new Date().toDateString() === date.toDateString()

            days.push(
                <div key={`day-${day}`} className={`h-24 border p-1 ${isToday ? "bg-muted/30 border-primary" : ""}`}>
                <div className="flex justify-between items-start">
                    <span className={`text-sm font-medium ${isToday ? "text-primary" : ""}`}>{day}</span>
                </div>
                </div>
            )
        }

        return (
            <div>
                <div className="grid grid-cols-7 gap-px">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="text-center py-2 font-medium text-sm">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-px">
                    {days}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => navigate("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="font-medium min-w-[200px] text-center">{formatDateRange()}</div>
                <Button variant="outline" size="icon" onClick={() => navigate("next")}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
                </div>
            </div>

            {renderMonthView()}

        </div>
    )
}

export default ConsultantCalendar