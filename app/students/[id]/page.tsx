'use client'

import { db, storage } from "@/lib/firebaseConfig";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ref, uploadBytesResumable, uploadBytes  } from "firebase/storage";
import { Student } from "@/lib/types/types";
import StudentProfileCard from "./StudentProfileCard";
import TaskSummary from "./TaskSummary";
import StudentDetails from "./StudentAssignments";
import StudentProfileHeader from "./StudentProfileHeader";
import { useStudent } from "@/hooks/useStudent";
import AssignmentsList from "./AssignmentsList";

function page() {
    // retrieve the student ID from URL and create state to hold student data
    const { id } = useParams<{id: string}>();

    // fetch student data from Firestore when the component mounts and set it to state
    const studentFromHook = useStudent(id)
    const [student, setStudent] = useState<Student | null>(null);

    useEffect(() => {
        if (studentFromHook) setStudent(studentFromHook);
    }, [studentFromHook]);


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
                    <StudentProfileCard student={student} setStudent={setStudent} />

                    {/* Main Content Container */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Task Summary Section */}
                        <TaskSummary student={student} />

                        {/* Student Details Section */}
                        <StudentDetails student={student} />
                        <AssignmentsList student={student} />
                    </div>
                </div>
            </div>
        // </div>
    )
}

export default page