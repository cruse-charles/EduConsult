import React from 'react'
import AuthGuard from '../components/AuthGuard'

const layout = ({children}: {children: React.ReactNode}) => {
    return (
        <AuthGuard>
            {children}
        </AuthGuard>
    )
}

export default layout