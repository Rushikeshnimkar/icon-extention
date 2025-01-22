import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Icon } from '../../types';

interface IconState {
  icons: Icon[];
  searchQuery: string;
  selectedLibrary: string;
  loading: boolean;
  filteredIcons: Icon[];
}

const initialState: IconState = {
  icons: [],
  searchQuery: '',
  selectedLibrary: 'all',
  loading: false,
  filteredIcons: [],
};

const iconSlice = createSlice({
  name: 'icons',
  initialState,
  reducers: {
    setIcons: (state, action: PayloadAction<Icon[]>) => {
      state.icons = action.payload;
      state.filteredIcons = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filteredIcons = filterIcons(state.icons, state.selectedLibrary, action.payload);
    },
    setSelectedLibrary: (state, action: PayloadAction<string>) => {
      state.selectedLibrary = action.payload;
      state.filteredIcons = filterIcons(state.icons, action.payload, state.searchQuery);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

// Helper function to filter icons
const filterIcons = (icons: Icon[], library: string, query: string): Icon[] => {
  return icons.filter(icon => {
    const matchesLibrary = library === 'all' || icon.library === library;
    const matchesSearch = !query || 
      icon.name.toLowerCase().includes(query.toLowerCase()) ||
      icon.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
    
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
