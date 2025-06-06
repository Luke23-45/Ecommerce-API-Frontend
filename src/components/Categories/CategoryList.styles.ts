// src/components/Admin/Categories/CategoryList.styles.ts
import styled, { type DefaultTheme, css, keyframes } from 'styled-components';
import { rgba, darken, lighten, transparentize } from 'polished';

// Helper to get theme
const t = (props: { theme: DefaultTheme }) => props.theme;

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

const subtleShine = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// --- Main Container ---
export const CategoryListContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => t(props).colors.adminPrimaryBg || lighten(0.03, String(t(props).colors.adminSurface || '#F8F9FA'))}; /* Slightly warmer than plain white */
  border-radius: 16px; /* Softer, more modern radius */
  box-shadow: 0 8px 25px ${props => rgba(darken(0.3, String(t(props).colors.adminPrimaryBg || '#F0F2F5')), 0.08)};
  padding: ${props => t(props).spacing(6)} ${props => t(props).spacing(7)};
  opacity: 0;
  animation: ${fadeIn} 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
  animation-delay: 0.1s;

  @media (max-width: ${props => t(props).breakpoints.tablet || '768px'}) {
    padding: ${props => t(props).spacing(4)};
    border-radius: 0;
    box-shadow: none;
  }
`;

// --- Header ---
export const CategoryListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => t(props).spacing(6)};
  padding-bottom: ${props => t(props).spacing(4)};
  border-bottom: 1px solid ${props => t(props).colors.adminBorder || '#E9E8EB'};
  flex-wrap: wrap;
  gap: ${props => t(props).spacing(4)};
`;

export const HeaderTitle = styled.h1` /* Upgraded to h1 for page title semantics */
  font-family: ${props => t(props).typography.admin?.fontFamily || t(props).typography.heading.fontFamily || 'sans-serif'};
  font-size: clamp(1.8rem, 4vw, 2.2rem); /* Larger, more prominent */
  font-weight: ${props => t(props).typography.admin?.weights?.bold || t(props).typography.heading.weights.bold || 700};
  color: ${props => t(props).colors.adminText || '#212529'};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${props => t(props).spacing(3)};
  svg { /* Icon for the main title, if any */
    color: ${props => t(props).colors.adminAccent || t(props).colors.accent1 || '#007BFF'};
    font-size: 1em; /* Relative to title font size */
  }
`;

// --- Search Input ---
export const CategorySearchInput = styled.input`
  padding: ${props => t(props).spacing(3)} ${props => t(props).spacing(4)};
  border: 1px solid ${props => t(props).colors.adminBorder || '#DEE2E6'};
  border-radius: 10px; /* Slightly more rounded */
  font-family: ${props => t(props).typography.admin?.fontFamily || 'sans-serif'};
  font-size: ${props => t(props).typography.admin?.sizes?.bodyBase || '0.95rem'};
  background-color: ${props => t(props).colors.adminSurface || '#FFFFFF'};
  color: ${props => t(props).colors.adminText || '#343A40'};
  width: 100%;
  max-width: 500px; /* Good max width for search */
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  margin-bottom: ${props => t(props).spacing(6)};

  &:focus {
    outline: none;
    border-color: ${props => t(props).colors.accent1 || '#007BFF'};
    box-shadow: 0 0 0 3.5px ${props => transparentize(0.7, String(t(props).colors.accent1 || '#007BFF'))};
  }
  &::placeholder {
    color: ${props => t(props).colors.adminTextSecondary || '#6C757D'};
    opacity: 0.9;
  }
`;

// --- Tree Container ---
export const CategoryTreeContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid ${props => t(props).colors.adminBorderLight || '#F1F3F5'};
  border-radius: 12px; /* Consistent rounding */
  overflow: hidden;
  background-color: ${props => t(props).colors.adminSurface || '#FFFFFF'}; // Ensure background for items
  box-shadow: 0 2px 8px ${props => rgba(darken(0.1, String(t(props).colors.adminPrimaryBg || '#F0F2F5')), 0.04)};
`;

// --- Individual Node (<li>) ---
export const CategoryTreeNodeStyled = styled.li<{ $level: number }>`
  /* No specific style needed here as CategoryRow handles borders */
  &:not(:last-child) ${() => CategoryRow} { // Apply to all but last CategoryRow in direct children
      border-bottom: 1px solid ${props => t(props).colors.adminBorderLight || '#F1F3F5'};
  }
`;

// --- Category Row ---
export const CategoryRow = styled.div<{ $level: number; $isTopLevelWithoutChildren?: boolean; $isExpanded?: boolean; $hasChildren?: boolean; }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => t(props).spacing(3)} ${props => t(props).spacing(4)};
  padding-left: ${(props) => t(props).spacing(4 + props.$level * 6)}; /* Increased indentation per level */

  ${(props) => props.$isTopLevelWithoutChildren && css`
    padding-left: calc(${(propsG) => t(propsG).spacing(4 + 0 * 6)} + 28px + ${(propsG) => t(propsG).spacing(2.5)});
  `}

  background-color: ${props => t(props).colors.adminSurface || '#FFFFFF'};
  transition: background-color 0.15s ease-out, box-shadow 0.2s ease-out;
  min-height: 56px;
  cursor: default; // Default for row, specific parts can be pointer

  ${({ $isExpanded, $hasChildren, theme }) => $isExpanded && $hasChildren && css`
    background-color: ${lighten(0.04, String(theme.colors.adminPrimaryBg || '#F0F2F5'))}; /* Subtle highlight for expanded parent */
    /* box-shadow: inset 3px 0 0px 0px ${theme.colors.accent1 || '#007BFF'}; */ /* Alternative active indicator */
  `}

  &:hover {
    background-color: ${props => lighten(0.05, String(t(props).colors.adminPrimaryBg || '#F0F2F5'))};
  }
`;

export const CategoryDetails = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  gap: ${props => t(props).spacing(2.5)}; /* Increased gap */
  overflow: hidden;
  cursor: pointer; /* Make this section clickable for toggle/edit */
`;

export const ExpandCollapseButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => t(props).colors.adminTextSecondary || '#5A6470'};
  font-size: 0.9em;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px; /* Slightly larger click area */
  height: 28px;
  border-radius: 8px; /* Softer radius */
  cursor: pointer;
  flex-shrink: 0;
  transition: color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: ${props => transparentize(0.9, String(t(props).colors.adminAccent || t(props).colors.accent1 || '#007BFF'))};
    color: ${props => t(props).colors.adminAccent || t(props).colors.accent1 || '#007BFF'};
  }
  &:active {
    transform: scale(0.9);
  }
`;

export const CategoryItemIcon = styled.img`
  width: 24px; /* Slightly larger */
  height: 24px;
  border-radius: 6px;
  object-fit: cover; /* Usually better for product images */
  flex-shrink: 0;
  border: 1px solid ${props => t(props).colors.adminBorderLight || '#F1F3F5'};
`;

export const CategoryNameDisplay = styled.span`
  font-family: ${props => t(props).typography.admin?.fontFamily || 'sans-serif'};
  font-size: ${props => t(props).typography.admin?.sizes?.bodyBase || '0.95rem'};
  font-weight: ${props => t(props).typography.admin?.weights?.medium || 500};
  color: ${props => t(props).colors.adminText || '#343A40'};
  transition: color 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${CategoryDetails}:hover & { /* Change name color on details hover */
    color: ${props => t(props).colors.adminAccent || t(props).colors.accent1 || '#007BFF'};
  }
`;

export const CategoryInfoText = styled.span`
  font-size: ${props => t(props).typography.admin?.sizes?.small || '0.8rem'}; /* Slightly larger */
  color: ${props => t(props).colors.adminTextMuted || '#86909C'};
  margin-left: ${props => t(props).spacing(1.5)};
  white-space: nowrap;
  background-color: ${props => transparentize(0.95, String(t(props).colors.adminTextMuted || '#86909C'))};
  padding: ${props => t(props).spacing(0.5)} ${props => t(props).spacing(1.5)};
  border-radius: ${props => t(props).borderRadius.pill || '12px'};
`;

export const CategoryStatusBadge = styled.span<{ $status: 'active' | 'inactive' }>`
  padding: ${props => t(props).spacing(1)} ${props => t(props).spacing(2.5)}; /* More padding */
  border-radius: ${props => t(props).borderRadius.pill || '16px'};
  font-size: ${props => t(props).typography.admin?.sizes?.tag || '0.7rem'};
  font-weight: ${props => t(props).typography.admin?.weights?.semiBold || 600};
  text-transform: uppercase;
  letter-spacing: 0.6px;
  white-space: nowrap;
  line-height: 1; /* Ensure consistent height */

  ${props => props.$status === 'active' && css`
    background: linear-gradient(135deg, ${transparentize(0.85, String(t(props).colors.adminStatusSuccess || '#28a745'))} 0%, ${transparentize(0.75, String(t(props).colors.adminStatusSuccess || '#198754'))} 100%);
    color: ${darken(0.05, String(t(props).colors.adminStatusSuccess || '#1E7E34'))};
    box-shadow: 0 1px 3px ${transparentize(0.9, String(t(props).colors.adminStatusSuccess || '#28a745'))};
  `}
  ${props => props.$status === 'inactive' && css`
    background: linear-gradient(135deg, ${transparentize(0.9, String(t(props).colors.adminTextSecondary || '#6c757d'))} 0%, ${transparentize(0.85, String(t(props).colors.adminTextMuted || '#ADB5BD'))} 100%);
    color: ${darken(0.1, String(t(props).colors.adminTextSecondary || '#5A6268'))};
  `}
`;

export const CategoryActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => t(props).spacing(1.5)}; /* Slightly more space */
  flex-shrink: 0;
  opacity: 0.4; /* Dim by default, show on row hover */
  transition: opacity 0.2s ease-in-out;

  ${CategoryRow}:hover & {
    opacity: 1;
  }

  button {
    background: transparent;
    border: none;
    color: ${props => t(props).colors.adminTextSecondary || '#5A6470'};
    cursor: pointer;
    font-size: 1rem; /* Slightly larger icons */
    padding: ${props => t(props).spacing(1.5)};
    border-radius: 50%;
    line-height: 1;
    display: flex; /* For icon centering */
    align-items: center;
    justify-content: center;
    width: 32px; /* Ensure circular shape */
    height: 32px;
    transition: color 0.2s ease, background-color 0.2s ease, transform 0.15s ease;

    &:hover {
      color: ${props => t(props).colors.adminAccent || t(props).colors.accent1 || '#007BFF'};
      background-color: ${props => transparentize(0.9, String(t(props).colors.adminAccent || t(props).colors.accent1 || '#007BFF'))};
      transform: scale(1.1);
    }
    &.delete-btn:hover {
      color: ${props => t(props).colors.adminStatusError || '#dc3545'};
      background-color: ${props => transparentize(0.9, String(t(props).colors.adminStatusError || '#dc3545'))};
    }
  }
`;

// --- Children List ---
export const CategoryChildrenList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: ${props => lighten(0.02, String(t(props).colors.adminSurface || '#FFFFFF'))}; 
   border-left: 2px solid ${props => t(props).colors.adminBorderLight || '#F1F3F5'};
   margin-left: ${props => t(props).spacing(4)}; 
`;

// --- No Categories Message ---
export const NoCategoryMessage = styled.div`
  text-align: center;
  padding: ${props => t(props).spacing(12)} ${props => t(props).spacing(6)};
  font-family: ${props => t(props).typography.admin?.fontFamily || 'sans-serif'};
  font-size: ${props => t(props).typography.admin?.sizes?.bodyBase || '1rem'};
  color: ${props => t(props).colors.adminTextSecondary || '#6C757D'};
  margin-top: ${props => t(props).spacing(6)};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background-color: ${props => transparentize(0.97, String(t(props).colors.adminPrimaryBg || '#F0F2F5'))};

  svg {
    font-size: 3.5em;
    margin-bottom: ${props => t(props).spacing(4)};
    color: ${props => t(props).colors.adminBorder || '#CED4DA'};
    opacity: 0.8;
  }
  p {
    max-width: 500px;
    line-height: 1.65;
  }
`;