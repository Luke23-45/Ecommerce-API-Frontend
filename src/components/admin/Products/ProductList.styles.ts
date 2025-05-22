// src/components/Admin/Products/ProductList.styles.ts
import styled, { type DefaultTheme, css, keyframes } from 'styled-components';
import { rgba, darken } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const ProductListContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${(props) => getTheme(props).colors.adminSurface};
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    padding: ${(props) => getTheme(props).spacing(6)};
    min-height: 70vh; /* Ensure some height for empty state or short lists */
    
    /* Animation for the whole list panel entry */
    opacity: 0;
    animation: ${fadeIn} 0.6s ease-out forwards;
    animation-delay: 0.2s;

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        padding: ${(props) => getTheme(props).spacing(4)};
        border-radius: 0; /* Full width on mobile */
        box-shadow: none; /* No shadow on mobile */
    }
`;

export const ProductListHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${(props) => getTheme(props).spacing(6)};

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        flex-direction: column;
        align-items: flex-start;
        gap: ${(props) => getTheme(props).spacing(3)};
    }
`;

export const HeaderTitle = styled.h2`
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.sectionTitle};
    font-weight: ${(props) => getTheme(props).typography.admin.weights.bold};
    color: ${(props) => getTheme(props).colors.adminText};
`;

// Styles for the basic search bar in the product list
export const ProductSearchInput = styled.input`
    padding: ${(props) => getTheme(props).spacing(2.5)} ${(props) => getTheme(props).spacing(4)};
    border: 1px solid ${(props) => getTheme(props).colors.adminBorder};
    border-radius: 8px;
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.dataCell};
    background-color: ${props => props.theme.colors.adminSecondaryBg};
    color: ${props => props.theme.colors.adminText};
    width: 250px;
    transition: all 0.2s ease-out;

    &:focus {
        outline: none;
        border-color: ${props => props.theme.colors.accent1};
        box-shadow: 0 0 0 2px ${props => rgba(props.theme.colors.accent1, 0.15)};
    }
    &::placeholder {
        color: ${props => props.theme.colors.adminTextSecondary};
    }

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        width: 100%;
        margin-top: ${(props) => getTheme(props).spacing(3)}; /* Space below title */
    }
`;

export const FilterBar = styled.div`
    display: flex;
    gap: ${(props) => getTheme(props).spacing(3)};
    margin-bottom: ${(props) => getTheme(props).spacing(6)};
    flex-wrap: wrap; /* Allow filters to wrap on smaller screens */

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        flex-direction: column; /* Stack filters on mobile */
        width: 100%;
        gap: ${(props) => getTheme(props).spacing(4)};
        margin-bottom: ${(props) => getTheme(props).spacing(4)};
    }
`;

export const FilterSelect = styled.select`
    padding: ${(props) => getTheme(props).spacing(2.5)} ${(props) => getTheme(props).spacing(4)};
    border: 1px solid ${(props) => getTheme(props).colors.adminBorder};
    border-radius: 8px;
    background-color: ${props => props.theme.colors.adminSecondaryBg};
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.dataCell};
    color: ${props => props.theme.colors.adminText};
    cursor: pointer;
    outline: none;
    transition: border-color 0.2s ease-out;

    &:focus {
        border-color: ${props => props.theme.colors.accent1};
    }
    
    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        width: 100%;
    }
`;

// --- Admin Table Styles (Generic for data display) ---
export const AdminTableWrapper = styled.div`
    overflow-x: auto; /* Enable horizontal scrolling for tables on small screens */
    width: 100%;
    background-color: ${(props) => getTheme(props).colors.adminSurface};
    border-radius: 12px;
    padding-bottom: ${(props) => getTheme(props).spacing(4)}; /* Space below table if it scrolls */

    /* Scrollbar customization */
    scrollbar-width: thin;
    scrollbar-color: ${(props) => getTheme(props).colors.adminBorder} transparent;

    &::-webkit-scrollbar {
        height: 8px;
    }
    &::-webkit-scrollbar-track {
        background: ${(props) => getTheme(props).colors.adminSecondaryBg};
        border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: ${(props) => getTheme(props).colors.adminBorder};
        border-radius: 10px;
        &:hover {
            background-color: ${(props) => darken(0.1, getTheme(props).colors.adminBorder)};
        }
    }
`;

export const AdminTable = styled.table`
    width: 100%;
    border-collapse: separate; /* Use separate to apply border-spacing/border-radius */
    border-spacing: 0; /* Remove default spacing */
    min-width: 800px; /* Ensure table doesn't get too squished */
    
    thead th {
        text-align: left;
        padding: ${(props) => getTheme(props).spacing(3)} ${(props) => getTheme(props).spacing(4)};
        font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
        font-size: ${(props) => getTheme(props).typography.admin.sizes.label};
        font-weight: ${(props) => getTheme(props).typography.admin.weights.semiBold};
        color: ${(props) => getTheme(props).colors.adminTextSecondary};
        text-transform: uppercase;
        letter-spacing: 0.3px;
        background-color: ${(props) => getTheme(props).colors.adminSecondaryBg};
        border-bottom: 1px solid ${(props) => getTheme(props).colors.adminBorder};

        &:first-child { border-top-left-radius: 12px; } /* Rounded corners on first/last header */
        &:last-child { border-top-right-radius: 12px; }
    }

    tbody tr {
        border-bottom: 1px solid ${(props) => getTheme(props).colors.adminBorder};
        transition: background-color 0.2s ease-out;

        &:last-child {
            border-bottom: none;
        }

        &:hover {
            background-color: ${(props) => rgba(getTheme(props).colors.accent1, 0.03)}; /* Subtle highlight on hover */
        }
    }

    tbody td {
        padding: ${(props) => getTheme(props).spacing(4)};
        font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
        font-size: ${(props) => getTheme(props).typography.admin.sizes.dataCell};
        color: ${(props) => getTheme(props).colors.adminText};
        line-height: 1.4;

        img { /* Styles for product image in table */
            width: 48px;
            height: 48px;
            border-radius: 8px;
            object-fit: cover;
            vertical-align: middle;
            margin-right: ${(props) => getTheme(props).spacing(2)};
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
    }
`;

export const TableActionButton = styled.button`
    background: none;
    border: none;
    color: ${(props) => getTheme(props).colors.adminTextSecondary};
    cursor: pointer;
    font-size: ${(props) => getTheme(props).typography.admin.sizes.bodyBase}; /* Icon size */
    transition: color 0.2s ease-out;

    &:hover {
        color: ${(props) => getTheme(props).colors.accent1}; /* Accent color on hover */
    }

    &:not(:last-child) {
        margin-right: ${(props) => getTheme(props).spacing(3)}; /* Space between actions */
    }
`;

export const ProductStatusBadge = styled.span<{ $status: 'active' | 'draft' | 'archived' | 'out_of_stock' | 'pending_review' | 'rejected' | 'inactive' }>`
    padding: 4px 8px;
    border-radius: 6px;
    font-size: ${(props) => getTheme(props).typography.admin.sizes.xsmall};
    font-weight: ${(props) => getTheme(props).typography.admin.weights.semiBold};
    text-transform: uppercase;
    letter-spacing: 0.3px;
    white-space: nowrap; /* Prevent wrapping */

    ${(props) => props.$status === 'active' && css`
        background-color: ${rgba(getTheme(props).colors.adminStatusSuccess, 0.15)};
        color: ${getTheme(props).colors.adminStatusSuccess};
    `}
    ${(props) => props.$status === 'draft' && css`
        background-color: ${rgba(getTheme(props).colors.adminBorder, 0.5)};
        color: ${getTheme(props).colors.adminTextSecondary};
    `}
    ${(props) => props.$status === 'pending_review' && css`
        background-color: ${rgba(getTheme(props).colors.adminStatusWarning, 0.15)};
        color: ${getTheme(props).colors.adminStatusWarning};
    `}
    ${(props) => props.$status === 'out_of_stock' && css`
        background-color: ${rgba(getTheme(props).colors.adminStatusError, 0.15)};
        color: ${getTheme(props).colors.adminStatusError};
    `}
    ${(props) => props.$status === 'archived' && css`
        background-color: ${rgba(getTheme(props).colors.adminTextSecondary, 0.1)};
        color: ${getTheme(props).colors.adminTextSecondary};
    `}
     ${(props) => props.$status === 'rejected' && css`
        background-color: ${rgba(getTheme(props).colors.adminStatusError, 0.2)};
        color: ${getTheme(props).colors.adminStatusError};
    `}
    ${(props) => props.$status === 'inactive' && css`
        background-color: ${rgba(getTheme(props).colors.darkGray, 0.1)};
        color: ${getTheme(props).colors.darkGray};
    `}
`;

export const TableFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: ${(props) => getTheme(props).spacing(4)};
    padding: ${(props) => getTheme(props).spacing(2)} 0;
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.small};
    color: ${(props) => getTheme(props).colors.adminTextSecondary};
    border-top: 1px solid ${(props) => getTheme(props).colors.adminBorder};

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        flex-direction: column;
        gap: ${(props) => getTheme(props).spacing(2)};
    }
`;

export const PaginationContainer = styled.div`
    display: flex;
    gap: ${(props) => getTheme(props).spacing(1)}; /* Space between pagination buttons */
`;

export const PaginationButton = styled.button<{ $active?: boolean }>`
    padding: ${(props) => getTheme(props).spacing(1)} ${(props) => getTheme(props).spacing(2.5)};
    border: 1px solid ${(props) => props.$active ? getTheme(props).colors.accent1 : getTheme(props).colors.adminBorder};
    border-radius: 4px;
    background-color: ${(props) => props.$active ? getTheme(props).colors.accent1 : getTheme(props).colors.adminSurface};
    color: ${(props) => props.$active ? getTheme(props).colors.textLight : getTheme(props).colors.adminText};
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.small};
    cursor: pointer;
    transition: all 0.2s ease-out;

    &:hover:not(:disabled):not($active) {
        background-color: ${(props) => getTheme(props).colors.adminSecondaryBg};
        color: ${(props) => getTheme(props).colors.accent1};
        border-color: ${(props) => getTheme(props).colors.accent1};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    &.prev-next-btn {
        padding: ${(props) => getTheme(props).spacing(1)} ${(props) => getTheme(props).spacing(3)};
    }
`;