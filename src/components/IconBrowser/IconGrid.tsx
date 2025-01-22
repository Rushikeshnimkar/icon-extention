import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../types';
import IconCard from './IconCard';

const IconGrid: React.FC = () => {
  const { icons, selectedLibrary, loading, searchQuery } = useSelector((state: RootState) => state.icons);

  // Filter icons based on selected library and search query
  const filteredIcons = React.useMemo(() => {
    return icons.filter(icon => {
      const matchesLibrary = selectedLibrary === 'all' || icon.library === selectedLibrary;
      const matchesSearch = !searchQuery || 
        icon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        icon.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesLibrary && matchesSearch;
    });
  }, [icons, selectedLibrary, searchQuery]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (filteredIcons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <svg className="w-12 h-12 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        <p>No icons found</p>
        {searchQuery && (
          <p className="mt-2 text-sm text-gray-400">
            Try different search terms
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4 p-4">
      {filteredIcons.map(icon => (
        <IconCard key={icon.id} icon={icon} />
      ))}
    </div>
  );
};

export default IconGrid;
