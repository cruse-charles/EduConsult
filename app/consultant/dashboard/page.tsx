'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import { getDoc, doc, DocumentReference, DocumentData } from "firebase/firestore";
import { db,  } from "@/lib/firebaseConfig";

import { FirebaseUserInfo, Student } from "@/lib/types/types";

import AddStudentModal from "./AddStudentModal/AddStudentModal";
import Highlights from "../../components/Highlights";
import StudentTable from "./StudentList";
import DashboardAssignmentList from "./DashboardAssignmentList";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchStudents } from "@/redux/slices/studentsSlice";
import { AsyncThunkAction, AsyncThunkConfig } from "@reduxjs/toolkit";

const page = () => {
    // State to manage students and set reference to the consultant document
    // const [students, setStudents] = useState<Student[]>([]);
    const [consultantDocRef, setConsultantDocRef] = useState<DocumentReference<DocumentData> | null>(null);
    const [searchQuery, setSearchQuery] = useState("")
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false)

    const user = useSelector((state: RootState) => state.user);
    const students = useSelector((state: RootState) => state.students)
    const dispatch = useDispatch();

    // // Function to fetch students for the current consultant user
    // const fetchStudents = async (user: FirebaseUserInfo) => {
    //     setLoading(true)
    //     try {
    //         // Get the consultant's document reference and snapshot
    //         const ref = doc(db, "consultantUsers", user.id);
    //         console.log('ref for fetching consultant doc', ref)

    //         setConsultantDocRef(ref);
    //         const consultantDocSnap = await getDoc(ref);

    //         // If the consultant document does not exist, set students to an empty array
    //         if (!consultantDocSnap.exists()) {
    //             setStudents([]);
    //             return;
    //         }

    //         // Extract student references from the consultant document
    //         const consultantData = consultantDocSnap.data();
    //         const studentRefs = consultantData.students || [];

    //         // Fetch each student's document data
    //         const studentDocs = await Promise.all(
    //             studentRefs.map(async (studentRef: DocumentReference<DocumentData>) => {
    //                 const studentDocSnap = await getDoc(studentRef);
    //                 return studentDocSnap.exists()
    //                     ? { id: studentDocSnap.id, ...studentDocSnap.data() }
    //                     : null;
    //             })
    //         );

    //         // Filter out any null values due to possible deleted students or missing data
    //         setStudents(studentDocs.filter(Boolean));
    //         setLoading(false)
    //     } catch (error) {
    //         console.log("Error fetching students:", error);
    //         setStudents([]);
    //         setLoading(false)
    //     }
    // };



    // // TODO: We shouldn't be fetching students again, just adding to localstate/redux on submissions
    // // Fetch students when user is available
    // useEffect(() => {
    //     if (user && user.id) fetchStudents(user as FirebaseUserInfo);
    // }, [user]);

    // // TODO: Add students to local state/redux instead of re-fetching
    // const handleStudentAdded = () => {
    //     if (user) fetchStudents(user as FirebaseUserInfo);
    // }

    useEffect(() => {
        if (user && user.id) {
            dispatch(fetchStudents(user));
        }
    }, [user, dispatch]);

    const filteredStudents = students.filter((student) => 
        `${student.personalInformation.firstName} ${student.personalInformation.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    return (
        <div className="flex min-h-screen">

            {/* Main Content Container */}
            <div className="container p-4 md:p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold welcome-dashboard">Dashboard</h1>
                        <div className="flex items-center gap-2">

                            {/* Search Bar */}
                             <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search students..."
                                    className="w-[200px] md:w-[260px] pl-8"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setShowDropdown(e.target.value.length > 0)
                                        setSearchQuery(e.target.value)
                                    }}
                                />
                                {showDropdown && filteredStudents.length > 0 && (
                                    <div className="absolute z-10 left-0 mt-2 w-full bg-white border rounded shadow">
                                    {filteredStudents.map(student => (
                                        <div key={student.id} className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                            onMouseDown={() => {
                                                window.location.href = `/students/${student.id}`;
                                            }}
                                        >
                                            {student.personalInformation.firstName} {student.personalInformation.lastName}
                                        </div>
                                    ))}
                                    </div>
                                )}
                             </div>

                        {/* Add Student Container */}
                        {/* <AddStudentModal consultantDocRef={consultantDocRef} onStudentAdded={handleStudentAdded}/> */}
                        <AddStudentModal consultantDocRef={consultantDocRef}/>
                        </div>
                    </div>

                    {/* Highlights */}
                    <Highlights />

    
                    {/* Tabs Container */}
                    <div className="">
                        <Tabs defaultValue="students">
                            <TabsList>
                                <TabsTrigger value="students">Students</TabsTrigger>
                                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                            </TabsList>
                            <TabsContent value="students" className="space-y-4">
                                <StudentTable students={students} loading={loading}/>
                            </TabsContent>
                            <TabsContent value="calendar" className="space-y-4">
                                <DashboardAssignmentList />
                            </TabsContent>
                        </Tabs>
                    </div>
            </div>
        </div>
    );
};

export default page;

function dispatch(arg0: AsyncThunkAction<any[] | undefined, FirebaseUserInfo, AsyncThunkConfig>) {
    throw new Error("Function not implemented.");
}
