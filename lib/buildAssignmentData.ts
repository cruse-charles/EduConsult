// lib/assignmentDefaults.ts
import { Timestamp } from "firebase/firestore"
import { AssignmentFormData, AssignmentFile } from "@/lib/types/types"

export const getEmptyFormData = (student, user): AssignmentFormData => ({
  title: "",
  type: "",
  priority: "",
  folder: "",
  studentFirstName: student?.profile?.firstName,
  studentLastName: student?.profile?.lastName,
  consultantFirstName: user?.profile?.firstName,
  consultantLastName: user?.profile?.lastName,
  dueDate: undefined,
  note: "",
  files: [],
  createdAt: null,
  status: 'In-Progress',
})

export const buildAssignmentData = ({
  formData,
  dueDate,
  studentId,
  student,
  user,
  filesData,
}: BuildAssignmentDataParams) => {
  const dueDateAt1159pm = new Date(dueDate)
  dueDateAt1159pm.setHours(23, 59, 0, 0)

  return {
    ...formData,
    dueDate: Timestamp.fromDate(dueDateAt1159pm),
    createdAt: Timestamp.fromDate(new Date()),
    studentId,
    studentFirstName: student?.profile?.firstName,
    studentLastName: student?.profile?.lastName,
    consultantFirstName: user?.profile?.firstName,
    consultantLastName: user?.profile?.lastName,
    consultantId: user.id,
    color: student.ui?.color,
    timeline: [{
      files: filesData as AssignmentFile[],
      type: 'Assignment Created',
      uploadedAt: Timestamp.fromDate(new Date()),
      uploadedByName: `${user?.profile?.firstName} ${user?.profile?.lastName}`,
      uploadedById: user.id,
      note: 'Assignment created and assigned to student.',
    }],
  }
}