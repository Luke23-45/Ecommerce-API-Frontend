// src/components/Common/VariantSelector/SizeButton.styles.ts
import styled, { css, type DefaultTheme } from 'styled-components';
import { rgba, darken, lighten, transparentize } from 'polished'; // `darken` is not used, can remove

export const SizeButtonStyled = styled.button<{ 
  // No theme: DefaultTheme prop here, it's injected by ThemeProvider
  $isSelected: boolean;
  $isAvailable: boolean; 
}>`
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(3)};
  min-width: 55px; /* Slightly increased for better touch target if values are short */
  border: 1.5px solid; // Border color will be set by conditional logic below
  border-color: ${({ theme, $isSelected, $isAvailable }) => {
    if ($isSelected) return theme.colors.accent1;
    if ($isAvailable) return theme.colors.mediumGray; // Use mediumGray for a bit more definition than lightGray
    return transparentize(0.6, theme.colors.lightGray); // More transparent for unavailable border
  }};
  
  background-color: ${({ theme, $isSelected, $isAvailable }) => {
    if ($isSelected) return transparentize(0.9, theme.colors.accent1); // Subtle accent background when selected
    if ($isAvailable) return lighten(0.05, theme.colors.primaryNeutral); // Slightly off-white for available
    return lighten(0.07, theme.colors.primaryNeutral); // Even lighter/more neutral for unavailable (but still distinct)
  }};

  color: ${({ theme, $isSelected, $isAvailable }) => {
    if ($isSelected) return theme.colors.accent1; // Strong accent color for selected text
    if ($isAvailable) return theme.colors.textDark;
    return theme.colors.textMuted; // Use textMuted for unavailable items
  }};
  
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.small};
  font-weight: ${({ theme, $isSelected }) => 
    $isSelected 
      ? theme.typography.body.weights.bold // Bolder for selected
      : theme.typography.body.weights.medium // Medium for regular available options
  };
  text-align: center;
  cursor: ${(props) => (props.$isAvailable ? 'pointer' : 'not-allowed')};
  opacity: ${(props) => (props.$isAvailable ? 1 : 0.65)}; // Unavailable slightly more faded
  transition: all 0.2s ease-out;
  position: relative;
  line-height: 1.4;
  white-space: nowrap; // Prevent text wrapping in buttons

  &:hover:not(:disabled) { // :disabled already implies !isAvailable
    border-color: ${({ theme, $isSelected }) => 
      $isSelected ? theme.colors.accent1 : transparentize(0.3, theme.colors.accent1)}; // Keep accent border if selected, or preview accent border
    color: ${({ theme }) => theme.colors.accent1};
    background-color: ${({ theme, $isSelected }) => 
      $isSelected 
        ? transparentize(0.85, theme.colors.accent1) // Slightly darker selected hover
        : transparentize(0.94, theme.colors.accent1)}; // Very subtle accent background on hover for available
  }
  
  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent1}; // Ensure border color changes on focus
    box-shadow: 0 0 0 2px ${({theme}) => theme.colors.backgroundLight}, /* Inner ring to separate from button content */
                0 0 0 4px ${({theme}) => theme.colors.accent1};   /* Outer focus ring */
  }

  // Strikethrough for unavailable items
  ${(props) => !props.$isAvailable && css`
    text-decoration: line-through;
    text-decoration-color: ${rgba(props.theme.colors.textMuted, 0.8)}; // Use textMuted for strikethrough
    text-decoration-thickness: 1.5px; // Make strikethrough slightly thicker if needed
  `}

   @media (max-width: ${(props) => props.theme.breakpoints.mobileL}) {
    padding: ${({ theme }) => theme.spacing(1.5)} ${({ theme }) => theme.spacing(2.5)};
    font-size: ${({ theme }) => theme.typography.body.sizes.xsmall};
    min-width: 45px;
  }
`;