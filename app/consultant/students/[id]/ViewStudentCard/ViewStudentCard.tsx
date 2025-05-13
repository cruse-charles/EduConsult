'use client'

import { db } from '@/lib/firebaseConfig'
import { Student } from '@/lib/types/types'
import { deleteDoc, doc, DocumentReference, getDoc, updateDoc } from 'firebase/firestore'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import StudentCardContent from './StudentCardContent'
import EditStudentCardContent from './EditStudentCardContent'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useStudent } from '@/hooks/useStudent'

// interface ViewStudentCardProps {
//     student: Student;
//     setStudent: (student: Student) => void;
// }

// function ViewStudentCard({student, setStudent} : ViewStudentCardProps) {
function ViewStudentCard() {

    // const student : Student = useStudent(useSelector((state: RootState) => state.student).id as string)
    const student = useSelector((state: RootState) => state.student) as Student

    if (!student) return <div>Loading...</div>
    
    // State to manage edit mode and the student being edited
    const [editMode, setEditMode] = useState(false)
    const [editStudent, setEditStudent] = useState(student)
    
    useEffect(() => {
        if (student) setEditStudent(student)
    }, [student])

    useEffect(() => {
        console.log('Edit Student', editStudent)
        console.log('Student', student)
    }, [editStudent, student])
    
    // Initialize router for navigation
    const router = useRouter();

    const user = useSelector((state: RootState) => state.user)

    // Function to handle student deletion
    // TODO: DELETE THE STUDENT REF FROM THE CONSULTANT DOCUMENT

    // TODO: Make sure students can't delete their own card/themselves
    const handleDelete = async () => {
        try {
            // Delete the student document from Firestore
            await deleteDoc(doc(db, "studentUsers", student.id))
            console.log("Student deleted:", student.id);

            // Remove student from consultant's students array
            const consultantRef = doc(db, "consultantUsers", user.id);
            const consultantSnap = await getDoc(consultantRef);
            const consultantData = consultantSnap.data();

            const studentRefs = consultantData?.students as DocumentReference[]

            const updatedStudentRefs = studentRefs.filter((ref) => ref.id !== student.id)

            await updateDoc(consultantRef, {
                students: updatedStudentRefs
            })

            console.log("Student deleted from consultant's array")
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
                personalInformation: editStudent.personalInformation,
                academicInformation: editStudent.academicInformation,
            })

            // Update the local state with the edited student data
            setEditMode(false);
            // setStudent(editStudent)
            console.log("Student updated:", student.id);
        } catch (error) {
            console.error("Error updating student:", error);
        }
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setEditStudent((prev) => ({
            ...prev,
            personalInformation: {
                ...prev.personalInformation,
                [name]: value
            }
        }))
    }
    
    return (
        <Card className="md:col-span-1">
            <CardHeader>
                <div className="flex flex-col-reverse md:flex-row w-full justify-between items-start md:items-center gap-2">
    
                    {/* Student Name and Edit Section */}
                    {!editMode && 
                        <>
                            <CardTitle className="text-xl">
                                {student?.personalInformation?.firstName} {student?.personalInformation?.lastName}
                            </CardTitle>
                            <Button onClick={ ()=> setEditMode(true)} variant="outline" className="self-start md:self-auto">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </>
                    }
                    {editMode && 
                        <>
                            <div className='flex flex-col gap-2'>
                                <Label className='text-muted-foreground'>First Name</Label>
                                <Input className='h-7' name='firstName' value={editStudent.personalInformation.firstName} onChange={handleNameChange}/>
                                <Label className='text-muted-foreground'>Last Name</Label>
                                <Input className='h-7' name='lastName' value={editStudent.personalInformation.lastName} onChange={handleNameChange}/>   
                            </div>
                            <div className='flex flex-col gap-1'>
                                <Button variant="outline" onClick={handleSave}>Save</Button>
                                <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                                <Button variant="outline" onClick={handleDelete}>Delete</Button>
                            </div>
                        </>
                    }
                </div>
            </CardHeader>
            
            {/* Student Detail Container */}
            { editMode ? (
                    <EditStudentCardContent editStudent={editStudent} setEditStudent={setEditStudent}/>
                ) : (
                    <StudentCardContent student={editStudent} />
                )
            }
        </Card>
    )
}

export default ViewStudentCard