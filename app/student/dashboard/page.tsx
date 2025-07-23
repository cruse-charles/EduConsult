'use client'

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudent } from "@/redux/slices/studentSlice";
import { AppDispatch, RootState } from "@/redux/store";

import { Assignment, Student } from "@/lib/types/types";
import { getStudentAssignments } from "@/lib/queries/querys";

import Highlights from "@/app/components/Highlights";
import WeeklyCalendar from "./WeeklyCalendar";
import AssignmentsList from "./AssignmentsList";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function page() {
    // Initialize dispatch for data retrieval and state management
    const dispatch = useDispatch<AppDispatch>()
    const studentState = useSelector((state: RootState) => state.student)
    const user = useSelector((state: RootState) => state.user);

    const [student, setStudent] = useState<Student | null>(null);
    const [assignments, setAssignments] = useState<Assignment[]>([])
    
    useEffect(() => {
        dispatch(fetchStudent(user.id))
    }, [])


    // Update local student state when studentState in Redux store changes
    useEffect(() => {
        if (studentState) {
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