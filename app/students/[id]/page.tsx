'use client'

import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebaseConfig";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ref, uploadBytesResumable, uploadBytes  } from "firebase/storage";
import { Student } from "@/lib/types/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Edit, GraduationCap, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function page() {
    // retrieve the student ID from URL and create state to hold student data
    const { id } = useParams<{id: string}>();
    const [student, setStudent] = useState<Student | null>(null);

    // fetch student data from Firestore when the component mounts and set it to state
    useEffect(() => {
        const fetchstudent = async () => {
            const docRef = doc(db, "studentUsers", id);
            const docSnap = await getDoc(docRef);
            // console.log(docSnap.data())
            setStudent(docSnap.data() as Student | null);
        }

        fetchstudent()
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

    if (!student) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg text-muted-foreground">Loading student profile...</p>
            </div>
        );
    }

    return (
        // Page Containers
        <div className="flex min-h-screen flex-col">
            <div className="container flex-1 p-4 md:p-6 space-y-6">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Student Profile</h1>
                    <div className="ml-auto flex items-center gap-2">
                        <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Profile
                        </Button>
                    </div>
                </div>

                {/* Student Details Card */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="md:col-span-1">
                        <CardHeader className="flex flex-row items-center gap-4">
                        <div>
                            <CardTitle className="text-xl">{student?.personalInformation.name}</CardTitle>
                        </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="text-sm font-medium">Contact Information</div>
                            <div className="grid grid-cols-[1fr_2fr] gap-1 text-sm">
                            <div className="text-muted-foreground">Email:</div>
                            <div>{student?.personalInformation.email}</div>
                            <div className="text-muted-foreground">Phone:</div>
                            <div>{student?.personalInformation.phone}</div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <div className="text-sm font-medium">Academic Information</div>
                            <div className="grid grid-cols-[1fr_2fr] gap-1 text-sm">
                            <div className="text-muted-foreground">School:</div>
                            <div>{student?.academicInformation.currentSchool}</div>
                            <div className="text-muted-foreground">Grade:</div>
                            {/* <div>{student?.academicInformation.grade}</div> */}
                            <div className="text-muted-foreground">GPA:</div>
                            <div>{student?.academicInformation.gpa}</div>
                            </div>
                        </div>

                        <Separator />

                        {/* <div className="space-y-2">
                            <div className="text-sm font-medium">Target School</div>
                            <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                            <span>{student.targetSchool}</span>
                            </div>
                        </div> */}

                        <Separator />

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">Application Progress</div>
                            <span className="text-sm">{student?.progress}%</span>
                            </div>
                            <Progress value={student?.progress} className="h-2" />
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <div className="text-sm font-medium">Notes</div>
                            {/* <p className="text-sm text-muted-foreground">{student.notes}</p> */}
                        </div>
                        </CardContent>
                    </Card>

                {/* Main Content Container */}
                <div className="md:col-span-2 space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <div className="text-2xl font-bold">{student.pendingTasks}</div>
                        {/* <p className="text-xs text-muted-foreground">Next due: {student.nextDeadline}</p> */}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
                        </CardHeader>
                        <CardContent>
                        {/* <div className="text-2xl font-bold">{student.completedTasks}</div>
                        <p className="text-xs text-muted-foreground">
                        {Math.round((student.completedTasks / (student.completedTasks + student.pendingTasks)) * 100)}%
                        completion rate
                        </p> */}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Next Deadline</CardTitle>
                        </CardHeader>
                        <CardContent>
                        {/* <div className="text-xl font-bold">{student.nextDeadline}</div> */}
                        <p className="text-xs text-muted-foreground">Stanford Application Essay</p>
                        </CardContent>
                    </Card>
                    </div>

                    <Tabs defaultValue="assignments">
                    <TabsList>
                        <TabsTrigger value="assignments">Assignments</TabsTrigger>
                        <TabsTrigger value="calendar">Calendar</TabsTrigger>
                        <TabsTrigger value="school-info">School Information</TabsTrigger>
                    </TabsList>
                    <TabsContent value="assignments" className="space-y-4">
                        <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Student Assignments</h3>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Assignment
                        </Button>
                        </div>
                        {/* <AssignmentList studentId={student.id} /> */}
                    </TabsContent>
                    <TabsContent value="calendar">
                        <Card>
                        <CardHeader>
                            <CardTitle>Student Calendar</CardTitle>
                            <CardDescription>View and manage deadlines for {student?.personalInformation.name}</CardDescription>
                        </CardHeader>
                        {/* <CardContent>
                            <CalendarView studentId={student.id} />
                            </CardContent> */}
                        </Card>
                    </TabsContent>
                    {/* <TabsContent value="school-info">
                        <SchoolInfo schoolName={student.targetSchool} />
                        </TabsContent> */}
                    </Tabs>
                </div>
            </div>


            {/* Upload files */}
            {/* <input onChange={handleFileUpload} type='file' multiple/> */}
            </div>
        </div>
    )
}

export default page