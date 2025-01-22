import { Icon } from '../../types';
import * as HeroIconsSolid from '@heroicons/react/24/solid';
import * as HeroIconsOutline from '@heroicons/react/24/outline';
import * as HeroIconsMini from '@heroicons/react/20/solid';

export const getIcons = async (): Promise<Icon[]> => {
  // Helper function to process icons from a collection
  const processIconCollection = (
    collection: typeof HeroIconsSolid | typeof HeroIconsOutline | typeof HeroIconsMini,
    style: string,
    size: string
  ): Icon[] => {
    return Object.entries(collection).map(([name, component]) => {
      // Convert PascalCase to kebab-case for the name
      const kebabName = name
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase();

      return {
        id: `heroicons-${size}-${style}-${kebabName}`,
        name: kebabName,
        library: 'heroicons',
        category: style,
        component,
        props: {
          style: {
            width: '100%',
            height: '100%',
          }
        },
        styles: ['solid', 'outline', 'mini'],
        tags: [
          kebabName,
          style,
          'heroicons',
          size,
          ...kebabName.split('-'),
        ],
      };
    });
  };

  try {
    // Process all icon collections
    const solidIcons = processIconCollection(HeroIconsSolid, 'solid', '24');
    const outlineIcons = processIconCollection(HeroIconsOutline, 'outline', '24');
    const miniIcons = processIconCollection(HeroIconsMini, 'mini', '20');

    // Create a Map to ensure unique icons
    const uniqueIcons = new Map<string, Icon>();

    // Add icons from each collection, ensuring no duplicates
    [...solidIcons, ...outlineIcons, ...miniIcons].forEach(icon => {
      if (!uniqueIcons.has(icon.id)) {
        uniqueIcons.set(icon.id, icon);
      }
    });

    // Convert Map back to array
    const finalIcons = Array.from(uniqueIcons.values());

    // Log the number of icons found
    console.log('Heroicons loaded:', {
      total: finalIcons.length,
      solid: solidIcons.length,
      outline: outlineIcons.length,
      mini: miniIcons.length
    });

    return finalIcons;
  } catch (error) {
    console.error('Error processing Heroicons:', error);
    return [];
  }
};
