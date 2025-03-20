'use client'

import { useState } from "react"
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { app, db } from "@/lib/firebaseConfig"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap } from "lucide-react"
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore"

// TODO: Redirect signed in users away from signin/signup pages
const page = () => {
    // Initialize Firebase Auth instance using the configured app and Google Auth provider
    let auth = getAuth(app);
    let googleProvider = new GoogleAuthProvider();
    const router = useRouter();

    // State to manage form input data for email and password
    const [userData, setuserData] = useState({
        email: '',
        password: '',
    })

    const [isLoading, setIsLoading] = useState(false)

    // Handles form submission and user creation in Firebase Auth
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        
        // Firebase function to create a new user with email and password
        signInWithEmailAndPassword(auth, userData.email, userData.password)
            .then((userCredential) => {
                console.log('signed in...', userCredential)
                router.push('/dashboard');
                setIsLoading(false)
            })
            .catch((error) => {
                console.group(error.message)
                setIsLoading(false)
            })
    }

    // Handle Google sign-in
    const handleGoogleSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setIsLoading(false)

        // Firebase function to sign in with Google
        // Firebase function to sign in with Google
        signInWithPopup(auth, googleProvider)
            .then( async (result) => {
                console.log(result)
        
                // Check if this is a new user (first time signing in with Google)
                const user = result.user
                const userDocRef = doc(db, "consultantUsers", user.uid)
                const userDoc = await getDoc(userDocRef)
                        
                // If user document doesn't exist, create it (new user)
                if (!userDoc.exists()) {
                    router.push('/signup')
                } else {
                    router.push('/dashboard');
                }
        
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
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        onChange={handleInputChange}
                        name="password"
                        placeholder="••••••••"
                        type="password"
                        disabled={isLoading}
                    />
                  </div>
                  <Button disabled={isLoading}>{isLoading ? "Signing in..." : "Sign In"}</Button>
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