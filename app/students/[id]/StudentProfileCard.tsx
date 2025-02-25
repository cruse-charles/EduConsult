import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Student } from '@/lib/types/types'

function StudentProfileCard({student} : {student: Student}) {
    return (

        <Card className="md:col-span-1">
            <CardHeader className="flex flex-row items-center gap-4">
            <div>
                <CardTitle className="text-xl">{student?.personalInformation.firstName} {student?.personalInformation.lastName}</CardTitle>
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