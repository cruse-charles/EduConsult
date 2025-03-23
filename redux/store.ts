import { configureStore } from '@reduxjs/toolkit';
import studentReducer from './slices/studentSlice';
import assignmentReducer from './slices/assignmentsSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    student: studentReducer,
    assignments: assignmentReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;