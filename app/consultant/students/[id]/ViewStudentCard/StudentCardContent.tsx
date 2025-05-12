import { CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Student } from "@/lib/types/types"
import { Progress } from '@/components/ui/progress'

function StudentCardContent({student}: {student: Student}) {
  return (
    <CardContent className="space-y-4">
        <div className="space-y-2">
            <div className="text-sm font-medium">Contact Information</div>
            <div className="grid grid-cols-[1fr_2fr] gap-1 text-sm">
                <div className="text-muted-foreground">Email:</div>
                <div>{student?.personalInformation?.email}</div>
                <div className="text-muted-foreground">Phone:</div>
                <div>{student?.personalInformation?.phone}</div>
            </div>
        </div>

        <Separator />

        <div className="space-y-2">
            <div className="text-sm font-medium">Academic Information</div>
            <div className="grid grid-cols-[1fr_2fr] gap-1 text-sm">
                <div className="text-muted-foreground">School:</div>
                <div>{student?.academicInformation?.currentSchool}</div>
                <div className="text-muted-foreground">Grade:</div>
                <div>{student?.academicInformation?.grade}</div>
                <div className="text-muted-foreground">GPA: </div>
                <div>{student?.academicInformation?.gpa}</div>
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
                {/* <span className="text-sm">{student?.progress}%</span> */}
            </div>
            {/* <Progress value={student?.progress} className="h-2" /> */}
        </div>

        <Separator />

        <div className="space-y-2">
            <div className="text-sm font-medium">Notes</div>
            <p className="text-sm text-muted-foreground">{student?.personalInformation?.notes}</p>
        </div>
    </CardContent>
  )
}

export default StudentCardContent