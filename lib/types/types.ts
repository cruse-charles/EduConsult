import { Timestamp, DocumentReference, DocumentData } from "firebase/firestore";


export interface Student {
    id: string;
    academicInformation: {
        currentSchool: string;
        gpa: number;
        sat: number;
        toefl: number;
        targetSchools: string;
        grade: string;
    };
    personalInformation: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        other: string;
        notes: string;
    };
    consultant: DocumentReference<DocumentData>;
    pendingTasks: number;
    nextDeadline: Timestamp | null;
    progress: number;
}

export interface StudentFormData {
    personalInformation: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        other: string;
        notes: string;
    };
    academicInformation: {
        currentSchool: string;
        grade: string;
        gpa: string;
        sat: string;
        toefl: string;
        targetSchools: string;
    };
    pendingTasks: string;
    progress: string;
    nextDeadline: string;
    consultant: any;
}