// src/pages/CheckoutReviewPage/CheckoutReviewPage.styles.ts

import styled, { keyframes, css } from 'styled-components'; // Added css import
import { lighten, darken, transparentize } from 'polished'; // Added for potential use, good to have

/* --- Inheriting the Premium Design System (Local Definition for this File) --- */
// These local definitions will guide the styling. Ensure they match the Élan vision.
const colors = {
  background: '#F8F5F2', // Élan primaryNeutral for a warmer, premium page background
  panelBackground: '#FFFFFF', // Pure white for content cards for contrast and cleanliness
  textPrimary: '#302D2A', // Élan textDark for high contrast and readability
  textSecondary: '#5A5653', // Élan textMedium for secondary information
  accentPrimary: '#A46E4A', // Élan accent1 for key interactive elements and highlights
  accentVibrant: '#8C5D3E', // Élan accent1Hover or Active for hover states
  border: '#E5E7EB',      // Élan adminBorder or a similar light, neutral gray
  success: '#10B981',      // Élan success color
  error: '#EF4444',        // Élan error color
  white: '#FFFFFF',
  textLink: '#9C643C',    // Élan textLink
  textLinkHover: '#7E5130', // Élan textLinkHover
  // Add any other colors from Élan theme if needed:
  // textMuted: '#888480',
  // accent1Subtle: '#FDF8F5',
};

const typography = {
  fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`,
  fontFamilyHeading: `'Playfair Display', serif`, // For titles, if desired
  // Line heights and letter spacings can be defined here or applied inline
  lineHeightBase: 1.6,
  lineHeightTight: 1.35,
};

const shadows = {
  // Using Élan theme shadow definitions directly or slightly adapted
  soft: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)', // Similar to theme.shadows.md
  medium: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)', // Similar to theme.shadows.lg
  interactive: '0 3px 6px rgba(0, 0, 0, 0.07)', // From theme for hovers
  focusRing: `0 0 0 3px ${transparentize(0.5, colors.accentPrimary)}`, // Using accentPrimary for focus
};

const borderRadius = { // Consistent border radii
    small: '6px',
    medium: '12px',
    large: '16px', // Same as theme.borderRadius.large
    xlarge: '24px', // Same as theme.borderRadius.xlarge
    pill: '9999px',
};

const spacing = (value: number) => `${value * 0.25}rem`; // Helper for spacing consistency

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* --- Page Layout --- */

export const ReviewPageWrapper = styled.div`
  background-color: ${colors.background};
  min-height: 100vh;
  font-family: ${typography.fontFamily};
  padding: ${spacing(16)} 0 ${spacing(24)} 0; /* E.g., 4rem top, 6rem bottom */
  animation: ${fadeIn} 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s both; // Refined easing & delay

  @media (max-width: 768px) { // Consider using theme breakpoints here if possible for consistency
    padding: ${spacing(8)} 0 ${spacing(12)} 0;
  }
`;

export const ReviewContentLimiter = styled.div`
  max-width: 1200px; // Good max width
  margin: 0 auto;
  padding: 0 ${spacing(8)}; // e.g., 2rem -> theme.spacing(8)

  @media (max-width: 480px) { // Example mobile breakpoint
    padding: 0 ${spacing(6)}; // Less padding on very small screens
  }
`;

export const ReviewHeader = styled.header`
  text-align: center;
  margin-bottom: ${spacing(14)}; // 3.5rem

  h1 {
    font-family: ${typography.fontFamilyHeading}; // Using Playfair Display
    font-size: clamp(2.25rem, 5vw, 3rem); // Refined clamp for title
    font-weight: 700; // From theme: heading.weights.bold
    color: ${colors.textPrimary};
    margin: 0 0 ${spacing(4)} 0; // 1rem
    line-height: ${typography.lineHeightTight};
  }
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  color: ${colors.textLink}; // Using Élan textLink
  font-size: ${spacing(3.75)}; // Approx 0.9rem-1rem from theme: body.sizes.small or base
  font-weight: 500; // theme.typography.body.weights.medium
  display: inline-flex;
  align-items: center;
  gap: ${spacing(2)}; // 0.5rem
  cursor: pointer;
  transition: color 0.2s ease-out, transform 0.2s ease-out; // Added transform transition
  padding: ${spacing(2)} ${spacing(1)}; // Give it a bit more clickable area without affecting visual gap

  svg {
    transition: transform 0.2s ease-out;
  }

  &:hover {
    color: ${colors.textLinkHover}; // Élan textLinkHover
    transform: translateY(-1px); // Subtle lift
    svg {
      transform: translateX(-2px); // Icon moves with text
    }
  }

  &:focus-visible {
      outline: none;
      box-shadow: ${shadows.focusRing};
      border-radius: ${borderRadius.small};
  }
`;

export const ReviewLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 420px; // 420px for sidebar is good
  gap: ${spacing(12)}; // 3rem gap, generous and good
  align-items: flex-start;

  @media (max-width: 992px) { // Breakpoint for stacking
    grid-template-columns: 1fr;
    gap: ${spacing(10)}; // Slightly reduced gap when stacked
  }
`;

export const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${spacing(8)}; // 2rem, good separation between cards
`;

export const Sidebar = styled.aside`
  position: sticky;
  top: ${spacing(8)}; // 2rem sticky top
  // Consider max-height for scrollability if header + this becomes too tall
  max-height: calc(100vh - ${spacing(16)}); // (Top sticky value * 2 for top/bottom margin)
  overflow-y: auto; // Only if content can exceed max-height

  @media (max-width: 992px) {
    position: static;
    max-height: none;
    overflow-y: visible;
  }

  // Optional: Custom scrollbar for elegance
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { 
    background: ${darken(0.1, colors.border)}; 
    border-radius: ${borderRadius.pill};
  }
  scrollbar-width: thin;
  scrollbar-color: ${darken(0.1, colors.border)} transparent;
`;

/* --- Content Cards --- */

export const ReviewCard = styled.section`
  background: ${colors.panelBackground};
  border-radius: ${borderRadius.xlarge}; // Consistent premium radius
  border: 1px solid ${colors.border};
  box-shadow: ${shadows.soft}; // Default soft shadow
  transition: box-shadow 0.3s ease-out;

  &:hover {
    // Optional subtle hover effect for cards if desired, though usually not needed for read-only info cards
    // box-shadow: ${shadows.medium};
  }
`;

export const CardHeader = styled.div`
  padding: ${spacing(6)} ${spacing(7)}; // 1.5rem 1.75rem -> Generous header padding
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${colors.border};
`;

export const SectionTitle = styled.h2`
  font-family: ${typography.fontFamilyHeading}; // Playfair for section titles
  font-size: ${spacing(5.5)}; // Approx 1.3rem, adjust based on theme hierarchy
  font-weight: 600; // theme.typography.heading.weights.semiBold or bold
  color: ${colors.textPrimary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${spacing(3)}; // 0.75rem

  svg {
    color: ${colors.accentPrimary};
    opacity: 1; // Full opacity for clear icon
    font-size: 1.1em; // Relative to h2
  }
`;

export const EditLink = styled.button`
  background: none;
  border: 1px solid transparent; // For layout consistency, then styled on hover
  color: ${colors.accentPrimary};
  font-size: ${spacing(3.5)}; // ~0.9rem
  font-weight: 500; // theme.typography.body.weights.medium or semiBold
  cursor: pointer;
  padding: ${spacing(1.5)} ${spacing(3)}; // Clickable area
  border-radius: ${borderRadius.medium};
  transition: all 0.2s ease-out;

  &:hover {
    // text-decoration: underline; // Optional, button style preferred
    color: ${colors.accentVibrant};
    background-color: ${transparentize(0.9, colors.accentPrimary)}; // Subtle background
    border-color: ${transparentize(0.7, colors.accentPrimary)};
  }
  &:focus-visible {
    outline: none;
    box-shadow: ${shadows.focusRing};
  }
`;

export const CardBody = styled.div`
  padding: ${spacing(7)}; // Consistent with header's horizontal, slightly more vertical
  font-size: ${spacing(3.75)}; // ~0.95rem for base text in cards
  line-height: ${typography.lineHeightBase};
  color: ${colors.textSecondary};

  // Specific styling for label-value pairs or address blocks
  .address-block, .detail-block {
    margin-bottom: ${spacing(4)};
    &:last-child {
      margin-bottom: 0;
    }
  }

  .detail-label {
    display: block;
    color: ${colors.textSecondary};
    font-size: ${spacing(3.25)}; // ~0.8rem, slightly smaller for labels
    margin-bottom: ${spacing(0.5)};
    font-weight: 400; // theme.typography.body.weights.regular
  }
  
  strong, .detail-value { // Can be <strong> or a span with this class
    color: ${colors.textPrimary};
    font-weight: 500; // theme.typography.body.weights.medium
    display: block; // Ensure values are on new lines if labels are above
  }
`;

/* --- Item List Styles --- */

export const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  // No padding here, CardBody provides it. Remove if CardBody padding is 0 for ItemList scenarios.
`;

export const Item = styled.div`
  display: grid; // Use grid for precise alignment
  grid-template-columns: auto 1fr auto; // Thumbnail, Details, Price/Qty
  gap: ${spacing(5)}; // 1.25rem
  align-items: center; // Vertically center align items in the row
  padding: ${spacing(5)} 0; // Vertical padding for each item

  &:not(:last-child) {
    border-bottom: 1px solid ${colors.border};
  }
`;

export const ItemThumbnail = styled.div`
  width: 80px; // Good size
  height: 80px;
  border-radius: ${borderRadius.medium}; // Consistent with other radii
  overflow: hidden;
  flex-shrink: 0;
  background-color: ${transparentize(0.5, colors.border)}; // Softer placeholder
  border: 1px solid ${colors.border}; // Defines the edge

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    ${Item}:hover & {
      transform: scale(1.08); // Slightly more noticeable zoom on item hover
    }
  }
`;

export const ItemDetails = styled.div`
  flex-grow: 1; // Takes available space
  display: flex;
  flex-direction: column;
  justify-content: center; // Vertically center if row is taller
  text-align: left;
`;

export const ItemName = styled.h3`
  font-family: ${typography.fontFamily}; // Inter for item names for readability
  font-size: ${spacing(4.25)}; // ~1.05rem
  font-weight: 600; // theme.typography.body.weights.semiBold
  color: ${colors.textPrimary};
  margin: 0 0 ${spacing(1)} 0; // 0.3rem -> theme.spacing(1) or 1.5
  line-height: ${typography.lineHeightTight};
`;

export const ItemVariant = styled.p`
  font-size: ${spacing(3.25)}; // ~0.85rem, theme.typography.body.sizes.xsmall
  color: ${colors.textSecondary};
  margin: 0;
  line-height: ${typography.lineHeightBase};
`;

export const ItemQuantityPrice = styled.div`
  font-family: ${typography.fontFamily}; // Inter for consistency
  color: ${colors.textPrimary};
  font-weight: 500; // theme.typography.body.weights.medium
  text-align: right;
  line-height: ${typography.lineHeightTight}; // Tighter line height for Qty/Price block
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center; // Vertically center if row is taller
  gap: ${spacing(0.5)};

  .item-quantity {
    font-size: ${spacing(3.5)}; // ~0.9rem
    color: ${colors.textSecondary};
  }
  .item-total-price strong { // For the actual price string
    font-size: ${spacing(4)}; // ~1rem
    font-weight: 600; // theme.typography.body.weights.semiBold
    color: ${colors.textPrimary};
  }
`;

/* --- Summary Sidebar Styles --- */

export const SummaryCard = styled(ReviewCard)`
  padding: ${spacing(7)}; // 1.75rem
`;

export const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing(3)} 0; // 0.8rem
  font-size: ${spacing(3.75)}; // ~0.95rem

  &:not(:last-child) {
    border-bottom: 1px dashed ${lighten(0.05, colors.border)}; // Lighter dashed line
  }
`;

export const InfoLabel = styled.span`
  color: ${colors.textSecondary};
  font-weight: 400; // theme.typography.body.weights.regular
`;

export const InfoValue = styled.span`
  color: ${colors.textPrimary};
  font-weight: 500; // theme.typography.body.weights.medium
`;

export const GrandTotalRow = styled(TotalRow)`
  padding-top: ${spacing(6)}; // 1.25rem plus some from TotalRow's base padding
  margin-top: ${spacing(3)}; // 0.75rem
  border-top: 2px solid ${colors.textPrimary};
  border-bottom: none;
  
  ${InfoLabel}, ${InfoValue} {
    font-family: ${typography.fontFamilyHeading}; // Playfair for Grand Total
    font-size: ${spacing(6.5)}; // ~1.6rem - more prominent
    font-weight: 700; // theme.typography.heading.weights.bold
    color: ${colors.textPrimary};
  }
`;

export const DiscountRow = styled(TotalRow)`
  // color: ${colors.success}; // Applied directly if needed, or use specific token
  ${InfoLabel}, ${InfoValue} {
    color: ${colors.success}; // Make discount text green
    font-weight: 600; // Slightly bolder for discount info
  }
`;

// Reusing PrimaryCtaButton from common components for consistency and beauty
// If PlaceOrderButton needs unique styling beyond PrimaryCtaButton:
export const PlaceOrderButtonStyled = styled.button` // Assuming PrimaryCtaButton needs overrides
  width: 100%;
  font-family: ${typography.fontFamily}; // Inter for button text
  font-weight: 600; // theme.typography.utility.button.fontWeight or body.weights.semiBold
  font-size: ${spacing(4.5)}; // ~1.15rem, theme.typography.utility.button.fontSize or slightly larger
  padding: ${spacing(4.5)} ${spacing(7)}; // ~1.1rem 1.75rem
  border-radius: ${borderRadius.medium}; // Consistent radius
  border: none;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  background: ${colors.accentPrimary}; // Main Élan accent
  color: ${colors.white};
  box-shadow: ${shadows.medium};
  margin-top: ${spacing(8)}; // 2rem

  display: flex; // For icon and text alignment
  align-items: center;
  justify-content: center;
  gap: ${spacing(2)};

  &:hover:not(:disabled) {
    background: ${colors.accentVibrant}; // Darker accent on hover
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${transparentize(0.6, colors.accentPrimary)}; // Softer, branded glow
  }
  &:disabled {
    background-color: ${lighten(0.15, colors.border)};
    color: ${darken(0.2, colors.textSecondary)};
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
  // For loading state with spinner
  &.is-loading {
    // Styles when loading, e.g., spinner instead of text or alongside
  }
`;

export const SecurityNotice = styled.p`
  text-align: center;
  font-size: ${spacing(3.25)}; // ~0.85rem
  color: ${colors.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing(2)};
  margin-top: ${spacing(6)}; // 1.5rem

  svg {
    color: ${colors.success}; // Green lock icon
  }
`;

// Example additions to CheckoutReviewPage.styles.ts
export const BreakdownCard = styled(ReviewCard)`
  margin-top: 1.5rem; // Space above these new cards
`;

export const BreakdownItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing(2)} 0;
  font-size: ${({ theme }) => theme.typography.body.sizes.small};
  color: ${({ theme }) => theme.colors.textMedium};

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border}; // Softer separator
  }
`;

export const BreakdownLabel = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary}; // Muted label
  margin-right: ${({ theme }) => theme.spacing(4)};
`;

export const BreakdownValue = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.typography.body.weights.medium};
  text-align: right;
`;