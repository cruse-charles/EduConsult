import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import AssignmentsList from "./AssignmentsList";
import StudentCalendar from "./StudentCalendar";
import ViewStudentCard from "./ViewStudentCard/ViewStudentCard";

// TODO: AssignmentList needs to be added here I think for it to 'render' and not render depending on tab selected
// Currently, it's always rendering that assigment list

function SelectViewTabs() {

    return (
        <Tabs defaultValue="assignments">
            <TabsList>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="school-info">Student Information</TabsTrigger>
            </TabsList>
            <TabsContent value="assignments" className="space-y-4">
                <div className="flex justify-between items-center">
                </div>
                <AssignmentsList />
            </TabsContent>
            <TabsContent value="calendar">
                <Card>
                <CardContent className="mt-3">
                    <StudentCalendar />
                </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="school-info">
                <ViewStudentCard />
            </TabsContent>
        </Tabs>
    )
}

export default SelectViewTabs