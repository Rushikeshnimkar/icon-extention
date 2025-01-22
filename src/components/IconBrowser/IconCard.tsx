import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon, FontAwesomeIconType, RootState } from '../../types';
import { setSelectedIcon } from '../../store/slices/previewSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IconCardProps {
  icon: Icon;
}

const IconCard: React.FC<IconCardProps> = ({ icon }) => {
  const dispatch = useDispatch();
  const selectedIcon = useSelector((state: RootState) => state.preview.selectedIcon);
  const IconComponent = icon.component;

  const handleClick = () => {
    dispatch(setSelectedIcon(icon));
  };

  const isSelected = selectedIcon?.id === icon.id;

  const renderIcon = () => {
    const commonStyle: React.CSSProperties = {
      width: '1.25rem',
      height: '1.25rem',
    };

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
      return (
        <IconComponent
          path={icon.props.path}
          style={commonStyle} icon={'function'}        />
      );
    }

    return <IconComponent style={commonStyle} icon={'function'} path={''} />;
  };

  return (
    <div 
      className={`
        icon-card p-2.5 border rounded-lg cursor-pointer
        hover:shadow-lg hover:border-primary-500 
        flex flex-col items-center gap-2
        ${isSelected ? 'border-primary-500 bg-primary-50/50 shadow-md' : 'border-gray-200/80 bg-white/80'}
      `}
      onClick={handleClick}
    >
      <div className={`
        w-8 h-8 flex items-center justify-center rounded-md
        ${isSelected ? 'text-primary-600' : 'text-gray-700'}
        hover:text-primary-500 transition-colors
        ${isSelected ? 'bg-primary-100/50' : 'hover:bg-gray-50'}
      `}>
        {renderIcon()}
      </div>
      <div className="text-[11px] text-center truncate w-full text-gray-600 font-medium">
        {icon.name}
      </div>
    </div>
  );
};

export default IconCard;
