// src/components/Common/QuantityInput/QuantityInput.styles.ts
import styled, { type DefaultTheme } from 'styled-components'; // DefaultTheme for prop types
import { rgba, darken, lighten, transparentize } from 'polished';

// Renamed prop for clarity to avoid conflict with HTML 'disabled' attribute
export const QuantityInputWrapper = styled.div<{ $isDisabled?: boolean }>`
  display: inline-flex; /* Changed from flex to inline-flex for better layout flow with other elements */
  align-items: center;
  background-color: ${({ theme }) => lighten(0.05, theme.colors.primaryNeutral)}; /* Slightly lighter than before */
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  overflow: hidden;
  height: 44px; /* Standard height for form controls, adjust as needed */
  max-width: 120px; /* Keep it relatively compact */
  opacity: ${(props) => (props.$isDisabled ? 0.55 : 1)}; // Use $isDisabled
  pointer-events: ${(props) => (props.$isDisabled ? 'none' : 'auto')}; // Use $isDisabled
  transition: border-color 0.2s ease-out, box-shadow 0.2s ease-out;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.accent1};
    box-shadow: 0 0 0 2px ${({ theme }) => rgba(theme.colors.accent1, 0.2)}; // Refined focus shadow
  }
`;

export const QuantityButton = styled.button` // No theme prop needed here if ThemeProvider is used
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.accent1};
  font-size: 0.9rem; /* Icons slightly smaller for a refined look */
  /* font-weight removed, icons don't usually need font-weight unless they are font icons with weights */
  padding: 0 ${({ theme }) => theme.spacing(2.5)}; /* Balanced padding */
  height: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s ease-out, color 0.15s ease-out;
  line-height: 1;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => transparentize(0.92, theme.colors.accent1)}; // More subtle hover
    color: ${({ theme }) => darken(0.08, theme.colors.accent1)};
  }
  &:active:not(:disabled) {
    background-color: ${({ theme }) => transparentize(0.85, theme.colors.accent1)};
  }
  &:disabled {
    color: ${({ theme }) => theme.colors.textMuted}; // Use textMuted for disabled icon
    opacity: 0.6; // Combined with wrapper opacity for clear disabled state
    cursor: not-allowed;
  }

  svg { // Target svg directly for consistent styling if needed
    display: block; // Helps with exact centering sometimes
  }

  /* Borders between buttons and display for visual separation */
  &:first-of-type {
    border-right: 1px solid ${({ theme }) => theme.colors.lightGray};
  }
  &:last-of-type {
    border-left: 1px solid ${({ theme }) => theme.colors.lightGray};
  }
`;

export const QuantityDisplay = styled.span` // No theme prop needed here
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.base}; // Consistent base size
  font-weight: ${({ theme }) => theme.typography.body.weights.semiBold}; // Make quantity number stand out
  color: ${({ theme }) => theme.colors.textDark};
  min-width: 36px; /* Ensure enough space for ~2 digits comfortably */
  height: 100%;    /* Fill height of wrapper */
  text-align: center;
  /* line-height adjusted dynamically by flexbox align-items */
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  padding: 0 ${({ theme }) => theme.spacing(1)}; /* Small horizontal padding */

  /* Styling for input[type=number] if used as display (from your example)
     Generally, using a <span> is simpler if not directly editable.
     If direct input is desired, this part is fine.
  */
  input[type="number"] {
    width: 100%; /* Take width of its container (min-width above) */
    text-align: center;
    border: none;
    background-color: transparent;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    color: inherit;
    padding: 0;
    margin: 0;
    -moz-appearance: textfield;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    &:focus {
      outline: none;
    }
    /* Readonly state if used as display */
    &[readOnly] {
        cursor: default;
    }
  }
`;