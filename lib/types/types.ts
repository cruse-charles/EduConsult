import { Timestamp, DocumentReference, DocumentData } from "firebase/firestore";


export interface Student {
    id: string;
    academicInformation: {
        currentSchool: string;
        gpa: number;
        sat: number;
        toefl: number;
    };
    personalInformation: {
        name: string;
        email: string;
        phone: string;
        wechat: string;
    };
    consultant: DocumentReference<DocumentData>;
    pendingTasks: number;
    nextDeadline: Timestamp | null;
    progress: number;
}