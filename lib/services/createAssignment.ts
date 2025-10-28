import { addAssignment } from "@/redux/slices/consultantDashboardAssignmentsSlice"
import { uploadAssignment } from "../../repositories/assignmentRepository"
import { fileUpload } from "../../repositories/storageRepository"
import { buildAssignmentData } from "../buildAssignmentData"
import { checkReduxNextDeadline, updateAssignmentDocIds, updateFolders, updateReduxInProgressCount } from "@/redux/slices/currentStudentSlice"
import { updateInProgressCount } from "../statsUtils"

// @ts-ignore
// Create assignment by building data, uploading files, and adding to Firestore
export const createAssignment = async ({ formData, dueDate, files, studentId, student, user, }) => {
  const assignmentData = buildAssignmentData({
    formData,
    dueDate,
    studentId,
    student,
    user
  })

  const filesData = await fileUpload(files, studentId)
  assignmentData.timeline[0].files = filesData

  const assignmentDocId = await uploadAssignment(assignmentData, studentId, user.id)

  return { assignmentData, assignmentDocId }
}

// @ts-ignore
export const createAssignmentForStudents = async ({ formData, dueDate, files, students, user }) => {

  // Run all assignment creations in parallel for multiple students, capturing all results
  const results = await Promise.allSettled(

    // @ts-ignore
    // Map each student to an async assignment creation task
    students.map(async (student) => {
      // Build assignment data specific to each student
      const assignmentData = buildAssignmentData({ formData, dueDate, studentId: student.id, student, user})
  
      // Upload files for each student
      assignmentData.timeline[0].files = files.length > 0
          ? await fileUpload(files, student.id)
          : []
  
      // Create the assignment document in Firestore
      const assignmentDocId = await uploadAssignment(assignmentData, student.id, user.id)
  
      // Return relevant data for tracking
      return { student, assignmentData, assignmentDocId }
    })
  )

  // Extract results
  const succeeded = results
    .filter((response) => response.status === "fulfilled")
    .map(response => response.value)

  const failed = results
    .filter((response) => response.status === "rejected")
    .map((response, i) => ({ student: students[i], reason: response.reason }))
  
  // Return both success and failure so UI can handle partial success cases
  return { succeeded, failed }
}

// @ts-ignore
export const dispatchAssignmentUpdates = (dispatch, { assignmentDocId, assignmentData, folder, studentId, isComplete, userId }) => {
  // Add assignment to StudentAssignmentSlice
  dispatch(addAssignment({ id: assignmentDocId, ...assignmentData, hasRead: true }))
            
  // Update redux to include new folder if any and add assignment to student's profile
  dispatch(updateFolders(folder))
  dispatch(updateAssignmentDocIds(assignmentDocId))

  // Increase In-Progress count on addition of new assignment and nextDeadline check
  updateInProgressCount(studentId, 'In-Progress')
  dispatch(updateReduxInProgressCount({newStatus: assignmentData.status}))
  dispatch(checkReduxNextDeadline(assignmentData.dueDate))  
  
}