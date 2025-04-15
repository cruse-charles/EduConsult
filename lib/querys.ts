import { startOfWeek, endOfWeek } from 'date-fns';

import { query, where, getDocs, collection, doc } from 'firebase/firestore';
import { db } from "@/lib/firebaseConfig";
import { Timestamp } from "firebase/firestore";

export const countTasksDueThisWeek = async (consultantId: string) => {

    const consultantRef = doc(db, "consultantUsers", consultantId);

    const start = startOfWeek(new Date())
    const end = endOfWeek(new Date())

    const q = query(
        collection(db, 'assignments'),
        where('consultant', '==', consultantRef),
        where('dueDate', '>=', Timestamp.fromDate(start)),
        where('dueDate', '<=', Timestamp.fromDate(end))
    )

    const snapshot = await getDocs(q);
    return snapshot.size;
}

export const countOfInProgressStudents = async (consultantId: string) => {
    const consultantRef = doc(db, "consultantUsers", consultantId);

    const q = query(
        collection(db, 'studentUsers'),
        where('consultant', '==', consultantRef),
        where('stats.pendingAssignmentsCount', '>', 0)
    )

    const snapshot = await getDocs(q);
    console.log("Count of in-progress students:", snapshot.size);
    return snapshot.size;
}