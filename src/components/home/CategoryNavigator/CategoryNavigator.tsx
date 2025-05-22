// src/components/CategoryNavigator/CategoryNavigator.tsx
import React from 'react';
import { IconContext } from 'react-icons'; // For styling icons
import { FaHome, FaUtensils, FaBed, FaPalette, FaSun, FaLightbulb, FaBriefcase, FaSpa } from 'react-icons/fa'; // Example Icons

import {
  NavigatorContainer,
  IconList,
  IconCell,
  IconPlaceholder,
  IconLabel,
} from './CategoryNavigator.styles';

// Dummy Category Data
interface CategoryIcon {
  id: string;
  label: string;
  icon: React.ElementType; // Type for React component (like FaHome)
}

const categoryIcons: CategoryIcon[] = [
  { id: 'living', label: 'Living', icon: FaHome },
  { id: 'dining', label: 'Dining', icon: FaUtensils },
  { id: 'bedroom', label: 'Bedroom', icon: FaBed },
  { id: 'lighting', label: 'Lighting', icon: FaLightbulb },
  { id: 'art', label: 'Art & Decor', icon: FaPalette },
  { id: 'office', label: 'Office', icon: FaBriefcase },
  { id: 'outdoor', label: 'Outdoor', icon: FaSun },
  { id: 'wellness', label: 'Wellness', icon: FaSpa },
];

interface CategoryNavigatorProps {
  activeCategory: string;
  onCategorySelect: (categoryId: string) => void; // Function to scroll to section
}

const CategoryNavigator: React.FC<CategoryNavigatorProps> = ({ activeCategory, onCategorySelect }) => {
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

export default CategoryNavigator;