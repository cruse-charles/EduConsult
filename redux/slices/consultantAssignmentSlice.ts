import { db } from "@/lib/firebaseConfig";

import { doc, getDoc } from 'firebase/firestore';

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { Assignment } from "@/lib/types/types";
import { getConsultantDashboardAssignments } from "@/lib/queries/querys";

// Async thunk to fetch assignments from Firestore by an array of IDs
export const fetchConsultantDashboardAssignments = createAsyncThunk(
  "consultantDashboard/fetchConsultantDashboardAssignments",
  async (consultantId: string) => {
    try {
      const snapshot = await getConsultantDashboardAssignments(consultantId);
      console.log('getTasksDueThisWeekConsultantDashboard', snapshot);
      return snapshot;
    } catch (error) {
      console.error("Error fetching consultant dashboard assignments:", error);
      throw error;
    }
  }
)

const initialState: Assignment[] = []

// Create a slice for assignments
const consultantAssignmentsSlice = createSlice({
  name: 'consultantDashboardAssignments',
  initialState,
  reducers: {
    // Replaces state with a new list of assignments
    setAssignments(state, action) {
      return action.payload;
    },
    // Adds a new assignment to the state
    addAssignment(state, action) {
      return [...state, action.payload]
    },
    // Adds a new entry to the timeline of a specific assignment
    addEntry(state, action) {
      const { entryData, assignmentId } = action.payload;
      const assignmentIndex = state.findIndex(assignment => assignment.id === assignmentId);
      
      if (assignmentIndex !== -1) {
        // Add the new entry to the timeline array
        state[assignmentIndex].timeline.push(entryData);
      }
    },
    // Updates a specific assignment in the state
    updateAssignmentSlice(state, action) {
      const { assignmentId, updateData } = action.payload;
      const assignmentIndex = state.findIndex(assignment => assignment.id === assignmentId);
    
      if (assignmentIndex !== -1) {
          state[assignmentIndex] = { ...state[assignmentIndex], ...updateData };
      }
    },
    // Deletes an assignment from the state by its ID
    deleteDashboardAssignment(state, action) {
      const assignmentId = action.payload;
      if (state.length === 0) return state

      return state.filter((assignment) => assignment.id !== assignmentId)
    }
  },
  // Handle async actions using extraReducers for Inprogress, fulfilled, and rejected states
  extraReducers: (builder) => {
    builder
    .addCase(fetchConsultantDashboardAssignments.fulfilled, (state, action) => {
      return action.payload as Assignment[];
    })
    .addCase(fetchConsultantDashboardAssignments.rejected, (state, action) => {
      console.error("fetchConsultantAssignments rejected:", action.payload);
      return state;
    })
  },
});

export const { setAssignments, addAssignment, addEntry, updateAssignmentSlice, deleteDashboardAssignment } = consultantAssignmentsSlice.actions;
export default consultantAssignmentsSlice.reducer;