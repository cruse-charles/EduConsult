'use client'

import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

import { useRouter } from "next/navigation";
import { useEffect } from "react"


// TODO: Use redirect() to redirect without any flash, need to research how
const GuestGuard = ({children}: {children: React.ReactNode}) => {
    const user = useSelector((state: RootState) => state.user);
    const router = useRouter();

    const isCheckingAuth = user.id

    useEffect(() => {
        if (isCheckingAuth) {
            router.push('/dashboard');
        }
    }, [user, isCheckingAuth])

    if (isCheckingAuth) {
        return null;
    }

    return (
        <>{children}</>
    )
}

export default GuestGuard