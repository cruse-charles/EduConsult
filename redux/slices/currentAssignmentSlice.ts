import { Assignment } from "@/lib/types/types"
import { createSlice} from "@reduxjs/toolkit"

const assignment: Assignment = {
    id: '',
    title: '',
    type: '',
    priority: '',
    dueDate: undefined ,
    note: '',
    createdAt: null,
    studentId: '',
    studentFirstName: '',
    studentLastName: '',
    consultantId: '',
    consultantFirstName: '',
    consultantLastName: '',
    folder: '',
    status: '',
    timeline: [],
    color: '',
}

const initialState = {
    assignment: assignment,
    isModalOpen: false
}

const currentAssignmentSlice = createSlice({
    name: 'currentAssignment',
    initialState,
    reducers: {
        setCurrentAssignment(state, action) {
            state.assignment = action.payload
        },
        clearCurrentAssignment(state, action) {
            return initialState
        },
        updateCurrentAssignment(state, action) {
            return action.payload
        },
        readCurrentAssignment(state) {
            return {
                ...state,
                hasRead: true
            }
        },
        openCurrentAssignmentModal(state) {
            state.isModalOpen = true
        },
        closeCurrentAssignmentModal(state) {
            state.isModalOpen = false
        }
    }
})

export const { setCurrentAssignment, updateCurrentAssignment, clearCurrentAssignment, readCurrentAssignment, openCurrentAssignmentModal, closeCurrentAssignmentModal } = currentAssignmentSlice.actions
export default currentAssignmentSlice.reducer