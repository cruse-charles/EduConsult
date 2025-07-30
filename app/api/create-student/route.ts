// app/api/create-student/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb, admin } from '@/lib/firebaseAdmin';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { email, password, personalInformation, academicInformation, folders, consultantId, onboarding } = await request.json();

    // Verify consultant token from request headers
    const authHeader = request.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Extract token
    const token = authHeader.split('Bearer ')[1];
    
    // Verify the token and get user info
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
      console.log('decodedToken', decodedToken)
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    // Verify the requesting user is the consultant
    if (decodedToken.uid !== consultantId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Create student account
    const userRecord = await adminAuth.createUser({
      email,
      password,
      emailVerified: false,
    });

    const studentId = userRecord.uid;

    // Reference to the new student document and consultant document
    const studentRef = adminDb.collection('studentUsers').doc(studentId);
    const consultantRef = adminDb.collection('consultantUsers').doc(consultantId);

    // Prepare student data
    const studentData = {
      personalInformation,
      academicInformation,
      consultant: consultantId,
      folders: folders || [],
      email,
      onboarding,
      createdAt: new Date().toISOString(),
    };

    // Run firestore operations in parallel
    await Promise.all([
      // Create student document and update consultant's students array
      studentRef.set(studentData),
      consultantRef.update({
        students: admin.firestore.FieldValue.arrayUnion(studentRef)
        // students: admin.firestore.FieldValue.arrayUnion(studentId)
      })
    ])

    // Retrieve student information
    // const studentSnap = await studentRef.get();
    // const createdStudentData = {id: studentRef.id, ...studentSnap.data()};



    // old
    // // Create student document
    // await studentRef.set({
    //   personalInformation: personalInformation,
    //   academicInformation: academicInformation,
    //   consultant: consultantId,
    //   folders: folders || [],
    //   email,
    //   onboarding,
    //   createdAt: new Date().toISOString(),
    // });

    // // Retrieve student information
    // const studentSnap = await studentRef.get();
    // const createdStudentData = {id: studentRef.id, ...studentSnap.data()};

    // // Update consultant's students array
    // await consultantRef.update({
    //   students: admin.firestore.FieldValue.arrayUnion(studentRef)
    // });
    // old

    return NextResponse.json({ 
      success: true, 
      student: { id: studentId, ...studentData },
      message: 'Student created successfully'
    });
    
  } catch (error: any) {
    console.error('Error creating student:', error);
    
    // Handle specific errors
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json({ 
        error: 'Email already exists' 
      }, { status: 400 });
    }
    
    if (error.code === 'auth/invalid-email') {
      return NextResponse.json({ 
        error: 'Invalid email format' 
      }, { status: 400 });
    }
    
    if (error.code === 'auth/weak-password') {
      return NextResponse.json({ 
        error: 'Password is too weak' 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: error.message || 'Failed to create student'
    }, { status: 500 });
  }
}