import { configureStore } from '@reduxjs/toolkit';
import iconReducer from './slices/iconSlice';
import previewReducer from './slices/previewSlice';
import toastReducer from './slices/toastSlice';

export const store = configureStore({
  reducer: {
    icons: iconReducer,
    preview: previewReducer,
    toast: toastReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
