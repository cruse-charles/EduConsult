import { db } from '@/lib/firebaseConfig';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc } from 'firebase/firestore';

export const fetchStudent = createAsyncThunk(
    'student/fetchStudent',
    async (studentId: string) => {
        const docRef = doc(db, "studentUsers", studentId);
        const docSnap = await getDoc(docRef);
        return {id: docSnap.id, ...docSnap.data()};
    }
);

const initialState = {}

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setStudent(state, action) {
      return action.payload;
    },
    updateFolders(state, action) {
      if (state.folders.includes(action.payload)) {
        state.folders = state.folders;
      } else {
        state.folders = [...state.folders, action.payload];
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStudent.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});


export const { setStudent, updateFolders } = studentSlice.actions;
export default studentSlice.reducer;