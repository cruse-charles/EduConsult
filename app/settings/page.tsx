'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RootState } from '@/redux/store'
import { useState } from 'react'
import { useSelector } from 'react-redux'

const page = () => {

    const user = useSelector((state: RootState) => state.user);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6">
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
      </div>
    </div>
  )
}

export default page