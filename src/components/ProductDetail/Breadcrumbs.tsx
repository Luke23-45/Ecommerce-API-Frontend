// src/components/Common/Breadcrumbs/Breadcrumbs.tsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom'; // For client-side navigation
import { useTheme, type DefaultTheme } from 'styled-components'; // Import useTheme

// Import styled components
import {
  BreadcrumbNav,
  BreadcrumbList,
  BreadcrumbItem,
} from './Breadcrumbs.styles';

// Define the shape of a breadcrumb item
export interface BreadcrumbLink {
  label: string;
  link?: string; // Optional: if not present, it's the current page
  // icon?: React.ElementType; // Optional: if you want icons next to labels
}

interface BreadcrumbsProps {
  items: BreadcrumbLink[];
  // You could add props for custom separator, ARIA labels for the nav etc.
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const theme = useTheme(); // Use the theme from context

  if (!items || items.length === 0) {
    return null; // Don't render if no items are provided
  }

  return (
    // The `theme` prop is automatically passed to styled components via ThemeProvider
    // so no need to pass `theme={theme}` to each styled component instance here.
    <BreadcrumbNav aria-label="breadcrumb">
      <BreadcrumbList>
        {items.map((item, index) => (
          <BreadcrumbItem key={index}>
            {item.link && index < items.length - 1 ? ( // Check if it's a link AND not the last item
              <RouterLink to={item.link} title={`Go to ${item.label}`}>
                {item.label}
              </RouterLink>
            ) : (
              // Last item, or item without a link, is displayed as plain text (current page)
              <span aria-current={index === items.length - 1 ? "page" : undefined}>
                {item.label}
              </span>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </BreadcrumbNav>
  );
};

export default Breadcrumbs;