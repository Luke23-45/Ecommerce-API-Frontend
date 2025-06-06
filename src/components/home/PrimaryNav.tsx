// src/components/home/PrimaryNav/PrimaryNav.tsx
import React, { useState, useCallback } from 'react';
import { FaTimes } from 'react-icons/fa'; // Import the close icon

import {
  FullscreenMenuOverlay,
  MenuContent,
  CloseButton, // Import the styled CloseButton
  NavSectionList,
  NavSectionTitle,
  NavLinkItem,
} from './styles/PrimaryNav.styles';


// Dummy Data for menu (as before)
const menuData = [
  {
    title: 'Shop by Category',
    items: [
      { id: 'all-cat', label: 'All Categories', path: '/collections' },
      { id: 'living', label: 'Living Room', path: '/collections/living',
        children: [
          { id: 'living-sofas', label: 'Sofas & Sectionals', path: '/collections/living/sofas' },
          { id: 'living-tables', label: 'Coffee Tables', path: '/collections/living/tables' },
        ]
      },
      { id: 'bedroom', label: 'Bedroom', path: '/collections/bedroom',
        children: [
          { id: 'bedroom-beds', label: 'Beds & Frames', path: '/collections/bedroom/beds' },
          { id: 'bedroom-bedding', label: 'Bedding', path: '/collections/bedroom/bedding' },
        ]
      },
      { id: 'dining', label: 'Dining', path: '/collections/dining' },
      { id: 'decor', label: 'Decor & Art', path: '/collections/decor' },
      { id: 'lighting', label: 'Lighting', path: '/collections/lighting' },
    ]
  },
  {
    title: 'Offers & Discoveries',
    items: [
      { id: 'sale', label: 'Sale', path: '/sale' },
      { id: 'new-arrivals', label: 'New Arrivals', path: '/new-arrivals' },
      { id: 'bestsellers', label: 'Bestsellers', path: '/bestsellers' },
    ]
  },
  {
    title: 'Élan Info',
    items: [
      { id: 'our-story', label: 'Our Story', path: '/about' },
      { id: 'sustainability', label: 'Sustainability', path: '/sustainability' },
      { id: 'contact', label: 'Contact Us', path: '/contact' },
      { id: 'blog', label: 'Blog', path: '/blog' },
    ]
  },
];


interface CategoryMenuItem { // Define this interface within this file or in a common types file
  id: string;
  label: string;
  path: string;
  children?: CategoryMenuItem[];
}

interface PrimaryNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrimaryNav: React.FC<PrimaryNavProps> = ({ isOpen, onClose }) => {

  // Memoized render function for menu items (to optimize performance)
  const renderMenuItems = useCallback((items: CategoryMenuItem[], isSub: boolean = false) => {
    return items.map(item => (
      <NavLinkItem key={item.id} className={isSub ? 'sub-category' : ''}>
        <a href={item.path} onClick={onClose}> {/* Pass onClose to individual links */}
          {item.label}
        </a>
        {item.children && item.children.length > 0 && (
          <NavSectionList>
            {renderMenuItems(item.children, true)}
          </NavSectionList>
        )}
      </NavLinkItem>
    ));
  }, [onClose]); // Dependency array includes onClose

  return (
    <FullscreenMenuOverlay $isOpen={isOpen} onClick={onClose}> {/* Click overlay to close */}
      <MenuContent $isOpen={isOpen} onClick={e => e.stopPropagation()}> {/* Prevent clicks inside from closing */}
        {/* The prominent close button */}
        <CloseButton onClick={onClose} aria-label="Close navigation menu">
          <FaTimes /> {/* The close icon */}
        </CloseButton>

        {menuData.map(section => (
          <NavSectionList key={section.title}>
            <NavSectionTitle>{section.title}</NavSectionTitle>
            {renderMenuItems(section.items)}
          </NavSectionList>
        ))}

      </MenuContent>
    </FullscreenMenuOverlay>
  );
};

export default PrimaryNav;