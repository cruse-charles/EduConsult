'use client'

import { Button } from '@/components/ui/button'
import { RootState } from '@/redux/store'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useSelector } from 'react-redux'

function StudentProfileHeader() {
    const user = useSelector((state: RootState) => state.user)
    const student = useSelector((state: RootState) => state.student)

    return (
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
                <Link href={`/${user.role}/dashboard/`}>
                    <ArrowLeft className="h-4 w-4" />
                </Link>
            </Button>
            <h1 className="text-2xl font-bold">{student?.personalInformation?.firstName} {student?.personalInformation?.lastName}</h1>
        </div>
    )
}

export default StudentProfileHeader