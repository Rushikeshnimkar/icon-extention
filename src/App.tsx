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
    <div className="h-[600px] w-[800px] flex flex-col">
      <header className="bg-white border-b px-4 py-3">
        <h1 className="text-xl font-semibold text-gray-800">Icon Browser</h1>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden">
        <Content />
        {isVisible && <PreviewPanel />}
      </main>
    </div>
  );
};

export default App;