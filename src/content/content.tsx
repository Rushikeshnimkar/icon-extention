import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../types';
import IconGrid from '../components/IconBrowser/IconGrid';
import LibrarySelector from '../components/LibrarySelector/LibrarySelector';
import SearchBar from '../components/SearchBar/SearchBar';

const Content: React.FC = () => {
  const loading = useSelector((state: RootState) => state.icons.loading);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b">
        <SearchBar />
        <LibrarySelector />
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
          </div>
        ) : (
          <IconGrid />
        )}
      </div>
    </div>
  );
};

export default Content;