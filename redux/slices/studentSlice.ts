import { db } from '@/lib/firebaseConfig';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc } from 'firebase/firestore';

// export const fetchStudent = createAsyncThunk(
//     'student/fetchStudent',
//     async (studentId: string) => {
//         const docRef = doc(db, "studentUsers", studentId);
//         const docSnap = await getDoc(docRef);
//         return {id: docSnap.id, ...docSnap.data()};
//     }
// );

// const initialState = null

// const studentSlice = createSlice({
//   name: 'student',
//   initialState,
//   reducers: {
//     setStudent(state, action) {
//       return action.payload;
//     },
//     updateAssignments(state, action) {
//       if (state) state.assignments = action.payload;
//     },
//     updateFolders(state, action) {
//       if (state) state.folders = action.payload;
//     },
//   },
//   // Add extraReducers to handle the async thunk
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchStudent.fulfilled, (state, action) => {
//         return action.payload;
//       });
//   },
// });

const initialState = {}

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setStudent(state, action) {
      return action.payload;
    },
    updateAssignments(state, action) {
      if (state) state.assignments = action.payload;
    },
    updateFolders(state, action) {
      if (state) state.folders = action.payload;
    },
  },
});

export const { setStudent, updateFolders } = studentSlice.actions;
export default studentSlice.reducer;