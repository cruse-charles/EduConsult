'use client'

import { useEffect, useState } from "react";
import { getDoc, doc, DocumentReference, DocumentData } from "firebase/firestore";
import { db, app } from "@/lib/firebaseConfig";
import Sidebar from "../components/Sidebar";
import AddStudentModal from "../components/AddStudentModal";
import Link from "next/link";
import { getAuth, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

interface Student {
    id: string;
    name: string;
    gpa: number;
}

const page = () => {
    
    // State to manage students and current user (consultant)
    const [students, setStudents] = useState<Student[]>([]);
    const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

    // 1. Listen for auth state changes and set user
    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
        return () => unsubscribe();
    }, []);

    // 2. Fetch students when user is available
    useEffect(() => {

        // Function to fetch students for the current consultant user
        const fetchStudents = async (user: FirebaseUser) => {
            try {
                // Get the consultant's document reference and snapshot
                const consultantDocRef = doc(db, "consultantUsers", user.uid);
                const consultantDocSnap = await getDoc(consultantDocRef);

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

        if (currentUser) {
            fetchStudents(currentUser);
        }
    }, [currentUser]);
    
    return (
        <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 bg-white">
            <h1>Students</h1>
            <ul>
            {students.map((student) => (
                <Link href={`studentprofile/${student.id}`} key={student.id}>{student.name}</Link>
            ))}
            </ul>
        </div>
        <AddStudentModal />
        </div>
    );
};

export default page;
