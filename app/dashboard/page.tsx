'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import { getDoc, doc, DocumentReference, DocumentData } from "firebase/firestore";
import { db, app } from "@/lib/firebaseConfig";
import { User as FirebaseUser } from "firebase/auth";

import { FirebaseUserInfo, Student } from "@/lib/types/types";
import { useConsultant } from "@/hooks/useConsultant";

import AppSidebar from "../components/AppSidebar";
import AddStudentModal from "./AddStudentModal/AddStudentModal";
import StudentCard from "../components/StudentCard";
import Highlights from "../components/Highlights";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import StudentTable from "./StudentTable/StudentTable";
import ConsultantCalendar from "../components/ConsultantCalendar";
import DashboardAssignmentList from "./DashboardAssignmentList/DashboardAssignmentList";




const page = () => {
    // State to manage students and set reference to the consultant document
    const [students, setStudents] = useState<Student[]>([]);
    const [consultantDocRef, setConsultantDocRef] = useState<DocumentReference<DocumentData> | null>(null);

    // const role = useSelector((state: RootState) => state.user.role)
    const user = useSelector((state: RootState) => state.user);

    // Function to fetch students for the current consultant user
    // const fetchStudents = async (user: FirebaseUser) => {
    const fetchStudents = async (user: FirebaseUserInfo) => {
        try {
            // Get the consultant's document reference and snapshot
            // console.log('fetching students.....')
            const ref = doc(db, "consultantUsers", user.id);
            // console.log("Consultant Document Reference:", ref);
            setConsultantDocRef(ref);
            const consultantDocSnap = await getDoc(ref);
            // console.log("Consultant Document Snapshot:", consultantDocSnap);
            // console.log("Consultant Document Data:", consultantDocSnap.data());

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

    // OLD
    // // 1. Listen for auth state changes and set user, grabbing currentUser isn't always reliable on initial render
    // const currentUser = useConsultant();
    

    // // 2. Fetch students when user is available
    // useEffect(() => {
    //     if (currentUser) fetchStudents(currentUser);
    // }, [currentUser]);

    // const handleStudentAdded = () => {
    //     if (currentUser) fetchStudents(currentUser);
    // }
    // OLD

    // NEW
    // 1. Listen for auth state changes and set user, grabbing currentUser isn't always reliable on initial render
    // const currentUser = useConsultant();
    

    // 2. Fetch students when user is available
    useEffect(() => {
        if (user) fetchStudents(user as FirebaseUserInfo);
    }, [user]);

    const handleStudentAdded = () => {
        if (user) fetchStudents(user as FirebaseUserInfo);
    }
    // NEW
    
    return (
        <div className="flex min-h-screen">
            {/* Sidebar Container */}
            {/* <AppSidebar /> */}
    
            {/* Main Content Container */}
            <div className="container p-4 md:p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Dashboard</h1>
                        <div className="flex items-center gap-2">
                             <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                type="search"
                                placeholder="Search students..."
                                className="w-[200px] md:w-[260px] pl-8"
                                // value={searchQuery}
                                // onChange={(e) => setSearchQuery(e.target.value)}
                                />
                             </div>
                        {/* Add Student Container */}
                        <AddStudentModal consultantDocRef={consultantDocRef} onStudentAdded={handleStudentAdded}/>
                        </div>
                    </div>

                    {/* Highlights */}
                    <Highlights />

    
                    {/* Tabs Container */}
                    {/* TODO: Export to another component and use Redux to fetch students needed */}
                    <div className="">
                        <Tabs defaultValue="students">
                            <TabsList>
                            <TabsTrigger value="students">Students</TabsTrigger>
                            <TabsTrigger value="calendar">Calendar</TabsTrigger>
                            {/* <TabsTrigger value="deadlines">Upcoming Deadlines</TabsTrigger> */}
                            </TabsList>
                            <TabsContent value="students" className="space-y-4">
                                <StudentTable students={students}/>
                            </TabsContent>
                            <TabsContent value="calendar" className="space-y-4">
                                {/* <ConsultantCalendar /> */}
                                <DashboardAssignmentList />
                            </TabsContent>
                        </Tabs>
                    </div>
            </div>
        </div>
    );
};

export default page;