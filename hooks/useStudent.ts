import { db } from "@/lib/firebaseConfig";
import { Student } from "@/lib/types/types";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useStudent = (id) => {
    const [student, setStudent] = useState<Student | null>(null);

    useEffect(() => {
        const fetchstudent = async () => {
            const docRef = doc(db, "studentUsers", id);
            const docSnap = await getDoc(docRef);
            // console.log(docSnap.data())
            setStudent({id: docSnap.id, ...docSnap.data()} as Student | null);
        }
        fetchstudent()
    }, [])

    return student
}