// assignmentsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"


export const fetchAssignments = createAsyncThunk(
  'assignments/fetchAssignments',
  async ({ consultantId, loadMore }, { getState }) => {
    const state = getState() as RootState

    const cursor = loadMore
      ? state.assignments.cursor
      : null

    const result = await getConsultantAssignmentsPaginated(
      consultantId,
      cursor
    )

    return {
      assignments: result.assignments,
      cursor: result.cursor,
      hasMore: result.hasMore,
      loadMore
    }
  }
)

interface AssignmentsState {

}

const initialState: AssignmentsState = {

}

const assignmentsSlice = createSlice({

})

export const {

} = assignmentsSlice.actions

export default assignmentsSlice.reducer