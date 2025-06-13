// src/components/Dashboard/Common/Common.styles.ts

// ... (keep all your existing styled-components like AdminButton, AdminInput, etc.)

import styled, { css, type DefaultTheme } from 'styled-components';
import { rgba } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

import { AdminInput } from '@/components/admin/Dashboard/Common/Common.styles';

// --- NEW COMPONENTS TO ADD ---

/**
 * A wrapper component that groups an Addon and an Input together to look like a single element.
 * It is responsible for the border, background, and focus states of the entire group.
 */
export const InputGroup = styled.div`
  display: flex;
  align-items: stretch; // Ensures children are the same height
  position: relative;
  width: 100%;
  
  // The group itself gets the visual styles of an input field
  background-color: ${(props) => getTheme(props).colors.adminSurface || '#fff'};
  border: 1px solid ${(props) => getTheme(props).colors.adminBorder || '#e2e8f0'};
  border-radius: 8px; // Match AdminInput's border-radius
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  // The magic part: When ANY element inside the group gets focus, style the whole group.
  &:focus-within {
    border-color: ${(props) => getTheme(props).colors.accent1 || '#3182ce'};
    box-shadow: 0 0 0 3px ${(props) => rgba(getTheme(props).colors.accent1 || '#3182ce', 0.2)};
  }

  // When the group has an error (you would add a class or prop for this), style it.
  &.has-error {
    border-color: ${(props) => getTheme(props).colors.adminStatusError || '#e53e3e'};
     &:focus-within {
        border-color: ${(props) => getTheme(props).colors.adminStatusError || '#e53e3e'};
        box-shadow: 0 0 0 3px ${(props) => rgba(getTheme(props).colors.adminStatusError || '#e53e3e', 0.2)};
     }
  }

  // --- CONTEXTUAL STYLING ---
  // This is the most important part. We override the styles of the AdminInput
  // ONLY when it's a direct child of an InputGroup.
  & > ${AdminInput} {
    // Remove the original input's border and shadow since the group handles it.
    border: none;
    box-shadow: none;

    // Make the input fill the remaining space.
    flex-grow: 1;
    width: auto;

    // Reset border-radius, then apply it only to the right corners.
    border-radius: 0;
    border-top-right-radius: 7px; // Use 1px less than parent for perfect corners
    border-bottom-right-radius: 7px;
    
    // The input should not have its own focus styles.
    &:focus {
      box-shadow: none;
    }
  }
`;

/**
 * An addon element designed to sit on the left side of an input within an InputGroup.
 * Perfect for icons or static text (e.g., "$", "kg", "@").
 */
export const InputLeftAddon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  // Spacing
  padding: 0 ${(props) => getTheme(props).spacing(3)};

  // Visuals
  background-color: ${(props) => getTheme(props).colors.adminSecondaryBg || '#f7fafc'};
  color: ${(props) => getTheme(props).colors.adminTextMuted || '#718096'};
  border-right: 1px solid ${(props) => getTheme(props).colors.adminBorder || '#e2e8f0'};
  
  // Match the input's corner radius on the left side
  border-top-left-radius: 7px;
  border-bottom-left-radius: 7px;
  
  // Typography
  font-size: 0.9em;
  font-weight: 500;
  white-space: nowrap; // Prevent text like "USD" from wrapping
`;

export const FieldHelperText = styled.small`
  display: block;
  // Use a slightly smaller font size to be less prominent than labels or input values.
  font-size: 0.8rem; 
  font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'Inter, sans-serif'};
  // Use a muted text color so it doesn't compete for attention.
  color: ${(props) => getTheme(props).colors.adminTextMuted || '#718096'};
  // Add some space between it and the input field above it.
  margin-top: ${(props) => getTheme(props).spacing(1.5)};
  line-height: 1.5; // Improves readability for multi-line helper text.
  padding-left: 2px; // A tiny indent to align nicely under the label.
`;


/**
 * A prominent, clear error message component that appears below an invalid form field.
 * It's designed to grab the user's attention to a required correction.
 */
export const FieldError = styled.small`
  display: block;
  font-size: 0.8rem;
  font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'Inter, sans-serif'};
  font-weight: 500; // Give it a bit more weight than helper text.
  
  // The most important part: use the theme's error color.
  color: ${(props) => getTheme(props).colors.adminStatusError || '#e53e3e'};

  margin-top: ${(props) => getTheme(props).spacing(1.5)};
  line-height: 1.5;

  // Apply the animation to draw the user's eye when the error appears.

`;