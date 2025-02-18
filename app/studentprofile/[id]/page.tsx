'use client'

import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebaseConfig";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ref, uploadBytesResumable, uploadBytes  } from "firebase/storage";

function page({params} : {params: {id: string}}) {

    const {id} = useParams();
    const [studentData, setStudentData] = useState(null);


    useEffect(() => {

        const fetchStudentData = async () => {
            const docRef = doc(db, "studentUsers", id);
            const docSnap = await getDoc(docRef);
            // console.log(docSnap.data())
            setStudentData(docSnap.data())
        }

        fetchStudentData()
    })

    // TODO: add monitor uploading process, use these links: 
        // https://firebase.google.com/docs/storage/web/upload-files
        // https://www.youtube.com/watch?v=fgdpvwEWJ9M start at around 30:00

    const handleFileUpload = (event) => {
        const files = event?.target.files
        console.log(files);

        Array.from(files).forEach((file) => {
            const storageRef = ref(storage, `${file.name}`);
            uploadBytes(storageRef, file).then((snapshot) => {
                console.log('Uploaded a blob or file!');
            });
        })
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