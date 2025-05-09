import { NextResponse } from "next/server";

// POST /api/set-session
export async function POST(req: Request) {
  const { role } = await req.json();

  const res = NextResponse.json({ success: true });
  
  // Set cookie for role (1 day expiration for example)
  res.cookies.set("role", role, {
    httpOnly: true, // prevents JS access
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  return res;
}
