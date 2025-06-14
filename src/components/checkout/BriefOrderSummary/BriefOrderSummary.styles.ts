// src/components/checkout/BriefOrderSummary/BriefOrderSummary.styles.ts
import styled, { css, keyframes } from 'styled-components';
import { darken, lighten, transparentize } from 'polished';

// --- Root Wrapper ---
export const SummaryCardWrapper = styled.div`
  background: ${({ theme }) => theme.colors.backgroundSubtle}; /* Softer background */
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.xlarge}; /* Match other main cards */
  padding: ${({ theme }) => theme.spacing(6)}; /* Generous padding */
  box-shadow: ${({ theme }) => theme.shadows.lg}; /* More presence as it's sticky */

  /* Make it truly sticky with consideration for header */
position: sticky;
top: ${({ theme }) =>
  `calc(${(theme.dimensions as any)?.stickyHeaderHeight || '100px'} + ${theme.spacing(6)})`};

max-height: ${({ theme }) =>
  `calc(100vh - (${(theme.dimensions as any)?.stickyHeaderHeight || '100px'} + ${theme.spacing(12)}))`};

overflow-y: auto; // Allow internal scrolling if content exceeds max-height

@media (max-width: 991px) {
  position: static;
  max-height: none;
  overflow-y: visible;
  margin-top: ${({ theme }) => theme.spacing(6)};
  order: -1; // Moves the element above others in flexbox (e.g. below stepper on mobile)
}

`;
export const SubtotalLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.body.sizes.base}; /* Standard size for labels */
  font-weight: ${({ theme }) => theme.typography.body.weights.regular};
  color: ${({ theme }) => theme.colors.textMedium};
`;
// --- Title ---
export const SummaryTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.heading.fontFamily}; /* Playfair Display */
  font-size: ${({ theme }) => theme.typography.admin.sectionHeader}; /* 1.125rem - good size */
  font-weight: ${({ theme }) => theme.typography.heading.weights.bold};
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0 0 ${({ theme }) => theme.spacing(5)} 0; /* Increased margin */
  padding-bottom: ${({ theme }) => theme.spacing(4)}; /* Increased padding */
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)}; /* Increased gap */

  svg {
    font-size: 1.2em; /* Relative to h3 font size */
    color: ${({ theme }) => theme.colors.accent1}; /* Use accent color for icon */
    margin-top: -2px; /* Fine-tune icon alignment */
  }
`;
export const SubtotalValue = styled.span`
  font-size: ${({ theme }) => theme.typography.body.sizes.base}; /* Standard size for values */
  font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
  color: ${({ theme }) => theme.colors.textDark};
  text-align: right;
`;
// --- Item Preview ---
export const ItemPreviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)}; /* Increased gap */
  margin-bottom: ${({ theme }) => theme.spacing(5)};
  padding-right: ${({ theme }) => theme.spacing(1)}; // Space for scrollbar if present
  
  /* Conditional max-height and scrollbar styling (only if it needs to scroll) */
  /* If items are few, no scrollbar. If many, these apply. */
  max-height: 250px; /* Adjust as needed */
  overflow-y: auto;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { 
    background: ${({ theme }) => theme.colors.mediumGray}; 
    border-radius: ${({ theme }) => theme.borderRadius.pill};
  }
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.mediumGray} transparent;
`;

export const ItemPreview = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3.5)}; /* Slightly increased gap */
`;

export const ItemPreviewThumbnail = styled.div`
  width: 64px; /* Slightly larger */
  height: 64px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  overflow: hidden;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.colors.lightGray};
  border: 1px solid ${({ theme }) => theme.colors.lightGray}; // Subtle border for definition

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease-out;
    ${ItemPreview}:hover & { // Subtle zoom on parent hover
        transform: scale(1.05);
    }
  }
`;

export const ItemPreviewDetails = styled.div`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  color: ${({ theme }) => theme.colors.textMedium};
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
  flex-grow: 1; /* Allow details to take remaining space */

  .name {
    font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
    color: ${({ theme }) => theme.colors.textDark};
    font-size: ${({ theme }) => theme.typography.body.sizes.base}; /* Clearer name size */
    display: block;
    margin-bottom: ${({ theme }) => theme.spacing(0.5)};
  }
  .quantity {
    font-size: ${({ theme }) => theme.typography.body.sizes.small};
    color: ${({ theme }) => theme.colors.textMuted};
  }
  .price { // For individual item price, if shown
    font-size: ${({ theme }) => theme.typography.body.sizes.small};
    color: ${({ theme }) => theme.colors.textDark};
    font-weight: ${({ theme }) => theme.typography.body.weights.medium};
    margin-top: ${({ theme }) => theme.spacing(1)};
    text-align: right; // Example alignment
  }
`;

export const ViewAllItemsLink = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textLink}; /* More subtle link color */
  font-size: ${({ theme }) => theme.typography.body.sizes.small};
  font-weight: ${({ theme }) => theme.typography.body.weights.medium};
  cursor: pointer;
  text-decoration: none; // Cleaner look
  display: block;
  margin-top: ${({ theme }) => theme.spacing(3)}; // Increased margin
  text-align: right;
  transition: color 0.2s ease-out;

  &:hover {
    color: ${({ theme }) => theme.colors.textLinkHover};
    text-decoration: underline; // Underline on hover for affordance
  }
`;

// --- Cost Breakdown Rows (Subtotal, Discount, Shipping, Tax, Total) ---
const CostRowBase = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(2.5)} 0; /* Adjusted padding */
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
`;

export const SubtotalRow = styled.div`
  ${CostRowBase}
  margin-top: ${({ theme }) => theme.spacing(4)}; /* More space before first cost row */
  border-top: 1px dashed ${({ theme }) => theme.colors.lightGray};
`;

export const CostLineItemRow = styled.div<{ $isEmphasized?: boolean; $isDiscount?: boolean }>`
  ${CostRowBase}
  border-top: 1px solid ${({ theme }) => theme.colors.lightGray}; /* Thin solid line for subsequent items */
  padding: ${({ theme }) => theme.spacing(3)} 0;

  ${({$isDiscount, theme}) => $isDiscount && css`
    color: ${theme.colors.success}; // Or a specific discount color like accent2Vibrant
    ${SubtotalLabel}, ${SubtotalValue} { // Override children
        color: inherit; // Make text color inherit from parent
    }
  `}
`;

export const GrandTotalRow = styled.div`
  ${CostRowBase}
  margin-top: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => theme.spacing(4)} 0; /* More padding for grand total */
  border-top: 2px solid ${({ theme }) => theme.colors.textDark}; /* Stronger separator for total */

  ${SubtotalLabel}, ${SubtotalValue} {
    font-size: ${({ theme }) => theme.typography.body.sizes.large}; /* Larger grand total text */
    font-weight: ${({ theme }) => theme.typography.body.weights.bold};
    color: ${({ theme }) => theme.colors.textDark};
  }
`;







// --- Discount Section ---
export const DiscountInputWrapper = styled.div`
  margin: ${({ theme }) => theme.spacing(5)} 0; /* More vertical margin */
  display: flex;
  gap: ${({ theme }) => theme.spacing(2.5)};
  align-items: center;

  svg { // Gift Icon
    color: ${({ theme }) => theme.colors.accent1}; /* Use accent color for gift icon */
    font-size: 1.4rem; /* Larger icon */
    flex-shrink: 0;
    /* margin-right not needed due to gap */
  }

  input {
    flex-grow: 1;
    padding: ${({ theme }) => theme.spacing(3)}; /* More padding in input */
    border: 1.5px solid ${({ theme }) => theme.colors.mediumGray}; /* Thicker border */
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    font-size: ${({ theme }) => theme.typography.body.sizes.base}; /* Larger input text */
    background-color: ${({ theme }) => theme.colors.backgroundLight};
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &::placeholder {
        color: ${({ theme }) => theme.colors.textMuted};
    }
    &:focus {
      border-color: ${({ theme }) => theme.colors.accent1};
      box-shadow: 0 0 0 3px ${({theme}) => transparentize(0.8, theme.colors.accent1)};
      outline: none;
    }
    &:disabled {
        background-color: ${({ theme }) => theme.colors.lightGray};
        cursor: not-allowed;
    }
  }

  button { /* Apply Button */
    padding: 0 ${({ theme }) => theme.spacing(5)}; /* More horizontal padding */
    height: calc(${({ theme }) => theme.spacing(3)} * 2 + 1.2rem + 3px); /* Match input height: padding*2 + fontSize + border*2 */
    background-color: ${({ theme }) => theme.colors.accent1}; /* Primary accent for apply */
    color: ${({ theme }) => theme.colors.textLight};
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
    font-size: ${({ theme }) => theme.typography.body.sizes.small}; /* Slightly smaller button text */
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.15s ease-out;
    white-space: nowrap;

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.accent1Hover};
      transform: translateY(-1px);
    }
    &:disabled {
        background-color: ${({ theme }) => theme.colors.mediumGray};
        color: ${({theme}) => theme.colors.textDisabled};
        cursor: not-allowed;
    }
  }
`;

export const DiscountMessage = styled.div<{ $type: 'success' | 'error' }>`
  font-size: ${({ theme }) => theme.typography.body.sizes.small};
  padding: ${({ theme }) => theme.spacing(2.5)};
  margin-top: -${({ theme }) => theme.spacing(3)}; // Pull up closer to input
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  border-radius: ${({ theme }) => theme.borderRadius.medium}; // Consistent radius
  text-align: left; /* Better for messages */
  border-left: 4px solid;

  ${({ theme, $type }) => $type === 'success' && css`
    color: ${darken(0.1, theme.colors.success)}; // Darker for readability
    background-color: ${theme.colors.successSubtleBg};
    border-color: ${theme.colors.success};
  `}
  ${({ theme, $type }) => $type === 'error' && css`
    color: ${darken(0.1, theme.colors.error)}; // Darker for readability
    background-color: ${theme.colors.errorSubtleBg};
    border-color: ${theme.colors.error};
  `}
`;


// --- Proceed Button ---
export const ProceedButtonWrapper = styled.div`
  margin-top: ${({ theme }) => theme.spacing(6)}; /* Generous space above button */

  /* The PrimaryCtaButton should be styled beautifully in its own definition */
  /* Ensure it handles isLoading states visually if that prop is added */
`;