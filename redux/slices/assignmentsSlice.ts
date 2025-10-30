// assignmentsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { getConsultantAssignmentsPaginated } from "@/lib/queries/querys"
import { Assignment } from "@/lib/types/types"


export const fetchAssignments = createAsyncThunk(
  'assignments/fetchAssignments',
  async ({ consultantId, loadMore }, { getState }) => {
    const state = getState() as RootState

    const cursor = loadMore ? state.assignments.cursor : null

    const result = await getConsultantAssignmentsPaginated(consultantId, cursor)

    return {
      assignments: result.assignments,
      cursor: result.cursor,
      hasMore: result.hasMore,
      loadMore
    }
  }
)

interface AssignmentsState {
    data: Assignment[],
    loading: boolean,
    error: string | null,
    pagination: {
        cursor: Assignment | null,
        hasMore: boolean
    }
}

const initialState: AssignmentsState = {
    data: [],
    loading: false,
    error: null,
    pagination: {
        cursor: null,
        hasMore: true
    }
}

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    addAssignment: (state, action) => {
      const assignment = action.payload
      state.data.push(assignment)
    },

    addManyAssignments: (state, action) => {
      action.payload.forEach((assignment: Assignment) => {
        if (!state.data.some((a) => a.id === assignment.id)) {
          state.data.push(assignment)
        }
      })
    },

    removeAssignment: (state, action) => {
      const id = action.payload
      state.data = state.data.filter(a => a.id !== id)
    },

    updateAssignment: (state, action) => {
      const { id, updates } = action.payload
      const index = state.data.findIndex((a) => a.id === id)
      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...updates }
      }
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.loading = false

        const { assignments, cursor, hasMore } = action.payload

        assignments.forEach((a: any) => {
          if (!state.data.some((assignment) => assignment.id === a.id)) {
            state.data.push(a)
          }
        })

        state.pagination.cursor = cursor
        state.pagination.hasMore = hasMore
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch"
      })
  }
})

export const {

} = assignmentsSlice.actions

export default assignmentsSlice.reducer