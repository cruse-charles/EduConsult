import { db } from "@/lib/firebaseConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";

import { AssignmentDoc } from "@/lib/types/types";

export const fetchAssignments = createAsyncThunk(
    'student/fetchAssignments',
    async (assignmentsDocId: string) => {
        const assignmentRef = doc(db, "assignments", assignmentsDocId)
        const assignmentSnapshot = await getDoc(assignmentRef)
        return {id: assignmentSnapshot.id, ...assignmentSnapshot.data()};
    }
);

const initialState = {}


const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    setAssignments(state, action) {
      return action.payload;
    },
    addAssignment(state, action) {
        const assignments = state as AssignmentDoc
        if (state) assignments.assignments = [...assignments.assignments, action.payload];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAssignments.fulfilled, (state, action) => {
        console.log("REDUCER HIT: fetchAssignments.fulfilled");
        console.log("Payload:", action.payload);
      return action.payload;
    });
  },
});

export const { setAssignments, addAssignment } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;