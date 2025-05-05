'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RootState } from '@/redux/store'
import { useState } from 'react'
import { useSelector } from 'react-redux'

const page = () => {

    const [passwords, setPasswords] = useState({currentPassword: '', newPassword: '', confirmPassword: ''})

    const user = useSelector((state: RootState) => state.user);

    const handlePasswordChange = () => {

    }

    return (
        <div className="min-h-screen">
            <div className="container mx-auto p-6 max-w-4xl space-y-6">
                {/* Profile Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Update your personal information and profile details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <p>{user.firstName}</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <p>{user.lastName}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <p>{user.email}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Password Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>Update your password to keep your account secure</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                value={passwords.currentPassword}
                                onChange={(e) => setPasswords((prev) => ({ ...prev, currentPassword: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={passwords.newPassword}
                                onChange={(e) => setPasswords((prev) => ({ ...prev, newPassword: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={passwords.confirmPassword}
                                onChange={(e) => setPasswords((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                            />
                        </div>
                        <Button onClick={handlePasswordChange}>Update Password</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default page