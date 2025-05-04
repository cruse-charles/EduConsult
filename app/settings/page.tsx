'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateUserPersonalInfo } from '@/lib/userUtils'
import { RootState } from '@/redux/store'
import { Pencil, Save } from 'lucide-react'
import { useState } from 'react'
import { useSelector } from 'react-redux'

const page = () => {

    const [passwords, setPasswords] = useState({currentPassword: '', newPassword: '', confirmPassword: ''})
    const [edit, setEdit] = useState(false)
    
    const user = useSelector((state: RootState) => state.user);
    const [profileData, setProfileData] = useState({firstName: user.firstName, lastName: user.lastName, email: user.email})

    const handlePasswordChange = () => {

    }

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        updateUserPersonalInfo(user.id, profileData)
        setEdit(false)
    }

    const handleCancel = () => {
        setEdit(false)
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
                        {!edit ? (
                            <>
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
                                
                                <Button onClick={() => setEdit(true)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit Profile
                                </Button>
                            </>
                        ) : (
                            <>
                            {/* Edit Section */}
                            <form onSubmit={handleSave}>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            value={profileData.firstName}
                                            onChange={(e) => setProfileData((prev) => ({ ...prev, firstName: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            value={profileData.lastName}
                                            onChange={(e) => setProfileData((prev) => ({ ...prev, lastName: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                            id="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                                        />
                                </div>
                                <Button type='submit'>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </Button>
                                <Button onClick={handleCancel} variant="outline">
                                    Cancel
                                </Button>
                            </form>
                        </>
                        )}
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