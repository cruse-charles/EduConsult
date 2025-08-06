'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

import { FirebaseUserInfo } from "@/lib/types/types";

import AddStudentModal from "./AddStudentModal/AddStudentModal";
import Highlights from "../../components/Highlights/Highlights";
import StudentTable from "./StudentTable";
import DashboardAssignmentList from "./DashboardAssignmentList";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchStudents } from "@/redux/slices/studentsSlice";
import { setUser, fetchUser } from "@/redux/slices/userSlice";
import { setOnboardingState } from "@/redux/slices/onboardingSlice";

const page = () => {
    const dispatch = useDispatch();
    
    // State to manage students and set reference to the consultant document
    const [searchQuery, setSearchQuery] = useState("")
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false)

    // Retrieve state variables
    const userId = useSelector((state: RootState) => state.user.id);
    const students = useSelector((state: RootState) => state.students.studentList)

    // Function to retreive consultant info
    const getUserInfo = async (userId: string): Promise<FirebaseUserInfo> => {
        try {
            const consultantDoc = await getDoc(doc(db, "consultantUsers", userId))
            if (consultantDoc.exists()) {
                const data = consultantDoc.data()
                return {id: consultantDoc.id, firstName: data.firstName, lastName: data.lastName, email: data.email, role: 'consultant', onboarding: data.onboarding}
            }
                
            throw new Error("User not found")
                
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    // useEffect(() => {
    //     const fetchUserData = async () => {
    //         if (!userId) return;

    //         try {
    //             const user = await getUserInfo(userId);

    //             // Add user info to Redux
    //             dispatch(setUser({
    //                 id: user.id,
    //                 firstName: user.firstName,
    //                 lastName: user.lastName,
    //                 email: user.email,
    //                 role: user.role,
    //             }));

    //             dispatch(setOnboardingState({
    //                 isComplete: user.onboarding.isComplete,
    //                 onboardingStep: user.onboarding.onboardingStep,
    //             }));

    //             // Fetch students if consultant
    //             if (user.role === "consultant") {
    //                 // @ts-ignore
    //                 dispatch(fetchStudents(user));
    //             }
    //         } catch (error) {
    //             console.error("Failed to fetch user info:", error);
    //         }
    //     };

    //     fetchUserData();
    // }, [userId, dispatch]);

    useEffect(() => {
        dispatch(fetchUser({ userId: userId, database: "consultantUsers" }));
    }, [userId])

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
                            <AddStudentModal/>
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
                                <StudentTable />
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