import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ToastState {
  message: string | null;
  type: 'success' | 'error';
  isVisible: boolean;
}

const initialState: ToastState = {
  message: null,
  type: 'success',
  isVisible: false,
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<{ message: string; type?: 'success' | 'error' }>) => {
      state.message = action.payload.message;
      state.type = action.payload.type || 'success';
      state.isVisible = true;
    },
    hideToast: (state) => {
      state.isVisible = false;
      state.message = null;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer; 