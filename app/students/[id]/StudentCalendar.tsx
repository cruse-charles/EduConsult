import React, { useState } from 'react'

const StudentCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date())

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const current = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }

    const handleDateClick = (day) => {

    }

    return (
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
                    className={`h-40 p-1 border cursor-pointer hover:bg-muted/50 ${
                        !isCurrentMonth ? "text-muted-foreground bg-muted/20" : ""
                    } ${isToday ? "bg-primary/10 border-primary" : ""}`}
                    onClick={() => handleDateClick(day)}
                    >
                    <div className="text-sm font-medium mb-1">{day.getDate()}</div>
                    </div>
                )
            })}
        </div>
    )
}

export default StudentCalendar