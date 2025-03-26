import { app } from '@/lib/firebaseConfig'
import { resetStore } from '@/redux/slices/resetSlice'
import { getAuth, signOut } from 'firebase/auth'
import Link from 'next/link'
import { useDispatch } from 'react-redux'

const Sidebar = () => {
    const auth = getAuth(app)
    const dispatch = useDispatch()
    
    // Handle user sign out
    const handleSignOut = async () => {
        try {
            await signOut(auth)
            dispatch(resetStore())
            console.log("User signed out successfully");
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    }

  return (
    <div className="w-64 border-r">
        <div className="flex h-14 border-b px-4">
        <Link href="/" className="flex items-center font-semibold">
            EduConsult
        </Link>
        </div>
        <nav className="p-4">
            <div className="grid gap-1">
                <Link href="/dashboard">
                <button className="w-full justify-start gap-2">
                    Dashboard
                </button>
                </Link>
                <Link href="/dashboard/students">
                <button className="w-full justify-start gap-2">
                    Students
                </button>
                </Link>
                <Link href="/dashboard/assignments">
                <button className="w-full justify-start gap-2">
                    Assignments
                </button>
                </Link>
                <Link href="/dashboard/calendar">
                <button className="w-full justify-start gap-2">
                    Calendar
                </button>
                </Link>
                <Link href="/dashboard/schools">
                <button className="w-full justify-start gap-2">
                    Schools
                </button>
                </Link>
                <Link href="/dashboard/settings">
                <button className="w-full justify-start gap-2">
                    Settings
                </button>
                </Link>
                <Link href="/">
                <button onClick={handleSignOut} className="w-full justify-start gap-2">
                    Logout
                </button>
                </Link>
            </div>
        </nav>
    </div>
  )
}

export default Sidebar