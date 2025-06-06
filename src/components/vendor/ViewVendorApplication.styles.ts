// src/components/profile/display/ViewVendorApplication.styles.ts
import styled, { type DefaultTheme, css, keyframes } from 'styled-components';
import { rgba, darken, lighten, transparentize } from 'polished';

// --- Keyframes ---
const subtlePageEntrance = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
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
const cardEntrance = keyframes`
  from {
    opacity: 0;
    transform: translateY(15px) scale(0.99);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

// --- Main Page Container ---
export const PageContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundLight || '#ffffff'}; /* White page background */
  color: ${({ theme }) => theme.colors.textDark};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  width: 100%;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing(8)} ${({ theme }) => theme.containerPadding};
  max-width: 1200px; 
  margin: 0 auto;
  animation: ${subtlePageEntrance} 0.35s ease-out;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet || '768px'}) {
    padding: ${({ theme }) => theme.spacing(6)} ${({ theme }) => theme.spacing(4)};
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
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(4)} 0;
  margin-bottom: ${({ theme }) => theme.spacing(6)}; // Adjusted margin
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};

  h1 {
    font-family: ${({ theme }) => theme.typography.heading.fontFamily};
    font-size: clamp(1.7rem, 3.5vw, 2.3rem);
    font-weight: ${({ theme }) => theme.typography.heading.weights.bold};
    color: ${({ theme }) => theme.colors.textDark};
    margin: 0;
    letter-spacing: -0.01em;
  }
`;

// --- Status Badge (Matches ViewSellerApplication) ---
export const StatusBadge = styled.span<{ status: string }>`
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2.5)};
  border-radius: ${({ theme }) => theme.borderRadius?.pill || '20px'};
  font-size: ${({ theme }) => theme.typography.body.sizes.xsmall};
  font-weight: ${({ theme }) => theme.typography.body.weights.bold};
  text-transform: uppercase;
  letter-spacing: 0.6px;
  line-height: 1.4;
  color: ${({ theme, status }) => { /* ... (same color logic as ViewSellerApplication.styles.ts) ... */ if (status === 'approved') return darken(0.1, theme.colors.adminStatusSuccess || '#388E3C'); if (status === 'pending') return darken(0.25, theme.colors.adminStatusWarning || '#FBC02D'); if (status === 'rejected' || status === 'suspended') return theme.colors.adminStatusError || '#D32F2F'; return theme.colors.textMedium; }};
  background-color: ${({ theme, status }) => { /* ... (same background logic) ... */ if (status === 'approved') return transparentize(0.88, theme.colors.adminStatusSuccess || '#AED581'); if (status === 'rejected' || status === 'suspended') return transparentize(0.88, theme.colors.adminStatusError || '#E57373'); if (status === 'pending') return transparentize(0.85, theme.colors.adminStatusWarning || '#FFD54F'); return theme.colors.lightGray; }};
  border: 1px solid ${({ theme, status }) => { /* ... (same border logic) ... */ if (status === 'approved') return transparentize(0.75, theme.colors.adminStatusSuccess || '#AED581'); if (status === 'rejected' || status === 'suspended') return transparentize(0.75, theme.colors.adminStatusError || '#E57373'); if (status === 'pending') return transparentize(0.7, theme.colors.adminStatusWarning || '#FFD54F'); return theme.colors.lightGray; }};
  min-width: 85px;
  text-align: center;
  white-space: nowrap;
`;

// --- Grid Container for Cards (Matches ViewSellerApplication) ---
export const CardGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.spacing(6)};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet || '768px'}) {
    gap: ${({ theme }) => theme.spacing(5)};
  }
`;

// --- Info Card (Matches ViewSellerApplication) ---
export const InfoCard = styled.article<{ animationDelay?: string }>`
  background-color: ${({ theme }) => theme.colors.adminSurface || '#ffffff'};
  border: 1px solid ${({ theme }) => theme.colors.adminBorder || theme.colors.lightGray || '#e0e0e0'};
  border-radius: ${({ theme }) => theme.borderRadius?.large || '12px'};
  box-shadow: ${({ theme }) => theme.shadows?.medium || '0 4px 12px rgba(0,0,0,0.08)'};
  display: flex;
  flex-direction: column;
  height: 100%;
  transform-origin: top center;
  animation: ${cardEntrance} 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: ${({ animationDelay }) => animationDelay || '0s'};
  opacity: 0; 
  overflow: hidden;
  transition: box-shadow 0.25s ease-out, transform 0.2s ease-out;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows?.large || '0 8px 25px rgba(0,0,0,0.1)'};
  }
`;

// --- Card Header (Matches ViewSellerApplication) ---
export const CardHeader = styled.div`
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(5)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.adminBorder || theme.colors.lightGray || '#e9ecef'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(3)};
`;

// --- Card Content (Matches ViewSellerApplication) ---
export const CardContent = styled.div`
  padding: ${({ theme }) => theme.spacing(5)};
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: ${({theme}) => theme.spacing(4)};
`;

// --- Card Title (Matches ViewSellerApplication) ---
export const CardTitle = styled.h3` // Changed from h2 to h3
  font-family: ${({ theme }) => theme.typography.heading.fontFamily};
  font-size: clamp(1.2rem, 2.5vw, 1.5rem);
  font-weight: ${({ theme }) => theme.typography.heading.weights.semiBold};
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};

  svg {
    color: ${({ theme }) => theme.colors.accent1 || '#A46E4A'};
    font-size: 1.05em; 
    opacity: 0.9;
  }
`;

// --- FieldGrid (Matches ViewSellerApplication) ---
export const FieldGrid = styled.div<{ columns?: number; $rowGap?: string; $columnGap?: string }>`
  display: grid;
  grid-template-columns: repeat(${({ columns }) => columns || 1}, 1fr); 
  row-gap: ${({ theme, $rowGap }) => $rowGap || theme.spacing(3.5)};
  column-gap: ${({ theme, $columnGap }) => $columnGap || theme.spacing(4)};

  &.two-columns {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    @media (max-width: ${({ theme }) => theme.breakpoints.mobileL || '480px'}) { 
      grid-template-columns: 1fr; 
    }
  }
`;

// --- ViewField, ViewLabel, ViewValue (Matches ViewSellerApplication) ---
export const ViewField = styled.div`
  position: relative;
`;

export const ViewLabel = styled.p`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.xsmall};
  font-weight: ${({ theme }) => theme.typography.body.weights.bold};
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0 0 ${({ theme }) => theme.spacing(0.75)} 0;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  line-height: 1.3;
`;

export const ViewValue = styled.div<{ highlight?: boolean }>`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.base};
  color: ${({ theme, highlight }) => highlight ? (theme.colors.accent1 || '#A46E4A') : (theme.colors.textDark)};
  font-weight: ${({ theme, highlight }) => highlight ? theme.typography.body.weights.medium : theme.typography.body.weights.regular};
  line-height: 1.5;
  word-break: break-word;
  display: flex;
  align-items: center; /* Default for icon + text value */
  gap: ${({theme}) => theme.spacing(1)};

  svg.value-icon { /* Added for styling icons directly within ViewValue */
    font-size: 0.95em;
    color: ${({ theme }) => theme.colors.textMedium};
    opacity: 0.75;
    margin-right: ${({ theme }) => theme.spacing(0.5)};
    flex-shrink: 0;
  }
  
  &.address-value, &.multiline-value { /* Class for multi-line values that should stack */
    flex-direction: column;
    align-items: flex-start;
    gap: ${({theme}) => theme.spacing(0.5)};
    span { display: block; }
  }

  &.array-values {
    flex-direction: row;
    flex-wrap: wrap;
    gap: ${({theme}) => theme.spacing(1.25)};
    align-items: center;
    
    span.array-item {
      background-color: ${({ theme }) => transparentize(0.93, theme.colors.accent2)}; 
      color: ${({ theme }) => darken(0.15, theme.colors.accent2)};
      padding: ${({ theme }) => theme.spacing(0.5)} ${({ theme }) => theme.spacing(1.5)};
      border-radius: ${({ theme }) => theme.borderRadius?.pill || '20px'};
      font-size: ${({ theme }) => theme.typography.body.sizes.xsmall};
      font-weight: ${({theme}) => theme.typography.body.weights.medium};
      border: 1px solid ${({ theme }) => transparentize(0.88, theme.colors.accent2)};
      line-height: 1.3;
    }
  }
`;

// --- DocumentLink (Matches ViewSellerApplication) ---
export const DocumentLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1.5)};
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.accent1 || '#A46E4A'};
  border: 1px solid ${({ theme }) => transparentize(0.8, theme.colors.accent1 || '#A46E4A')};
  border-radius: ${({ theme }) => theme.borderRadius?.medium || '6px'};
  text-decoration: none;
  font-family: ${({theme}) => theme.typography.body.fontFamily};
  font-weight: ${({theme}) => theme.typography.body.weights.medium};
  font-size: ${({theme}) => theme.typography.body.sizes.small};
  transition: all 0.2s ease-out;

  &:hover, &:focus-visible {
    background-color: ${({ theme }) => transparentize(0.94, theme.colors.accent1 || '#A46E4A')};
    border-color: ${({ theme }) => transparentize(0.6, theme.colors.accent1 || '#A46E4A')};
    outline: none;
  }
  svg { font-size: 1em; }
`;

// --- HeaderActionsContainer & ActionButton (Matches ViewSellerApplication) ---
export const HeaderActionsContainer = styled.div`
  display: flex; align-items: center; flex-wrap: wrap; gap: ${({ theme }) => theme.spacing(2)};
`;
export const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'warning' | 'danger' | 'subtle' }>`
  /* ... (Keep your refined ActionButton styles from ViewSellerApplication.styles.ts) ... */
  padding: ${({ theme }) => theme.spacing(1.5)} ${({ theme }) => theme.spacing(2.5)}; border-radius: ${({ theme }) => theme.borderRadius?.medium || '6px'}; font-family: ${({ theme }) => theme.typography.body.fontFamily}; font-size: ${({ theme }) => theme.typography.body.sizes.xsmall}; font-weight: ${({ theme }) => theme.typography.body.weights.semiBold}; cursor: pointer; transition: all 0.2s ease-out; border: 1.5px solid transparent; display: inline-flex; align-items: center; justify-content: center; gap: ${({ theme }) => theme.spacing(1)}; line-height: 1.2; text-align: center; white-space: nowrap; box-shadow: ${({theme}) => theme.shadows?.xs}; svg { font-size: 1em; margin-bottom: -1px; }
  ${({ theme, $variant }) => { if ($variant === 'primary') return css` background-color: ${theme.colors.accent1}; color: ${theme.colors.textLight}; &:hover:not(:disabled) { background-color: ${darken(0.07, theme.colors.accent1)}; } `; if ($variant === 'warning') return css` background-color: ${theme.colors.adminStatusWarning}; color: ${darken(0.35, theme.colors.adminStatusWarning)}; border: 1px solid ${darken(0.15, theme.colors.adminStatusWarning)}; &:hover:not(:disabled) { background-color: ${darken(0.07, theme.colors.adminStatusWarning)}; } `; if ($variant === 'danger') return css` background-color: ${theme.colors.adminStatusError}; color: ${theme.colors.textLight}; &:hover:not(:disabled) { background-color: ${darken(0.07, theme.colors.adminStatusError)}; } `; if ($variant === 'subtle') return css` background-color: transparent; color: ${theme.colors.accent1}; box-shadow: none; padding-left: ${theme.spacing(0.5)}; padding-right: ${theme.spacing(0.5)}; &:hover:not(:disabled) { background-color: ${transparentize(0.94, theme.colors.accent1)}; } `; return css` background-color: ${transparentize(0.9, theme.colors.darkGray)}; color: ${darken(0.1, theme.colors.darkGray)}; border: 1px solid ${transparentize(0.8, theme.colors.darkGray)}; &:hover:not(:disabled) { background-color: ${transparentize(0.85, theme.colors.darkGray)}; border-color: ${transparentize(0.6, theme.colors.darkGray)};} `; }}
  &:disabled { opacity: 0.6; cursor: not-allowed; filter: grayscale(30%); box-shadow: none; }
  &:focus-visible { outline: 2px solid ${({theme}) => theme.colors.accentFocus || theme.colors.accent1}; outline-offset: 2px;}
`;

// --- Utility for Vendor Title + Icon --- (Matches ConforTitle, renamed from TitleGroup for specificity)
export const VendorTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing(2)};
`;

// --- NEW STYLES FOR VENDOR TEAM MEMBERS (from your provided vendor styles) ---
export const MemberList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: ${({ theme }) => theme.spacing(2)}; /* Added some top margin */
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* Slightly smaller min for members */
  gap: ${({ theme }) => theme.spacing(3.5)}; /* Balanced gap */
`;

export const MemberListItem = styled.li`
  background-color: ${({ theme }) => lighten(0.05, theme.colors.primaryNeutral)}; 
  padding: ${({ theme }) => theme.spacing(3.5)};
  border-radius: ${({theme}) => theme.borderRadius.medium}; // Consistent medium radius
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  box-shadow: ${({theme}) => theme.shadows.xs}; // Subtle shadow for member items

  p {
    margin: 0 0 ${({ theme }) => theme.spacing(1.25)} 0;
    font-family: ${({theme}) => theme.typography.body.fontFamily};
    font-size: ${({theme}) => theme.typography.body.sizes.small};
    color: ${({theme}) => theme.colors.textDark};
    line-height: 1.55;
    &:last-child { margin-bottom: 0; }
  }

  strong {
    font-weight: ${({theme}) => theme.typography.body.weights.semiBold};
    color: ${({ theme }) => theme.colors.textMedium}; // Muted label for "User ID:", "Roles:"
    margin-right: ${({theme}) => theme.spacing(1)};
  }

  .roles-container {
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing(1.25)};
    margin-top: ${({theme}) => theme.spacing(0.75)};
  }

  span.role-tag {
      background-color: ${({ theme }) => transparentize(0.85, theme.colors.accent1)}; 
      color: ${({ theme }) => darken(0.05, theme.colors.accent1)};
      padding: ${({ theme }) => theme.spacing(0.5)} ${({ theme }) => theme.spacing(1.5)};
      border-radius: ${({theme}) => theme.borderRadius.pill};
      font-size: ${({theme}) => theme.typography.body.sizes.xsmall};
      font-weight: ${({theme}) => theme.typography.body.weights.medium};
      text-transform: capitalize;
      border: 1px solid ${({ theme }) => transparentize(0.75, theme.colors.accent1)};
  }

  small { /* For "Added On/By" meta */
      font-size: ${({theme}) => theme.typography.body.sizes.xsmall};
      color: ${({theme}) => theme.colors.textMuted};
      opacity: 0.9;
      display: block;
      margin-top: ${({theme}) => theme.spacing(1.5)};
  }
`;