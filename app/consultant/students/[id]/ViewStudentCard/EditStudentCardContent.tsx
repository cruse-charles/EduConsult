import { CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

import { Student } from '@/lib/types/types'

interface EditStudentCardContentProps {
    editStudent: Student;
    setEditStudent: React.Dispatch<React.SetStateAction<Student>>;
}

// TODO: Need loading state on saving edits
function EditStudentCardContent({editStudent, setEditStudent}: EditStudentCardContentProps) {
    const safeValue = (value: number | null) => (value === null || isNaN(value) ? '' : value);

    const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target



        setEditStudent((prev) => (
            {
                ...prev,
                personalInformation: {
                    ...prev.personalInformation,
                    [name]: value
                }
            }
        ))
    }

    const handleAcademicInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target

        setEditStudent((prev) => (
            {
                ...prev,
                academicInformation: {
                    ...prev.academicInformation,
                    [name]: value
                }
            }
        ))
    }

  return (
    <CardContent className="space-y-4">
        <div className="space-y-2">
            <div className="text-sm font-medium">Contact Information</div>
            <div className="grid grid-cols-[1fr_2fr] gap-1 text-sm">
                <div className="text-muted-foreground">Email:</div>
                <Input className='h-7' name='email' type='email' value={editStudent?.personalInformation.email} onChange={handlePersonalInfoChange}/>
                <div className="text-muted-foreground">Phone:</div>
                <Input className='h-7' name='phone' value={editStudent?.personalInformation.phone} onChange={handlePersonalInfoChange}/>
            </div>
        </div>

        <Separator />

        <div className="space-y-2">
            <div className="text-sm font-medium">Academic Information</div>
            <div className="grid grid-cols-[1fr_2fr] gap-1 text-sm">
                <div className="text-muted-foreground">School:</div>
                <Input className='h-7' name='currentSchool' value={editStudent?.academicInformation.currentSchool} onChange={handleAcademicInfoChange}/>
                
                <div className="text-muted-foreground">Grade:</div>
                <Input className='h-7' name='grade' value={safeValue(editStudent?.academicInformation.grade)} onChange={handleAcademicInfoChange}/>
                
                <div className="text-muted-foreground">GPA:</div>
                <Input className='h-7' step="any" name='gpa' value={safeValue(editStudent?.academicInformation.gpa)} onChange={handleAcademicInfoChange}/>
            </div>
        </div>

        <Separator />

        {/* <div className="space-y-2">
            <div className="text-sm font-medium">Target School</div>
            <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <span>{editStudent.targetSchool}</span>
            </div>
        </div> */}

        {/* <Separator /> */}

        {/* <div className="space-y-2">
            <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Application Progress</div>
            <span className="text-sm">{editStudent?.progress}%</span>
            </div>
            <Progress value={editStudent?.progress} className="h-2" />
        </div> */}

        {/* <Separator /> */}

        <div className="space-y-2">
            <Textarea name='notes' className="text-sm font-medium" value={editStudent?.personalInformation.notes} onChange={handlePersonalInfoChange}/>
        </div>
    </CardContent>
  )
}

export default EditStudentCardContent