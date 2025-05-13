import React from 'react'
import GuestGuard from '../components/GuestGuard'

const layout = ({children}: {children: React.ReactNode}) => {
    return (
        // <GuestGuard>
        <>
            {children}
        </>
        // {/* </GuestGuard> */}
    )
}

export default layout