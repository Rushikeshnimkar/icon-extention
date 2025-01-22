import React, { useState, useRef, useEffect } from 'react';
import { ChromePicker } from 'react-color';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={pickerRef}>
      <div
        className="w-full h-10 rounded-md border cursor-pointer flex items-center px-3"
        style={{ backgroundColor: color }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm" style={{ 
          color: getContrastColor(color),
          mixBlendMode: 'difference'
        }}>
          {color}
        </span>
      </div>
      
      {isOpen && (
        <div className="absolute z-10 mt-2">
          <ChromePicker
            color={color}
            onChange={(color) => onChange(color.hex)}
            disableAlpha
          />
        </div>
      )}
    </div>
  );
};

// Helper function to determine text color based on background
const getContrastColor = (hexcolor: string): string => {
  const r = parseInt(hexcolor.slice(1, 3), 16);
  const g = parseInt(hexcolor.slice(3, 5), 16);
  const b = parseInt(hexcolor.slice(5, 7), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#000000' : '#FFFFFF';
};

export default ColorPicker;
