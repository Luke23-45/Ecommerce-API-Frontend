// src/components/Admin/Orders/OrderList.styles.ts
import styled, {  type DefaultTheme, css, keyframes } from 'styled-components';
import { rgba, darken } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const OrderListContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${(props) => props.theme.colors.adminSurface}; // Direct theme access
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    padding: ${(props) => props.theme.spacing(6)}; // Direct theme access
    min-height: 70vh;
    
    opacity: 0;
    animation: ${fadeIn} 0.6s ease-out forwards;
    animation-delay: 0.2s;

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) { // Direct theme access
        padding: ${(props) => props.theme.spacing(4)}; // Direct theme access
        border-radius: 0;
        box-shadow: none;
    }
`;

export const OrderListHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${(props) => props.theme.spacing(6)}; // Direct theme access

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) { // Direct theme access
        flex-direction: column;
        align-items: flex-start;
        gap: ${(props) => props.theme.spacing(3)}; // Direct theme access
    }
`;

export const HeaderTitle = styled.h2`
    font-family: ${(props) => props.theme.typography.admin.fontFamily}; // Direct theme access
    font-size: ${(props) => props.theme.typography.admin.sizes.sectionTitle}; // Direct theme access
    font-weight: ${(props) => props.theme.typography.admin.weights.bold}; // Direct theme access
    color: ${(props) => props.theme.colors.adminText}; // Direct theme access
`;

export const OrderSearchInput = styled.input`
    padding: ${(props) => props.theme.spacing(2.5)} ${(props) => props.theme.spacing(4)}; // Direct theme access
    border: 1px solid ${(props) => props.theme.colors.adminBorder}; // Direct theme access
    border-radius: 8px;
    font-family: ${(props) => props.theme.typography.admin.fontFamily}; // Direct theme access
    font-size: ${(props) => props.theme.typography.admin.sizes.dataCell}; // Direct theme access
    background-color: ${props => props.theme.colors.adminSecondaryBg}; // Direct theme access
    color: ${props => props.theme.colors.adminText}; // Direct theme access
    width: 250px;
    transition: all 0.2s ease-out;

    &:focus {
        outline: none;
        border-color: ${props => props.theme.colors.accent1}; // Direct theme access
        box-shadow: 0 0 0 2px ${props => rgba(props.theme.colors.accent1, 0.15)}; // Direct theme access
    }
    &::placeholder {
        color: ${props => props.theme.colors.adminTextSecondary}; // Direct theme access
    }

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) { // Direct theme access
        width: 100%;
        margin-top: ${(props) => props.theme.spacing(3)}; // Direct theme access
    }
`;

export const FilterBar = styled.div`
    display: flex;
    gap: ${(props) => props.theme.spacing(3)}; // Direct theme access
    margin-bottom: ${(props) => props.theme.spacing(6)}; // Direct theme access
    flex-wrap: wrap;

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) { // Direct theme access
        flex-direction: column;
        width: 100%;
        gap: ${(props) => props.theme.spacing(4)}; // Direct theme access
        margin-bottom: ${(props) => props.theme.spacing(4)}; // Direct theme access
    }
`;

export const FilterSelect = styled.select`
    padding: ${(props) => props.theme.spacing(2.5)} ${(props) => props.theme.spacing(4)}; // Direct theme access
    border: 1px solid ${(props) => props.theme.colors.adminBorder}; // Direct theme access
    border-radius: 8px;
    background-color: ${props => props.theme.colors.adminSecondaryBg}; // Direct theme access
    font-family: ${(props) => props.theme.typography.admin.fontFamily}; // Direct theme access
    font-size: ${(props) => props.theme.typography.admin.sizes.dataCell}; // Direct theme access
    color: ${props => props.theme.colors.adminText}; // Direct theme access
    cursor: pointer;
    outline: none;
    transition: border-color 0.2s ease-out;

    &:focus {
        border-color: ${props => props.theme.colors.accent1}; // Direct theme access
    }
    
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) { // Direct theme access
        width: 100%;
    }
`;

export const AdminTableWrapper = styled.div`
    overflow-x: auto;
    width: 100%;
    background-color: ${(props) => props.theme.colors.adminSurface}; // Direct theme access
    border-radius: 12px;
    padding-bottom: ${(props) => props.theme.spacing(4)}; // Direct theme access

    scrollbar-width: thin;
    scrollbar-color: ${(props) => props.theme.colors.adminBorder} transparent; // Direct theme access

    &::-webkit-scrollbar {
        height: 8px;
    }
    &::-webkit-scrollbar-track {
        background: ${(props) => props.theme.colors.adminSecondaryBg}; // Direct theme access
        border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: ${(props) => props.theme.colors.adminBorder}; // Direct theme access
        border-radius: 10px;
        &:hover {
            background-color: ${(props) => darken(0.1, props.theme.colors.adminBorder)}; // Direct theme access
        }
    }
`;

export const AdminTable = styled.table`
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    min-width: 800px;
    
    thead th {
        text-align: left;
        padding: ${(props) => props.theme.spacing(3)} ${(props) => props.theme.spacing(4)}; // Direct theme access
        font-family: ${(props) => props.theme.typography.admin.fontFamily}; // Direct theme access
        font-size: ${(props) => props.theme.typography.admin.sizes.label}; // Direct theme access
        font-weight: ${(props) => props.theme.typography.admin.weights.semiBold}; // Direct theme access
        color: ${(props) => props.theme.colors.adminTextSecondary}; // Direct theme access
        text-transform: uppercase;
        letter-spacing: 0.3px;
        background-color: ${(props) => props.theme.colors.adminSecondaryBg}; // Direct theme access
        border-bottom: 1px solid ${(props) => props.theme.colors.adminBorder}; // Direct theme access

        &:first-child { border-top-left-radius: 12px; }
        &:last-child { border-top-right-radius: 12px; }
    }

    tbody tr {
        border-bottom: 1px solid ${(props) => props.theme.colors.adminBorder}; // Direct theme access
        transition: background-color 0.2s ease-out;

        &:last-child {
            border-bottom: none;
        }

        &:hover {
            background-color: ${(props) => rgba(props.theme.colors.accent1, 0.03)}; // Direct theme access
        }
    }

    tbody td {
        padding: ${(props) => props.theme.spacing(4)}; // Direct theme access
        font-family: ${(props) => props.theme.typography.admin.fontFamily}; // Direct theme access
        font-size: ${(props) => props.theme.typography.admin.sizes.dataCell}; // Direct theme access
        color: ${(props) => props.theme.colors.adminText}; // Direct theme access
        line-height: 1.4;

        img { /* Styles for product image in table */
            width: 48px;
            height: 48px;
            border-radius: 8px;
            object-fit: cover;
            vertical-align: middle;
            margin-right: ${(props) => props.theme.spacing(2)}; // Direct theme access
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
    }
`;

export const TableActionButton = styled.button`
    background: none;
    border: none;
    color: ${(props) => props.theme.colors.adminTextSecondary}; // Direct theme access
    cursor: pointer;
    font-size: ${(props) => props.theme.typography.admin.sizes.bodyBase}; // Direct theme access
    transition: color 0.2s ease-out;

    &:hover {
        color: ${(props) => props.theme.colors.accent1}; // Direct theme access
    }

    &:not(:last-child) {
        margin-right: ${(props) => props.theme.spacing(3)}; // Direct theme access
    }
`;

export const OrderStatusBadge = styled.span<{ $status: 'paid' | 'pending' | 'refunded' | 'failed' | 'canceled' | 'processing' | 'shipped' | 'delivered' | 'returned' }>`
    padding: 4px 8px;
    border-radius: 6px;
    font-size: ${(props) => props.theme.typography.admin.sizes.xsmall}; // Direct theme access
    font-weight: ${(props) => props.theme.typography.admin.weights.semiBold}; // Direct theme access
    text-transform: uppercase;
    letter-spacing: 0.3px;
    white-space: nowrap;

    ${(props) => props.$status === 'paid' && css`
        background-color: ${rgba(props.theme.colors.adminStatusSuccess, 0.15)};
        color: ${props.theme.colors.adminStatusSuccess};
    `}
    ${(props) => props.$status === 'processing' && css`
        background-color: ${rgba(props.theme.colors.adminStatusWarning, 0.15)};
        color: ${props.theme.colors.adminStatusWarning};
    `}
    ${(props) => props.$status === 'shipped' && css`
        background-color: ${rgba(props.theme.colors.accent2, 0.15)}; /* Sage green accent */
        color: ${props.theme.colors.accent2};
    `}
    ${(props) => props.$status === 'delivered' && css`
        background-color: ${rgba(props.theme.colors.adminStatusSuccess, 0.25)}; /* Stronger success */
        color: ${props.theme.colors.adminStatusSuccess};
    `}
    ${(props) => props.$status === 'refunded' && css`
        background-color: ${rgba(props.theme.colors.adminTextSecondary, 0.15)};
        color: ${props.theme.colors.adminTextSecondary};
    `}
    ${(props) => props.$status === 'canceled' && css`
        background-color: ${rgba(props.theme.colors.adminStatusError, 0.1)};
        color: ${props.theme.colors.adminStatusError};
    `}
    ${(props) => props.$status === 'pending' && css`
        background-color: ${rgba(props.theme.colors.adminStatusWarning, 0.1)};
        color: ${props.theme.colors.adminStatusWarning};
    `}
    ${(props) => props.$status === 'failed' && css`
        background-color: ${rgba(props.theme.colors.adminStatusError, 0.2)};
        color: ${props.theme.colors.adminStatusError};
    `}
    ${(props) => props.$status === 'returned' && css`
        background-color: ${rgba(props.theme.colors.adminStatusError, 0.15)};
        color: ${props.theme.colors.adminStatusError};
    `}
`;

export const TableFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: ${(props) => props.theme.spacing(4)}; // Direct theme access
    padding: ${(props) => props.theme.spacing(2)} 0; // Direct theme access
    font-family: ${(props) => props.theme.typography.admin.fontFamily}; // Direct theme access
    font-size: ${(props) => props.theme.typography.admin.sizes.small}; // Direct theme access
    color: ${(props) => props.theme.colors.adminTextSecondary}; // Direct theme access
    border-top: 1px solid ${(props) => props.theme.colors.adminBorder}; // Direct theme access

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) { // Direct theme access
        flex-direction: column;
        gap: ${(props) => props.theme.spacing(2)}; // Direct theme access
    }
`;

export const PaginationContainer = styled.div`
    display: flex;
    gap: ${(props) => props.theme.spacing(1)}; // Direct theme access
`;

export const PaginationButton = styled.button<{ $active?: boolean }>`
    padding: ${(props) => props.theme.spacing(1)} ${(props) => props.theme.spacing(2.5)}; // Direct theme access
    border: 1px solid ${(props) => props.$active ? props.theme.colors.accent1 : props.theme.colors.adminBorder}; // Direct theme access
    border-radius: 4px;
    background-color: ${(props) => props.$active ? props.theme.colors.accent1 : props.theme.colors.adminSurface}; // Direct theme access
    color: ${(props) => props.$active ? props.theme.colors.textLight : props.theme.colors.adminText}; // Direct theme access
    font-family: ${(props) => props.theme.typography.admin.fontFamily}; // Direct theme access
    font-size: ${(props) => props.theme.typography.admin.sizes.small}; // Direct theme access
    cursor: pointer;
    transition: all 0.2s ease-out;

    &:hover:not(:disabled):not($active) {
        background-color: ${(props) => props.theme.colors.adminSecondaryBg}; // Direct theme access
        color: ${(props) => props.theme.colors.accent1}; // Direct theme access
        border-color: ${(props) => props.theme.colors.accent1}; // Direct theme access
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    &.prev-next-btn {
        padding: ${(props) => props.theme.spacing(1)} ${(props) => props.theme.spacing(3)}; // Direct theme access
    }
`;