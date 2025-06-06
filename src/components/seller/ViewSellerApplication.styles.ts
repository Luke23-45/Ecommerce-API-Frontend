// src/components/profile/display/ViewSellerApplication.styles.ts
import styled, { type DefaultTheme, css, keyframes } from 'styled-components';
import { rgba, darken, lighten, transparentize } from 'polished';

// --- Keyframes ---
const subtlePageEntrance = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const cardEntrance = keyframes`
  from {
    opacity: 0;
    transform: translateY(15px) scale(0.99); // Refined entrance
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

// --- Main Page Container ---
export const PageContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundLight || '#ffffff'}; // Enforced white page background
  color: ${({ theme }) => theme.colors.textDark};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  width: 100%;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing(6)} ${({ theme }) => theme.containerPadding}; // Adjusted top/bottom padding
  
  /* NEW: Fixed max-width for the overall content area of this page */
  max-width: 1200px; 
  margin: 0 auto; // Center the container

  animation: ${subtlePageEntrance} 0.35s ease-out;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet || '768px'}) {
    padding: ${({ theme }) => theme.spacing(5)} ${({ theme }) => theme.spacing(4)};
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobileL || '480px'}) {
    padding: ${({ theme }) => theme.spacing(4)};
  }
`;

// --- Header for the View ---
export const ViewHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(4)} 0; // Vertical padding only, horizontal handled by PageContainer
  margin-bottom: ${({ theme }) => theme.spacing(6)}; // Reduced margin before cards for tighter look
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};

  h1 {
    font-family: ${({ theme }) => theme.typography.heading.fontFamily};
    font-size: clamp(1.7rem, 3.5vw, 2.3rem); // Slightly more prominent title
    font-weight: ${({ theme }) => theme.typography.heading.weights.bold};
    color: ${({ theme }) => theme.colors.textDark}; // Title on white background
    margin: 0;
    letter-spacing: -0.01em;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet || '768px'}) {
     padding: ${({ theme }) => theme.spacing(3)} 0;
     margin-bottom: ${({ theme }) => theme.spacing(5)};
     h1 { font-size: clamp(1.5rem, 4.5vw, 2rem); }
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobileL || '480px'}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing(2.5)};
  }
`;

// --- Status Badge ---
export const StatusBadge = styled.span<{ status: string }>`
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2.5)};
  border-radius: ${({ theme }) => theme.borderRadius?.pill || '20px'};
  font-size: ${({ theme }) => theme.typography.body.sizes.xsmall};
  font-weight: ${({ theme }) => theme.typography.body.weights.bold};
  text-transform: uppercase;
  letter-spacing: 0.6px;
  line-height: 1.4; // Added for better vertical alignment
  color: ${({ theme, status }) => {
    if (status === 'approved') return theme.colors.adminStatusSuccess || '#388E3C';
    if (status === 'pending') return darken(0.15, theme.colors.adminStatusWarning || '#FBC02D');
    if (status === 'rejected' || status === 'suspended') return theme.colors.adminStatusError || '#D32F2F';
    return theme.colors.textMedium;
  }};
  background-color: ${({ theme, status }) => {
    if (status === 'approved') return transparentize(0.9, theme.colors.adminStatusSuccess || '#AED581');
    if (status === 'rejected' || status === 'suspended') return transparentize(0.9, theme.colors.adminStatusError || '#E57373');
    if (status === 'pending') return transparentize(0.88, theme.colors.adminStatusWarning || '#FFD54F');
    return lighten(0.05, theme.colors.lightGray); // Lighter fallback
  }};
  border: 1px solid ${({ theme, status }) => {
    if (status === 'approved') return transparentize(0.8, theme.colors.adminStatusSuccess || '#AED581');
    if (status === 'rejected' || status === 'suspended') return transparentize(0.8, theme.colors.adminStatusError || '#E57373');
    if (status === 'pending') return transparentize(0.75, theme.colors.adminStatusWarning || '#FFD54F');
    return theme.colors.lightGray; // Use lightGray for less prominent border
  }};
  min-width: 85px;
  text-align: center;
  white-space: nowrap;
`;

// --- Grid Container for Cards ---
export const CardGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Min item width 300px */
  gap: ${({ theme }) => theme.spacing(5)}; /* Balanced gap between cards */

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet || '768px'}) {
    gap: ${({ theme }) => theme.spacing(4)};
  }
`;

// --- Info Card ---
export const InfoCard = styled.article<{ animationDelay?: string }>`
  background-color: ${({ theme }) => theme.colors.backgroundLight || '#ffffff'}; /* NEW: White card background */
  border: 1px solid ${({ theme }) => theme.colors.lightGray}; /* Softer border */
  border-radius: ${({ theme }) => theme.borderRadius?.large || '12px'};
  box-shadow: ${({ theme }) => theme.shadows?.subtle || '0 2px 8px rgba(0,0,0,0.06)'}; /* NEW: Subtle shadow for distinction */
  display: flex;
  flex-direction: column;
  height: 100%; /* Ensure cards in a row have same height */
  transform-origin: top center;
  animation: ${cardEntrance} 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: ${({ animationDelay }) => animationDelay || '0s'};
  opacity: 0; 
  overflow: hidden;
  transition: box-shadow 0.25s ease-out, transform 0.2s ease-out;

  &:hover {
    transform: translateY(-3px); /* Subtle lift */
    box-shadow: ${({ theme }) => theme.shadows?.medium || '0 5px 15px rgba(0,0,0,0.08)'}; /* Slightly enhanced shadow */
  }
`;

// --- Card Header ---
export const CardHeader = styled.div`
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(5)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray}; /* Lighter border */
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(2.5)};
`;

// --- Card Content ---
export const CardContent = styled.div`
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(5)}; /* Consistent with header */
  flex-grow: 1; /* This helps when card heights are uniform */
  display: flex;
  flex-direction: column;
  gap: ${({theme}) => theme.spacing(3.5)}; /* Gap between FieldGrids */
`;

// --- Card Title (within CardHeader) ---
export const CardTitle = styled.h3` /* Changed to h3 as page title is h1 */
  font-family: ${({ theme }) => theme.typography.heading.fontFamily};
  font-size: clamp(1.1rem, 2vw, 1.35rem); /* Refined size */
  font-weight: ${({ theme }) => theme.typography.heading.weights.semiBold};
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};

  svg {
    color: ${({ theme }) => theme.colors.accent1 || '#A46E4A'};
    font-size: 1.1em; 
    opacity: 0.9;
  }
`;

// --- FieldGrid ---
export const FieldGrid = styled.div<{ columns?: number; $rowGap?: string; $columnGap?: string }>`
  display: grid;
  grid-template-columns: repeat(${({ columns }) => columns || 1}, 1fr); 
  row-gap: ${({ theme, $rowGap }) => $rowGap || theme.spacing(3)}; /* Default row gap refined */
  column-gap: ${({ theme, $columnGap }) => $columnGap || theme.spacing(4)};

  &.two-columns {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); /* Min width for items in 2-col */
    @media (max-width: ${({ theme }) => theme.breakpoints.mobileL || '480px'}) { 
      grid-template-columns: 1fr; 
    }
  }
`;

// --- ViewField, ViewLabel, ViewValue (Key refinements for distinction) ---
export const ViewField = styled.div`
  /* Removed line-height, will be handled by content */
  position: relative;
  /* No background/border here, InfoCard provides the card look */
`;

export const ViewLabel = styled.p`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.xsmall};
  font-weight: ${({ theme }) => theme.typography.body.weights.bold}; /* Bolder Label for clear distinction */
  color: ${({ theme }) => theme.colors.textMuted}; /* Muted Gray for label */
  margin: 0 0 ${({ theme }) => theme.spacing(0.75)} 0; /* Tighter space to value */
  text-transform: uppercase;
  letter-spacing: 0.5px; 
  line-height: 1.2; 
`;

export const ViewValue = styled.div<{ highlight?: boolean }>`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.base};
  color: ${({ theme, highlight }) => highlight ? (theme.colors.accent1 || '#A46E4A') : (theme.colors.textDark)}; /* Value in primary text color */
  font-weight: ${({ theme }) => theme.typography.body.weights.regular}; /* Regular weight for value */
  line-height: 1.5; /* Improved readability for value */
  margin: 0;
  padding: 0; 
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({theme}) => theme.spacing(0.25)}; /* Very small gap for multi-line parts of a single value */
  word-break: break-word;

  &.array-values {
    flex-direction: row;
    flex-wrap: wrap;
    gap: ${({theme}) => theme.spacing(1.25)}; // Slightly smaller gap for pills
    align-items: center; // Align pills better
    
    span.array-item {
      background-color: ${({ theme }) => transparentize(0.93, theme.colors.accent2)}; 
      color: ${({ theme }) => darken(0.15, theme.colors.accent2)}; // Ensure contrast
      padding: ${({ theme }) => theme.spacing(0.5)} ${({ theme }) => theme.spacing(1.5)}; // More compact pills
      border-radius: ${({ theme }) => theme.borderRadius?.pill || '20px'}; // Pill shape
      font-size: ${({ theme }) => theme.typography.body.sizes.xsmall};
      font-weight: ${({theme}) => theme.typography.body.weights.medium};
      border: 1px solid ${({ theme }) => transparentize(0.88, theme.colors.accent2)};
      line-height: 1.3;
    }
  }
`;

// --- DocumentLink ---
export const DocumentLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1.5)};
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)}; /* More compact */
  background-color: transparent;
  color: ${({ theme }) => theme.colors.accent1 || '#A46E4A'};
  border: 1px solid ${({ theme }) => transparentize(0.8, theme.colors.accent1 || '#A46E4A')}; /* Very subtle border */
  border-radius: ${({ theme }) => theme.borderRadius?.medium || '6px'};
  text-decoration: none;
  font-family: ${({theme}) => theme.typography.body.fontFamily};
  font-weight: ${({theme}) => theme.typography.body.weights.medium};
  font-size: ${({theme}) => theme.typography.body.sizes.small};
  transition: all 0.2s ease-out;

  &:hover, &:focus-visible {
    background-color: ${({ theme }) => transparentize(0.94, theme.colors.accent1 || '#A46E4A')};
    border-color: ${({ theme }) => transparentize(0.6, theme.colors.accent1 || '#A46E4A')};
    /* box-shadow: none; */ // Remove shadow from simple link unless desired
    outline: none;
  }
  svg { font-size: 1em; }
`;

// --- HeaderActionsContainer ---
export const HeaderActionsContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(2)}; /* Slightly smaller gap for header buttons */
`;

// --- ActionButton ---
export const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'warning' | 'danger' | 'subtle' }>`
  padding: ${({ theme }) => theme.spacing(1.5)} ${({ theme }) => theme.spacing(2.5)}; /* Compact action buttons */
  border-radius: ${({ theme }) => theme.borderRadius?.medium || '6px'};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.xsmall}; /* Smaller text */
  font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
  cursor: pointer;
  transition: all 0.2s ease-out;
  border: 1.5px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(1)};
  line-height: 1.2;
  text-align: center;
  white-space: nowrap;
  box-shadow: ${({theme}) => theme.shadows?.xs}; /* Minimal shadow for buttons */

  svg {
    font-size: 1em; 
    margin-bottom: -1px; 
  }

  /* Variant styles (keep the logic from your previous version, ensuring color contrasts and theme alignment) */
  ${({ theme, $variant }) => {
    if ($variant === 'primary') return css` background-color: ${theme.colors.accent1}; color: ${theme.colors.textLight}; &:hover:not(:disabled) { background-color: ${darken(0.07, theme.colors.accent1)}; } `;
    if ($variant === 'warning') return css` background-color: ${theme.colors.adminStatusWarning}; color: ${darken(0.35, theme.colors.adminStatusWarning)}; border: 1px solid ${darken(0.15, theme.colors.adminStatusWarning)}; &:hover:not(:disabled) { background-color: ${darken(0.07, theme.colors.adminStatusWarning)}; } `;
    if ($variant === 'danger') return css` background-color: ${theme.colors.adminStatusError}; color: ${theme.colors.textLight}; &:hover:not(:disabled) { background-color: ${darken(0.07, theme.colors.adminStatusError)}; } `;
    if ($variant === 'subtle') return css` background-color: transparent; color: ${theme.colors.accent1}; box-shadow: none; padding-left: ${theme.spacing(0.5)}; padding-right: ${theme.spacing(0.5)}; &:hover:not(:disabled) { background-color: ${transparentize(0.94, theme.colors.accent1)}; } `;
    return css` /* Secondary/Default for header buttons (likely on light background) */
      background-color: ${transparentize(0.9, theme.colors.darkGray)};
      color: ${darken(0.1, theme.colors.darkGray)};
      border: 1px solid ${transparentize(0.8, theme.colors.darkGray)};
      &:hover:not(:disabled) { background-color: ${transparentize(0.85, theme.colors.darkGray)}; border-color: ${transparentize(0.6, theme.colors.darkGray)};}
    `;
  }}

  &:disabled { /* ... keep existing disabled styles ... */ opacity: 0.6; cursor: not-allowed; filter: grayscale(30%); box-shadow: none; }
  &:focus-visible { /* ... keep existing focus styles ... */ outline: 2px solid ${({theme}) => theme.colors.accentFocus || theme.colors.accent1}; outline-offset: 2px;}
`;
export const TwoCardRowWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; /* Strict two equal columns */
  gap: ${({ theme }) => theme.spacing(6)}; /* Gap between these two cards, matches CardGridContainer gap */
  width: 100%; /* Takes full width of its slot in the parent CardGridContainer */

  /* Responsive behavior for this specific two-card row */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet || '768px'}) {
    grid-template-columns: 1fr; /* Stack them on tablet and smaller */
    gap: ${({ theme }) => theme.spacing(5)}; /* Adjust gap for stacked view */
  }
`;
// --- Utility Components ---
export const SpacedRow = styled.div` /* ... */ `;
export const TitleGroup = styled.div` /* ... */ `;