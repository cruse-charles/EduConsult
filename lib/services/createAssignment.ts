import { uploadAssignment } from "../../repositories/assignmentRepository"
import { fileUpload } from "../../repositories/storageRepository"
import { buildAssignmentData } from "../buildAssignmentData"

// @ts-ignore
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