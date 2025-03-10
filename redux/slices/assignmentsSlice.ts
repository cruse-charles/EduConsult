import { db } from "@/lib/firebaseConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";

import { AssignmentDoc } from "@/lib/types/types";

// old
// export const fetchAssignments = createAsyncThunk(
//     'student/fetchAssignments',
//     async (assignmentsDocId: string) => {
//         const assignmentRef = doc(db, "assignments", assignmentsDocId)
//         const assignmentSnapshot = await getDoc(assignmentRef)
//         return {id: assignmentSnapshot.id, ...assignmentSnapshot.data()};
//     }
// );
// old


// new
export const fetchAssignments = createAsyncThunk(
  "student/fetchAssignments",
  async (assignmentsDocIds: string[]) => {
    try {
      const assignments = await Promise.all(
        assignmentsDocIds.map(async (assignmentDocId) => {
          const assignmentRef = doc(db, "assignments", assignmentDocId);
          const assignmentSnapshot = await getDoc(assignmentRef);

          if (!assignmentSnapshot.exists()) {
            throw new Error(`Assignment with ID ${assignmentDocId} not found`);
          }

          return {
            id: assignmentSnapshot.id,
            ...assignmentSnapshot.data(),
          };
        })
      );
      return assignments;
    } catch (error) {
      return console.error(error.message);
    }
  }
);
// new

// old
// const initialState = {}
// old

// new
const initialState = []
// new


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
      return action.payload;
    }) 
    .addCase(fetchAssignments.rejected, (state, action) => {
      console.error("fetchAssignments rejected:", action.payload);
      return [];
  });;
  },
});

export const { setAssignments, addAssignment } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;