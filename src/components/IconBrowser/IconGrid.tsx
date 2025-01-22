import React from 'react';
import { useSelector } from 'react-redux';
import { selectFilteredIcons } from '../../store/slices/iconSlice';
import { RootState } from '../../types';
import IconCard from './IconCard';

const IconGrid: React.FC = () => {
  const icons = useSelector((state: RootState) => selectFilteredIcons(state));
  const loading = useSelector((state: RootState) => state.icons.loading);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (icons.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No icons found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4 p-4">
      {icons.map(icon => (
        <IconCard key={icon.id} icon={icon} />
      ))}
    </div>
  );
};

export default IconGrid;
