'use client'

import { useState } from "react"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { app } from "@/lib/firebaseConfig"

const page = () => {
    // Initialize Firebase Auth instance using the configured app
    let auth = getAuth(app);

    // State to manage form input data for email and password
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    })

    // Handles form submission and user creation in Firebase Auth
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        // Firebase function to create a new user with email and password
        createUserWithEmailAndPassword(auth, loginData.email, loginData.password)
            .then((userCredential) => {
                console.log(userCredential)
            })
            .catch((error) => {
                console.group(error.message)
            })
    }

    // Handles input changes and updates state accordingly
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target

        setLoginData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

  return (
    // Form that triggers handleSubmit on submit
    <form onSubmit={handleSubmit}>
        <input onChange={handleInputChange} value={loginData.email} name='email' placeholder='email' className='border border-black'/>
        <input onChange={handleInputChange} value={loginData.password} name='password' placeholder='password' className='border border-black'/>
        <button type='submit' className='border border-black'>Login</button>
    </form>
  )
}

export default page