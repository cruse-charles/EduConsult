import React, { useState } from 'react'

const DashboardAssignmentList = () => {
    const [currentStartDate, setcurrentStartDate] = useState(new Date())
    
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

    const formatDay = (date) => {
        const isToday = new Date().toDateString() === date.toDateString()
        return {
            dayName: date.toLocaleString("default", { weekday: "short" }),
            dayNumber: date.getDate(),
            isToday
        }
    }
    
    return (
        <div>
            {days.map((day) => {
                const dayInfo = formatDay(day)
                return (
                    <div>{dayInfo.dayName}</div>
                )
            })}
        </div>
    )
}

export default DashboardAssignmentList