// src/components/ProductListing/SortOptions.styles.ts
import styled from 'styled-components'; // Removed css as it's not used directly here
import { FaCheck, FaInfoCircle } from 'react-icons/fa'; // Import FaInfoCircle

export const SortWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(2.5)} 0; // Adjusted padding to be slightly less to match image height for this bar
  padding-left: 10px;
  font-family: ${({ theme }) => theme.typography.fonts.body};
`;

export const SortList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap; // Good for responsiveness
  align-items: center;
  gap: ${({ theme }) => theme.spacing(0)}; // No explicit gap, handled by item padding and separator margin
`;

export const SortItem = styled.li` // isActive prop is not needed on <li>, only on <button>
  position: relative;
  display: flex; // Ensures button and separator are in a line
  align-items: center;

  /* The actual clickable button for the sort option */
  button {
    background: none;
    border: none;
    // Padding for clickable area and visual spacing around text/icons
    padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(1.5)}; 
    font-size: 13px; // Approx 12-13px from image
    color: ${({ theme }) => theme.colors.textMedium}; // Default color for non-active items
    font-weight: ${({ theme }) => theme.typography.body.weights.regular};
    cursor: pointer;
    transition: color 0.2s ease;
    display: flex;
    align-items: center;
    white-space: nowrap; // Prevent text wrapping within a sort option

    &:hover {
      color: ${({ theme }) => theme.colors.info}; // Blue text on hover
    }

    &[aria-pressed="true"] { // Style for the active button
      color: ${({ theme }) => theme.colors.info}; // Blue text for active
      font-weight: ${({ theme }) => theme.typography.body.weights.medium}; // Slightly bolder for active
    }
  }

  /* Separator '|' between sort items */
  &:not(:last-child)::after {
    content: '|';
    color: ${({ theme }) => theme.colors.mediumGray}; // Separator color matches image
    font-size: ${({ theme }) => theme.typography.body.sizes.xsmall}; // Small separator
    padding: 0 ${({ theme }) => theme.spacing(2)}; // Spacing around the separator
    pointer-events: none; // Separator is not interactive
    line-height: 1; // Ensure it aligns well vertically
  }
`;

// Styled FaCheck icon for active sort option
export const ActiveSortIcon = styled(FaCheck)`
  color: ${({ theme }) => theme.colors.info}; // Blue checkmark
  font-size: 0.8em; // Relative to button's font size, making it slightly smaller
  margin-right: ${({ theme }) => theme.spacing(1)}; // Space between checkmark and text
`;

// Styled FaInfoCircle icon for "쿠팡 랭킹순"
export const InfoIcon = styled(FaInfoCircle)`
  color: ${({ theme }) => theme.colors.textMuted}; // Muted color for info icon
  font-size: 0.9em; // Slightly smaller than text
  margin-left: ${({ theme }) => theme.spacing(1)};
  cursor: help; // Indicate it provides information
`;