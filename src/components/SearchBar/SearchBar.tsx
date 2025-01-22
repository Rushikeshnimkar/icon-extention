import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery, setIcons, setLoading } from '../../store/slices/iconSlice';
import { RootState } from '../../types';
import { loadIcons } from '../../services/iconLibraries';
import debounce from 'lodash/debounce';

const SearchBar: React.FC = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector((state: RootState) => state.icons.searchQuery);

  const reloadAndSearch = useCallback(async (value: string) => {
    try {
      dispatch(setLoading(true));
      dispatch(setSearchQuery(value));
      dispatch(setIcons([])); // Clear current icons
      const freshIcons = await loadIcons();
      dispatch(setIcons(freshIcons));
    } catch (error) {
      console.error('Error reloading icons:', error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      reloadAndSearch(value);
    }, 300),
    [reloadAndSearch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedSearch(value);
  };

  const handleClear = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setSearchQuery(''));
      dispatch(setIcons([])); // Clear current icons
      if (document.querySelector('input')) {
        (document.querySelector('input') as HTMLInputElement).value = '';
      }
      const freshIcons = await loadIcons();
      dispatch(setIcons(freshIcons));
    } catch (error) {
      console.error('Error reloading icons:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="p-4">
      <div className="relative">
        <input
          type="text"
          className="w-full px-4 py-2 pl-10 pr-10 border rounded-lg focus:outline-none 
                     focus:ring-2 focus:ring-primary-500"
          placeholder="Search icons..."
          defaultValue={searchQuery}
          onChange={handleChange}
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 
                     text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
