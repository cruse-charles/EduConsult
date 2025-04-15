import { startOfWeek, endOfWeek } from 'date-fns';

import { query, where, getDocs, collection, doc } from 'firebase/firestore';
import { db } from "@/lib/firebaseConfig";
import { Timestamp } from "firebase/firestore";

// Function to count tasks due this week for a consultant view
export const countTasksDueThisWeek = async (consultantId: string) => {

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
    return snapshot.size;
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
export const countOverDueAssignments = async (consultantId: string) => {
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