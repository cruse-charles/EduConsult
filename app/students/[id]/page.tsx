'use client'

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Student } from "@/lib/types/types";
import { useStudent } from "@/hooks/useStudent";

import ViewStudentCard from "./ViewStudentCard/StudentViewCard";
import AssignmentsOverview from "./AssignmentsOverview";
import SelectViewTabs from "./SelectViewTabs";
import StudentProfileHeader from "./StudentProfileHeader";
import AssignmentsList from "./AssignmentsList";

import { useDispatch, useSelector } from "react-redux";
import { fetchStudent } from "@/redux/slices/studentSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Sidebar from "@/app/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Highlights from "@/app/components/Highlights";

function page() {
    // Retrieve the student ID from URL and initialize dispatch for data retrieval and state management
    const { id: studentId } = useParams<{id: string}>();
    const dispatch = useDispatch<AppDispatch>()

    // State to track if authetication is ready
    const [authReady, setAuthReady] = useState(false)

    // Check if the user is authenticated and set authReady to true when the auth state changes
    // This ensures that the student data is only fetched after the authentication state is confirmed
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) setAuthReady(true);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (authReady && studentId) {
            dispatch(fetchStudent(studentId))
        }
    }, [studentId, dispatch, authReady])

    // fetch student data from Firestore when the component mounts and set it to state
    const studentFromHook = useStudent(studentId)
    const [student, setStudent] = useState<Student | null>(null);

    // TODO: Remove using hook to set student and use Redux. Will need to adjust the StudentProfileCard
    // and EditStudentCardContent components. They are using the local state here, so need to migrate
    // logic to reducer
    useEffect(() => {
        if (studentFromHook) setStudent(studentFromHook);
    }, [studentFromHook]);

    const user = useSelector((state: RootState) => state.user);

    if (!student) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg text-muted-foreground">Loading student profile...</p>
            </div>
        );
    }

    return (
        user.role === 'consultant' ? (
            // Page Containers
            <div className="container flex-1 p-4 md:p-6 space-y-6">
                <StudentProfileHeader />

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Student Details Card */}
                    <ViewStudentCard student={student} setStudent={setStudent} />

                    {/* Main Content Container */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Task Summary Section */}
                        <AssignmentsOverview student={student} />

                        {/* Student Details Section */}
                        <SelectViewTabs />
                    </div>
                </div>
            </div>
        ) : (
            <div className="min-h-screen bg-background">
                <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container flex h-16 items-center justify-between px-4">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-lg font-semibold">Welcome back, {user.firstName} {user.lastName}!</h1>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="flex min-h screen">
                        {/* Side Bar */}
                        <Sidebar />
                        
                        <main className="container p-4 md:p-6 space-y-6">
                        {/* Task Stats */}
                        <Highlights />

                        {/* Select Assignment, Calendar */}
                        <Tabs defaultValue="assignments" className="space-y-4">
                            <TabsList>
                                <TabsTrigger value="assignments">My Assignments</TabsTrigger>
                                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                            </TabsList>
                            <TabsContent value="assignments">
                                <AssignmentsList />
                            </TabsContent>
                        </Tabs>
                    </main>
                </div>
            </div>
        )
    )
}

export default page