import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadIcons } from './services/iconLibraries';
import { setIcons, setLoading } from './store/slices/iconSlice';
import { RootState } from './types';
import Content from './content/content';
import PreviewPanel from './components/Preview/PreviewPanel';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const isVisible = useSelector((state: RootState) => state.preview.isVisible);
  const isLoading = useSelector((state: RootState) => state.icons.loading);

  useEffect(() => {
    const initializeIcons = async () => {
      try {
        dispatch(setLoading(true));
        const icons = await loadIcons();
        dispatch(setIcons(icons));
      } catch (error) {
        console.error('Failed to load icons:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    initializeIcons();
  }, [dispatch]);

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-3 py-2 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-medium text-gray-800">Icons</h1>
          {isLoading && (
            <div className="flex items-center text-xs text-gray-500">
              <svg className="animate-spin h-3 w-3 mr-1" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {!isVisible ? (
          <div className="flex-1 overflow-auto p-2">
            <Content />
          </div>
        ) : (
          <PreviewPanel />
        )}
      </main>
    </div>
  );
};

export default App;