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
        },
        // addEntry(state, action) {
        //     // TODO: NEED TO ADD ENTRY TO CURRENT ASSIGNMENT WHEN STUDENT ADDS ENTRY, NEED TO ADD DISPATCH FOR IT TOO
        //     const { entryData, assignmentId } = action.payload;
        //     const assignmentIndex = state.findIndex(assignment => assignment.id === assignmentId);
            
        //     if (assignmentIndex !== -1) {
        //         // Add the new entry to the timeline array
        //         state[assignmentIndex].timeline.push(entryData);
        //     }
        // }
    }
})

export const { setCurrentAssignment, updateCurrentAssignment, clearCurrentAssignment } = currentAssignmentSlice.actions
export default currentAssignmentSlice.reducer