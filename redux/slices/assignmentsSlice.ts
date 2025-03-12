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

export const { setAssignments, addAssignment } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;