import { db } from "@/lib/firebaseConfig";
import { Assignment } from "@/lib/types/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";

export const fetchAssignments = createAsyncThunk(
  "assignments/fetchAssignments",
  async (assignmentsDocIds: string[], {rejectWithValue}) => {
    try {
      const assignments = await Promise.all(
        assignmentsDocIds.map(async (assignmentDocId) => {
          const assignmentRef = doc(db, "assignments", assignmentDocId);
          const assignmentSnapshot = await getDoc(assignmentRef);

          if (!assignmentSnapshot.exists()) {
            throw new Error(`Assignment with ID ${assignmentDocId} not found`);
          }

          // return {
          //   id: assignmentSnapshot.id,
          //   ...assignmentSnapshot.data(),
          // };

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
            ...data, // Spread any additional fields
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

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    setAssignments(state, action) {
      return action.payload;
    },
    addAssignment(state, action) {
      return [...state, action.payload]
    },
    addEntry(state, action) {
      const { entryData, assignmentId } = action.payload;
      const assignmentIndex = state.findIndex(assignment => assignment.id === assignmentId);
      
      if (assignmentIndex !== -1) {
        // Add the new entry to the timeline array
        state[assignmentIndex].timeline.push(entryData);
      }
    },
    updateAssignmentSlice(state, action) {
      const { assignmentId, updateData } = action.payload;
      const assignmentIndex = state.findIndex(assignment => assignment.id === assignmentId);
    
      if (assignmentIndex !== -1) {
          state[assignmentIndex] = { ...state[assignmentIndex], ...updateData };
      }
    },
    deleteAssignmentSlice(state, action) {
      const assignmentId = action.payload;
      return state.filter((assignment) => assignment.id !== assignmentId)
    }
  },
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