'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import CreateStudentModal from "./CreateStudentModal/CreateStudentModal";
import Highlights from "../../components/Highlights/Highlights";
import StudentTable from "./StudentTable/StudentTable";
import DashboardAssignmentList from "./DashboardAssignmentList";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUser } from "@/redux/slices/userSlice";
import { fetchStudents } from "@/redux/slices/studentsSlice";


const page = () => {
    const dispatch = useDispatch<AppDispatch>();
    
    // State to manage students and set reference to the consultant document
    const [searchQuery, setSearchQuery] = useState("")
    const [showDropdown, setShowDropdown] = useState(false);

    // Retrieve state variables
    const userId = useSelector((state: RootState) => state.user.id);
    const students = useSelector((state: RootState) => state.students.studentList)

    // Fetch user and user's student info
    useEffect(() => {
        if (userId) {
            dispatch(fetchUser({ userId: userId, database: "consultantUsers" }));
            dispatch(fetchStudents(userId))
        } 

        console.log('USERID - ', userId)
    }, [userId])

    useEffect(() => {
        console.log('STUDENTS - ', students)
    }, [students])

    // const filteredStudents = students.filter((student) => 
    //     `${student.personalInformation.firstName} ${student.personalInformation.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    // )
    const filteredStudents = (students ?? []).filter((student) => 
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
                            <CreateStudentModal/>
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