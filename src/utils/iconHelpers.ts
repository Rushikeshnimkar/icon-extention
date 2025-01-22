import { Icon } from '../types';

export const formatIconName = (name: string): string => {
  return name
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .trim();
};

export const generateIconCode = (icon: Icon, color: string, size: number): {
  react: string;
  html: string;
} => {
  const componentName = icon.name.replace(/[-_]([a-z])/g, (g) => g[1].toUpperCase());

  const reactCode = `import { ${componentName} } from '${icon.library}';

<${componentName} 
  style={{ color: '${color}', width: ${size}, height: ${size} }}
/>`;

  const htmlCode = `<i class="${icon.library} ${icon.name}"
   style="color: ${color}; font-size: ${size}px;"></i>`;

  return {
    react: reactCode,
    html: htmlCode,
  };
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};
