// src/components/ProductListing/Pagination.styles.ts
import styled, { css } from 'styled-components';

export const PaginationWrapper = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(4)} 0; // Vertical padding for the pagination band
  margin-top: ${({ theme }) => theme.spacing(3)}; // Space above pagination, after ProductGrid
  border-top: 1px solid ${({ theme }) => theme.colors.lightGray}; // Line above pagination
  font-family: ${({ theme }) => theme.typography.fonts.body};
  width: 100%; // Take full width of ProductDisplayArea
`;

export const PageList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)}; // Increased gap to match visual
`;

export const PageItem = styled.li``;

const sharedButtonStyles = css`
  min-width: 32px; 
  height: 32px;
  padding: 0 ${({ theme }) => theme.spacing(1)}; // Less horizontal padding for number buttons
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none; // No border for minimalist look
  background-color: transparent;
  color: ${({ theme }) => theme.colors.textMedium};
  font-size: ${({ theme }) => theme.typography.body.sizes.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  cursor: pointer;
  transition: color 0.2s ease;
  text-decoration: none;

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.info}; // Blue text on hover
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.textDisabled};
    cursor: not-allowed;
  }
`;

export const PageButton = styled.button<{ isActive?: boolean }>`
  ${sharedButtonStyles}

  ${({ isActive, theme }) =>
    isActive &&
    css`
      color: ${theme.colors.info}; // Blue text for active page
      font-weight: ${theme.typography.body.weights.bold}; // Bold active page
      cursor: default;
    `}
`;

export const NavButton = styled.button`
  ${sharedButtonStyles}
  color: ${({ theme }) => theme.colors.textDark}; // Nav arrows slightly darker
  padding: 0 ${({ theme }) => theme.spacing(2)}; // More padding for arrow buttons
  
  svg {
    font-size: 0.9rem; 
  }
  &:disabled {
    color: ${({ theme }) => theme.colors.lightGray}; // Very faint disabled arrows
  }
`;

export const EllipsisItem = styled.span`
  // Looks like image does not use ellipsis, shows all page numbers (e.g., 1 to 10)
  // If we keep ellipsis for many pages:
  ${sharedButtonStyles}
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: default;
  padding: 0 ${({ theme }) => theme.spacing(1)};
  &:hover {
    background-color: transparent; // No hover effect
  }
`;