'use client'

import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebaseConfig";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ref, uploadBytesResumable, uploadBytes  } from "firebase/storage";

interface Student {
    name: string;
    gpa: number;
}

function page() {
    // retrieve the student ID from URL and create state to hold student data
    const { id } = useParams<{id: string}>();
    const [studentData, setStudentData] = useState<Student | null>(null);

    // fetch student data from Firestore when the component mounts and set it to state
    useEffect(() => {
        const fetchStudentData = async () => {
            const docRef = doc(db, "studentUsers", id);
            const docSnap = await getDoc(docRef);
            // console.log(docSnap.data())
            setStudentData(docSnap.data() as Student | null);
        }

        fetchStudentData()
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

    return (
        <div>
            <div>Name: {studentData?.name}</div>
            <div>GPA: {studentData?.gpa}</div>
            <input onChange={handleFileUpload} type='file' multiple/>
        </div>
    )
}

export default page