import { ComponentType, CSSProperties } from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Base Props Types
interface BaseIconProps {
  style?: CSSProperties;
  className?: string;
}

// Icon Types
interface BaseIcon {
  id: string;
  name: string;
  category: string;
  styles?: string[];
  tags: string[];
}

export interface FontAwesomeIconType extends BaseIcon {
  library: 'fontawesome';
  component: typeof FontAwesomeIcon;
  props: {
    icon: IconDefinition;
    style?: CSSProperties;
  };
}

export interface MaterialIconType extends BaseIcon {
  library: 'material';
  component: ComponentType<BaseIconProps & { path: string }>;
  props: {
    path: string;
    style?: CSSProperties;
  };
}

export interface HeroIconType extends BaseIcon {
  library: 'heroicons';
  component: ComponentType<BaseIconProps>;
  props: {
    style?: CSSProperties;
  };
}

// Combined Icon Type
export type Icon = FontAwesomeIconType | HeroIconType | MaterialIconType;

// State Types
export interface IconState {
  icons: Icon[];
  searchQuery: string;
  selectedLibrary: string;
  loading: boolean;
}

export interface PreviewState {
  selectedIcon: Icon | null;
  size: number;
  color: string;
  isVisible: boolean;
}

// Copy Format Types
export interface CopyFormat {
  name: string;
  getValue: (icon: Icon, color: string, size: number) => string;
}

export const COPY_FORMATS: Record<string, CopyFormat> = {
  REACT: {
    name: 'React',
    getValue: (icon: Icon, color: string, size: number) => {
      const componentName = icon.name
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');

      return `import { ${componentName} } from '${icon.library}';

<${componentName} 
  style={{ color: '${color}', width: ${size}, height: ${size} }}
/>`;
    },
  },
  HTML: {
    name: 'HTML',
    getValue: (icon: Icon, color: string, size: number) => 
      `<i class="${icon.library} ${icon.name}"
   style="color: ${color}; font-size: ${size}px;"></i>`,
  },
  SVG: {
    name: 'SVG',
    getValue: (_icon: Icon, color: string, size: number) => 
      `<svg width="${size}" height="${size}" fill="${color}">
  <!-- SVG path data would be here -->
</svg>`,
  },
};

// Root State Type
export interface RootState {
  icons: IconState;
  preview: PreviewState;
}
