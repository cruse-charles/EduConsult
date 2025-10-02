'use client'

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

import Highlights from "@/app/components/Highlights/Highlights";
import WeeklyCalendar from "./WeeklyCalendar";
import AssignmentsList from "./AssignmentList/AssignmentsList";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchUser } from "@/redux/slices/userSlice";

function page() {
    // Initialize dispatch for data retrieval and state management
    const dispatch = useDispatch<AppDispatch>()
    const user = useSelector((state: RootState) => state.user);
    
    // Fetch user data on component mount
    useEffect(() => {
        dispatch(fetchUser({ userId: user.id, database: "studentUsers" }))
    }, [])

    return (
            <div className="min-h-screen bg-background">
                <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container flex h-16 items-center justify-between px-4">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-lg font-semibold">Welcome back, {user?.profile?.firstName} {user?.profile?.lastName}!</h1>
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