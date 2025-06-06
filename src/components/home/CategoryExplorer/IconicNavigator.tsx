// src/components/CategoryExplorer/IconicNavigator.tsx
import React from 'react';
import { IconContext } from 'react-icons'; // For styling icons
import { FaHome, FaUtensils, FaBed, FaPalette, FaSun, FaLightbulb, FaBriefcase, FaSpa } from 'react-icons/fa'; // Example Icons

import {
  NavigatorContainer,
  IconList,
  IconCell,
  IconPlaceholder,
  IconLabel,
} from './IconicNavigator.styles';

// Dummy Category Data
interface CategoryIcon {
  id: string;
  label: string;
  icon: React.ElementType; // Type for React component (like FaHome)
}

const categoryIcons: CategoryIcon[] = [
  { id: 'prod1', label: 'Living', icon: FaHome },
  { id: 'prod2', label: 'Dining', icon: FaUtensils },
  { id: 'prod3', label: 'Bedroom', icon: FaBed },
  { id: 'prod4', label: 'Lighting', icon: FaLightbulb },
  { id: 'prod5', label: 'Art & Decor', icon: FaPalette },
  { id: 'prod6', label: 'Office', icon: FaBriefcase },
  { id: 'outdoor', label: 'Outdoor', icon: FaSun },
  { id: 'wellness', label: 'Wellness', icon: FaSpa }, 
];

interface IconicNavigatorProps {
  activeCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

const IconicNavigator: React.FC<IconicNavigatorProps> = ({ activeCategory, onCategorySelect }) => {
  return (
    <NavigatorContainer>
      <IconList>
        {categoryIcons.map((cat, index) => (
          <IconCell
            key={cat.id}
            $isActive={cat.id === activeCategory}
            onClick={() => onCategorySelect(cat.id)}
            aria-label={`Select ${cat.label} category`}
          >
            <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
              <IconPlaceholder as={cat.icon} />
            </IconContext.Provider>
            <IconLabel $isActive={cat.id === activeCategory}>
              {cat.label}
            </IconLabel>
          </IconCell>
        ))}
      </IconList>
    </NavigatorContainer>
  );
};

export default IconicNavigator;