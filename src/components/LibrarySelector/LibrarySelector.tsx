import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedLibrary } from '../../store/slices/iconSlice';
import { RootState } from '../../types';
import { iconLibraries } from '../../services/iconLibraries';

const LibrarySelector: React.FC = () => {
  const dispatch = useDispatch();
  const selectedLibrary = useSelector((state: RootState) => state.icons.selectedLibrary);

  return (
    <div className="flex space-x-2 p-4 border-b">
      <button
        onClick={() => dispatch(setSelectedLibrary('all'))}
        className={`px-3 py-1 rounded-md text-sm ${
          selectedLibrary === 'all'
            ? 'bg-primary-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      {iconLibraries.map((library) => (
        <button
          key={library.id}
          onClick={() => dispatch(setSelectedLibrary(library.id))}
          className={`px-3 py-1 rounded-md text-sm ${
            selectedLibrary === library.id
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {library.name}
        </button>
      ))}
    </div>
  );
};

export default LibrarySelector;