import { addAssignment } from "@/redux/slices/consultantAssignmentSlice"
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