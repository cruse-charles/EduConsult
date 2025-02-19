'use client'

import { useState } from "react";
import { app, db } from "@/lib/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";


function AddStudentModal() {
    // State to manage form input data for student
    const [formData, setformData] = useState({
        name: '',
    })

    // Handles form submission and adds a new student document to Firestore
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const docRef = await addDoc(collection(db, "studentUsers"), {
                name: formData.name,
            })
            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }

    // Handles input changes and updates state accordingly
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setformData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    return (
        <form onSubmit={handleSubmit}>
            <input onChange={e => handleChange(e)} placeholder='name' name='name' value={formData.name}/>
            <button type='submit'>Submit</button>
        </form>
    )
}

export default AddStudentModal