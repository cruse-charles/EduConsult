import { db } from "@/lib/firebaseConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";

export const fetchAssignments = createAsyncThunk(
    'student/fetchAssignments',
    async (assignmentsDocId: string) => {
        const assignmentRef = doc(db, "assignments", assignmentsDocId)
        const assignmentSnapshot = await getDoc(assignmentRef)
        return {id: assignmentSnapshot.id, ...assignmentSnapshot.data()};
    }
);


// const initialState = {}

const initialState = {
  assignments: [],
  id: null,
  student: null,
  consultant: null,
}


const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    setAssignments(state, action) {
      return action.payload;
    },
    addAssignment(state, action) {
      if (state) state.assignments = [...state.assignments, action.payload];
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