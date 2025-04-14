import React from 'react'

const ConsultantCalendar = () => {

    const renderMonthView = () => {

        const days = []

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
        <div>
            {renderMonthView()}
        </div>
    )
}

export default ConsultantCalendar