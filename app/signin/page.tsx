'use client'

import { useState } from "react"
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { app } from "@/lib/firebaseConfig"

const page = () => {
    // Initialize Firebase Auth instance using the configured app and Google Auth provider
    let auth = getAuth(app);
    let googleProvider = new GoogleAuthProvider();

    // State to manage form input data for email and password
    const [userData, setuserData] = useState({
        email: '',
        password: '',
    })

    // Handles form submission and user creation in Firebase Auth
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        // Firebase function to create a new user with email and password
        signInWithEmailAndPassword(auth, userData.email, userData.password)
            .then((userCredential) => {
                console.log(userCredential)
            })
            .catch((error) => {
                console.group(error.message)
            })
    }

    // Handle Google sign-in
    const handleGoogleSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        
        // Firebase function to sign in with Google
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                console.log(result)
            })
            .catch((error) => {
                console.group(error.message)
            })
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
        <button type='submit' className='border border-black'>Sign in</button>
        <button className='border border-black' onClick={handleGoogleSignIn}>Google</button>
    </form>
  )
}

export default page