import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { Assignment } from "@/lib/types/types";
import { getConsultantDashboardAssignments } from "@/lib/queries/querys";

// Async thunk to fetch assignments from Firestore by an array of IDs
export const fetchConsultantDashboardAssignments = createAsyncThunk(
  "consultantDashboard/fetchConsultantDashboardAssignments",
  async ({consultantId, startDate, endDate}: {consultantId: string, startDate: Date, endDate: Date}) => {
    try {
      const snapshot = await getConsultantDashboardAssignments(consultantId, startDate, endDate);
      return {assignments: snapshot, loadedFrom: startDate, loadedThrough: endDate};
    } catch (error) {
      console.error("Error fetching consultant dashboard assignments:", error);
      throw error;
    }
  }
)

interface consultantDashboardAssignments {
  data: Assignment[]
  query: {
    loadedThrough: Date | null  // furthest date we've fetched
    loadedFrom: Date | null  // earliest date we've fetched
  }
  loading: boolean
  error: string | null
}

const initialState: consultantDashboardAssignments = {
  data: [],
  query: {
    loadedThrough: null,
    loadedFrom: null,
  },
  loading: false,
  error: null
}

// Create a slice for assignments
const consultantDashboardAssignmentsSlice = createSlice({
  name: 'consultantDashboardAssignments',
  initialState,
    reducers: {
    // Replaces state with a new list of assignments
    setAssignments(state, action) {
      state.data = action.payload;
    },
    // Adds a new assignment to the state
    addAssignment(state, action) {
      state.data.push(action.payload);
    },
    // Adds a new entry to the timeline of a specific assignment
    addEntry(state, action) {
      const { entryData, assignmentId } = action.payload;
      const assignmentIndex = state.data.findIndex(assignment => assignment.id === assignmentId);
      
      if (assignmentIndex !== -1) {
        // Add the new entry to the timeline array
        state.data[assignmentIndex].timeline.push(entryData);
      }
    },
    // Updates a specific assignment in the state
    updateAssignmentSlice(state, action) {
      const { assignmentId, updateData } = action.payload;
      const assignmentIndex = state.data.findIndex(assignment => assignment.id === assignmentId);
    
      if (assignmentIndex !== -1) {
          state.data[assignmentIndex] = { ...state.data[assignmentIndex], ...updateData };
      }
    },
    // Deletes an assignment from the state by its ID
    deleteDashboardAssignment(state, action) {
      const assignmentId = action.payload;
      if (state.data.length === 0) return state

      state.data = state.data.filter((assignment) => assignment.id !== assignmentId)
    }
  },
  // Handle async actions using extraReducers for Inprogress, fulfilled, and rejected states
  extraReducers: (builder) => {
    builder
      .addCase(fetchConsultantDashboardAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConsultantDashboardAssignments.fulfilled, (state, action) => {
        state.data.push(...action.payload.assignments)
        if (!state.query.loadedThrough || action.payload.loadedThrough > state.query.loadedThrough) {
            state.query.loadedThrough = action.payload.loadedThrough
        }
        if (!state.query.loadedFrom || action.payload.loadedFrom < state.query.loadedFrom) {
            state.query.loadedFrom = action.payload.loadedFrom
        }
        state.loading = false
        state.error = null
      })
      .addCase(fetchConsultantDashboardAssignments.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch assignments'
      })
  },
});

export const { setAssignments, addAssignment, addEntry, updateAssignmentSlice, deleteDashboardAssignment } = consultantDashboardAssignmentsSlice.actions;
export default consultantDashboardAssignmentsSlice.reducer;