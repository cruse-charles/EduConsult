import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from 'firebase/firestore';

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { Assignment } from "@/lib/types/types";
import { RootState } from "../store";

// Async thunk to fetch assignments from Firestore by an array of IDs
export const fetchAssignments = createAsyncThunk(
  "currentStudentAssignments/fetchAssignments",
  async (assignmentsDocIds: string[], {rejectWithValue, getState}) => {
    try {
      const state = getState() as RootState;
      const assignmentsMetaData = state.user.assignmentsMetaData

      // Fetch all assignments in parallel
      const assignments = await Promise.all(
        assignmentsDocIds.map(async (assignmentDocId) => {
          // Get a reference to the assignment document and fetch its snapshot
          const assignmentRef = doc(db, "assignments", assignmentDocId);
          const assignmentSnapshot = await getDoc(assignmentRef);

          if (!assignmentSnapshot.exists()) {
            throw new Error(`Assignment with ID ${assignmentDocId} not found`);
          }

          // Extract data from the snapshot
          const assignmentData = assignmentSnapshot.data();

          // const assignmentMetaData = assignmentsMetaData.find((meta) => meta.id === assignmentDocId)
            const assignmentMetaData = assignmentsMetaData[assignmentDocId]

          // Ensure all required Assignment fields are present
          return {
            id: assignmentDocId,
            ...assignmentData,
            hasRead: assignmentMetaData?.hasRead
          } as Assignment;
        })
      );
      return assignments;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const initialState: Assignment[] = []

// Create a slice for assignments
const studentAssignmentsSlice = createSlice({
  name: 'currentStudentAssignments',
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
    clearAssignments(state) {
      return []
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
    updateAssignmentsSlice(state, action) {
      const { assignmentId, updateData } = action.payload;
      const assignmentIndex = state.findIndex(assignment => assignment.id === assignmentId);
    
      if (assignmentIndex !== -1) {
          state[assignmentIndex] = { ...state[assignmentIndex], ...updateData };
      }
    },
    // Deletes an assignment from the state by its ID
    deleteAssignmentSlice(state, action) {
      const assignmentId = action.payload;
      return state.filter((assignment) => assignment.id !== assignmentId)
    },
    renameFolderInStudentAssignmentsSlice(state, action) {
      const { oldFolderName, newFolderName } = action.payload;
      state.map((assignment) => {
        if (assignment.folder === oldFolderName) {
          assignment.folder = newFolderName;
          return assignment;
        }
      })
    },
    readAssignmentSlice(state, action) {
      const assignment = state.find(assignment => assignment.id === action.payload);
      // state[action.payload].hasRead = true

      if (assignment) {
        assignment.hasRead = true
      }
    }
  },
  // Handle async actions using extraReducers for in-rogress, fulfilled, and rejected states
  extraReducers: (builder) => {
    builder
    .addCase(fetchAssignments.fulfilled, (state, action) => {
      return action.payload;
    }) 
    .addCase(fetchAssignments.rejected, (state, action) => {
      console.error("fetchAssignments rejected:", action.payload);
      return state;
    })
  },
});

export const { setAssignments, addAssignment, addEntry, updateAssignmentsSlice, deleteAssignmentSlice, clearAssignments, renameFolderInStudentAssignmentsSlice, readAssignmentSlice } = studentAssignmentsSlice.actions;
export default studentAssignmentsSlice.reducer;