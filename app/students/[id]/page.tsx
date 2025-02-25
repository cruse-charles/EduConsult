'use client'

import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebaseConfig";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ref, uploadBytesResumable, uploadBytes  } from "firebase/storage";
import { Student } from "@/lib/types/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Edit, GraduationCap, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentProfileCard from "./StudentProfileCard";
import TaskSummary from "./TaskSummary";
import StudentDetails from "./StudentDetails";
import StudentProfileHeader from "../StudentProfileHeader";

function page() {
    // retrieve the student ID from URL and create state to hold student data
    const { id } = useParams<{id: string}>();
    const [student, setStudent] = useState<Student | null>(null);

    // fetch student data from Firestore when the component mounts and set it to state
    useEffect(() => {
        const fetchstudent = async () => {
            const docRef = doc(db, "studentUsers", id);
            const docSnap = await getDoc(docRef);
            // console.log(docSnap.data())
            setStudent(docSnap.data() as Student | null);
        }

        fetchstudent()
    }, [])

    // TODO: add monitor uploading process, use these links: 
        // https://firebase.google.com/docs/storage/web/upload-files
        // https://www.youtube.com/watch?v=fgdpvwEWJ9M start at around 30:00

    // handle file upload, upload each file to Firebase Storage
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event?.target.files
        console.log(files);

        if (!files) {
            console.error('No files selected');
            return;
        }

        for (const file of Array.from(files) as File[]) {
            // Create a storage reference
            const storageRef = ref(storage, `${file.name}`);
            
            // Upload the file to the storage reference
            try {
                const snapshot = uploadBytes(storageRef, file)
                console.log('Uploaded a blob or file!', snapshot);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    }

    if (!student) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg text-muted-foreground">Loading student profile...</p>
            </div>
        );
    }

    return (
        // Page Containers
        // <div className="flex min-h-screen flex-col">
            <div className="container flex-1 p-4 md:p-6 space-y-6">
                <StudentProfileHeader />

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Student Details Card */}
                    <StudentProfileCard student={student} />

                    {/* Main Content Container */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Task Summary Section */}
                        <TaskSummary student={student} />

                        {/* Student Details Section */}
                        <StudentDetails student={student} />
                    </div>
                </div>
            </div>
        // </div>
    )
}

export default page