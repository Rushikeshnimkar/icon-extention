import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Icon } from '../../types';

interface PreviewState {
  selectedIcon: Icon | null;
  size: number;
  color: string;
  isVisible: boolean;
}

const initialState: PreviewState = {
  selectedIcon: null,
  size: 24,
  color: '#000000',
  isVisible: false,
};

const previewSlice = createSlice({
  name: 'preview',
  initialState,
  reducers: {
    setSelectedIcon: (state, action: PayloadAction<Icon | null>) => {
      state.selectedIcon = action.payload;
      state.isVisible = !!action.payload;
    },
    setSize: (state, action: PayloadAction<number>) => {
      state.size = Math.max(16, Math.min(128, action.payload));
    },
    setColor: (state, action: PayloadAction<string>) => {
      state.color = action.payload;
    },
    setVisibility: (state, action: PayloadAction<boolean>) => {
      state.isVisible = action.payload;
    },
    resetPreview: () => initialState,
  },
});

export const {
  setSelectedIcon,
  setSize,
  setColor,
  setVisibility,
  resetPreview,
} = previewSlice.actions;

export default previewSlice.reducer;
