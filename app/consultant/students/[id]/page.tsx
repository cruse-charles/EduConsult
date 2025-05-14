'use client'

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Student } from "@/lib/types/types";

import AssignmentsOverview from "./AssignmentsOverview";
import SelectViewTabs from "./SelectViewTabs";
import StudentProfileHeader from "./StudentProfileHeader";

import { useDispatch, useSelector } from "react-redux";
import { fetchStudent } from "@/redux/slices/studentSlice";
import { AppDispatch, RootState } from "@/redux/store";

function page() {
    // Retrieve the student ID from URL and initialize dispatch for data retrieval and state management
    const { id: studentId } = useParams<{id: string}>();
    const dispatch = useDispatch<AppDispatch>()
    const studentState = useSelector((state: RootState) => state.student)
    const user = useSelector((state: RootState) => state.user);

    // State to track if authetication is ready, create local state for student
    const [student, setStudent] = useState<Student | null>(null);

    // fetch student data from Firestore when the component mounts and set it to state
    useEffect(() => {
            dispatch(fetchStudent(studentId))
    }, [studentId, dispatch])


    // Update local student state when studentState in Redux store changes
    useEffect(() => {
        if (studentState && studentState.id) {
            setStudent(studentState as Student);
        }

        console.log('studentState', studentState)
    }, [studentState]);

    // Loading page displayed while no student
    if (!student) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg text-muted-foreground">Loading student profile...</p>
            </div>
        );
    }

    return (
        // Page Containers
        <div className="container flex-1 p-4 md:p-6 space-y-6">
            <StudentProfileHeader />

            <div className="grid gap-6 md:grid-cols-1">
                {/* Student Details Card */}

                {/* Main Content Container */}
                <div className="md:col-span-2 space-y-6">
                    {/* Task Summary Section */}
                    <AssignmentsOverview student={student} />

                    {/* Student Details Section */}
                    <SelectViewTabs />
                </div>
            </div>
        </div>
    )
}

export default page