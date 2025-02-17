'use client'

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import Sidebar from "../components/Sidebar";
import AddStudentModal from "../components/AddStudentModal";

const page = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const querySanpshot = await getDocs(collection(db, "studentUsers"))
                const data = querySanpshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }))

                setStudents(data);
            } catch (error) {
                console.log("Error fetching students:", error);
            }
        }

        fetchStudents();
    }, [students])

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-white">
        <h1>Students</h1>
        <ul>
          {students.map((student) => (
            <li key={student.id}>{student.name}</li>
          ))}
        </ul>
      </div>
      <AddStudentModal />
    </div>
  );
};

export default page;
