import { Timestamp, DocumentReference, DocumentData } from "firebase/firestore";


export interface StudentBase {
    // id: string;
    academicInformation: {
        currentSchool: string;
        gpa: number | null;
        sat: number | null;
        toefl: number | null;
        targetSchools: string;
        grade: number | null;
    };
    personalInformation: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        other: string;
        notes: string;
    };
    consultant: DocumentReference<DocumentData> | null;
}

export interface Student extends StudentBase {
    id: string;
    assignmentsDocId?: string;
    pendingTasks: number | null;
    nextDeadline: Timestamp | null;
    progress: number | null;
    folders: string[]
}

export interface StudentFormData extends StudentBase {}

export interface AssignmentFile {
    storagePath: string;
    downloadURL: string;
    originalName: string;
    uploadedAt: Date;
}

export interface Assignment {
    title: string;
    type: string;
    priority: string;
    dueDate: Date | undefined | Timestamp;
    notes: string;
    files: AssignmentFile[];
    createdAt: Date | null;
    student: string;
    folderName: string;
    status: string;
}

export interface AssignmentDoc {
    student: string;
    consultant: string;
    assignments: Assignment[];
}