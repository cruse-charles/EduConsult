import { Timestamp, DocumentReference, DocumentData } from "firebase/firestore";

// Base to create/use a student
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

// Interface to add additional information about student
export interface Student extends StudentBase {
    id: string;
    assignmentDocIds?: string[];
    pendingTasks: number | null;
    nextDeadline: Timestamp | null;
    progress: number | null;
    folders: string[]
}

// Naming for creating students
export interface StudentFormData extends StudentBase {}

// Structure for files for an assignment
export interface AssignmentFile {
    storagePath: string;
    downloadUrl: string;
    originalName: string;
    uploadedAt: Date;
}

// Base to create/use an assignment
export interface AssignmentBase {
    title: string;
    type: string;
    priority: string;
    dueDate: Date | undefined | Timestamp;
    note: string;
    createdAt: Date | null | Timestamp;
    student: string;
    folder: string;
    status: string;
}

// FormData version of an assignment
export interface AssignmentFormData extends AssignmentBase {
    files: AssignmentFile[];
}

// Structure for uploading assignments
export interface AssignmentUpload extends AssignmentBase {
    timeline: Entry[]
}

// Structure for using assignments
export interface Assignment extends AssignmentBase {
    id: string;
    timeline: Entry[];
}

// Structure for timeline entries
export interface Entry {
    files: AssignmentFile[];
    note: string;
    type: string;
    uploadedAt: Date | Timestamp;
    uploadedBy: string;
}

export interface UpdateAssignment {
    status: string;
    note: string;
    type: string;
    dueDate: Date | Timestamp;    
}

// // structure of assignemtnts in database
// export interface AssignmentDoc {
//     student: string;
//     consultant: string;
//     assignments: Assignment[];
// }