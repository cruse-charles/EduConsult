import { CheckCircle, XCircle } from 'lucide-react'
import React from 'react'

const CustomToast = ({title, description, status}: {title: string; description: string; status: string}) => {
    
    if (status === 'success') {
        return (
            <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                <div>
                    <p className="font-medium">{title}</p>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
            </div>
        )
    }

    if (status === 'error') {
        return (
            <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-500 mt-1" />
                <div>
                    <p className="font-medium">{title}</p>
                    {description && <p className="text-sm text-muted-foreground">{descriptionCheck(description)}</p>}
                </div>
            </div>
        )
    }
}

const descriptionCheck = (description: string) => {
    if ((description).includes('auth/email-already-in-use')) {
        return 'Email already in use'
    } else if ((description).includes('6')) {
        return 'Password should be at least 6 characters long.'
    } else {
        return description
    }
}

export default CustomToast