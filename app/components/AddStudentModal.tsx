'use client'

import { useState } from "react";
import { app, db } from "@/lib/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "lucide-react";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";



function AddStudentModal() {
    // State to manage form input data for student
    const [formData, setFormData] = useState({
        personalInformation: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            wechat: '',
        },
        academicInformation: {
            currentSchool: '',
            grade: '',
            gpa: '',
            sat: '',
            toefl: '',
        },
        pendingTasks: '',
        progress: '',
        nextDeadline: '',
        notes: '',
        targetSchools: '',
    });

    // Handles form submission and adds a new student document to Firestore
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const docRef = await addDoc(collection(db, "studentUsers"), {
                personalInformation: formData.personalInformation,
                academicInformation: formData.academicInformation,
                pendingTasks: formData.pendingTasks,
                progress: formData.progress,
                nextDeadline: formData.nextDeadline,
                notes: formData.notes
            })
            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }

    // Handles input changes and updates state accordingly
    // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //     const {name, value} = e.target
    //     setFormData((prevData) => ({
    //         ...prevData,
    //         [name]: value,
    //     }))
    // }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            personalInformation: {
                ...prevData.personalInformation,
                [name]: value,
            }
        }))
    }

    return (
        <Dialog>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                            <Input id="firstName" placeholder="Enter first name" value={formData.personalInformation.firstName} name="firstName" onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                            <Input id="lastName" placeholder="Enter last name" value={formData.personalInformation.lastName} name="lastName" onChange={handleInputChange} required />
                        </div>
                    </div>
                    <Button type='submit'>Submit</Button>
                </form>
            </DialogContent>
      </Dialog>
    )
}

export default AddStudentModal