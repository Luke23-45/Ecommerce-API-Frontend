// src/components/checkout/PaymentMethodSection/PaymentMethodSection.styles.ts
import styled, { css, keyframes } from 'styled-components';
import { transparentize, lighten, darken } from 'polished';

// Import base styles if not already extending
import { CheckoutSectionBase, SectionTitle as SectionTitleBase } from '@/pages/CheckoutPage/CheckoutPage.styles';

// --- Animations (if any specific to this section) ---
const formReveal = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px) scaleY(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scaleY(1);
  }
`;

// --- Root Wrapper ---
export const PaymentMethodSectionWrapper = styled(CheckoutSectionBase)`
  // Inherits base styling
`;

// --- Section Title ---
export const PaymentSectionTitle = styled(SectionTitleBase)`
  margin-bottom: ${({ theme }) => theme.spacing(6)}; // Consistent spacing
`;

// --- List of Payment Options ---
export const PaymentMethodList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)}; /* Increased gap for visual separation */
  margin-bottom: ${({ theme }) => theme.spacing(4)}; /* Space before Stripe form if it appears */
`;

interface PaymentOptionCardProps {
  $isSelected: boolean;
}

export const PaymentOptionCard = styled.div<PaymentOptionCardProps>`
  display: grid;
  // Columns: RadioButton | Icon | Details
  grid-template-columns: ${({ theme }) => theme.spacing(8)} ${({ theme }) => theme.spacing(8)} 1fr;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)}; /* Gap between elements in the card */
  
  border: 2px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing(5)};
  cursor: pointer;
  transition: all 0.25s ${({ theme }) => theme.transitions.base};
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  .payment-icon { /* Class for styling icons like Visa, Mastercard etc. */
    font-size: 2rem; /* Make card brand icons larger */
    color: ${({ theme }) => theme.colors.textMedium};
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    border-color: ${({ theme, $isSelected }) => ($isSelected ? theme.colors.accent1Hover : theme.colors.mediumGray)};
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  ${({ theme, $isSelected }) => $isSelected && css`
    border-color: ${theme.colors.accent1};
    box-shadow: 0 0 0 2.5px ${theme.colors.accent1}, ${theme.shadows.lg};
    background-color: ${transparentize(0.96, theme.colors.accent1)};
  `}
`;

export const PaymentOptionDetails = styled.div`
  flex-grow: 1; /* Not needed with grid, but harmless */
  display: flex;
  flex-direction: column; /* Stack main text and secondary info like expiry */
  gap: ${({ theme }) => theme.spacing(0.5)};
  text-align: left;
`;

export const PaymentOptionText = styled.span`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
  color: ${({ theme }) => theme.colors.textDark};
  font-size: ${({ theme }) => theme.typography.body.sizes.large}; /* Consistent with OptionName from shipping */
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
`;

export const PaymentOptionMeta = styled.span`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.small};
  color: ${({ theme }) => theme.colors.textMuted};
`;


// --- Stripe Payment Form Wrapper (for new card) ---
export const PaymentFormWrapper = styled.div<{ $showForm: boolean }>`
  /* Styling for the container of the Stripe CardElement */
  margin-top: ${({ theme, $showForm }) => $showForm ? theme.spacing(5) : 0};
  padding: ${({ theme, $showForm }) => $showForm ? theme.spacing(5) : 0};
  background: ${({ theme, $showForm }) => $showForm ? lighten(0.03, theme.colors.primaryNeutral) : 'transparent'};
  border: 1px solid ${({ theme, $showForm }) => $showForm ? theme.colors.lightGray : 'transparent'};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  
  max-height: ${({ $showForm }) => ($showForm ? '500px' : '0')};
  overflow: hidden;
  opacity: ${({ $showForm }) => ($showForm ? 1 : 0)};
  visibility: ${({ $showForm }) => ($showForm ? 'visible' : 'hidden')};
  
  transform-origin: top center;
  transition: max-height 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
              padding 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
              margin-top 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
              opacity 0.3s ease-out ${({ $showForm }) => ($showForm ? '0.1s' : '0s')},
              visibility 0s linear ${({ $showForm }) => ($showForm ? '0s' : '0.4s')},
              border-color 0.4s ease-out;

  // Additional elements inside the form (like "Save card" checkbox)
  .stripe-form-footer {
    margin-top: ${({ theme }) => theme.spacing(4)};
    display: flex;
    justify-content: space-between; // Example if you have other actions
    align-items: center;
  }
`;

// --- Styling for Stripe Elements ---
// This will be passed as 'style' prop to CardElement, CardNumberElement etc.
// Not a styled-component itself, but an object for Stripe.
export const getStripeElementStyle = (theme: any) => ({ // 'any' for theme because DefaultTheme might not be available directly in all contexts if this is moved out
  base: {
    color: theme.colors.textDark,
    fontFamily: theme.typography.body.fontFamily,
    fontSmoothing: "antialiased",
    fontSize: theme.typography.body.sizes.base, // e.g., '16px' or theme variable
    '::placeholder': {
      color: theme.colors.textMuted,
    },
    iconColor: theme.colors.textDark, // Color of brand icons in the element
  },
  invalid: {
    color: theme.colors.error,
    iconColor: theme.colors.error,
  },
  complete: {
    iconColor: theme.colors.success, // Icon color changes on valid input
  }
});

// Wrapper for the individual Stripe Element if needed, to apply consistent borders
export const StripeElementContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundLight}; /* White background for the input */
  padding: ${({ theme }) => theme.spacing(3)}; /* Generous padding inside the input */
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border: 1.5px solid ${({ theme }) => theme.colors.mediumGray}; /* Slightly thicker border */
  box-shadow: ${({ theme }) => theme.shadows.xs}; /* Subtle inset-like shadow or very light outer */
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &.StripeElement--focus {
    border-color: ${({ theme }) => theme.colors.accent1};
    box-shadow: 0 0 0 3px ${({theme}) => transparentize(0.8, theme.colors.accent1)};
  }
  &.StripeElement--invalid {
    border-color: ${({ theme }) => theme.colors.error};
    box-shadow: 0 0 0 3px ${({theme}) => transparentize(0.8, theme.colors.error)};
  }
  &.StripeElement--complete { // Style for when the element has valid input
    // border-color: ${({ theme }) => theme.colors.success}; // Optional: border turns green
  }
`;

// --- Error Message Display ---
export const PaymentErrorDisplay = styled.div` // Renamed to avoid conflict
  color: ${({ theme }) => theme.colors.error};
  background-color: ${({ theme }) => theme.colors.errorSubtleBg}; // Use subtle background
  border-left: 4px solid ${({ theme }) => theme.colors.error}; // Accent bar for severity
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing(3)};
  margin-top: ${({ theme }) => theme.spacing(4)};
  font-size: ${({ theme }) => theme.typography.body.sizes.small};
  font-weight: ${({ theme }) => theme.typography.body.weights.medium};
  text-align: left; /* Better for detailed error messages */
  line-height: ${({ theme }) => theme.typography.lineHeights.base};

  svg { /* If an icon is prepended */
    margin-right: ${({ theme }) => theme.spacing(2)};
  }
`;

// --- RadioCircle --- (Assuming this is already beautifully styled from previous step)
// If not, copy the refined RadioCircle style here. For brevity, assuming it's imported.
// export { RadioCircle } from './RadioCircle.styles'; // or from a common location

// --- Security Information ---
export const SecurityInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2.5)}; /* Increased gap */
  padding: ${({ theme }) => theme.spacing(4)} 0; /* Vertical padding, no horizontal needed if centered/full-width */
  margin-top: ${({ theme }) => theme.spacing(5)}; /* Consistent spacing */
  color: ${({ theme }) => theme.colors.textMedium};
  font-size: ${({ theme }) => theme.typography.body.sizes.small};
  line-height: ${({ theme }) => theme.typography.lineHeights.base};
  
  svg {
    color: ${({ theme }) => theme.colors.accent2Vibrant}; /* Use a more reassuring, positive accent */
    flex-shrink: 0;
    font-size: 1.3em; /* Slightly larger lock icon */
  }
`;


interface RadioCircleProps {
  $isSelected: boolean; // Use transient prop with '$'
  disabled?: boolean; // Optional: to style a disabled state
}

export const RadioCircle = styled.div<RadioCircleProps>`
  width: 22px; // Standard radio button size
  height: 22px;
  border-radius: 50%; // Makes it a circle
  border: 2px solid ${({ theme, $isSelected }) => 
    $isSelected ? theme.colors.accent1 : theme.colors.mediumGray
  };
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; // Prevents it from shrinking in flex layouts
  transition: all 0.2s ease-out;
  cursor: pointer; // Indicate it's clickable (if the parent card is clickable)

  // The inner dot that appears when selected
  &::after {
    content: '';
    width: 10px; // Smaller than the outer circle
    height: 10px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.accent1};
    transform: scale(0); // Hidden by default
    transition: transform 0.15s ease-out;
    
    ${({ $isSelected }) => $isSelected && css`
      transform: scale(1); // Visible when selected
    `}
  }

  // Optional: Style for when the parent is disabled
  ${({ theme, disabled }) => disabled && css`
    border-color: ${theme.colors.lightGray};
    background-color: ${theme.colors.primaryNeutral};
    cursor: not-allowed;

    &::after {
      background-color: ${theme.colors.mediumGray};
    }
  `}
`;