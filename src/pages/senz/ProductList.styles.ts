// src/components/Admin/ProductList/ProductList.styles.ts
import styled, { createGlobalStyle, css, keyframes, type DefaultTheme } from 'styled-components';
import { rgba, darken, lighten, transparentize } from 'polished';

// --- Mock Theme for this specific Admin Panel Design ---


// The 't' helper function is removed as we are directly accessing adminProductListTheme.

// --- Global Styles ---
export const ProductListGlobalStyle = createGlobalStyle`
  body {
    background-color: ${adminProductListTheme.colors.primaryBackground};
    font-family: ${adminProductListTheme.typography.fontFamily};
    color: ${adminProductListTheme.colors.textPrimary};
  }
`;

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Main Page Container ---
export const ProductPageContainer = styled.div`
  padding: ${adminProductListTheme.spacing(6)}; /* 24px */
  max-width: ${adminProductListTheme.breakpoints.desktop || '1440px'};
  margin: 0 auto;
  animation: ${fadeIn} 0.3s ease-out;
`;

// --- Page Header Area ---
export const PageHeader = styled.header`
  margin-bottom: ${adminProductListTheme.spacing(4)}; /* 16px */
  .breadcrumbs {
    font-size: ${adminProductListTheme.typography.small};
    color: ${adminProductListTheme.colors.textSecondary};
    margin-bottom: ${adminProductListTheme.spacing(1)};
    a {
      color: ${adminProductListTheme.colors.textLink};
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .page-title {
    font-size: ${adminProductListTheme.typography.h1};
    font-weight: ${adminProductListTheme.typography.weights.bold};
    color: ${adminProductListTheme.colors.textPrimary};
    margin: 0;
  }
`;

// --- Content Header ---
export const ContentHeader = styled.div`
  background-color: ${adminProductListTheme.colors.surface};
  padding: ${adminProductListTheme.spacing(5)}; /* 20px */
  border-radius: ${adminProductListTheme.borderRadius.large};
  box-shadow: ${adminProductListTheme.shadows.small};
  margin-bottom: ${adminProductListTheme.spacing(6)}; /* 24px */
`;

export const TitleActionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${adminProductListTheme.spacing(5)}; /* 20px */
  gap: ${adminProductListTheme.spacing(4)};

  @media (max-width: ${adminProductListTheme.breakpoints.tablet || '768px'}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const TitleGroup = styled.div`
  h2 {
    font-size: ${adminProductListTheme.typography.h2};
    font-weight: ${adminProductListTheme.typography.weights.semiBold};
    color: ${adminProductListTheme.colors.textPrimary};
    margin: 0 0 ${adminProductListTheme.spacing(1)} 0;
  }
  p {
    font-size: ${adminProductListTheme.typography.body};
    color: ${adminProductListTheme.colors.textSecondary};
    margin: 0;
    max-width: 450px;
  }
`;

export const ActionsGroup = styled.div`
  display: flex;
  gap: ${adminProductListTheme.spacing(3)}; /* 12px */
  flex-shrink: 0;

  @media (max-width: ${adminProductListTheme.breakpoints.tablet || '768px'}) {
    width: 100%;
    button {
      flex-grow: 1;
    }
  }
`;

// --- Styled Buttons ---
export const ProductActionButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'tertiary' }>`
  font-family: ${adminProductListTheme.typography.fontFamily};
  font-size: ${adminProductListTheme.typography.button};
  font-weight: ${adminProductListTheme.typography.weights.medium};
  padding: ${adminProductListTheme.spacing(2.5)} ${adminProductListTheme.spacing(4)}; /* 10px 16px */
  border-radius: ${adminProductListTheme.borderRadius.medium};
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${adminProductListTheme.spacing(2)}; /* 8px */
  border: 1px solid transparent;
  white-space: nowrap;

  svg {
    font-size: 1.1em;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${({ $variant }) => { // We only need $variant from props here
    const theme = adminProductListTheme; // Use the imported theme directly
    switch ($variant) {
      case 'primary':
        return css`
          background-color: ${theme.colors.primaryAccent};
          color: ${theme.colors.primaryAccentText};
          border-color: ${theme.colors.primaryAccent};
          &:hover:not(:disabled) {
            background-color: ${darken(0.07, String(theme.colors.primaryAccent))};
            border-color: ${darken(0.07, String(theme.colors.primaryAccent))};
            box-shadow: 0 2px 8px ${rgba(String(theme.colors.primaryAccent), 0.3)};
          }
        `;
      case 'secondary':
        return css`
          background-color: ${theme.colors.surface};
          color: ${theme.colors.primaryAccent};
          border-color: ${theme.colors.primaryAccent};
          &:hover:not(:disabled) {
            background-color: ${transparentize(0.9, String(theme.colors.primaryAccent))};
            border-color: ${darken(0.05, String(theme.colors.primaryAccent))};
          }
        `;
      default:
        return css`
          background-color: transparent;
          color: ${theme.colors.textLink};
          border: none;
          padding-left: ${theme.spacing(1)};
          padding-right: ${theme.spacing(1)};
          &:hover:not(:disabled) {
            color: ${darken(0.1, String(theme.colors.textLink))};
            text-decoration: underline;
          }
        `;
    }
  }}
`;

// --- Search Bar ---
export const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;

  @media (max-width: ${adminProductListTheme.breakpoints.tablet || '768px'}) {
    max-width: 100%;
  }

  svg {
    position: absolute;
    left: ${adminProductListTheme.spacing(3)}; /* 12px */
    top: 50%;
    transform: translateY(-50%);
    color: ${adminProductListTheme.colors.textDisabled};
    font-size: 1.1rem;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: ${adminProductListTheme.spacing(2.5)} ${adminProductListTheme.spacing(3)} ${adminProductListTheme.spacing(2.5)} ${adminProductListTheme.spacing(10)};
  border: 1px solid ${adminProductListTheme.colors.border};
  border-radius: ${adminProductListTheme.borderRadius.medium};
  font-family: ${adminProductListTheme.typography.fontFamily};
  font-size: ${adminProductListTheme.typography.body};
  color: ${adminProductListTheme.colors.textPrimary};
  background-color: ${adminProductListTheme.colors.surface};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &::placeholder {
    color: ${adminProductListTheme.colors.textDisabled};
  }

  &:focus {
    outline: none;
    border-color: ${adminProductListTheme.colors.primaryAccent};
    box-shadow: 0 0 0 3px ${transparentize(0.75, String(adminProductListTheme.colors.primaryAccent))};
  }
`;

// --- Table Styling ---
export const TableContainer = styled.div`
  background-color: ${adminProductListTheme.colors.surface};
  border-radius: ${adminProductListTheme.borderRadius.large};
  box-shadow: ${adminProductListTheme.shadows.small};
  overflow-x: auto;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: ${adminProductListTheme.typography.fontFamily};

  th, td {
    padding: ${adminProductListTheme.spacing(3)} ${adminProductListTheme.spacing(4)}; /* 12px 16px */
    text-align: left;
    vertical-align: middle;
    border-bottom: 1px solid ${adminProductListTheme.colors.borderLight};
  }

  th {
    font-size: ${adminProductListTheme.typography.tableHeader};
    font-weight: ${adminProductListTheme.typography.weights.semiBold};
    color: ${adminProductListTheme.colors.textSecondary};
    background-color: ${adminProductListTheme.colors.tableHeaderBg};
    text-transform: capitalize;
    white-space: nowrap;

    &:first-child {
      border-top-left-radius: ${adminProductListTheme.borderRadius.large};
    }
    &:last-child {
      border-top-right-radius: ${adminProductListTheme.borderRadius.large};
    }
  }

  td {
    font-size: ${adminProductListTheme.typography.body};
    color: ${adminProductListTheme.colors.textPrimary};

    &.product-name {
      font-weight: ${adminProductListTheme.typography.weights.medium};
    }
  }

  tbody tr {
    &:last-child td {
      border-bottom: none;
    }
    &:hover {
      background-color: ${lighten(0.02, String(adminProductListTheme.colors.tableHeaderBg))};
    }
  }
`;

export const ProductImageCell = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: ${adminProductListTheme.borderRadius.small};
  border: 1px solid ${adminProductListTheme.colors.borderLight};
`;

// --- Status Toggle Switch ---
export const StatusToggleContainer = styled.label`
  position: relative;
  display: inline-block;
  width: 38px;
  height: 22px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${adminProductListTheme.colors.border}; /* Grey when off */
    transition: .3s;
    border-radius: 22px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .3s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: ${adminProductListTheme.colors.primaryAccent}; /* Orange when on */
  }

  input:checked + .slider:before {
    transform: translateX(16px);
  }
`;

// --- Table Actions ---
export const TableActionsCell = styled.div`
  display: flex;
  gap: ${adminProductListTheme.spacing(2)}; /* 8px */

  button {
    background: none;
    border: none;
    color: ${adminProductListTheme.colors.textSecondary};
    cursor: pointer;
    font-size: 1.1rem;
    padding: ${adminProductListTheme.spacing(1)};
    border-radius: 50%;
    transition: color 0.2s ease, background-color 0.2s ease;

    &:hover {
      color: ${adminProductListTheme.colors.primaryAccent};
      background-color: ${transparentize(0.9, String(adminProductListTheme.colors.primaryAccent))};
    }
    &.delete:hover {
        color: ${adminProductListTheme.colors.error};
        background-color: ${transparentize(0.9, String(adminProductListTheme.colors.error))};
    }
  }
`;

// --- Pagination ---
export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${adminProductListTheme.spacing(4)} 0;
  margin-top: ${adminProductListTheme.spacing(2)};
  font-family: ${adminProductListTheme.typography.fontFamily};

  button, span {
    margin: 0 ${adminProductListTheme.spacing(1)};
    padding: ${adminProductListTheme.spacing(1.5)} ${adminProductListTheme.spacing(2.5)};
    min-width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: ${adminProductListTheme.borderRadius.medium};
    font-size: ${adminProductListTheme.typography.small};
    font-weight: ${adminProductListTheme.typography.weights.medium};
    line-height: 1;
  }

  button {
    background-color: ${adminProductListTheme.colors.surface};
    color: ${adminProductListTheme.colors.textSecondary};
    border: 1px solid ${adminProductListTheme.colors.border};
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;

    &:hover:not(:disabled) {
      background-color: ${adminProductListTheme.colors.primaryAccent};
      color: ${adminProductListTheme.colors.primaryAccentText};
      border-color: ${adminProductListTheme.colors.primaryAccent};
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &.active {
      background-color: ${adminProductListTheme.colors.primaryAccent};
      color: ${adminProductListTheme.colors.primaryAccentText};
      border-color: ${adminProductListTheme.colors.primaryAccent};
      font-weight: ${adminProductListTheme.typography.weights.bold};
    }
  }

  .ellipsis {
    color: ${adminProductListTheme.colors.textDisabled};
    border: none;
    padding-left: ${adminProductListTheme.spacing(0.5)};
    padding-right: ${adminProductListTheme.spacing(0.5)};
  }
`;

// --- Empty State or Loading ---
export const MessageContainer = styled.div`
  text-align: center;
  padding: ${adminProductListTheme.spacing(10)} ${adminProductListTheme.spacing(4)};
  font-size: ${adminProductListTheme.typography.body};
  color: ${adminProductListTheme.colors.textSecondary};
  background-color: ${adminProductListTheme.colors.surface};
  border-radius: ${adminProductListTheme.borderRadius.large};
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 2.5rem;
    margin-bottom: ${adminProductListTheme.spacing(3)};
    color: ${adminProductListTheme.colors.textDisabled};
  }
`;