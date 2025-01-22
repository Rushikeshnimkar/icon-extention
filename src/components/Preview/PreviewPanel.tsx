import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, Icon, FontAwesomeIconType, MaterialIconType } from '../../types';
import { setSize, setColor } from '../../store/slices/previewSlice';
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
    <div className="border-t p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Preview</h3>
        <button
          onClick={handleFloatIcon}
          className="px-3 py-1 text-sm rounded-md bg-primary-500 text-white 
                   hover:bg-primary-600 transition-colors"
        >
          Float Icon
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
          {renderIcon(selectedIcon)}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Size</label>
            <input
              type="range"
              min="16"
              max="128"
              value={size}
              onChange={(e) => dispatch(setSize(Number(e.target.value)))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Color</label>
            <ColorPicker
              color={color}
              onChange={(color) => dispatch(setColor(color))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;