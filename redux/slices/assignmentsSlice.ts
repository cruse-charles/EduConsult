import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { Assignment } from "@/lib/types/types";

// Async thunk to fetch assignments from Firestore by an array of IDs
export const fetchAssignments = createAsyncThunk(
  "assignments/fetchAssignments",
  async (assignmentsDocIds: string[], {rejectWithValue}) => {
    try {
      // Fetch all assignments in parallel
      console.log("fetching assignemtns...")
      const assignments = await Promise.all(
        assignmentsDocIds.map(async (assignmentDocId) => {
          // Get a reference to the assignment document and fetch its snapshot
          const assignmentRef = doc(db, "assignments", assignmentDocId);
          const assignmentSnapshot = await getDoc(assignmentRef);

          if (!assignmentSnapshot.exists()) {
            throw new Error(`Assignment with ID ${assignmentDocId} not found`);
          }

          // Extract data from the snapshot
          const data = assignmentSnapshot.data();
          
          // Ensure all required Assignment fields are present
          return {
            id: assignmentSnapshot.id,
            title: data?.title || '',
            type: data?.type || '',
            priority: data?.priority || '',
            dueDate: data?.dueDate || undefined,
            note: data?.note || '',
            createdAt: data?.createdAt || null,
            student: data?.student || '',
            folder: data?.folder || '',
            status: data?.status || '',
            timeline: data?.timeline || [],
            ...data,
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
const assignmentsSlice = createSlice({
  name: 'assignments',
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
    deleteAssignmentSlice(state, action) {
      const assignmentId = action.payload;
      return state.filter((assignment) => assignment.id !== assignmentId)
    }
  },
  // Handle async actions using extraReducers for pending, fulfilled, and rejected states
  extraReducers: (builder) => {
    builder.addCase(fetchAssignments.fulfilled, (state, action) => {
      return action.payload;
    }) 
    .addCase(fetchAssignments.rejected, (state, action) => {
      console.error("fetchAssignments rejected:", action.payload);
      return state;
  });;
  },
});

export const { setAssignments, addAssignment, addEntry, updateAssignmentSlice, deleteAssignmentSlice } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;