// src/components/ProductListing/ProductListHeader.styles.ts
import styled, { css } from 'styled-components';
// FaAngleDown is likely needed
// import { FaAngleDown } from 'react-icons/fa';

export const HeaderBarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center; // Changed to center for better vertical alignment of potentially different sized elements
  margin-bottom: ${({ theme }) => theme.spacing(6)}; // Increased margin for more visual separation
  padding-bottom: ${({ theme }) => theme.spacing(4)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  font-family: ${({ theme }) => theme.typography.fonts.body}; // Default body font
`;

export const CategoryTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.fonts.heading}; // Élan Heading Font
  font-size: ${({ theme }) => theme.typography.heading.sizes.h5}; // Make it substantial, e.g., 2.8rem clamp
  font-weight: ${({ theme }) => theme.typography.heading.weights.bold}; // Or extraBold for Playfair
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0;
  line-height: 1.3; // Good line-height for headings
  letter-spacing: ${({ theme }) => theme.typography.letterSpacings.tight};
`;

export const ViewOptionsWrapper = styled.div`
  position: relative;
  display: flex; // Allow for other controls here in future if needed
  align-items: center;
`;

// Refined Dropdown Button Style
export const ViewOptionsButton = styled.button`
  background-color: transparent;
  // border: 1px solid transparent; // Option: Start borderless for minimalism
  border: 1px solid ${({ theme }) => theme.colors.lightGray}; // Option: Very subtle border
  padding: ${({ theme }) => theme.spacing(2.5)} ${({ theme }) => theme.spacing(4)}; // Generous padding
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-family: ${({ theme }) => theme.typography.fonts.body}; // Inter for UI elements
  font-size: ${({ theme }) => theme.typography.body.sizes.base}; // Clear, readable size
  font-weight: ${({ theme }) => theme.typography.body.weights.medium};
  color: ${({ theme }) => theme.colors.textMedium};
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent1}; // Accent border on hover
    color: ${({ theme }) => theme.colors.accent1};
    // background-color: ${({ theme }) => theme.colors.accent1Subtle}; // Optional subtle bg on hover
  }
  
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent1};
    outline-offset: 2px;
    border-color: ${({ theme }) => theme.colors.accent1};
  }

  svg { // The FaAngleDown icon
    margin-left: ${({ theme }) => theme.spacing(3)}; // More space for icon
    font-size: 1rem; // Slightly larger icon
    color: currentColor; // Inherit color from button text
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &[aria-expanded="true"] svg {
    transform: rotate(180deg);
  }
`;

// Refined Dropdown List Styling
export const ViewOptionsDropdown = styled.ul<{ isOpen: boolean }>`
  list-style: none;
  padding: ${({ theme }) => theme.spacing(1)} 0; // Vertical padding for the dropdown itself
  margin: 0;
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing(2)}); // Slightly more space from button
  right: 0;
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.large}; // Larger radius for a softer look
  box-shadow: ${({ theme }) => theme.shadows.lg}; // Softer, larger shadow
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  min-width: 180px; // Wider dropdown for better readability of "XXView by Hot"

  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-8px)')}; // Softer entrance
  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), 
              transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), 
              visibility 0s linear ${({ isOpen }) => (isOpen ? '0s' : '0.25s')};
`;

export const ViewOptionsItem = styled.li<{ isActive?: boolean }>`
  padding: ${({ theme }) => theme.spacing(2.5)} ${({ theme }) => theme.spacing(4)}; // Consistent, generous padding
  font-family: ${({ theme }) => theme.typography.fonts.body};
  font-size: ${({ theme }) => theme.typography.body.sizes.base};
  color: ${({ theme, isActive }) => isActive ? theme.colors.accent1 : theme.colors.textDark};
  font-weight: ${({ theme, isActive }) => isActive ? theme.typography.body.weights.semiBold : theme.typography.body.weights.regular};
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryNeutral}; // Subtle Élan hover
    color: ${({ theme, isActive }) => !isActive && theme.colors.accent1}; // Accent color on hover for non-active items
  }

  // No internal borders, rely on spacing and hover for separation
  /* &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray}55; // Very subtle if needed
  } */
`;

export const HeaderSortContainer = styled.div `



`