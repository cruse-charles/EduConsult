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