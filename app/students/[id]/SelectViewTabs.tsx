import CreateAssignmentModal from "./CreateAssignmentModal/CreateAssignmentModal";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Student } from "@/lib/types/types";
import { RootState } from "@/redux/store";

import { useSelector } from "react-redux"
import AssignmentsList from "./AssignmentsList";
import StudentCalendar from "./StudentCalendar";

// TODO: AssignmentList needs to be added here I think for it to 'render' and not render depending on tab selected
// Currently, it's always rendering that assigment list

function SelectViewTabs() {

    // Access student from store
    const student = useSelector((state: RootState) => state.student) as Student;

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
                <CreateAssignmentModal/>
                </div>
                <AssignmentsList />
            </TabsContent>
            <TabsContent value="calendar">
                <Card>
                <CardHeader>
                    <CardTitle>Student Calendar</CardTitle>
                    <CardDescription>View and manage deadlines for {student?.personalInformation?.firstName} {student?.personalInformation?.lastName}</CardDescription>
                </CardHeader>
                <CardContent>
                    <StudentCalendar />
                </CardContent>
                </Card>
            </TabsContent>
            {/* <TabsContent value="school-info">
                <SchoolInfo schoolName={student.targetSchool} />
                </TabsContent> */}
        </Tabs>
    )
}

export default SelectViewTabs