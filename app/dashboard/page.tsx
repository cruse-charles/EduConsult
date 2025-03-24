'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getDoc, doc, DocumentReference, DocumentData } from "firebase/firestore";
import { db, app } from "@/lib/firebaseConfig";
import { User as FirebaseUser } from "firebase/auth";

import { Student } from "@/lib/types/types";
import { useConsultant } from "@/hooks/useConsultant";

import Sidebar from "../components/Sidebar";
import AddStudentModal from "../components/AddStudentModal/AddStudentModal";
import StudentCard from "../components/StudentCard";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const page = () => {
    // State to manage students and set reference to the consultant document
    const [students, setStudents] = useState<Student[]>([]);
    const [consultantDocRef, setConsultantDocRef] = useState<DocumentReference<DocumentData> | null>(null);

    const role = useSelector((state) => state.user.role)

    // Function to fetch students for the current consultant user
    const fetchStudents = async (user: FirebaseUser) => {
        try {
            // Get the consultant's document reference and snapshot
            console.log('fetching students...')
            const ref = doc(db, "consultantUsers", user.uid);
            console.log("Consultant Document Reference:", ref);
            setConsultantDocRef(ref);
            const consultantDocSnap = await getDoc(ref);
            console.log("Consultant Document Snapshot:", consultantDocSnap);

            // If the consultant document does not exist, set students to an empty array
            if (!consultantDocSnap.exists()) {
                setStudents([]);
                return;
            }

            // Extract student references from the consultant document
            const consultantData = consultantDocSnap.data();
            const studentRefs = consultantData.students || [];

            // Fetch each student's document data
            const studentDocs = await Promise.all(
                studentRefs.map(async (studentRef: DocumentReference<DocumentData>) => {
                    const studentDocSnap = await getDoc(studentRef);
                    return studentDocSnap.exists()
                        ? { id: studentDocSnap.id, ...studentDocSnap.data() }
                        : null;
                })
            );

            // Filter out any null values due to possible deleted students or missing data
            setStudents(studentDocs.filter(Boolean));
        } catch (error) {
            console.log("Error fetching students:", error);
            setStudents([]);
        }
    };

    // 1. Listen for auth state changes and set user, grabbing currentUser isn't always reliable on initial render
    const currentUser = useConsultant();
    

    // 2. Fetch students when user is available
    useEffect(() => {
        if (currentUser) fetchStudents(currentUser);
    }, [currentUser]);

    const handleStudentAdded = () => {
        if (currentUser) fetchStudents(currentUser);
    }
    
    return (
        role === 'consultant' ? (
            <div className="flex min-h-screen">
                {/* Sidebar Container */}
                <Sidebar />
    
                {/* Main Content Container */}
                <div className="container p-4 md:p-6 space-y-6">
                    {/* Add Student Container */}
                    <AddStudentModal consultantDocRef={consultantDocRef} onStudentAdded={handleStudentAdded}/>
    
                    {/* Tabs Container */}
                    {/* TODO: Export to another component and use Redux to fetch students needed */}
                    <div className="">
                        <Tabs defaultValue="students">
                            <TabsList>
                            <TabsTrigger value="students">Students</TabsTrigger>
                            {/* <TabsTrigger value="calendar">Calendar</TabsTrigger>
                            <TabsTrigger value="deadlines">Upcoming Deadlines</TabsTrigger> */}
                            </TabsList>
                            <TabsContent value="students" className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {students.map((student) => (
                                    <StudentCard key={student.id} student={student} />
                                ))}
                            </div>
                            {students.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-12">
                                <p className="text-muted-foreground">No students found matching your search.</p>
                                </div>
                            )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        ) : (
            <div>Hello</div>
        )
    );
};

export default page;
