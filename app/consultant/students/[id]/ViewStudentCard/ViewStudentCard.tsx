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
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { updateStudentInformation } from '@/redux/slices/currentStudentSlice'
import CustomToast from '@/app/components/CustomToast'
import { toast } from 'sonner'

function ViewStudentCard() {

    // Initialize router for navigation and retreive student and user data
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user)
    const student = useSelector((state: RootState) => state.currentStudent) as Student

    // TODO: Adjust loading state
    // if (!student) return <div>Loading...</div>
    
    // State to manage edit mode and the student being edited and loading
    const [editMode, setEditMode] = useState(false)
    const [editStudent, setEditStudent] = useState(student)
    const [isLoading, setIsLoading] = useState(false)
    
    useEffect(() => {
        if (student) setEditStudent(student)
    }, [student.id])


    // Function to handle student deletion
    // TODO: DELETE THE STUDENT REF FROM THE CONSULTANT DOCUMENT
    // TODO: Export out the firebase functions
    const handleDelete = async () => {
        try {
            setIsLoading(true)
            // Delete the student document from Firestore
            await deleteDoc(doc(db, "studentUsers", student.id))

            // Remove student from consultant's students array
            const consultantRef = doc(db, "consultantUsers", user.id);
            const consultantSnap = await getDoc(consultantRef);
            const consultantData = consultantSnap.data();

            const studentRefs = consultantData?.students as DocumentReference[]

            const updatedStudentRefs = studentRefs.filter((ref) => ref.id !== student.id)

            await updateDoc(consultantRef, {
                students: updatedStudentRefs
            })

            setIsLoading(false)

            // Redirect to dashboard
            router.push(`/${user.role}/dashboard`);
        } catch (error) {
            setIsLoading(false)
            console.error("Error deleting student:", error);
        }
    }

    const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        try {
            setIsLoading(true)
            // Update the student document in Firestore with the edited data
            const studentRef = doc(db, "studentUsers", student.id);
            await updateDoc(studentRef, {
                personalInformation: editStudent.personalInformation,
                academicInformation: editStudent.academicInformation,
            })

            // Update Redux
            dispatch(updateStudentInformation(editStudent))

            // Update the local state with the edited student data and end loading
            setIsLoading(false)
            setEditMode(false);
            toast(<CustomToast title="Successfully Updated Student Info" description='' status='success' />)
        } catch (error) {
            console.error("Error updating student:", error);
            setIsLoading(false)
            toast(<CustomToast title="Failed to Update Student Info" description='Please refresh and try again.' status='error' />)
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
                                {/* {editStudent?.personalInformation?.firstName} {editStudent?.personalInformation?.lastName} */}
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
                                <Button variant="outline" disabled={isLoading} onClick={handleSave}>Save</Button>
                                <Button variant="outline" disabled={isLoading} onClick={() => setEditMode(false)}>Cancel</Button>
                                <Button variant='destructive' disabled={isLoading} onClick={handleDelete}>Delete</Button>
                            </div>
                        </>
                    }
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

export default ViewStudentCard