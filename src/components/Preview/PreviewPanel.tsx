import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, Icon, FontAwesomeIconType, MaterialIconType } from '../../types';
import { setSize, setColor, setSelectedIcon } from '../../store/slices/previewSlice';
import ColorPicker from './ColorPicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactDOMServer from 'react-dom/server';

const PreviewPanel: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedIcon, size, color } = useSelector(
    (state: RootState) => state.preview
  );

  const renderIcon = (icon: Icon) => {
    const commonStyle = { color, width: size, height: size };

    if (icon.library === 'fontawesome') {
      const faIcon = icon as FontAwesomeIconType;
      return (
        <FontAwesomeIcon 
          icon={faIcon.props.icon}
          style={commonStyle}
        />
      );
    }
    
    if (icon.library === 'material') {
      const MaterialIcon = icon.component;
      return (
        <MaterialIcon
          path={(icon as MaterialIconType).props.path}
          style={commonStyle}
        />
      );
    }
    
    const HeroIcon = icon.component;
    return <HeroIcon style={commonStyle} />;
  };

  const getIconHtml = (icon: Icon): string => {
    // Render the icon using the existing renderIcon function
    const renderedIcon = renderIcon(icon);
    // Convert the React element to HTML string
    return ReactDOMServer.renderToString(renderedIcon);
  };

  const handleFloatIcon = async () => {
    if (!selectedIcon) return;

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.id) return;

      // First inject Font Awesome if it's a FA icon
      if (selectedIcon.library === 'fontawesome') {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            if (!document.querySelector('link[href*="fontawesome"]')) {
              const link = document.createElement('link');
              link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
              link.rel = 'stylesheet';
              document.head.appendChild(link);
            }
          }
        });
      }

      await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        css: `
          .floating-icon {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 999999;
            cursor: move;
            display: flex;
            align-items: center;
            justify-content: center;
            user-select: none;
          }
          .floating-icon i,
          .floating-icon svg {
            width: ${size}px !important;
            height: ${size}px !important;
            font-size: ${size}px !important;
            color: ${color} !important;
            fill: ${color} !important;
            stroke: ${color} !important;
            pointer-events: none;
          }
          .floating-icon .close-button {
            position: absolute;
            top: -10px;
            right: -10px;
            width: 20px;
            height: 20px;
            background: #ff4444;
            color: white !important;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            line-height: 1;
            z-index: 1;
            opacity: 0;
            transition: opacity 0.2s;
          }
          .floating-icon:hover .close-button {
            opacity: 1;
          }
        `
      });

      const iconHtml = getIconHtml(selectedIcon);

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (html: string) => {
          // Remove existing floating icons
          document.querySelectorAll('.floating-icon').forEach(el => el.remove());

          const div = document.createElement('div');
          div.className = 'floating-icon';
          div.innerHTML = html;

          // Add close button
          const closeButton = document.createElement('button');
          closeButton.className = 'close-button';
          closeButton.innerHTML = '×';
          closeButton.onclick = () => div.remove();
          div.appendChild(closeButton);
          
          document.body.appendChild(div);

          let isDragging = false;
          let currentX = 0;
          let currentY = 0;
          let initialX = 0;
          let initialY = 0;

          div.addEventListener('mousedown', (e) => {
            const target = e.target as HTMLElement;
            if (target && target.className === 'close-button') return;
            isDragging = true;
            const rect = div.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;
            div.style.transition = 'none';
          });

          document.addEventListener('mousemove', (e) => {
            if (isDragging) {
              e.preventDefault();
              currentX = e.clientX - initialX;
              currentY = e.clientY - initialY;
              div.style.left = `${currentX}px`;
              div.style.top = `${currentY}px`;
              div.style.transform = 'none';
            }
          });

          document.addEventListener('mouseup', () => {
            isDragging = false;
            div.style.transition = 'transform 0.2s';
          });
        },
        args: [iconHtml]
      });

    } catch (error) {
      console.error('Error creating floating icon:', error);
    }
  };

  if (!selectedIcon) {
    return null;
  }

  return (
    <div className="h-full flex flex-col bg-white/95 backdrop-blur-sm w-full p-4">
      {/* Header */}
      <div className="glass-effect border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(setSelectedIcon(null))}
            className="text-gray-500 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100/80
                     transition-all duration-200 active:transform active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 className="text-sm font-medium text-gray-800">Customize Icon</h3>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-4 space-y-5 overflow-y-auto">
        {/* Icon Preview */}
        <div className="flex justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200/50">
          <div className="p-5 bg-white rounded-lg shadow-sm ring-1 ring-gray-200/50">
            {renderIcon(selectedIcon)}
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Size and Color Controls */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            {/* Size Control */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-gray-700">Size</label>
                <span className="text-xs font-medium text-gray-500 tabular-nums">{size}px</span>
              </div>
              <input
                type="range"
                min="16"
                max="128"
                value={size}
                onChange={(e) => dispatch(setSize(Number(e.target.value)))}
                className="w-full"
              />
            </div>

            {/* Color Control */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
              <ColorPicker
                color={color}
                onChange={(color) => dispatch(setColor(color))}
              />
            </div>
          </div>
        </div>

        {/* Float Icon Button */}
        <button
          onClick={handleFloatIcon}
          className="btn-primary w-full py-2.5 px-4 text-sm
                   flex items-center justify-center gap-2 group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Float Icon
        </button>
      </div>
    </div>
  );
};

export default PreviewPanel;