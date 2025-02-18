'use client'

import { useEffect, useState } from "react";
import { collection, getDocs, where, getDoc, doc } from "firebase/firestore";
import { db, app } from "@/lib/firebaseConfig";
import Sidebar from "../components/Sidebar";
import AddStudentModal from "../components/AddStudentModal";
import Link from "next/link";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const page = () => {
    
    const [students, setStudents] = useState([]);
    
    // useEffect(() => {
        
    //     const fetchStudents = async () => {
    //         try {
            
    //             let auth = getAuth(app);
    //             const user = auth.currentUser;
    //             if (!user) console.log("No user is currently signed in.");
                
    //             // const querySanpshot = await getDocs(collection(db, "studentUsers"))
    //             const collectionRef = collection(db, "studentUsers");
    //             const query = (collectionRef, where("students", "==", `${}`));
    //             const querySanpshot = await getDocs(query);       
    //             const data = querySanpshot.docs.map(doc => ({
    //                 id: doc.id,
    //                 ...doc.data(),
    //             }))

    //             setStudents(data);
    //         } catch (error) {
    //             console.log("Error fetching students:", error);
    //         }
    //     }

    //     fetchStudents();
    // }, [students])

    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setStudents([]);
                return;
            }
            try {
                // Get consultant's document
                const consultantDocRef = doc(db, "consultantUsers", user.uid);
                console.log("Consultant Doc Ref:", consultantDocRef);
                const consultantDocSnap = await getDoc(consultantDocRef);
                console.log("Consultant Doc Snap:", consultantDocSnap);

                if (!consultantDocSnap.exists()) {
                    setStudents([]);
                    console.log("No consultant document found for the user.");
                    return;
                }

                const consultantData = consultantDocSnap.data();
                console.log("Consultant Data:", consultantData);
                const studentRefs = consultantData.students || [];

                // Fetch student documents by reference
                const studentDocs = await Promise.all(
                    studentRefs.map(async (studentRef) => {
                        // If your array is references, use getDoc(studentRef)
                        const studentDocSnap = await getDoc(studentRef);
                        console.log("Student Doc Snap:", studentDocSnap);
                        return studentDocSnap.exists()
                            ? { id: studentDocSnap.id, ...studentDocSnap.data() }
                            : null;
                    })
                );
                console.log("Student Docs:", studentDocs);
                setStudents(studentDocs.filter(Boolean));
            } catch (error) {
                console.log("Error fetching students:", error);
                setStudents([]);
            }
        });

        return () => unsubscribe();
    }, []);

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
