'use client'

import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth"
import { app, db } from "@/lib/firebaseConfig"
import { setDoc, doc, getDoc } from "firebase/firestore"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation";

import { GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useDispatch } from "react-redux"
import { setUser } from "@/redux/slices/userSlice"

const page = () => {
    // Initialize Firebase Auth instance using the configured app
    let auth = getAuth(app);
    const router = useRouter();
    let googleProvider = new GoogleAuthProvider();
    const dispatch = useDispatch();
    

    // State to manage form input data for email and password
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<{email?: string; password?: string; confirmPassword?: string; firstName?: string; lastName?: string; }>({})


    // Function to validate form inputs and set error messages
    const validateForm = () => {
      const newErrors: { email?: string; password?: string; confirmPassword?: string; firstName?: string; lastName?: string; } = {}


      if (!userData.firstName) {
        newErrors.firstName = 'First name is required'
      }

      if (!userData.lastName) {
        newErrors.lastName = 'Last name is required'
      }

      if (!userData.email) {
        newErrors.email = 'Email is required'
      }

      if (!userData.password) {
        newErrors.password = 'Password is required'
      } else if (userData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters'
      }

      if (!userData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password'
      }
      
      if (userData.password !== userData.confirmPassword) {
        newErrors.password = 'Passwords do not match'
        newErrors.confirmPassword = 'Passwords do not match'
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }


    // Handles form submission for user creation in Firebase Auth
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      // Validate form inputs and set error messages
      const isValid = validateForm()

      // Early exit if validation fails
      if (!isValid) {
        return
      }

      setIsLoading(true)

      try {
        // Firebase function to create a new user with email and password in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password)
        const user = userCredential.user;

        // Create a new document with user's UID in Firestore database
        await setDoc(doc(db, "consultantUsers", user.uid), {
            email: user.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            students: [],
            createdAt: new Date(),
            signInMethod: 'email',
            onboarding: {
              isComplete: false,
              onboardingStep: 0
            }
        })

        // login user
        await signInWithEmailAndPassword(auth, userData.email, userData.password)

        // set user's data after user creation
        dispatch(setUser({
          id: user.uid,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: user.email,
          role: 'consultant'
        }))

        // Call API to set cookie
        await fetch("/api/set-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: 'consultant' }),
        });
        
        // Navigate to dashboard
        router.push('/consultant/dashboard')
        setIsLoading(false)
      } catch (error) {
        console.log('Error creating consultant', (error as Error).message)
        if ((error as Error).message.includes('auth/email-already-in-use')) {
          setErrors({email: 'Email already in use'})
        }
        setIsLoading(false)
      }
    }

    // Handles input changes and updates state accordingly
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const {name, value} = e.target

      setUserData((prevData) => ({
          ...prevData,
          [name]: value,
      }))

      // Clear errors on input change
      setErrors({})
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

    // Handle Google sign-in
    const handleGoogleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      setIsLoading(false)
        
      // Firebase function to sign in with Google
      signInWithPopup(auth, googleProvider)
        .then( async (result) => {
          console.log(result)

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
              console.log('New Google user document created with parsed names:', { firstName, lastName })
          }

          router.push('/dashboard');
          setIsLoading(false)
        })
        .catch((error) => {
          console.group(error.message)
          setIsLoading(false)
        })
    }

  return (

    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2">
        <GraduationCap className="h-6 w-6" />
        <span className="font-bold">EduConsult Pro</span>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">Enter your information to get started</p>
        </div>
            <div className="grid gap-4">
              <Button
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full"
              >
                Continue With Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input name="firstName" onChange={handleInputChange} value={userData.firstName} id="firstName" placeholder="John" disabled={isLoading} className={errors.firstName ? "border-red-500" : ""}/>
                      {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input name="lastName" onChange={handleInputChange} value={userData.lastName} id="lastName" placeholder="Doe" disabled={isLoading} className={errors.lastName ? "border-red-500" : ""}/>
                      {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input name="email" placeholder="name@example.com" type="email" disabled={isLoading} className={errors.email ? 'border-red-500' : ''} onChange={handleInputChange} />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input name="password" placeholder="••••••••" type="password" disabled={isLoading} onChange={handleInputChange} className={errors.password ? "border-red-500" : ""} value={userData.password} />
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input name="confirmPassword" placeholder="••••••••" type="password" disabled={isLoading} className={errors.confirmPassword ? "border-red-500" : ""} onChange={handleInputChange} value={userData.confirmPassword} />
                    {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                  </div>
                  <Button disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </div>
              </form>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline">
                  Sign in
                </Link>
              </div>
            </div>
      </div>
    </div>
  )
}

export default page