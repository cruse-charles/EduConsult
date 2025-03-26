import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import type { UnknownAction } from 'redux';

import studentReducer from './slices/studentSlice';
import assignmentReducer from './slices/assignmentsSlice';
import userReducer from './slices/userSlice';
import { resetStore } from './slices/resetSlice';

const appReducer = combineReducers({
  student: studentReducer,
  assignments: assignmentReducer,
  user: userReducer,
})

type AppState = ReturnType<typeof appReducer>;

const rootReducer = (state: AppState | undefined, action: UnknownAction): AppState => {
  if (action.type === resetStore.type) {
    state = undefined;
  }
  return appReducer(state, action);
}

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
})

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;