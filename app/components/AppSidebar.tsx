"use client"

import Link from 'next/link'
import { BookOpen, Calendar, GraduationCap, Home, LogOut, Settings, Users } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

import { app } from '@/lib/firebaseConfig'
import { getAuth, signOut } from 'firebase/auth'

import { resetStore } from '@/redux/slices/resetSlice'
import { useDispatch } from 'react-redux'
import { usePathname } from 'next/navigation'

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Students",
    url: "/dashboard/students",
    icon: Users,
  },
  {
    title: "Assignments",
    url: "/dashboard/assignments",
    icon: BookOpen,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Schools",
    url: "/dashboard/schools",
    icon: GraduationCap,
  },
]

const bottomMenuItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Logout",
    url: "/logout",
    icon: LogOut,
  },
]

const AppSidebar = () => {
  const pathname = usePathname()
  const auth = getAuth(app)
  const dispatch = useDispatch()

  // Don't show sidebar on login/signup pages
  if (pathname === "/login" || pathname === "/signup" || pathname === "/") {
    return null
  }
    
  // Handle user sign out
  const handleSignOut = async () => {
      try {
          await signOut(auth)
          dispatch(resetStore())
      } catch (error) {
          console.error("Error signing out: ", error);
      }
  }

    return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <GraduationCap className="h-6 w-6" />
          <span className="font-semibold">EduConsult Pro</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* <div className="flex items-center gap-3 px-4 py-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-medium">Dr. Jane Doe</p>
            <p className="text-xs text-muted-foreground">Education Consultant</p>
          </div>
        </div> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )




  // return (
  //   <div className="w-64 border-r">
  //       <div className="flex h-14 border-b px-4">
  //       <Link href="/" className="flex items-center font-semibold">
  //           EduConsult
  //       </Link>
  //       </div>
  //       <nav className="p-4">
  //           <div className="grid gap-1">
  //               <Link href="/dashboard">
  //                   <button className="w-full justify-start gap-2">
  //                       Dashboard
  //                   </button>
  //               </Link>

  //               <Link href="/dashboard/students">
  //                   <button className="w-full justify-start gap-2">
  //                       Students
  //                   </button>
  //               </Link>

  //               <Link href="/dashboard/assignments">
  //                   <button className="w-full justify-start gap-2">
  //                       Assignments
  //                   </button>
  //               </Link>

  //               <Link href="/dashboard/calendar">
  //                   <button className="w-full justify-start gap-2">
  //                       Calendar
  //                   </button>
  //               </Link>

  //               <Link href="/dashboard/schools">
  //                   <button className="w-full justify-start gap-2">
  //                       Schools
  //                   </button>
  //               </Link>

  //               <Link href="/dashboard/settings">
  //                   <button className="w-full justify-start gap-2">
  //                       Settings
  //                   </button>
  //               </Link>

  //               <Link href="/">
  //                   <button onClick={handleSignOut} className="w-full justify-start gap-2">
  //                       Logout
  //                   </button>
  //               </Link>
  //           </div>
  //       </nav>
  //   </div>
  // )
}

export default AppSidebar