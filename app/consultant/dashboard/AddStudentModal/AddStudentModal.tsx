'use client'

import { DocumentReference, DocumentData, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { useState } from "react";

import { app } from "@/lib/firebaseConfig";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, User } from "lucide-react";
import { toast } from "sonner";

import CustomToast from "@/app/components/CustomToast";
import PersonalInfoSection from "./PersonalInfoSection";
import AcademicInfoSection from "./AcademicInfoSection";
import GoalsAndNotesSection from "./GoalsAndNotesSection";
import CreateStudentAccount from "./CreateStudentAccount";

import { StudentFormData } from "@/lib/types/types";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { completeStep } from "@/redux/slices/onboardingSlice";
import { nextStep } from "@/lib/onBoardingUtils";

interface AddStudentModalProps {
    consultantDocRef: DocumentReference<DocumentData> | null;
    onStudentAdded: () => void;
}

// TODO: Added students should be in redux, don't need to call again I guess but idk really if I want to do
    // that in the dashboard
function AddStudentModal({consultantDocRef, onStudentAdded} : AddStudentModalProps) {
    let auth = getAuth(app);
    const dispatch = useDispatch()
    const {isComplete, onboardingStep } = useSelector((state: RootState) => state.onboarding)
    const user = useSelector((state: RootState) => state.user)
    
    // State to manage dialog open/close state
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // State to manage form input data for student
    const [formData, setFormData] = useState<StudentFormData>({
        personalInformation: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            other: '',
            notes: '',
        },
        academicInformation: {
            currentSchool: '',
            grade: null,
            gpa: null,
            sat: null,
            toefl: null,
            targetSchools: '',
        },
        stats: {
            inProgressAssignmentsCount: 0,
            nextDeadline: undefined,
        },
        email: '',
        password: '',
        consultant: null,
        folders: []
    });

    const resetFormData = () => {
        setFormData({
        personalInformation: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            other: '',
            notes: '',
        },
        academicInformation: {
            currentSchool: '',
            grade: null,
            gpa: null,
            sat: null,
            toefl: null,
            targetSchools: '',
        },
        stats: {
            inProgressAssignmentsCount: 0,
            nextDeadline: undefined,
        },
        email: '',
        password: '',
        consultant: null,
        folders: []
        })
    }

    // Handles form submission, adds a new student document to Firestore
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        // Check if consultantDocRef is provided
        if (!consultantDocRef) {
            console.error("Consultant is not provided.");
            return;
        }

        const consultantSnap = await getDoc(consultantDocRef)
        const consultantData = consultantSnap.data();

        // TODO: Export the update/set doc stuff to studentUtils file
        // Create a new student document in the "studentUsers" collection
        try {
            const idToken = await auth.currentUser?.getIdToken(true); // current consultant’s token

            const res = await fetch("/api/create-student", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    personalInformation: formData.personalInformation,
                    academicInformation: formData.academicInformation,
                    folders: formData.folders,
                    consultantId: user.id,
                    onboarding: {
                        isComplete: false,
                        onboardingStep: 0
                    }
                }),
            });
            
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to create student");
            
            // Callback to refresh student list or perform any other action after adding a student
            onStudentAdded();
            
            // Close the dialog after submission
            setOpen(false);
            resetFormData()
            setIsLoading(false);

            // Proceed to next step for tooltip and update backend
            if (!isComplete) {
                dispatch(completeStep("studentCreated"))
                await nextStep(user.id)
            }
            
            // Success Message
            toast(<CustomToast title="Student Account Created" description="" status="success"/>)

        } catch (error) {
            setIsLoading(false)
            console.log('error creating student', error)
            toast(<CustomToast title="Student Account Not Created" description={`${error}`} status="error"/>)
        }
    }

    // Handles changes in personal information fields
    const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            personalInformation: {
                ...prevData.personalInformation,
                [name]: value,
            }
        }))
    }

    // Handles changes in academic information fields
    const handleAcademicInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            academicInformation: {
                ...prevData.academicInformation,
                [name]: value,
            }
        }))
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))

        if (name === 'email') {
            setFormData((prev) => ({
                ...prev,
                personalInformation: {
                    ...prev.personalInformation,
                    email: value
                }
            }))
        }
    }

    // TODO: Add loading state and error handling for form submission
    return (
        <Dialog open={open} onOpenChange={(isOpen)=> {setOpen(isOpen); resetFormData();}}>
            <DialogTrigger asChild>
                {/* <Button variant="default" className="w-full"> */}
                <Button variant="default" className="w-full create-student-btn">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Student
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Add New Student
                    </DialogTitle>
                    <DialogDescription>
                        Fill out the student information below. All fields marked with * are required.
                    </DialogDescription>
                </DialogHeader>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <CreateStudentAccount formData={formData} handleInputChange={handleInputChange}/>
                    <PersonalInfoSection formData={formData} handlePersonalInfoChange={handlePersonalInfoChange} />
                    <AcademicInfoSection formData={formData} handleAcademicInfoChange={handleAcademicInfoChange} />
                    <GoalsAndNotesSection formData={formData} handlePersonalInfoChange={handlePersonalInfoChange} handleAcademicInfoChange={handleAcademicInfoChange} />
                    <Button type='submit' disabled={isLoading}>Submit</Button>
                </form>
            </DialogContent>
      </Dialog>
    )
}

export default AddStudentModal