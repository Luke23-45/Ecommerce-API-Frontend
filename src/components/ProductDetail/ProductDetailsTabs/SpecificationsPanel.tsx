// src/components/ProductPage/ProductDetailsTabs/SpecificationsPanel.tsx
import React from 'react';
import { useTheme, type DefaultTheme } from 'styled-components'; // For direct theme access if needed by render logic

// Import styled components
import {
  SpecificationsPanelWrapper,
  SpecsTable,
  NoSpecsMessage,
} from './SpecificationsPanel.styles';

// --- Type Definitions ---
export interface SpecificationItem { // Re-defined here for clarity or import from shared types
  label: string;
  value: string | string[] | number | boolean; // Added boolean
}

export interface SpecificationsData {
  // Example structure: Key is display label (or key to be formatted), value is the spec
  // Allows for flexibility, e.g., backend might send already formatted labels.
  [labelOrKey: string]: string | string[] | number | boolean | undefined;
}
// --- End Type Definitions ---

interface SpecificationsPanelProps {
  specifications?: SpecificationsData; // The product's specifications object
  productName: string;                // For context in messages
}

const SpecificationsPanel: React.FC<SpecificationsPanelProps> = ({
  specifications,
  productName,
}) => {
  const theme = useTheme() as DefaultTheme; // If needed, e.g. for complex value rendering

  // --- Helper to format Specification Keys/Labels ---
  const formatSpecLabel = (key: string): string => {
    // Convert camelCase or snake_case to Title Case
    return key
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/[_-]/g, ' ')     // Replace underscores/hyphens with space
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
      .replace(/\s+/g, ' ') // Normalize multiple spaces
      .trim();
  };

  // --- Helper to format Specification Values ---
  const renderSpecValue = (value: string | string[] | number | boolean): React.ReactNode => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (Array.isArray(value)) {
      // If it's an array, render as a list or comma-separated string
      if (value.length === 0) return 'N/A';
      if (value.length === 1) return value[0];
      // Could also render as a <ul> here if needed, styled by SpecsTable td ul
      return (
        <ul style={{ margin: 0, paddingLeft: theme.spacing(4), listStylePosition: 'inside' }}>
          {value.map((item, index) => (
            <li key={index} style={{ marginBottom: theme.spacing(0.5) }}>{String(item)}</li>
          ))}
        </ul>
      );
      // return value.join(', ');
    }
    if (typeof value === 'number') {
        return value.toLocaleString(); // Basic number formatting
    }
    return String(value); // Default to string
  };


  // Filter out undefined/null values and convert object to array for mapping
  const specList: SpecificationItem[] = specifications
    ? Object.entries(specifications)
        .filter(([key, value]) => value !== undefined && value !== null && String(value).trim() !== '')
        .map(([key, value]) => ({
          label: formatSpecLabel(key), // Use helper to format the label
          value: value as string | string[] | number | boolean, // Cast needed after filter
        }))
    : [];

  if (specList.length === 0) {
    return (
      <SpecificationsPanelWrapper theme={theme}> {/* Pass theme if wrapper uses it */}
        <NoSpecsMessage theme={theme}>
          Detailed specifications for the {productName} are not yet available. Please check back soon.
        </NoSpecsMessage>
      </SpecificationsPanelWrapper>
    );
  }

  return (
    <SpecificationsPanelWrapper theme={theme}>
      <SpecsTable theme={theme}>
        {/* Optional: Add <thead> for accessibility or specific header row styling
        <thead>
          <tr>
            <th scope="row">Characteristic</th>
            <th scope="col">Detail</th>
          </tr>
        </thead> 
        */}
        <tbody>
          {specList.map((spec) => (
            <tr key={spec.label}>
              <th>{spec.label}</th>
              <td>{renderSpecValue(spec.value)}</td>
            </tr>
          ))}
        </tbody>
      </SpecsTable>
    </SpecificationsPanelWrapper>
  );
};

export default SpecificationsPanel;