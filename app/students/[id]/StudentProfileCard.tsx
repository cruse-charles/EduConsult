'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { db } from '@/lib/firebaseConfig'
import { Student } from '@/lib/types/types'
import { deleteDoc, doc, getDoc } from 'firebase/firestore'
import { Edit, Router } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

function StudentProfileCard({student} : {student: Student}) {
    const [editMode, setEditMode] = useState(false)
    const router = useRouter();

    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, "studentUsers", student.id))
            console.log("Student deleted:", student.id);
            router.push('/dashboard');
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    }
    
    return (
        <Card className="md:col-span-1">
            <CardHeader>
            <div className="flex flex-col-reverse md:flex-row w-full justify-between items-start md:items-center gap-2">
                <CardTitle className="text-xl">
                {student?.personalInformation.firstName} {student?.personalInformation.lastName}
                </CardTitle>
                {!editMode && <Button onClick={ ()=> setEditMode(true)} variant="outline" className="self-start md:self-auto">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </Button>}
                {editMode && 
                <div className='flex flex-row gap-2 self-start md:self-auto'>
                    <Button variant="outline" onClick={() => setEditMode(false)}>Save</Button>
                    <Button variant="outline" onClick={handleDelete}>Delete</Button>
                </div>}
            </div>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <div className="text-sm font-medium">Contact Information</div>
                <div className="grid grid-cols-[1fr_2fr] gap-1 text-sm">
                <div className="text-muted-foreground">Email:</div>
                <div>{student?.personalInformation.email}</div>
                <div className="text-muted-foreground">Phone:</div>
                <div>{student?.personalInformation.phone}</div>
                </div>
            </div>

            <Separator />

            <div className="space-y-2">
                <div className="text-sm font-medium">Academic Information</div>
                <div className="grid grid-cols-[1fr_2fr] gap-1 text-sm">
                <div className="text-muted-foreground">School:</div>
                <div>{student?.academicInformation.currentSchool}</div>
                <div className="text-muted-foreground">Grade:</div>
                {/* <div>{student?.academicInformation.grade}</div> */}
                <div className="text-muted-foreground">GPA:</div>
                <div>{student?.academicInformation.gpa}</div>
                </div>
            </div>

            <Separator />

            {/* <div className="space-y-2">
                <div className="text-sm font-medium">Target School</div>
                <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span>{student.targetSchool}</span>
                </div>
            </div> */}

            <Separator />

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Application Progress</div>
                <span className="text-sm">{student?.progress}%</span>
                </div>
                <Progress value={student?.progress} className="h-2" />
            </div>

            <Separator />

            <div className="space-y-2">
                <div className="text-sm font-medium">Notes</div>
                {/* <p className="text-sm text-muted-foreground">{student.notes}</p> */}
            </div>
            </CardContent>
        </Card>
    )
}

export default StudentProfileCard