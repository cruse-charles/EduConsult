'use client'

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Student } from "@/lib/types/types";

// import ViewStudentCard from "./ViewStudentCard/ViewStudentCard";
// import AssignmentsOverview from "./AssignmentsOverview";
// import SelectViewTabs from "./SelectViewTabs";
// import StudentProfileHeader from "./StudentProfileHeader";
import AssignmentsList from "./AssignmentsList";

import { useDispatch, useSelector } from "react-redux";
import { fetchStudent } from "@/redux/slices/studentSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Sidebar from "@/app/components/AppSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Highlights from "@/app/components/Highlights";
import WeeklyCalendar from "./WeeklyCalendar";
import { getStudentAssignments } from "@/lib/querys";
// import StudentCalendar from "./StudentCalendar";

function page() {
    // Retrieve the student ID from URL and initialize dispatch for data retrieval and state management
    const { id: studentId } = useParams<{id: string}>();
    const dispatch = useDispatch<AppDispatch>()
    const studentState = useSelector((state: RootState) => state.student)
    const user = useSelector((state: RootState) => state.user);

    // State to track if authetication is ready, create local state for student
    const [authReady, setAuthReady] = useState(false)
    const [student, setStudent] = useState<Student | null>(null);
    const [assignments, setAssignments] = useState([])

    // Check if the user is authenticated and set authReady to true when the auth state changes
    // This ensures that the student data is only fetched after the authentication state is confirmed
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) setAuthReady(true);
        });

        return () => unsubscribe();
    }, []);

    // fetch student data from Firestore when the component mounts and set it to state
    useEffect(() => {
        if (authReady && studentId) {
            dispatch(fetchStudent(studentId))
        }
    }, [studentId, dispatch, authReady])

    // Update local student state when studentState in Redux store changes
    useEffect(() => {
        if (studentState && studentState.id) {
            setStudent(studentState as Student);
        }
    }, [studentState]);

    useEffect(() => {
        const fetchAssignments = async () => {
            const assignmentsData = await getStudentAssignments(user.id);
            setAssignments(assignmentsData)
        }

        fetchAssignments()
    }, [])

    useEffect(() => {
        console.log('StudentId', studentId)
        console.log("assignments", assignments);
    }, [assignments])

    // TODO: ADD PROPER LOADING STATE
    // Loading page displayed while no student
    // if (!student) {
    //     return (
    //         <div className="flex items-center justify-center min-h-screen">
    //             <p className="text-lg text-muted-foreground">Loading student profile...</p>
    //         </div>
    //     );
    // }

    return (
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
                        {/* <Sidebar /> */}
                        
                        <main className="container p-4 md:p-6 space-y-6">
                        {/* Task Stats */}
                        <Highlights />

                        {/* Select Assignment, Calendar */}
                        <Tabs defaultValue="assignments" className="space-y-4">
                            <TabsList>
                                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                            </TabsList>
                            <TabsContent value="assignments">
                                <AssignmentsList />
                            </TabsContent>
                            <TabsContent value='calendar'>
                                <WeeklyCalendar />
                            </TabsContent>
                        </Tabs>
                    </main>
                </div>
            </div>
        )
}

export default page