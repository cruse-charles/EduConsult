import { startOfWeek, endOfWeek } from 'date-fns';

import { query, where, getDocs, collection, doc, orderBy, limit } from 'firebase/firestore';
import { db } from "@/lib/firebaseConfig";
import { Timestamp } from "firebase/firestore";
import { Assignment } from './types/types';

// Function to count tasks due this week for a consultant view
export const getTasksDueThisWeekConsultantDashboard = async (consultantId: string) => {

    // Get consultant's doc reference
    const consultantRef = doc(db, "consultantUsers", consultantId);

    // Find the start and end of current week
    const start = startOfWeek(new Date())
    const end = endOfWeek(new Date())

    // Count assignments with dueDates within current week
    const q = query(
        collection(db, 'assignments'),
        where('consultant', '==', consultantRef),
        where('dueDate', '>=', Timestamp.fromDate(start)),
        where('dueDate', '<=', Timestamp.fromDate(end)),
        where('status', '==', 'Pending')
    )

    const snapshot = await getDocs(q);
    console.log('getTasksDueThisWeekConsultantDashboard', snapshot);
    return snapshot;
}

// Function to count tasks due this week for a consultant view
export const getTasksDueThisWeekStudentDashboard = async (studentId: string) => {

    // Get consultant's doc reference
    // const consultantRef = doc(db, "studentUsers", studentId);

    // Find the start and end of current week
    const start = startOfWeek(new Date())
    const end = endOfWeek(new Date())

    // Count assignments with dueDates within current week
    const q = query(
        collection(db, 'assignments'),
        where('student', '==', studentId),
        where('dueDate', '>=', Timestamp.fromDate(start)),
        where('dueDate', '<=', Timestamp.fromDate(end)),
        where('status', '==', 'Pending')
    )

    const snapshot = await getDocs(q);
    console.log('getTasksDueThisWeekConsultantDashboard', snapshot);
    return snapshot;
}

// Function to count students in progress (has pending assighnemnts) for a consultant view
export const countOfInProgressStudents = async (consultantId: string) => {
    const consultantRef = doc(db, "consultantUsers", consultantId);

    const q = query(
        collection(db, 'studentUsers'),
        where('consultant', '==', consultantRef),
        where('stats.pendingAssignmentsCount', '>', 0)
    )

    const snapshot = await getDocs(q);
    return snapshot.size;
}

// Function to count overdue assignments for a consultant view
export const countOverDueAssignmentsConsultantDashboard = async (consultantId: string) => {
    const consultantRef = doc(db, "consultantUsers", consultantId);

    const q = query(
        collection(db, 'assignments'),
        where('consultant', '==', consultantRef),
        where('dueDate', '<=', Timestamp.fromDate(new Date())),
        where('status', '==', 'Pending')
    )

    const snapshot = await getDocs(q);
    return snapshot.size;
}

// Function to count completed assignments for a student view
export const countCompletedAssignmentsStudentDashboard = async (studentId: string) => {

    const q = query(
        collection(db, 'assignments'),
        where('student', '==', studentId),
        where('status', '==', 'Completed')
    )

    const snapshot = await getDocs(q);
    return snapshot.size;
}

// Function to count under review assignments for a student view
export const countReviewedAssignmentsStudentDashboard = async (studentId: string) => {

    const q = query(
        collection(db, 'assignments'),
        where('student', '==', studentId),
        where('status', '==', 'Under Review')
    )

    const snapshot = await getDocs(q);
    return snapshot.size;
}

// Function to count total assignments for a student view
export const countTotalAssignmentsStudentDashboard = async (studentId: string) => {

    const q = query(
        collection(db, 'assignments'),
        where('student', '==', studentId),
    )

    const snapshot = await getDocs(q);
    return snapshot.size;
}

export const findNextAssignmentDeadlineConsultantDashboard = async (consultantId: string) => {
    const consultantRef = doc(db, "consultantUsers", consultantId)

    const q = query(
        collection(db, 'assignments'),
        where('consultant', '==', consultantRef),
        where('dueDate', '>=', Timestamp.fromDate(new Date())),
        orderBy('dueDate', 'asc'),
        limit(1)
    )
    const snapshot = await getDocs(q);
    console.log('findNextDeadlineAssignment snapshot', snapshot.docs[0]?.data())

    if (snapshot.docs.length > 0) {
        const docSnap = snapshot.docs[0]

        return {
            id: docSnap.id,
            ...docSnap.data()
        } as Assignment
    }
}

// TODO: Currently have just a string for student ref and actual ref for consultant, standardize this
export const countPendingTasksForStudentConsultantView = async (studentId: string, consultantId: string) => {
    const consultantRef = doc(db, "consultantUsers", consultantId)

    const q = query(
        collection(db, 'assignments'),
        where('student', '==', studentId),
        where('consultant', '==', consultantRef),
        where('status', '==', 'Pending')
    )

    const snapshot = await getDocs(q)
    return snapshot.size
}

// TODO: Currently have just a string for student ref and actual ref for consultant, standardize this
export const countCompletedTasksForStudentConsultantView = async (studentId: string, consultantId: string) => {
    const consultantRef = doc(db, "consultantUsers", consultantId)

    const q = query(
        collection(db, 'assignments'),
        where('student', '==', studentId),
        where('consultant', '==', consultantRef),
        where('status', '==', 'Completed')
    )

    const snapshot = await getDocs(q)
    return snapshot.size
}

// TODO: Currently have just a string for student ref and actual ref for consultant, standardize this
export const findNextAssignmentDeadlineStudentDashboard = async (studentId: string, consultantId: string) => {
    const consultantRef = doc(db, "consultantUsers", consultantId)

    const q = query(
        collection(db, 'assignments'),
        where('consultant', '==', consultantRef),
        where('student', '==', studentId),
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

    // Get consultant's doc reference
    const consultantRef = doc(db, "consultantUsers", consultantId);

    // Find today and six days later, encompasing a week
    const today = new Date()
    today.setDate(today.getDate())
    const sixDaysLater = new Date()
    sixDaysLater.setDate(today.getDate() + 6);

    // Count assignments with dueDates within current week
    const q = query(
        collection(db, 'assignments'),
        where('consultant', '==', consultantRef),
        where('dueDate', '>=', Timestamp.fromDate(today)),
        where('dueDate', '<=', Timestamp.fromDate(sixDaysLater)),
        where('status', '==', 'Pending')
    )

    const snapshot = await getDocs(q);
    console.log('getTasksDueThisWeekConsultantDashboard', snapshot);
    return snapshot;
}