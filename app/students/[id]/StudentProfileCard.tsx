'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { db } from '@/lib/firebaseConfig'
import { Student } from '@/lib/types/types'
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore'
import { Edit } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import StudentCardContent from './StudentCardContent'
import EditStudentCardContent from './EditStudentCardContent'

function StudentProfileCard({student, setStudent} : {student: Student}) {
    const [editMode, setEditMode] = useState(false)
    const [editStudent, setEditStudent] = useState(student)
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

    const handleSave = async (e) => {
        e.preventDefault()

        try {
            const studentRef = doc(db, "studentUsers", student.id);
            await updateDoc(studentRef, {
                personalInformation: {
                    firstName: editStudent.personalInformation.firstName,
                    lastName: editStudent.personalInformation.lastName,
                    email: editStudent.personalInformation.email,
                    phone: editStudent.personalInformation.phone,
                    other: editStudent.personalInformation.other,
                    notes: editStudent.personalInformation.notes
                },
                academicInformation: {
                    currentSchool: editStudent.academicInformation.currentSchool,
                    grade: editStudent.academicInformation.grade,
                    gpa: editStudent.academicInformation.gpa,
                    sat: editStudent.academicInformation.sat,
                    toefl: editStudent.academicInformation.toefl,
                    targetSchools: editStudent.academicInformation.targetSchools
                },
                pendingTasks: editStudent.pendingTasks,
                progress: editStudent.progress,
                nextDeadline: editStudent.nextDeadline
            })
            setEditMode(false);
            setStudent(editStudent)
            console.log("Student updated:", student.id);
        } catch (error) {
            console.error("Error updating student:", error);
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
                    <Button variant="outline" onClick={handleSave}>Save</Button>
                    <Button variant="outline" onClick={handleDelete}>Delete</Button>
                </div>}
            </div>
            </CardHeader>
            { editMode ? (
                    <EditStudentCardContent editStudent={editStudent} setEditStudent={setEditStudent}/>
                ) : (
                    <StudentCardContent student={student} />
                )
            }
        </Card>
    )
}

export default StudentProfileCard