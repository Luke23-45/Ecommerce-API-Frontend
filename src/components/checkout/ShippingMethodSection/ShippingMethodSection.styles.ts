// src/components/checkout/ShippingMethodSection/ShippingMethodSection.styles.ts
import styled, { css } from 'styled-components';
import { transparentize, lighten, darken } from 'polished';

// Use CheckoutSectionBase and SectionTitleBase as foundations
import { CheckoutSectionBase, SectionTitle as SectionTitleBase } from '@/pages/CheckoutPage/CheckoutPage.styles';

// --- Root Wrapper for ShippingMethodSection ---
export const ShippingMethodSectionWrapper = styled(CheckoutSectionBase)`
  // Inherits padding, border-radius, shadow from CheckoutSectionBase
  // Add any ShippingMethodSection specific overrides here if needed
`;

// --- Section Title ---
export const ShippingSectionTitle = styled(SectionTitleBase)`
  // Any ShippingMethodSection specific title adjustments
  margin-bottom: ${({ theme }) => theme.spacing(6)}; // Consistent spacing after title
`;

// --- List of Shipping Options ---
export const ShippingOptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)}; /* Increased gap between options */
  /* No margin-bottom here, StepActions will provide spacing if it's the last element */
`;

interface ShippingOptionCardProps {
  $isSelected: boolean;
}

export const ShippingOptionCard = styled.div<ShippingOptionCardProps>`
  display: grid;
  // Columns: RadioButton | Details (Name, Description) | Cost
  grid-template-columns: ${({ theme }) => theme.spacing(8)} 1fr auto; /* Fixed width for radio, flexible for details, auto for cost */
  align-items: center; // Vertically align content within each row
  gap: ${({ theme }) => theme.spacing(4)};
  
  border: 2px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.large}; /* Consistent large radius */
  padding: ${({ theme }) => theme.spacing(5)}; /* Generous padding */
  cursor: pointer;
  transition: all 0.25s ${({ theme }) => theme.transitions.base};
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &:hover {
    border-color: ${({ theme, $isSelected }) => ($isSelected ? theme.colors.accent1Hover : theme.colors.mediumGray)};
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  ${({ theme, $isSelected }) => $isSelected && css`
    border-color: ${theme.colors.accent1};
    box-shadow: 0 0 0 2.5px ${theme.colors.accent1}, ${theme.shadows.lg};
    background-color: ${transparentize(0.96, theme.colors.accent1)};
    
    // Style the RadioCircle within the selected card
    // Assuming RadioCircle component is imported and used directly in JSX.
    // If RadioCircle is a child styled-component here, you can target it.
    // For now, let's assume it's handled by passing $isSelected to RadioCircle itself.
  `}
`;

// Re-using RadioCircle: We will import and use the RadioCircle styled component
// from PaymentMethodSection.styles.ts (or a common components directory).
// For example: import { RadioCircle } from '../Common/RadioCircle.styles';
// Make sure RadioCircle is defined as beautiful and premium.

export const OptionDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(0.5)}; /* Small gap between name and description */
  text-align: left; /* Ensure text aligns left */
`;

export const OptionName = styled.p`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-weight: ${({ theme }) => theme.typography.body.weights.semiBold}; /* Stronger weight */
  color: ${({ theme }) => theme.colors.textDark};
  font-size: ${({ theme }) => theme.typography.body.sizes.large}; /* More prominent name */
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
`;

export const OptionDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.body.sizes.small}; /* Slightly smaller for desc */
  color: ${({ theme }) => theme.colors.textMedium};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeights.base};

  &.estimated-delivery { /* Specific style for delivery estimate */
    font-style: italic;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-top: ${({ theme }) => theme.spacing(1)};
  }
`;

export const OptionCost = styled.p`
  font-family: ${({ theme }) => theme.typography.heading.fontFamily}; /* Playfair for cost - elegant! */
  font-size: ${({ theme }) => theme.typography.body.sizes.large}; /* Match OptionName size for balance */
  font-weight: ${({ theme }) => theme.typography.heading.weights.bold}; /* Make cost stand out */
  color: ${({ theme }) => theme.colors.accent1}; /* Use accent color for cost */
  margin: 0;
  text-align: right;
  white-space: nowrap; // Prevent wrapping
`;

