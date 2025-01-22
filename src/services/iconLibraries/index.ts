import { getIcons as getFontAwesomeIcons } from './fontawesome';
import { getIcons as getMaterialIcons } from './material';
import { getIcons as getHeroIcons } from './heroicons';
import { Icon } from '../../types';

export const iconLibraries = [
  {
    id: 'fontawesome',
    name: 'Font Awesome',
    description: 'The web\'s most popular icon set and toolkit',
    website: 'https://fontawesome.com',
  },
  {
    id: 'material',
    name: 'Material Design Icons',
    description: 'Material Design Icons by Google',
    website: 'https://material.io/icons',
  },
  {
    id: 'heroicons',
    name: 'Heroicons',
    description: 'Beautiful hand-crafted SVG icons by the makers of Tailwind CSS',
    website: 'https://heroicons.com',
  },
] as const;

export const loadIcons = async (): Promise<Icon[]> => {
  try {
    const [fontAwesomeIcons, materialIcons, heroIcons] = await Promise.all([
      getFontAwesomeIcons(),
      getMaterialIcons(),
      getHeroIcons(),
    ]);

    const allIcons = [...fontAwesomeIcons, ...materialIcons, ...heroIcons];

    console.log('All icons loaded:', {
      total: allIcons.length,
      fontawesome: fontAwesomeIcons.length,
      material: materialIcons.length,
      heroicons: heroIcons.length,
    });

    return allIcons;
  } catch (error) {
    console.error('Error loading icons:', error);
    return [];
  }
};

export const getIconLibrary = (id: string) => {
  return iconLibraries.find(library => library.id === id);
};
