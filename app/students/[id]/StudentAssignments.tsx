import AddAssignmentModal from "@/app/components/Assignments/AddAssignmentModal"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useSelector } from "react-redux"

// function StudentAssignments({student, onAssignmentAdded} : {student: Student}) {
function StudentAssignments({onAssignmentAdded}) {

    // Access student from store
    const student = useSelector((state: RootState) => state.student);

    return (
        <Tabs defaultValue="assignments">
            <TabsList>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="school-info">School Information</TabsTrigger>
            </TabsList>
            <TabsContent value="assignments" className="space-y-4">
                <div className="flex justify-between items-center">
                {/* <h3 className="text-lg font-medium">Student Assignments</h3>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Assignment
                </Button> */}
                <AddAssignmentModal onAssignmentAdded={onAssignmentAdded}/>
                </div>
                {/* <AssignmentList studentId={student.id} /> */}
            </TabsContent>
            <TabsContent value="calendar">
                <Card>
                <CardHeader>
                    <CardTitle>Student Calendar</CardTitle>
                    <CardDescription>View and manage deadlines for {student?.personalInformation?.firstName} {student?.personalInformation?.lastName}</CardDescription>
                </CardHeader>
                {/* <CardContent>
                    <CalendarView studentId={student.id} />
                    </CardContent> */}
                </Card>
            </TabsContent>
            {/* <TabsContent value="school-info">
                <SchoolInfo schoolName={student.targetSchool} />
                </TabsContent> */}
        </Tabs>
    )
}

export default StudentAssignments