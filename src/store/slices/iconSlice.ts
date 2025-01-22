import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Icon } from '../../types';

interface IconState {
  icons: Icon[];
  searchQuery: string;
  selectedLibrary: string;
  loading: boolean;
}

const initialState: IconState = {
  icons: [],
  searchQuery: '',
  selectedLibrary: 'all',
  loading: false,
};

const iconSlice = createSlice({
  name: 'icons',
  initialState,
  reducers: {
    setIcons: (state, action: PayloadAction<Icon[]>) => {
      state.icons = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedLibrary: (state, action: PayloadAction<string>) => {
      state.selectedLibrary = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

// Simple selector for filtered icons
export const selectFilteredIcons = (state: { icons: IconState }): Icon[] => {
  const { icons, selectedLibrary, searchQuery } = state.icons;
  
  return icons.filter(icon => {
    const matchesLibrary = selectedLibrary === 'all' || icon.library === selectedLibrary;
    const matchesSearch = !searchQuery || 
      icon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      icon.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesLibrary && matchesSearch;
  });
};

export const {
  setIcons,
  setSearchQuery,
  setSelectedLibrary,
  setLoading,
} = iconSlice.actions;

export default iconSlice.reducer;
