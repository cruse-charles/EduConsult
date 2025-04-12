import { startOfWeek, endOfWeek } from 'date-fns';
import { query, where, getDocs, collection, doc } from 'firebase/firestore';
import { db } from "@/lib/firebaseConfig";
import { RootState } from '@/redux/store';
import { Timestamp } from "firebase/firestore";

export const countTasksDueThisWeek = async (consultantId: string) => {
    // console.log('Consultant ID', consultantId)

    const consultantRef = doc(db, "consultantUsers", consultantId);
    // console.log('Consultant Ref', consultantRef)

    const start = startOfWeek(new Date())
    const end = endOfWeek(new Date())
    // console.log('Start of week:', Timestamp.fromDate(start))
    // console.log('end of week:', Timestamp.fromDate(end))

    const q = query(
        collection(db, 'assignments'),
        where('consultant', '==', consultantRef),
        where('dueDate', '>=', Timestamp.fromDate(start)),
        where('dueDate', '<=', Timestamp.fromDate(end))
    )

    const snapshot = await getDocs(q);
    // console.log('spanpshot of query', snapshot)
    return snapshot.size;
}