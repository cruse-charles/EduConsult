'use client'

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useParams } from "next/navigation";
import { useEffect } from "react";

function page({params} : {params: {id: string}}) {

    const {id} = useParams();

    useEffect(() => {

        const fetchStudentData = async () => {
            const docRef = doc(db, "studentUsers", id);
            const docSnap = await getDoc(docRef);
            console.log(docSnap.data());
        }

        fetchStudentData()
    })



    return (
        <div>Student Page</div>
    )
}

export default page