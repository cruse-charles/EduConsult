import { db } from "@/lib/firebaseConfig";
import { arrayRemove, arrayUnion, deleteDoc, doc, getDoc, increment, setDoc, Timestamp, updateDoc } from "firebase/firestore";

import { Assignment, AssignmentUpload, Entry, UpdateAssignment } from "../lib/types/types"
import { updateNextDeadlineForStudent } from "../lib/statsUtils";

import { nanoid } from "@reduxjs/toolkit";
import { fileUpload } from "./storageRepository";
import { buildAssignmentData } from "@/lib/buildAssignmentData";


// TODO: We are currently doing four separate writes, batch them to safegaurd against partial updates and improve performance
export const uploadAssignment = async (assignmentData: AssignmentUpload, studentId: string, consultantId: string) => {

    try {
        const assignmentDocId = nanoid()

        // Create a new Doc
        const assignmentDocRef = doc(db, "assignments", assignmentDocId)
        await setDoc(assignmentDocRef, assignmentData)

        // Update nextDeadline field for student
        await updateNextDeadlineForStudent(studentId, assignmentData.dueDate, consultantId)
    
        // Update folder names in student's doc
        await updateDoc(doc(db, "studentUsers", studentId), {
            assignmentDocIds: arrayUnion(assignmentDocId),
            "system.folders": arrayUnion(assignmentData.folder)
        })

        // Update assignmentMetaData subcollection for consultant and student
        await setDoc(doc(db, "consultantUsers", consultantId, "assignmentMeta", assignmentDocId), {
            hasRead: true,
            lastSeenAt: Timestamp.now(),
            lastActivityAt: Timestamp.now()
        })

        // Update assignmentMetaData subcollection for consultant
        await setDoc(doc(db, "studentUsers", studentId, "assignmentMeta", assignmentDocId), {
            hasRead: false,
            lastSeenAt: Timestamp.now(),
            lastActivityAt: Timestamp.now()
        })
    
        return assignmentDocId
    } catch (error) {
        console.log("Error adding assignment: ", error)
        throw error
    }

}

// @ts-ignore
export const createAssignmentForStudents = async ({ formData, dueDate, files, students, user }) => {

    const results = await Promise.allSettled(
        // @ts-ignore
        students.map(async (student) => {
            const assignmentData = buildAssignmentData({
                formData,
                dueDate,
                studentId: student.id,
                student,
                user,
            })

            // Upload a separate copy of files per student so edits are independent
            assignmentData.timeline[0].files = files.length > 0
                ? await fileUpload(files, student.id)
                : []

            const assignmentDocId = await uploadAssignment(assignmentData, student.id, user.id)
            return { assignmentData, assignmentDocId, student }
        })
    )

    const succeeded = results
        .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
        .map(r => r.value)

    const failed = results
        .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
        .map((r, i) => ({ student: students[i], reason: r.reason }))

    return { succeeded, failed }
}


// Update an assignment from consultant view
// TODO: This function needs to update the AssignmentMeta for student
export const updateAssignment = async (assignmentData: UpdateAssignment, assignmentId: string, studentId: string, consultantId: string) => {
    try {
        // Get reference to the assignment document
        const assignmentDocRef = doc(db, "assignments", assignmentId);

        // Update assignment doc
        // @ts-ignore
        await updateDoc(assignmentDocRef, assignmentData);

        // Update nextDeadline field for student
        await updateNextDeadlineForStudent(studentId, assignmentData.dueDate, consultantId);
    } catch (error) {
        console.log('Error updating assignment in updateAssignment', error)
        throw error
    }
}

// Adding an entry to an assignment's timeline
// TODO: This function needs permissions for the student to update the assignmentMetaData in consultantUsers 
export const uploadEntry = async (entryData: Entry, assignmentDocId: string, consultantId: string, studentId: string, userId: string) => {
    try {
        await updateDoc(doc(db, "assignments", assignmentDocId), {
            timeline: arrayUnion(entryData)
        })

        const isConsultant = userId === consultantId

        await updateDoc(doc(db, "consultantUsers", consultantId, "assignmentMeta", assignmentDocId), {
            hasRead: isConsultant,
            lastActivityAt: Timestamp.now(),
            lastSeenAt: Timestamp.now()
        })

        await updateDoc(doc(db, "studentUsers", studentId, "assignmentMeta", assignmentDocId), {
            hasRead: !isConsultant,
            lastActivityAt: Timestamp.now(),
            lastSeenAt: Timestamp.now()
        })

    } catch (error) {
        console.log("Error updating assignment in uploadEntry", error)
        throw error
    }
}

// Deleting an assignment
export const deleteAssignment = async (assignmentId: string, studentId: string, consultantId: string) => {
    try {
        // Retrieve assignment status to update in-progress count in highlights if needed
        const assignmentDocRef = doc(db, "assignments", assignmentId)
        const assignmentDocSnap = await getDoc(assignmentDocRef)
        const assignmentData = assignmentDocSnap.data()
        const assignmentStatus = assignmentData?.status

        if (assignmentStatus === "In-Progress") {
            await updateDoc(doc(db, "studentUsers", studentId), {
                "stats.inProgressAssignmentsCount": increment(-1)
            })
        }

        // Delete assignment document
        await deleteDoc(doc(db, "assignments", assignmentId))

        // Remove assignment ID from student document
        const studentDocRef = doc(db, "studentUsers", studentId)

        await updateDoc(studentDocRef, {
            assignmentDocIds: arrayRemove(assignmentId)
        })

        // Delete assignmentMetaData for consultant and student
        await deleteDoc(doc(db, "studentUsers", studentId, "assignmentMeta", assignmentId))
        await deleteDoc(doc(db, "consultantUsers", consultantId, "assignmentMeta", assignmentId))

        // TODO: Have a popup that confirms deleted assignment and created and updated
    } catch (error) {
        console.log("Error deleting assignment", error)
        throw error
    }
}

// When student opens an assignment, update the hasRead and lastSeenAt fields in the assignmentMeta subcollection for that assignment
export const readAssignment = async(assignmentId: string, database: string, userId: string) => {
    try {
        const metaDataDocRef = doc(db, database, userId, "assignmentMeta", assignmentId)
        
        await updateDoc(metaDataDocRef, {
            hasRead: true,
            lastSeenAt: Timestamp.now()
        })
    } catch (error) {
        console.log("Error updating assignment metadata in readAssignment", error)
    }
}

// update Assignment status when student submits
export const updateAssignmentStatus = async (assignmentId: string, status: string, updatedAssignment: Assignment) => {
    try {
        // Get reference to the assignment document
        const assignmentDocRef = doc(db, "assignments", assignmentId);

        // Update doc
        // @ts-ignore
        await updateDoc(assignmentDocRef, {status});
    } catch (error) {
        console.log('Error updating assignment in updateAssignment', error)
        throw error
    }
}