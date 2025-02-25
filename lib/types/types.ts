import { Timestamp, DocumentReference, DocumentData } from "firebase/firestore";


export interface StudentBase {
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

export interface Student extends StudentBase {
    id: string;
}

export interface StudentFormData extends StudentBase {}