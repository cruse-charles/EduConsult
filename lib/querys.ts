import { startOfWeek, endOfWeek } from 'date-fns';

import { query, where, getDocs, collection, doc, orderBy, limit } from 'firebase/firestore';
import { db } from "@/lib/firebaseConfig";
import { Timestamp } from "firebase/firestore";
import { Assignment } from './types/types';

// Function to count tasks due this week for a consultant view
export const getTasksDueThisWeekConsultantDashboard = async (consultantId: string) => {

    // Find the start and end of current week
    const start = startOfWeek(new Date())
    const end = endOfWeek(new Date())

    // Count assignments with dueDates within current week
    const q = query(
        collection(db, 'assignments'),
        where('consultantId', '==', consultantId),
        where('dueDate', '>=', Timestamp.fromDate(start)),
        where('dueDate', '<=', Timestamp.fromDate(end)),
        where('status', '==', 'In-Progress')
    )

    const snapshot = await getDocs(q);
    return snapshot;
}

// Function to count tasks due this week for a consultant view
export const getTasksDueThisWeekStudentDashboard = async (studentId: string) => {

    // Find the start and end of current week
    const start = startOfWeek(new Date())
    const end = endOfWeek(new Date())

    // Count assignments with dueDates within current week
    const q = query(
        collection(db, 'assignments'),
        where('studentId', '==', studentId),
        where('dueDate', '>=', Timestamp.fromDate(start)),
        where('dueDate', '<=', Timestamp.fromDate(end)),
        where('status', '==', 'In-Progress')
    )

    const snapshot = await getDocs(q);
    return snapshot;
}

// Function to count students in progress (has In-Progress assighnemnts) for a consultant view
export const countOfInProgressStudents = async (consultantId: string) => {

    const q = query(
        collection(db, 'studentUsers'),
        where('consultant', '==', consultantId),
        where('stats.inProgressAssignmentsCount', '>', 0)
    )

    const snapshot = await getDocs(q);
    // console.log('countOfInProgressStudents', snapshot)
    return snapshot.size;
}

// Function to count overdue assignments for a consultant view
export const countOverDueAssignmentsConsultantDashboard = async (consultantId: string) => {

    const q = query(
        collection(db, 'assignments'),
        where('consultantId', '==', consultantId),
        where('dueDate', '<=', Timestamp.fromDate(new Date())),
        where('status', '==', 'In-Progress')
    )

    const snapshot = await getDocs(q);
    return snapshot.size;
}

// Function to count completed assignments for a student view
export const countCompletedAssignmentsStudentDashboard = async (studentId: string) => {
    
    const q = query(
        collection(db, 'assignments'),
        where('studentId', '==', studentId),
        where('status', '==', 'Completed')
    )

    const snapshot = await getDocs(q);
    return snapshot.size;
}

// Function to count under review assignments for a student view
export const countReviewedAssignmentsStudentDashboard = async (studentId: string) => {
    
    const q = query(
        collection(db, 'assignments'),
        where('studentId', '==', studentId),
        where('status', '==', 'Under Review')
    )

    const snapshot = await getDocs(q);
    return snapshot.size;
}

// Function to count total assignments for a student view
export const countTotalAssignmentsStudentDashboard = async (studentId: string) => {
    
    const q = query(
        collection(db, 'assignments'),
        where('studentId', '==', studentId),
    )

    const snapshot = await getDocs(q);
    return snapshot.size;
}

export const findNextAssignmentDeadlineConsultantDashboard = async (consultantId: string) => {
    
    const q = query(
        collection(db, 'assignments'),
        where('consultantId', '==', consultantId),
        where('dueDate', '>=', Timestamp.fromDate(new Date())),
        orderBy('dueDate', 'asc'),
        limit(1)
    )
    const snapshot = await getDocs(q);

    if (snapshot.docs.length > 0) {
        const docSnap = snapshot.docs[0]

        return {
            id: docSnap.id,
            ...docSnap.data()
        } as Assignment
    }
}

// TODO: Currently have just a string for student ref and actual ref for consultant, standardize this
export const countInProgressTasksForStudentConsultantView = async (studentId: string, consultantId: string) => {
    
    const q = query(
        collection(db, 'assignments'),
        where('studentId', '==', studentId),
        where('consultantId', '==', consultantId),
        where('status', '==', 'In-Progress')
    )

    const snapshot = await getDocs(q)
    return snapshot.size
}

// TODO: Currently have just a string for student ref and actual ref for consultant, standardize this
export const countCompletedTasksForStudentConsultantView = async (studentId: string, consultantId: string) => {
    
    const q = query(
        collection(db, 'assignments'),
        where('studentId', '==', studentId),
        where('consultantId', '==', consultantId),
        where('status', '==', 'Completed')
    )

    const snapshot = await getDocs(q)
    return snapshot.size
}

// TODO: Currently have just a string for student ref and actual ref for consultant, standardize this
export const nextDeadlineForStudent = async (studentId: string, consultantId: string) => {
    
    const q = query(
        collection(db, 'assignments'),
        where('consultantId', '==', consultantId),
        where('studentId', '==', studentId),
        where('dueDate', '>=', Timestamp.fromDate(new Date())),
        orderBy('dueDate', 'asc'),
        limit(1)
    )
    const snapshot = await getDocs(q);

    if (snapshot.docs.length > 0) {
        const docSnap = snapshot.docs[0]

        return {
            id: docSnap.id,
            ...docSnap.data()
        } as Assignment
    }
}

// TODO: I have this copy/pasted in some other redux slice function, reduce
// Function to retrieve all assignments within 7 days
export const getConsultantDashboardAssignments = async (consultantId: string) => {
    
    // Find today and six days later, encompasing a week
    // const today = new Date()
    // today.setDate(today.getDate())
    // const sixDaysLater = new Date()
    // sixDaysLater.setDate(today.getDate() + 6);

              // Find assignments from two last month, this month, and next month
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0); 

    // Count assignments with dueDates within current week
    const q = query(
          collection(db, 'assignments'),
          where('consultantId', '==', consultantId),
          // where('dueDate', '>=', Timestamp.fromDate(today)),
          // where('dueDate', '<=', Timestamp.fromDate(sixDaysLater)),
                    where('dueDate', '>=', Timestamp.fromDate(startDate)),
                    where('dueDate', '<=', Timestamp.fromDate(endDate)),

          // where('status', '==', 'In-Progress')
    )

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
        return {
            id: doc.id,
            ...doc.data()
        } as Assignment
    })
}

export const getConsultantCalendarAssignments = async (consultantId: string) => {
    
    // Find assignments from two last month, this month, and next month
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0); 

    // Count assignments with dueDates last month to next month
    const q = query(
        collection(db, 'assignments'),
        where('consultantId', '==', consultantId),
        where('dueDate', '>=', Timestamp.fromDate(startDate)),
        where('dueDate', '<=', Timestamp.fromDate(endDate)),
    )

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
        return {
            id: doc.id,
            ...doc.data()
        } as Assignment
    });
}

export const getStudentAssignments = async (studentId: string) => {
    
    const q = query(
        collection(db, 'assignments'),
        where('studentId', '==', studentId),
    )

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
        return {
            id: doc.id,
            ...doc.data()
        } as Assignment
    })
}

export const getConsultantAssignments = async (consultantId: string) => {
    
    const q = query(
        collection(db, 'assignments'),
        where('consultantId', '==', consultantId),
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => {
        return {
            id: doc.id,
            ...doc.data()
        } as Assignment
    })
}

// TODO: Adjust all queries to return data itself, not the snapshot, also leave comment on them to explain what they do
