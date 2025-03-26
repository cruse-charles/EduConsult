import { db } from '@/lib/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { Student } from '@/lib/types/types';


export const fetchStudent = createAsyncThunk(
    'student/fetchStudent',
    async (studentId: string) => {
        const docRef = doc(db, "studentUsers", studentId);
        const docSnap = await getDoc(docRef);
        return {id: docSnap.id, ...docSnap.data()};
    }
);

const initialState: Partial<Student> = {}

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    // setStudent(state, action) {
    //   return action.payload;
    // },
    updateFolders(state, action) {
      if (!state.folders) return
      if (!state.folders.includes(action.payload)) {
        state.folders = [...state.folders, action.payload];
      }
    },
    updateAssignmentDocIds(state, action) {
      if (!state.assignmentDocIds) return;
      state.assignmentDocIds = [...state.assignmentDocIds, action.payload];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStudent.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});


export const { 
  // setStudent, 
  updateFolders, updateAssignmentDocIds } = studentSlice.actions;
export default studentSlice.reducer;