'use client'

import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

import { useRouter } from "next/navigation";
import { useEffect } from "react"



const AuthGuard = ({children}: {children: React.ReactNode}) => {
    const user = useSelector((state: RootState) => state.user);
    const router = useRouter();

    useEffect(() => {
        if (!user.id) {
            router.push('/signin');
        }
    }, [user])

    return (
        <div>{children}</div>
    )
}

export default AuthGuard