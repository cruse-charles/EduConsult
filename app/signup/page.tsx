'use client'

import { useState } from "react"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { app, db } from "@/lib/firebaseConfig"
import { setDoc, collection, doc } from "firebase/firestore"

const page = () => {
    // Initialize Firebase Auth instance using the configured app
    let auth = getAuth(app);

    // State to manage form input data for email and password
    const [userData, setuserData] = useState({
        email: '',
        password: '',
    })

    // Handles form submission and user creation in Firebase Auth
    // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault()
        
    //     // Firebase function to create a new user with email and password
    //     createUserWithEmailAndPassword(auth, userData.email, userData.password)
    //         .then((userCredential) => {
    //             console.log(userCredential)
    //         })
    //         .catch((error) => {
    //             console.group(error.message)
    //         })
    // }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            // Firebase function to create a new user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password)
            const user = userCredential.user;
            await setDoc(doc(db, "consultantUsers", user.uid), {
                email: user.email,
                students: [],
            })
            console.log('Consultant Created')
        } catch (error) {
            console.log('Error creating consultant', error.message)
        }
            
    }


    // Handles input changes and updates state accordingly
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target

        setuserData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

  return (
    // Form that triggers handleSubmit on submit
    <form onSubmit={handleSubmit}>
        <input onChange={handleInputChange} value={userData.email} name='email' placeholder='email' className='border border-black'/>
        <input onChange={handleInputChange} value={userData.password} name='password' placeholder='password' className='border border-black'/>
        <button type='submit' className='border border-black'>Sign up</button>
    </form>
  )
}

export default page