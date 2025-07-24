'use client'

import { useParams } from "next/navigation";
import { useEffect } from "react";

import AssignmentsOverview from "./AssignmentsOverview";
import SelectViewTabs from "./SelectViewTabs";
import StudentProfileHeader from "./StudentProfileHeader";

import { useDispatch, useSelector } from "react-redux";
import { fetchStudent } from "@/redux/slices/currentStudentSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { clearAssignments, fetchAssignments } from "@/redux/slices/currentStudentAssignmentsSlice";

function page() {
    // Retrieve the student ID from URL and initialize dispatch for data retrieval
    const dispatch = useDispatch<AppDispatch>()
    const { id: studentId } = useParams<{id: string}>();
    const student = useSelector((state: RootState) => state.student)

    // TODO: Check if we want to combine these useEffects, and if we want to make a clearStudent
    useEffect(() => {
        // Clear previous student data and assignments
        // dispatch(clearStudent()) // You'd need to create this action
        dispatch(clearAssignments())
        dispatch(fetchStudent(studentId))
    }, [studentId, dispatch])

    // Then fetch assignments when student data loads
    useEffect(() => {
        if (student?.assignmentDocIds) {
            dispatch(fetchAssignments(student.assignmentDocIds))
        }
    }, [student?.assignmentDocIds, dispatch])



    // Loading page displayed while no student
    // if (!student) {
    //     return (
    //         <div className="flex items-center justify-center min-h-screen">
    //             <p className="text-lg text-muted-foreground">Loading student profile...</p>
    //         </div>
    //     );
    // }

    return (
        // Page Containers
        <div className="container flex-1 p-4 md:p-6 space-y-6">
            <StudentProfileHeader />

            <div className="grid gap-6 md:grid-cols-1">
                {/* Student Details Card */}

                {/* Main Content Container */}
                <div className="md:col-span-2 space-y-6">
                    {/* Task Summary Section */}
                    <AssignmentsOverview />

                    {/* Student Details Section */}
                    <SelectViewTabs />
                </div>
            </div>
        </div>
    )
}

export default page