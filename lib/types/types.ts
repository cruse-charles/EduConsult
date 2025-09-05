import { Timestamp, DocumentReference, DocumentData } from "firebase/firestore";

// Base to create/use a student
export interface StudentBase {
    academicInformation: {
        currentSchool: string;
        gpa: number | null;
        sat: number | null;
        toefl: number | null;
        targetSchools: string;
        grade: number | null;
        ielts: number | null;
        act: number | null;
        intendedMajor: string;
    };
    personalInformation: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        other: string;
        notes: string;
    };
    stats: {
        inProgressAssignmentsCount: number;
        nextDeadline: Timestamp | undefined;
    }
    consultant: DocumentReference<DocumentData> | string;
    folders: string[];
    password: string;
    role: string;
}

// Interface to add additional information about student
export interface Student extends StudentBase {
    id: string;
    assignmentDocIds?: string[];
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
    studentId: string;
    studentFirstName?: string;
    studentLastName?: string;
    consultantId: string;
    consultantFirstName?: string;
    consultantLastName?: string;
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
    hasRead?: boolean;
}

// Structure for timeline entries
export interface Entry {
    files: AssignmentFile[];
    note: string;
    type: string;
    uploadedAt: Date | Timestamp;
    uploadedByName: string;
    uploadedById: string;
}

export interface UpdateAssignment {
    status: string;
    note: string;
    type: string;
    dueDate: Date | Timestamp;    
}

export interface FirebaseUserInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'consultant' | 'student';
  onboarding: {
    isComplete: boolean;
    onboardingStep: number;
  }
  assignmentsMetaData: {
    hasRead: boolean;
    lastActivityAt: Timestamp;
    lastSeenAt: Timestamp;
  }[]
}

export interface UserState {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  assignmentsMetaData: Record<string, AssignmentMetaData>;
assignmentDocIds: string[];
  folders: string[];
}

export type AssignmentMetaData = {
  hasRead: boolean
  lastSeenAt?: Timestamp
  lastActivityAt?: Timestamp
}

export type AssignmentMetaDataMap = Record<string, AssignmentMetaData>