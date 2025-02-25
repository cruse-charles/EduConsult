'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/lib/firebaseConfig'
import { Student } from '@/lib/types/types'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { Edit } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import StudentCardContent from './StudentCardContent'
import EditStudentCardContent from './EditStudentCardContent'

interface StudentProfileCardProps {
    student: Student;
    setStudent: (student: Student) => void;
}

function StudentProfileCard({student, setStudent} : StudentProfileCardProps) {
    // State to manage edit mode and the student being edited
    const [editMode, setEditMode] = useState(false)
    const [editStudent, setEditStudent] = useState(student)
    
    // Initialize router for navigation
    const router = useRouter();

    // Function to handle student deletion
    const handleDelete = async () => {
        try {
            // Delete the student document from Firestore
            await deleteDoc(doc(db, "studentUsers", student.id))
            console.log("Student deleted:", student.id);

            // Redirect to dashboard
            router.push('/dashboard');
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    }

    const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        try {
            // Update the student document in Firestore with the edited data
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

            // Update the local state with the edited student data
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
    
                    {/* Student Name and Edit Section */}
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
            
            {/* Student Detail Container */}
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