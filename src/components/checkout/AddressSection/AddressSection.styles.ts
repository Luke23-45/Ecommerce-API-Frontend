// src/components/checkout/AddressSection/AddressSection.styles.ts
import styled, { css, keyframes } from 'styled-components';
import { transparentize, lighten, darken } from 'polished'; // Added darken
import { FormLabel } from '@/components/admin/common/FormSectionWrapper/FormSectionWrapper.styles';
import { AdminInput } from '@/components/admin/Dashboard/Common/Common.styles';
// Use CheckoutSectionBase as the root for this section
// Import directly or re-declare if preferred for component isolation
import { CheckoutSectionBase, SectionTitle as SectionTitleBase } from '@/pages/CheckoutPage/CheckoutPage.styles';


// --- Animations ---
const formFadeInSlideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// --- Root Wrapper for AddressSection ---
export const AddressSectionWrapper = styled(CheckoutSectionBase)`
  // Inherits padding, border-radius, shadow from CheckoutSectionBase
  // Add any AddressSection specific overrides or additional styles here
`;

// --- Section Title --- (Using the base and extending if needed)
export const AddressSectionTitle = styled(SectionTitleBase)`
  // Any AddressSection specific title adjustments,
  // e.g., if we want a slightly different margin or icon style within this section
  // For now, it will inherit from CheckoutPage.styles.ts SectionTitle
  margin-bottom: ${({ theme }) => theme.spacing(6)}; // Increased space after title
`;

// --- List of Saved Addresses ---
export const AddressList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing(4)}; /* Increased gap */
  margin-bottom: ${({ theme }) => theme.spacing(5)};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    /* More sophisticated grid for larger screens: ensures cards don't get too wide */
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
`;

interface AddressCardProps {
  $isSelected: boolean;
  $isSelectable?: boolean; // New prop if some cards are not selectable
}

export const AddressCard = styled.div<AddressCardProps>`
  border: 2px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.large}; /* Consistent large radius */
  padding: ${({ theme }) => theme.spacing(5)}; /* Generous padding */
  cursor: ${({ $isSelectable = true }) => $isSelectable ? 'pointer' : 'default'};
  position: relative;
  transition: all 0.25s ${({ theme }) => theme.transitions.base};
  background-color: ${({ theme }) => theme.colors.backgroundLight}; /* Use pure white/light for cards */
  box-shadow: ${({ theme }) => theme.shadows.sm}; /* Subtle initial shadow */

  &:hover {
    ${({ theme, $isSelected, $isSelectable = true }) => $isSelectable && css`
      border-color: ${$isSelected ? theme.colors.accent1Hover : theme.colors.mediumGray};
      transform: translateY(-3px);
      box-shadow: ${theme.shadows.md}; /* Slightly more prominent on hover */
    `}
  }

  ${({ theme, $isSelected }) => $isSelected && css`
    border-color: ${theme.colors.accent1};
    box-shadow: 0 0 0 2.5px ${theme.colors.accent1}, ${theme.shadows.lg}; /* Clearer selection ring & shadow */
    background-color: ${transparentize(0.96, theme.colors.accent1)}; /* Very subtle bg tint for selected */
    
    // Make selection indicator more prominent on selected card
    ${SelectionIndicator} {
        transform: scale(1.1);
        box-shadow: 0 2px 4px ${transparentize(0.7, theme.colors.accent1)};
    }
  `}
`;

export const AddressContent = styled.div`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.base}; /* Base font size for readability */
  color: ${({ theme }) => theme.colors.textMedium};
  line-height: ${({ theme }) => theme.typography.lineHeights.base};

  strong { /* Recipient's Name */
    display: block;
    color: ${({ theme }) => theme.colors.textDark};
    font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
    font-size: ${({ theme }) => theme.typography.body.sizes.large}; /* Slightly larger name */
    margin-bottom: ${({ theme }) => theme.spacing(1.5)};
  }
  span { /* Each line of the address */
    display: block;
    margin-bottom: ${({ theme }) => theme.spacing(0.5)};
    &:last-child {
        margin-bottom: 0;
    }
  }
`;

export const DefaultBadge = styled.span`
  display: inline-block;
  background-color: ${({ theme }) => transparentize(0.85, theme.colors.accent2Vibrant)};
  color: ${({ theme }) => darken(0.1,theme.colors.accent2Vibrant)};
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2.5)};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-size: ${({ theme }) => theme.typography.body.sizes.xsmall};
  font-weight: ${({ theme }) => theme.typography.body.weights.bold};
  margin-top: ${({ theme }) => theme.spacing(3)};
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

export const SelectionIndicator = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing(3)}; /* Adjust for padding */
  right: ${({ theme }) => theme.spacing(3)};
  width: 28px; /* Slightly larger */
  height: 28px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.accent1};
  color: ${({ theme }) => theme.colors.textLight};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ${({ theme }) => theme.transitions.base}, box-shadow 0.2s ease-out;
  font-size: 0.9em; /* Adjust check icon size if needed */
  z-index: 1; /* Ensure it's above other card content */
`;

// --- "Add New Address" & Form ---
export const AddNewAddressToggleWrapper = styled.div`
  margin-top: ${({ theme }) => theme.spacing(1)}; // Reduced from 2
  margin-bottom: ${({ theme }) => theme.spacing(5)};
  display: flex;
  justify-content: flex-start; // Align button to the left by default
`;

// Inheriting from SecondaryButton if it's already beautiful,
// otherwise style a new Button component for this purpose.
// For example, if SecondaryButton is from AuthForms and might not fit perfectly:
export const ToggleAddressFormButton = styled.button`
  // Assuming a similar style to SecondaryButton from AuthForms or a new definition
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(2.5)} ${({ theme }) => theme.spacing(4)};
  font-family: ${({ theme }) => theme.typography.utility.button.fontFamily || theme.typography.body.fontFamily};
  font-weight: ${({ theme }) => theme.typography.utility.button.fontWeight || 500};
  font-size: ${({ theme }) => theme.typography.utility.button.fontSize || '0.9rem'};
  letter-spacing: ${({ theme }) => theme.typography.utility.button.letterSpacing || '0.02em'};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  cursor: pointer;
  transition: all 0.2s ease-out;
  
  // Style for "outline" variant
  background-color: transparent;
  border: 1.5px solid ${({ theme }) => theme.colors.accent1};
  color: ${({ theme }) => theme.colors.accent1};

  svg {
    font-size: 1.1em;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.accent1Subtle};
    color: ${({ theme }) => theme.colors.accent1Hover};
    border-color: ${({ theme }) => theme.colors.accent1Hover};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.xs};
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px ${({theme}) => transparentize(0.7, theme.colors.accent1)};
  }
`;


export const AddressFormWrapper = styled.div<{ $isOpen: boolean }>`
  max-height: ${({ $isOpen }) => ($isOpen ? '1000px' : '0')}; /* Ensure $ for transient prop */
  overflow: hidden;
  transition: max-height 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              opacity 0.4s ease-out ${({ $isOpen }) => ($isOpen ? '0.1s' : '0s')},
              visibility 0s linear ${({ $isOpen }) => ($isOpen ? '0s' : '0.5s')};
  padding: ${({ $isOpen, theme }) => ($isOpen ? `${theme.spacing(5)} 0 ${theme.spacing(2)} 0` : '0')};
  border-top: ${({ $isOpen, theme }) => ($isOpen ? `1px dashed ${theme.colors.lightGray}` : 'none')};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  
  animation: ${({ $isOpen }) => $isOpen && css`${formFadeInSlideUp} 0.5s ease-out forwards`};

  form {
    display: grid;
    grid-template-columns: 1fr; /* Mobile first */
    gap: ${({ theme }) => theme.spacing(4)}; /* Increased gap in form */

    @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
      grid-template-columns: 1fr 1fr;
    }
  }
`;

// Input styles for the form (re-using or defining new elegant inputs)
// Assuming AdminInput and FormLabel are already beautifully styled
// If not, they would need refinement here or in their original definition.
// For instance, an elegant input might look like:
export const StyledFormLabel = styled(FormLabel)` // Assuming FormLabel exists
    font-size: ${({ theme }) => theme.typography.body.sizes.small};
    color: ${({ theme }) => theme.colors.textMedium};
    font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
    margin-bottom: ${({ theme }) => theme.spacing(1.5)};
`;

export const StyledInput = styled(AdminInput)` // Assuming AdminInput exists
    padding: ${({ theme }) => theme.spacing(3)}; // Generous padding
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    border: 1px solid ${({ theme }) => theme.colors.mediumGray};
    font-size: ${({ theme }) => theme.typography.body.sizes.base};
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &:focus {
        border-color: ${({ theme }) => theme.colors.accent1};
        box-shadow: 0 0 0 3px ${({theme}) => transparentize(0.8, theme.colors.accent1)};
        outline: none;
    }
    &::placeholder {
        color: ${({ theme }) => theme.colors.textMuted};
    }
`;


export const FormActions = styled.div`
  grid-column: 1 / -1; // Span full width on both mobile and tablet grid
  display: flex;
  gap: ${({ theme }) => theme.spacing(3)};
  margin-top: ${({ theme }) => theme.spacing(4)}; /* More space above actions */
  justify-content: flex-end; /* Align buttons to the right */

  /* Buttons inside should already be styled (PrimaryCtaButton, SecondaryButton) */
  /* Ensure they have appropriate minimum widths or flex properties */
  & > button {
    min-width: 120px; /* Example: ensure buttons have some min width */
  }
`;

// --- "Same as Shipping" Option (for Billing Address) ---
export const SameAsShippingWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(5)}; /* Consistent spacing */
  padding: ${({ theme }) => theme.spacing(4)};
  background-color: ${({ theme }) => theme.colors.accent1Subtle}; /* Subtle accent background */
  border-radius: ${({ theme }) => theme.borderRadius.large}; /* Consistent large radius */
  border: 1px solid ${({ theme }) => transparentize(0.7, theme.colors.accent1)}; /* Accent border */

  /* Ensure AdminCheckbox label styles are also elegant */
  label { /* Targeting AdminCheckbox label if possible */
      font-weight: ${({ theme }) => theme.typography.body.weights.medium};
  }
`;