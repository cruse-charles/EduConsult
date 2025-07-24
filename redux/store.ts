import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import type { UnknownAction } from 'redux';

import currentStudentReducer from './slices/currentStudentSlice';
import currentStudentAssignmentReducer from './slices/currentStudentAssignmentsSlice';
import userReducer from './slices/userSlice';
import consultantAssignmentReducer from './slices/consultantAssignmentSlice';
import onboardingReducer from './slices/onboardingSlice';
import currentAssignmentReducer from './slices/currentAssignmentSlice';
import studentsReducer from './slices/studentsSlice'
import { resetStore } from './slices/resetSlice';

// Combine all  individual slice reducers into a single app-level reducer
const appReducer = combineReducers({
  currentStudent: currentStudentReducer,
  currentStudentAssignments: currentStudentAssignmentReducer,
  consultantDashboardAssignments: consultantAssignmentReducer,
  user: userReducer,
  onboarding: onboardingReducer,
  currentAssignment: currentAssignmentReducer,
  students: studentsReducer
})

type AppState = ReturnType<typeof appReducer>;

// Define a root reducer that listens for the resetStore action to clear all state
const rootReducer = (state: AppState | undefined, action: UnknownAction): AppState => {
  if (action.type === resetStore.type) {
    state = undefined;
  }
  return appReducer(state, action);
}

// Configuration for redux-persist
const persistConfig = {
  key: 'root',
  storage,
}

// Create a persisted version of the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Create and configure the Redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check to allow storing non-serializable data like Dates or Firestore refs
    })
})

// Create a persistor object to control rehydration and persisting
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;