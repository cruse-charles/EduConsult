import { Badge } from '@/components/ui/badge'
import { Timestamp } from 'firebase/firestore'
import { CheckCircle, Clock, Eye, Hourglass, Upload } from 'lucide-react'
import React from 'react'

// TODO: Need to change pending status to overdue when we go past the date
const StatusBadge = (status: string, dueDate: Date | Timestamp | undefined) => {
    if (!dueDate) return null

    if (status === 'Pending' && dueDate < Timestamp.fromDate(new Date())) {
        return (
            <Badge className="gap-1 bg-red-100 text-red-800 font-bold hover:bg-red-100 hover:text-red-800">
                <Clock className="h-3 w-3" />
                Overdue
            </Badge>
        )
    }

    switch (status) {
        case "Pending":
        return (
            <Badge className="gap-1  bg-orange-100 text-orange-800 font-bold hover:bg-orange-100 hover:text-orange-800">
                <Hourglass className="h-3 w-3" />
                Assigned
            </Badge>
        )

        case "Completed":
        return (
            <Badge className="gap-1 bg-green-100 text-green-800 font-bold hover:bg-green-100 hover:text-green-800">
                <CheckCircle className="h-3 w-3" />
                Completed
            </Badge>
        )

        case "Submitted":
        return (
            <Badge className="gap-1 bg-blue-100 text-blue-800 font-bold hover:bg-blue-100 hover:text-blue-800">
                <Upload className="h-3 w-3" />
                Submitted
            </Badge>
        )

        case "Under Review":
        return (
            <Badge className="gap-1 bg-purple-100 text-purple-800 font-bold hover:bg-purple-100 hover:text-purple-800">
                <Eye className="h-3 w-3" />
                Reviewing
            </Badge>
        )
    }

    return null
}

export default StatusBadge