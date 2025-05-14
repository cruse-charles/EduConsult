import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname

    // Example: check if user is logged in (using cookies, JWT, etc.)
    const role = req.cookies.get("role")?.value // Or decode Firebase token here

    if (!role) {
        return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    if (path.startsWith("/consultant") && role !== "consultant") {
        return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    if (path.startsWith("/student") && role !== "student") {
        return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    console.log("Role from cookie:", role)

    return NextResponse.next()
}

// Apply only to these routes
export const config = {
    matcher: ["/consultant/:path*", "/student/:path*"],
}
