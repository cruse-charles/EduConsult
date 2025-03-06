import { configureStore } from '@reduxjs/toolkit';
import studentReducer from './slices/studentSlice';
import assignmentReducer from './slices/assignmentsSlice';

export const store = configureStore({
  reducer: {
    student: studentReducer,
    assignments: assignmentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;