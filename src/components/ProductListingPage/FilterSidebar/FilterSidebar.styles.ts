// src/components/ProductListing/FilterSidebar.styles.ts
import styled, { css } from 'styled-components';
import { FaCheck } from 'react-icons/fa'; // Keeping FaCheck for now, can be replaced
import { rgba } from 'polished';

export const SidebarWrapper = styled.aside<{ isOpen?: boolean }>`
  width: 240px; // Slightly wider for a more generous feel
  min-width: 240px;
  font-family: ${({ theme }) => theme.typography.fonts.body};
  background-color: ${({ theme }) => theme.colors.backgroundLight}; // Pure white or very light base
  padding: ${({ theme }) => theme.spacing(6)} ${({ theme }) => theme.spacing(4)};
  padding-right: ${({ theme }) => theme.spacing(2)}; // Reduce padding on the right edge
  border-right: 1px solid ${({ theme }) => theme.colors.lightGray}; // A soft border separating from content

  // Mobile handling (similar to before, but styles inside might be more refined)
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 300px;
    background-color: ${({ theme }) => theme.colors.backgroundLight};
    padding: ${({ theme }) => theme.spacing(6)};
    padding-top: ${({ theme }) => theme.spacing(12)}; // More space for close button and header
    box-shadow: ${({ theme }) => theme.shadows.xl}; // Stronger shadow for overlay
    transform: translateX(-100%);
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: ${({ theme }) => theme.zIndex.modalContent};
    overflow-y: auto;

    ${({ isOpen }) => isOpen && css`
      transform: translateX(0);
    `}
  }
`;

export const MobileCloseButton = styled.button`
  display: none;
  position: absolute;
  top: ${({ theme }) => theme.spacing(4)};
  right: ${({ theme }) => theme.spacing(4)};
  background: transparent;
  border: none;
  font-size: 1.8rem; // Larger close icon
  color: ${({ theme }) => theme.colors.textMedium};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing(2)};
  line-height: 1;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.textDark};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
  }
`;

export const FilterGroupWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(5)};
  
  &:last-child {
    margin-bottom: 0;
    border-bottom: none; // No border after the last group
  }
  // Consider a subtle border between groups if not using dividers
  // border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray}33; // Very subtle divider
`;

export const FilterGroupTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.fonts.body}; // Image uses sans-serif here
  font-size: ${({ theme }) => theme.typography.body.sizes.medium}; // Adjusted to match Coupang's smaller group titles
  font-weight: ${({ theme }) => theme.typography.body.weights.bold}; // Coupang uses bold
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0 0 ${({ theme }) => theme.spacing(3)};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  .group-title-text { // To wrap the text part of the title
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing(1.5)};
  }

  .group-icon { // For rocket icon etc.
    color: #DE3D4B; // Coupang Rocket Red
    font-size: 1rem; // Adjust as needed
  }

  .collapse-icon { // Chevron for collapse/expand
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.textMedium};
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &.collapsed .collapse-icon {
    transform: rotate(-90deg);
  }
`;

export const FilterList = styled.ul<{ isCollapsed?: boolean }>`
  list-style: none;
  padding: 0;
  margin: 0;
  overflow: hidden;
  
  // More sophisticated collapse animation
  max-height: ${({ isCollapsed }) => (isCollapsed ? '0' : '1000px')}; /* Estimate max height */
  opacity: ${({ isCollapsed }) => (isCollapsed ? 0 : 1)};
  transform: ${({ isCollapsed }) => (isCollapsed ? 'translateY(-10px)' : 'translateY(0)')};
  transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), 
              opacity 0.3s ease-out 0.05s,
              transform 0.3s ease-out 0.05s;
  
  ${({ isCollapsed }) => isCollapsed && css`
    transition-delay: 0s, 0s, 0s; // No delay when collapsing quickly
  `}

  position:relative;
`;


export const CategoryFilterItem = styled.li<{
  isActive?: boolean;
  depth: number; // We will use a depth prop to control indentation
}>`
  padding: 0.6rem 0.5rem;
  margin: 0.15rem 0;

  font-family: ${(props) => props.theme.typography.body.fontFamily};
  font-size: 0.9rem;
  font-weight: ${(props) => (props.isActive ? props.theme.typography.body.weights.bold : props.theme.typography.body.weights.regular)};
  color: ${(props) => (props.isActive ? props.theme.colors.accent1 : props.theme.colors.textMedium)};
  border-radius: ${(props) => props.theme.borderRadius.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative; // Needed for the pseudo-element

  // --- HIERARCHY VISUALIZATION ---
  // Indent the item based on its depth in the tree
  padding-left: ${(props) => `calc(${props.depth} * 1.25rem + 0.5rem)`};

  // Create the "L" shape connector line for nested items
  &::before {
    content: '';
    position: absolute;
    top: -0.8rem;
    left: ${(props) => `calc(${props.depth - 1} * 1.25rem + 0.5rem)`};
    height: 1.5rem;
    width: 0.75rem;
    // Hide the line for top-level items (depth 0)
    display: ${(props) => (props.depth > 0 ? 'block' : 'none')};
    border-bottom: 1px solid ${(props) => rgba(props.theme.colors.textMuted, 0.3)};
    border-left: 1px solid ${(props) => rgba(props.theme.colors.textMuted, 0.3)};
    border-bottom-left-radius: 5px;
  }

  &:hover {
    background-color: ${(props) => rgba(props.theme.colors.accent1, 0.08)};
    color: ${(props) => props.theme.colors.accent1};
  }
  
`;


export const CheckboxFilterItem = styled.li`
  /* Re-using structure from CategoryFilterItem for consistency if desired */
  font-size: ${({ theme }) => theme.typography.body.sizes.medium};
  color: ${({ theme }) => theme.colors.textMedium};
  padding: ${({ theme }) => theme.spacing(1.5)} ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  cursor: pointer;
  display: flex; // To align label and count
  justify-content: space-between; // To push count to the right
  align-items: center;
  transition: background-color 0.2s ease;
  margin-bottom: ${({ theme }) => theme.spacing(0.5)};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryNeutral}; // Very subtle hover
  }
`;

export const CustomCheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  flex-grow: 1; // Allow label text to take available space
`;

export const CustomCheckboxInput = styled.input.attrs({ type: 'checkbox' })`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
`;

// Redesigned Checkbox Visual
export const CustomCheckboxVisual = styled.span`
  width: 20px; // Slightly larger
  height: 20px;
  border: 1.5px solid ${({ theme }) => theme.colors.mediumGray};
  background-color: transparent; // Transparent background initially
  border-radius: ${({ theme }) => theme.borderRadius.small}; // Or .circle for round checkboxes
  margin-right: ${({ theme }) => theme.spacing(3)}; // More space to text
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, border-color 0.2s ease;
  flex-shrink: 0; // Prevent shrinking

  ${CustomCheckboxInput}:checked + & {
    background-color: ${({ theme }) => theme.colors.accent1}; // Accent color for checked state
    border-color: ${({ theme }) => theme.colors.accent1};
    svg {
      display: block;
    }
  }

  ${CustomCheckboxInput}:focus-visible + & {
    outline: 2px solid ${({ theme }) => theme.colors.accent1Hover};
    outline-offset: 2px;
  }

  svg { // Checkmark icon
    display: none;
    color: white; // White checkmark on accent background
    font-size: 0.8rem; 
    stroke-width: 1; // Thinner checkmark if using certain icons
  }
`;

export const CheckboxLabelText = styled.span`
  color: ${({ theme }) => theme.colors.textDark}; // Darker text for checkbox labels
  line-height: 1.4;
`;

export const FilterOptionCount = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.body.sizes.small};
  margin-left: ${({ theme }) => theme.spacing(2)}; // Give some space from text if on same line, or push right
  flex-shrink: 0;
`;

// No specific "MoreButton" or "FilterGroupDivider" styling changes, 
// but they would inherit the more refined font and spacing context.
// Previous FilterGroupDivider may be redundant if FilterGroupTitle gets a border-bottom.

export const MobileBackdrop = styled.div<{ isOpen?: boolean }>`
  display: none;
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({ theme }) => theme.colors.textDark}77; // Darker backdrop
    z-index: ${({ theme }) => theme.zIndex.modalBackdrop};
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1), visibility 0s 0.35s linear;

    ${({ isOpen }) => isOpen && css`
      opacity: 1;
      visibility: visible;
      transition-delay: 0s;
    `}
  }
`;

export const SidebarHeader = styled.div`
  padding-bottom: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
`;

export const SidebarTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.body.sizes.large}; // "필터" title
  font-weight: ${({ theme }) => theme.typography.body.weights.bold};
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0;
`;
export const NestedCategoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  position: relative;


  &::before {
    content: '';
    position: absolute;
    top: 10px;
    padding-left: 2px;

    left: calc(0.5rem - 1px); 
    width: 1px;
    height: 100%;
    background-color: ${(props) => rgba(props.theme.colors.textMuted, 0.3)};
  }

  &.li{

    margin-top: -20px !important;

  }
`;