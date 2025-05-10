'use client'

import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { app, db } from "@/lib/firebaseConfig"
import { doc, getDoc, setDoc } from "firebase/firestore"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap } from "lucide-react"
import { useDispatch } from "react-redux"
import { setUser } from "@/redux/slices/userSlice"
import { fetchStudent } from "@/redux/slices/studentSlice"

import { FirebaseUserInfo } from "@/lib/types/types"
import { AppDispatch } from "@/redux/store"

// TODO: Redirect signed in users away from signin/signup pages
const page = () => {
    // Initialize Firebase Auth instance, Google Auth provider, and router
    let auth = getAuth(app);
    let googleProvider = new GoogleAuthProvider();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    // State to manage form input data for email and password, loading state, and errors
    const [userData, setuserData] = useState({
        email: '',
        password: '',
    })
    const [errors, setErrors] = useState<{email?: string; password?: string}>({})
    const [isLoading, setIsLoading] = useState(false)

    // Function to validate form inputs and set error messages
    const validateForm = () => {
      const newErrors: { email?: string; password?: string } = {}

      if (!userData.email) {
        newErrors.email = 'Email is required'
      }

      if (!userData.password) {
        newErrors.password = 'Password is required'
      }
      
      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }

    // Handles form submission and user creation in Firebase Auth
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        validateForm()

        if (!validateForm()) {
          setIsLoading(false)
          return
        }

        try {
          // Sign in and get user crednetials
          const userCredential = await signInWithEmailAndPassword(auth, userData.email, userData.password)

          // Retrieve user info
          const user = await getUserInfo(userCredential.user.uid);

          // Add user info to Redux state
          dispatch(setUser({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
          }))
          
          // If the user is a student then set their data in student slice and redirect to student profile
          if (user.role === 'student') {
            dispatch(fetchStudent(user.id))
            // router.push(`/students/${user.id}`)
            router.push(`/student/dashboard`)
          } else {
            // Navigate to dashboard
            // router.push('/dashboard')
            router.push('/consultant/dashboard')
          }

          // Call API to set cookie
          await fetch("/api/set-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: user.role }),
          });


        } catch (error) {
          // Set errors if login fails
          setErrors({email: 'Invalid email or password', password: 'Invalid email or password' })
        } finally {
          setIsLoading(false)
        }
    }

    // Function to parse display name into first and last name for users from Google sign-in
    const parseDisplayName = (displayName: string | null) => {
      if (!displayName) {
        return { firstName: '', lastName: '' }
      }
        
      const nameParts = displayName.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''
        
      return { firstName, lastName }
    }

    // Retrieve user's info
    const getUserInfo = async (userId: string): Promise<FirebaseUserInfo> => {
      try {
        // Check if id is for a consultant
        const consultantDoc = await getDoc(doc(db, "consultantUsers", userId))
        if (consultantDoc.exists()) {
          const data = consultantDoc.data()
          return {id: consultantDoc.id, firstName: data.firstName, lastName: data.lastName, email: data.email, role: 'consultant'}
        }

        // Check if id is for a student
        const studentDoc = await getDoc(doc(db, "studentUsers", userId))
        if (studentDoc.exists()) {
          const data = studentDoc.data()
          return {id: studentDoc.id, firstName: data.personalInformation.firstName, lastName: data.personalInformation.lastName, email: data.email, role: 'student'}
        }

        throw new Error("User not found")
      } catch (error) {
        console.log(error)
        throw error
      }
    }

    // TODO: Think this is copy-pasted with signup for googleSignIn, so export it
    // TODO: Double check the id stuff with google sign ins
    // Handle Google sign-in
    const handleGoogleSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setIsLoading(false)

        // Firebase function to sign in with Google
        signInWithPopup(auth, googleProvider)
          .then( async (result) => {
        
            // Check if this is a new user (first time signing in with Google)
            const user = result.user
            const userDocRef = doc(db, "consultantUsers", user.uid)
            const userDoc = await getDoc(userDocRef)

            // Parse the display name into first and last name
            const { firstName, lastName } = parseDisplayName(user.displayName)
                        
            // If user document doesn't exist, create it (new user)
            if (!userDoc.exists()) {
                await setDoc(userDocRef, {
                    email: user.email,
                    firstName: firstName,
                    lastName: lastName,
                    photoURL: user.photoURL,
                    students: [],
                    createdAt: new Date(),
                    signInMethod: 'google'
                })
            }

            const userInfo = await getUserInfo(user.uid);

            // Add user info to Redux state
            dispatch(setUser({
              id: userInfo.id,
              firstName: userInfo.firstName,
              lastName: userInfo.lastName,
              email: userInfo.email,
              role: userInfo.role
            }))

            // If the user is a student then set their data in Redux
            if (userInfo.role === 'student') {
              dispatch(fetchStudent(userInfo.id))
            }
                
            // Redirect to dashboard after successful sign-in
            router.push('/dashboard');
            setIsLoading(false)
          })
          .catch((error) => {
              console.group(error.message)
              setIsLoading(false)
          })
    }

    // Handles input changes and updates state accordingly
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target

        setuserData((prevData) => ({
            ...prevData,
            [name]: value,
        }))

        // Clear errors on input change
        setErrors({})
    }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2">
        <GraduationCap className="h-6 w-6" />
        <span className="font-bold">EduConsult Pro</span>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
        </div>
            <div className="grid gap-4">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        onChange={handleInputChange}
                        name="email"
                        placeholder="name@example.com"
                        type="email"
                        disabled={isLoading}
                        className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        onChange={handleInputChange}
                        name="password"
                        placeholder="••••••••"
                        type="password"
                        disabled={isLoading}
                        className={errors.password ? "border-red-500" : ""}
                    />
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                  </div>
                  <Button disabled={isLoading}>{isLoading ? "Logging in..." : "Login"}</Button>
                  <Button onClick={handleGoogleSignIn} variant='outline'>Continue With Google</Button>
                </div>
              </form>
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link href="/signup" className="underline">
                  Sign up
                </Link>
              </div>
            </div>
      </div>
    </div>
  )
}

export default page