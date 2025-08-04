import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin"; 

export async function POST (req: Request) {
    try {
        const { uid } = await req.json()
        await adminAuth.setCustomUserClaims(uid, { role: 'consultant' })

        return NextResponse.json({success: true})
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}