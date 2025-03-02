'use client'

import { useEffect, useState } from "react";
import { getDoc, doc, DocumentReference, DocumentData } from "firebase/firestore";
import { db, app } from "@/lib/firebaseConfig";
import Sidebar from "../components/Sidebar";
import AddStudentModal from "../components/AddStudentModal/AddStudentModal";
import { getAuth, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import StudentCard from "../components/StudentCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Student } from "@/lib/types/types";
import { useConsultant } from "@/hooks/useConsultant";

const page = () => {
    // State to manage students and set reference to the consultant document
    const [students, setStudents] = useState<Student[]>([]);
    const [consultantDocRef, setConsultantDocRef] = useState<DocumentReference<DocumentData> | null>(null);

    // Function to fetch students for the current consultant user
    const fetchStudents = async (user: FirebaseUser) => {
        try {
            // Get the consultant's document reference and snapshot
            const ref = doc(db, "consultantUsers", user.uid);
            setConsultantDocRef(ref);
            const consultantDocSnap = await getDoc(ref);

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
        <div className="flex min-h-screen">
            {/* Sidebar Container */}
            <Sidebar />

            {/* Main Content Container */}
            <div className="container p-4 md:p-6 space-y-6">
                {/* Add Student Container */}
                <AddStudentModal consultantDocRef={consultantDocRef} onStudentAdded={handleStudentAdded}/>

                {/* Tabs Container */}
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
    );
};

export default page;
