console.log('Content script loaded');

// Helper to check if element is an icon
const isIconElement = (element) => {
  const iconSelectors = [
    'i[class*="fa"]',
    'svg',
    'img[class*="icon"]',
    '[class*="icon"]',
    '[data-icon]'
  ];
  return iconSelectors.some(selector => element.matches(selector));
};

// Initialize dragging variables
let isDragging = false;
let currentX = 0;
let currentY = 0;
let initialX = 0;
let initialY = 0;

// Create floating icon container
const createFloatingIcon = (target) => {
  // Remove existing floating icon
  document.querySelector('.floating-icon')?.remove();

  // Create container
  const floatingContainer = document.createElement('div');
  floatingContainer.className = 'floating-icon';

  // Clone the icon
  const iconClone = target.cloneNode(true);
  iconClone.style.cssText = `
    color: #000000 !important;
    font-size: 24px !important;
    width: 24px !important;
    height: 24px !important;
  `;

  // Add close button
  const closeButton = document.createElement('button');
  closeButton.className = 'close-button';
  closeButton.innerHTML = '×';
  closeButton.onclick = () => floatingContainer.remove();

  // Add elements
  floatingContainer.appendChild(iconClone);
  floatingContainer.appendChild(closeButton);

  return floatingContainer;
};

// Handle dragging
const initDragging = (element) => {
  const handleMouseDown = (e) => {
    if (e.target.className === 'close-button') return;
    isDragging = true;
    initialX = e.clientX - currentX;
    initialY = e.clientY - currentY;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;
    element.style.transform = `translate(${currentX}px, ${currentY}px)`;
  };

  const handleMouseUp = () => {
    isDragging = false;
  };

  element.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);

  return () => {
    element.removeEventListener('mousedown', handleMouseDown);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
};

// Main click handler
document.addEventListener('click', (event) => {
  const target = event.target;
  
  if (isIconElement(target)) {
    event.preventDefault();
    event.stopPropagation();
    
    const floatingContainer = createFloatingIcon(target);
    document.body.appendChild(floatingContainer);
    initDragging(floatingContainer);
  }
});