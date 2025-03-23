'use client'

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Student } from "@/lib/types/types";
import { useStudent } from "@/hooks/useStudent";

import StudentViewCard from "./StudentViewCard/StudentViewCard";
import AssignmentsOverview from "./AssignmentsOverview";
import SelectViewTabs from "./SelectViewTabs";
import StudentProfileHeader from "./StudentProfileHeader";
import AssignmentsList from "./AssignmentsList";

import { useDispatch, useSelector } from "react-redux";
import { fetchStudent } from "@/redux/slices/studentSlice";
import { AppDispatch } from "@/redux/store";

function page() {
    // retrieve the student ID from URL and initialize dispatch for data retrieval and state management
    const { id: studentId } = useParams<{id: string}>();
    const dispatch = useDispatch<AppDispatch>()

    // Dispatch fetchStudent, retrieving student information from Firebase
    useEffect(() => {
        if (studentId) {
            dispatch(fetchStudent(studentId));
        }
    }, [studentId, dispatch]);

    // fetch student data from Firestore when the component mounts and set it to state
    const studentFromHook = useStudent(studentId)
    const [student, setStudent] = useState<Student | null>(null);

    // TODO: Remove using hook to set student and use Redux. Will need to adjust the StudentProfileCard
    // and EditStudentCardContent components. They are using the local state here, so need to migrate
    // logic to reducer
    useEffect(() => {
        if (studentFromHook) setStudent(studentFromHook);
    }, [studentFromHook]);

    // const student = useSelector((state) => state.student);

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

            <div className="grid gap-6 md:grid-cols-3">
                {/* Student Details Card */}
                <StudentViewCard student={student} setStudent={setStudent} />

                {/* Main Content Container */}
                <div className="md:col-span-2 space-y-6">
                    {/* Task Summary Section */}
                    <AssignmentsOverview student={student} />

                    {/* Student Details Section */}
                    <SelectViewTabs />
                    <AssignmentsList />
                </div>
            </div>
        </div>
    )
}

export default page