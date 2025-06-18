import { db } from '@/lib/firebaseConfig';
import { doc, getDoc, Timestamp } from 'firebase/firestore';

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
    updateFolders(state, action) {
      if (!state.folders) return
      if (!state.folders.includes(action.payload)) {
        state.folders = [...state.folders, action.payload];
      }
    },
    // TODO: Rename this to addAssignmentDocId, this doesn't account for deletion
    updateAssignmentDocIds(state, action) {
      if (!state.assignmentDocIds) return;
      state.assignmentDocIds = [...state.assignmentDocIds, action.payload];
    },
    removeAssignmentDocId(state, action) {
      const deletedAssignmentDocId = action.payload
      if (!state.assignmentDocIds) return
      state.assignmentDocIds = state.assignmentDocIds.filter((assignmentDocId) => assignmentDocId != deletedAssignmentDocId)
    },
    updateReduxInProgressCount(state, action) {
      if (!state.stats) return;

      const { newStatus, oldStatus } = action.payload;
      console.log('in reducer action payload', action.payload)
      console.log('newstatus && oldstatus', newStatus, oldStatus)

      // Case 1: Create new In-Progress
      if (newStatus === "In-Progress" && !oldStatus) {
        state.stats.inProgressAssignmentsCount += 1;
        console.log('Case 1')
        return;
      }

      // Case 2: In-Progress → Non-In-Progress
      if (oldStatus === "In-Progress" && newStatus !== "In-Progress") {
        state.stats.inProgressAssignmentsCount = Math.max(
          0,
          state.stats.inProgressAssignmentsCount - 1
        );
        console.log('Case 2')
        return;
      }

      // Case 3: Non-In-Progress → In-Progress
      if (oldStatus !== "In-Progress" && newStatus === "In-Progress") {
        state.stats.inProgressAssignmentsCount += 1;
        console.log('Case 3')
        return;
      }

      // Case 4: In-Progress → Deleted
      if (oldStatus === 'In-Progress' && newStatus === 'Deleted') {
        state.stats.inProgressAssignmentsCount = Math.max(0, state.stats.inProgressAssignmentsCount - 1)
      }
      console.log('Case4')
      return
    },
    updateStudentInformation(state, action) {
      return {...state, ...action.payload}
    },
    removeFolder(state, action) {
      state.folders = state.folders?.filter((folder) => folder !== action.payload)
    },
    renameFolderInStudentSlice(state, action) {
      const { oldFolderName, newFolderName } = action.payload;
      state.folders = state.folders?.map((folder) => folder === oldFolderName ? newFolderName : folder);
    },
    checkReduxNextDeadline(state, action) {
      if (!state.stats) {
        return
      }
      
      if (!state.stats.nextDeadline) state.stats.nextDeadline = action.payload

      const now = Timestamp.fromDate(new Date());
      const currentDeadline = state.stats.nextDeadline
      const newDeadline = action.payload instanceof Timestamp ? action.payload : Timestamp.fromDate(action.payload);
      
      if (!currentDeadline || !newDeadline || !state.stats.nextDeadline) {
        console.log('next deadline error in student slice redux')
        return
      }

      // If the current next deadline is in the past and the new due date is in the future, update it
      if (currentDeadline?.seconds < now.seconds && newDeadline.seconds >= now.seconds) {
          state.stats.nextDeadline = newDeadline
      // If the new due date is earlier than the current next deadline and both are in the future, update it
      } else if (
          currentDeadline?.seconds >= now.seconds &&
          newDeadline.seconds >= now.seconds &&
          newDeadline.seconds < currentDeadline?.seconds
      ) {
          state.stats.nextDeadline = newDeadline
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStudent.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});


export const { updateFolders, updateAssignmentDocIds, removeAssignmentDocId, updateReduxInProgressCount, updateStudentInformation, removeFolder, renameFolderInStudentSlice, checkReduxNextDeadline } = studentSlice.actions;
export default studentSlice.reducer;