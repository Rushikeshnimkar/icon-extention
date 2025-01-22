import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedLibrary, setIcons, setLoading } from '../../store/slices/iconSlice';
import { RootState } from '../../types';
import { iconLibraries } from '../../services/iconLibraries';
import { loadIcons } from '../../services/iconLibraries';

type LibraryCounts = {
  [key: string]: number;
  all: number;
  fontawesome: number;
  heroicons: number;
  material: number;
};

const LibrarySelector: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedLibrary, icons } = useSelector((state: RootState) => state.icons);

  // Function to reload icons
  const reloadIcons = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setIcons([])); // Clear current icons
      const freshIcons = await loadIcons();
      dispatch(setIcons(freshIcons));
    } catch (error) {
      console.error('Error reloading icons:', error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const handleLibraryChange = async (libraryId: string) => {
    if (libraryId !== selectedLibrary) {
      dispatch(setLoading(true));
      dispatch(setSelectedLibrary(libraryId));
      await reloadIcons(); // Reload icons when changing libraries
    }
  };

  // Calculate icon counts per library
  const libraryCounts = React.useMemo(() => {
    const counts: LibraryCounts = {
      all: icons.length,
      fontawesome: 0,
      heroicons: 0,
      material: 0
    };
    
    icons.forEach(icon => {
      if (icon.library in counts) {
        counts[icon.library] += 1;
      }
    });
    
    return counts;
  }, [icons]);

  const renderLibraryButton = (id: string, name: string, icon?: string) => (
    <button
      key={id}
      onClick={() => handleLibraryChange(id)}
      className={`
        group relative flex items-center gap-2 px-3.5 py-1.5
        rounded-lg text-sm font-medium transition-all duration-200
        ${selectedLibrary === id
          ? 'bg-primary-500/10 text-primary-600 ring-1 ring-primary-500/20'
          : 'bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 shadow-sm ring-1 ring-gray-200'
        }
      `}
    >
      {icon && (
        <span className={`
          text-sm transition-transform duration-200
          ${selectedLibrary === id ? 'scale-110' : 'group-hover:scale-110'}
        `}>
          {icon}
        </span>
      )}
      <span>{name}</span>
      <span className={`
        px-1.5 py-0.5 text-xs rounded-full
        ${selectedLibrary === id
          ? 'bg-primary-500 text-white'
          : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
        }
      `}>
        {libraryCounts[id as keyof LibraryCounts]}
      </span>
    </button>
  );

  return (
    <div className="px-4 py-2.5 border-b bg-white">
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          {renderLibraryButton('all', 'All', '🎨')}
          {renderLibraryButton('fontawesome', 'FA', '🎯')}
          {renderLibraryButton('heroicons', 'Hero', '⚡')}
          {renderLibraryButton('material', 'MD', '💎')}
        </div>
        
        <button
          onClick={reloadIcons}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5
            bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-500 
            hover:text-gray-700 transition-all duration-200 text-sm font-medium
            ring-1 ring-gray-200"
        >
          <svg 
            className="w-3.5 h-3.5 transition-transform duration-500 ease-in-out
              group-hover:rotate-180" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
          <span>Reload</span>
        </button>
      </div>
    </div>
  );
};

export default LibrarySelector;