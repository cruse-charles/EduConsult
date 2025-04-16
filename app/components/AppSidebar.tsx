"use client"

import Link from 'next/link'
import { BookOpen, Calendar, GraduationCap, Home, LogOut, Router, Settings, Users } from "lucide-react"
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
import { usePathname, useRouter } from 'next/navigation'


const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  // {
  //   title: "Assignments",
  //   url: "/dashboard/assignments",
  //   icon: BookOpen,
  // },
  // {
  //   title: "Calendar",
  //   url: "/calendar",
  //   icon: Calendar,
  // },
  // {
  //   title: "Schools",
  //   url: "/dashboard/schools",
  //   icon: GraduationCap,
  // },
]

const bottomMenuItems = [
  // {
  //   title: "Settings",
  //   url: "/settings",
  //   icon: Settings,
  // },
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
  const router = useRouter()

  // Don't show sidebar on login/signup pages
  if (pathname === "/login" || pathname === "/signup" || pathname === "/") {
    return null
  }
    
  // Handle user sign out
  const handleLogout = async () => {
      try {
          await signOut(auth)
          router.push('/')
          setTimeout(() => dispatch(resetStore()), 200); // Delay Redux clear to prevent authgaurd redirect

      } catch (error) {
          console.error("Error logging out: ", error);
      }
  }

  // TODO: Make sidebar not have the trigger on certain pages, it does make some headers bigger
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
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/settings"}>
                  <Link href="/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar