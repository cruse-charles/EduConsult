'use client'

import { useState } from "react";
import { app, db } from "@/lib/firebaseConfig";
import { collection, addDoc, updateDoc, arrayUnion, DocumentReference, DocumentData } from "firebase/firestore";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "lucide-react";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import PersonalInfoSection from "./PersonalInfoSection";
import AcademicInfoSection from "./AcademicInfoSection";
import GoalsAndNotesSection from "./GoalsAndNotesSection";

interface AddStudentModalProps {
    consultantDocRef: DocumentReference<DocumentData> | null;
    onStudentAdded: () => void;
}

function AddStudentModal({consultantDocRef, onStudentAdded} : AddStudentModalProps) {
    // State to manage dialog open/close state`
    const [open, setOpen] = useState(false);

    // State to manage form input data for student
    const [formData, setFormData] = useState({
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
            grade: '',
            gpa: '',
            sat: '',
            toefl: '',
            targetSchools: '',
        },
        pendingTasks: '',
        progress: '',
        nextDeadline: '',
    });

    // Handles form submission, adds a new student document to Firestore
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Check if consultantDocRef is provided
        if (!consultantDocRef) {
            console.error("Consultant is not provided.");
            return;
        }

        // Create a new student document in the "studentUsers" collection
        try {
            const docRef = await addDoc(collection(db, "studentUsers"), {
                personalInformation: formData.personalInformation,
                academicInformation: formData.academicInformation,
                pendingTasks: formData.pendingTasks,
                progress: formData.progress,
                nextDeadline: formData.nextDeadline,
                consultant: consultantDocRef,
            })

            // Update the consultant's document to include the new student
            await updateDoc(consultantDocRef, {
                students: arrayUnion(docRef)
            })

            // Callback to refresh student list or perform any other action after adding a student
            onStudentAdded();
            
            // Close the dialog after submission
            setOpen(false);

            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.error("Error adding document: ", error);
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                    <User className="mr-2 h-4 w-4" />
                    Add New Student
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
                    <PersonalInfoSection formData={formData} handlePersonalInfoChange={handlePersonalInfoChange} />
                    <AcademicInfoSection formData={formData} handleAcademicInfoChange={handleAcademicInfoChange} />
                    <GoalsAndNotesSection formData={formData} handlePersonalInfoChange={handlePersonalInfoChange} handleAcademicInfoChange={handleAcademicInfoChange} />
                    <Button type='submit'>Submit</Button>
                </form>
            </DialogContent>
      </Dialog>
    )
}

export default AddStudentModal