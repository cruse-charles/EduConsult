import { Assignment } from "@/lib/types/types"
import { createSlice} from "@reduxjs/toolkit"

const initialState: Assignment = {
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
    consultantFirstName: '',
    consultantLastName: '',
    folder: '',
    status: '',
    timeline: []
}


const currentAssignmentSlice = createSlice({
    name: 'currentAssignment',
    initialState,
    reducers: {
        setCurrentAssignment(state, action) {
            return action.payload
        },
        clearCurrentAssignment(state, action) {
            return {    
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
                consultantFirstName: '',
                consultantLastName: '',
                folder: '',
                status: '',
                timeline: []
            }
        },
        updateCurrentAssignment(state, action) {
            return action.payload
        }
    }
})

export const { setCurrentAssignment, updateCurrentAssignment, clearCurrentAssignment } = currentAssignmentSlice.actions
export default currentAssignmentSlice.reducer