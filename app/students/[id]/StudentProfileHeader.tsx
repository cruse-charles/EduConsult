import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function StudentProfileHeader() {
    return (
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard/">
                    <ArrowLeft className="h-4 w-4" />
                </Link>
            </Button>
            <h1 className="text-2xl font-bold">Student Profile</h1>
            {/* <div className="ml-auto flex items-center gap-2">
                <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                </Button>
            </div> */}
        </div>
    )
}

export default StudentProfileHeader