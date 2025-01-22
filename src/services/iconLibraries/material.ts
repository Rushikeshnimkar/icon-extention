import { Icon, MaterialIconType } from '../../types';
import * as MDIIcons from '@mdi/js';
import MDIcon from '@mdi/react';
import { ComponentType } from 'react';

export const getIcons = async (): Promise<Icon[]> => {
  try {
    const icons: MaterialIconType[] = Object.entries(MDIIcons)
      .filter(([name]) => name.startsWith('mdi'))
      .map(([name, path]): MaterialIconType => {
        const iconName = name
          .replace('mdi', '')
          .replace(/([A-Z])/g, '-$1')
          .toLowerCase()
          .replace(/^-/, '');

        return {
          id: `mdi-${iconName}`,
          name: iconName,
          library: 'material',
          category: 'filled',
          component: MDIcon as ComponentType<any>,
          props: {
            path,
            style: {
              width: '100%',
              height: '100%',
            }
          },
          styles: ['filled'],
          tags: [
            iconName,
            'material',
            'mdi',
            ...iconName.split('-')
          ],
        };
      });

    console.log('Material icons loaded:', {
      total: icons.length
    });

    return icons;
  } catch (error) {
    console.error('Error processing Material icons:', error);
    return [];
  }
};
