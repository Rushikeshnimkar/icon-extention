import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery } from '../../store/slices/iconSlice';
import { RootState } from '../../store/store';
import debounce from 'lodash/debounce';

const SearchBar: React.FC = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector((state: RootState) => state.icons.searchQuery);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      dispatch(setSearchQuery(value));
    }, 300),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  return (
    <div className="p-4">
      <div className="relative">
        <input
          type="text"
          className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none 
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
      </div>
    </div>
  );
};

export default SearchBar;
