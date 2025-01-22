import React from 'react';
import { useDispatch } from 'react-redux';
import { Icon, FontAwesomeIconType } from '../../types';
import { setSelectedIcon } from '../../store/slices/previewSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IconCardProps {
  icon: Icon;
}

const IconCard: React.FC<IconCardProps> = ({ icon }) => {
  const dispatch = useDispatch();
  const IconComponent = icon.component;

  const handleClick = () => {
    dispatch(setSelectedIcon(icon));
  };

  const renderIcon = () => {
    const commonStyle: React.CSSProperties = {
      width: '1.5rem',
      height: '1.5rem',
    };

    if (icon.library === 'fontawesome') {
      const faIcon = icon as FontAwesomeIconType;
      return (
        <FontAwesomeIcon
          icon={faIcon.props.icon}
          className="w-6 h-6"
          style={commonStyle}
        />
      );
    }

    if (icon.library === 'material') {
      return (
        <IconComponent
              path={icon.props.path}
              className="w-6 h-6"
              style={commonStyle} icon={'function'}        />
      );
    }

    return (
      <IconComponent
            className="w-6 h-6"
            style={commonStyle} icon={'function'} path={''}      />
    );
  };

  return (
    <div 
      className="p-3 border rounded-lg hover:border-primary-500 cursor-pointer 
                 transition-all duration-200 flex flex-col items-center 
                 hover:shadow-md"
      onClick={handleClick}
    >
      <div className="w-8 h-8 flex items-center justify-center text-gray-700">
        {renderIcon()}
      </div>
      <div className="text-xs text-center mt-2 truncate w-full text-gray-600">
        {icon.name}
      </div>
    </div>
  );
};

export default IconCard;
