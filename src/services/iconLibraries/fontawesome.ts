import { Icon, FontAwesomeIconType } from '../../types';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

// Initialize FontAwesome library with all icons
library.add(fas, far, fab);

interface IconCollection {
  [key: string]: IconDefinition;
}

const processIconCollection = (
  collection: IconCollection,
  style: string
): FontAwesomeIconType[] => {
  return Object.entries(collection)
    .filter(([_, icon]) => icon && icon.iconName && icon.prefix)
    .map(([_, icon]) => ({
      id: `fa-${style}-${icon.iconName}`,
      name: icon.iconName,
      library: 'fontawesome',
      category: style,
      component: FontAwesomeIcon,
      props: {
        icon: icon,
        style: {
          width: '100%',
          height: '100%',
        }
      },
      styles: [style],
      tags: [
        icon.iconName,
        style,
        'fontawesome',
        ...icon.iconName.split('-'),
        icon.prefix
      ],
    }));
};

export const getIcons = async (): Promise<Icon[]> => {
  try {
    const solidIcons = processIconCollection(fas, 'solid');
    const regularIcons = processIconCollection(far, 'regular');
    const brandIcons = processIconCollection(fab, 'brands');

    const allIcons = [...solidIcons, ...regularIcons, ...brandIcons];

    console.log('FontAwesome icons loaded:', {
      total: allIcons.length,
      solid: solidIcons.length,
      regular: regularIcons.length,
      brands: brandIcons.length
    });

    return allIcons;
  } catch (error) {
    console.error('Error processing FontAwesome icons:', error);
    return [];
  }
};