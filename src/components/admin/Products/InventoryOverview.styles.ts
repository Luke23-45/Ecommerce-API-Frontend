// src/components/Admin/Products/InventoryOverview.styles.ts
import styled, { type DefaultTheme, keyframes, css } from 'styled-components';
import { rgba, darken } from 'polished';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const InventoryOverviewContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.adminSurface}; /* Direct theme access */
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    padding: ${(props: { theme: DefaultTheme }) => props.theme.spacing(6)}; /* Direct theme access */
    min-height: 70vh;
    
    opacity: 0;
    animation: ${fadeIn} 0.6s ease-out forwards;
    animation-delay: 0.2s;

    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.tablet}) { /* Direct theme access */
        padding: ${(props: { theme: DefaultTheme }) => props.theme.spacing(4)}; /* Direct theme access */
        border-radius: 0;
        box-shadow: none;
    }
`;

export const OverviewHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${(props: { theme: DefaultTheme }) => props.theme.spacing(6)}; /* Direct theme access */

    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.tablet}) { /* Direct theme access */
        flex-direction: column;
        align-items: flex-start;
        gap: ${(props: { theme: DefaultTheme }) => props.theme.spacing(3)}; /* Direct theme access */
    }
`;

export const HeaderTitle = styled.h2`
    font-family: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.fontFamily}; /* Direct theme access */
    font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.sizes.sectionTitle}; /* Direct theme access */
    font-weight: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.weights.bold}; /* Direct theme access */
    color: ${(props: { theme: DefaultTheme }) => props.theme.colors.adminText}; /* Direct theme access */
`;

export const InventorySearchInput = styled.input`
    padding: ${(props: { theme: DefaultTheme }) => props.theme.spacing(2.5)} ${(props: { theme: DefaultTheme }) => props.theme.spacing(4)}; /* Direct theme access */
    border: 1px solid ${(props: { theme: DefaultTheme }) => props.theme.colors.adminBorder}; /* Direct theme access */
    border-radius: 8px;
    font-family: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.fontFamily}; /* Direct theme access */
    font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.sizes.dataCell}; /* Direct theme access */
    background-color: ${props => props.theme.colors.adminSecondaryBg}; /* Direct theme access */
    color: ${props => props.theme.colors.adminText}; /* Direct theme access */
    width: 250px;
    transition: all 0.2s ease-out;

    &:focus {
        outline: none;
        border-color: ${props => props.theme.colors.accent1}; /* Direct theme access */
        box-shadow: 0 0 0 2px ${props => rgba(props.theme.colors.accent1, 0.15)}; /* Direct theme access */
    }
    &::placeholder {
        color: ${props => props.theme.colors.adminTextSecondary}; /* Direct theme access */
    }

    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.tablet}) { /* Direct theme access */
        width: 100%;
        margin-top: ${(props: { theme: DefaultTheme }) => props.theme.spacing(3)}; /* Direct theme access */
    }
`;

export const FilterBar = styled.div`
    display: flex;
    gap: ${(props: { theme: DefaultTheme }) => props.theme.spacing(3)}; /* Direct theme access */
    margin-bottom: ${(props: { theme: DefaultTheme }) => props.theme.spacing(6)}; /* Direct theme access */
    flex-wrap: wrap;

    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.tablet}) { /* Direct theme access */
        flex-direction: column;
        width: 100%;
        gap: ${(props: { theme: DefaultTheme }) => props.theme.spacing(4)}; /* Direct theme access */
        margin-bottom: ${(props) => props.theme.spacing(4)}; /* Direct theme access */
    }
`;

export const FilterSelect = styled.select`
    padding: ${(props: { theme: DefaultTheme }) => props.theme.spacing(2.5)} ${(props: { theme: DefaultTheme }) => props.theme.spacing(4)}; /* Direct theme access */
    border: 1px solid ${(props: { theme: DefaultTheme }) => props.theme.colors.adminBorder}; /* Direct theme access */
    border-radius: 8px;
    background-color: ${props => props.theme.colors.adminSecondaryBg}; /* Direct theme access */
    font-family: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.fontFamily}; /* Direct theme access */
    font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.sizes.dataCell}; /* Direct theme access */
    color: ${props => props.theme.colors.adminText}; /* Direct theme access */
    cursor: pointer;
    outline: none;
    transition: border-color 0.2s ease-out;

    &:focus {
        border-color: ${props => props.theme.colors.accent1}; /* Direct theme access */
    }
    
    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.tablet}) { /* Direct theme access */
        width: 100%;
    }
`;

export const AdminTableWrapper = styled.div`
    overflow-x: auto;
    width: 100%;
    background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.adminSurface}; /* Direct theme access */
    border-radius: 12px;
    padding-bottom: ${(props: { theme: DefaultTheme }) => props.theme.spacing(4)}; /* Direct theme access */

    scrollbar-width: thin;
    scrollbar-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.adminBorder} transparent; /* Direct theme access */

    &::-webkit-scrollbar { height: 8px; }
    &::-webkit-scrollbar-track { background: ${(props: { theme: DefaultTheme }) => props.theme.colors.adminSecondaryBg}; border-radius: 10px; } /* Direct theme access */
    &::-webkit-scrollbar-thumb {
        background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.adminBorder}; /* Direct theme access */
        border-radius: 10px;
        &:hover { background-color: ${(props) => darken(0.1, props.theme.colors.adminBorder)}; } /* Direct theme access */
    }
`;

export const AdminTable = styled.table`
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    min-width: 900px;
    
    thead th {
        text-align: left;
        padding: ${(props: { theme: DefaultTheme }) => props.theme.spacing(3)} ${(props: { theme: DefaultTheme }) => props.theme.spacing(4)}; /* Direct theme access */
        font-family: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.fontFamily}; /* Direct theme access */
        font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.sizes.label}; /* Direct theme access */
        font-weight: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.weights.semiBold}; /* Direct theme access */
        color: ${(props: { theme: DefaultTheme }) => props.theme.colors.adminTextSecondary}; /* Direct theme access */
        text-transform: uppercase;
        letter-spacing: 0.3px;
        background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.adminSecondaryBg}; /* Direct theme access */
        border-bottom: 1px solid ${(props: { theme: DefaultTheme }) => props.theme.colors.adminBorder}; /* Direct theme access */

        &:first-child { border-top-left-radius: 12px; }
        &:last-child { border-top-right-radius: 12px; }
    }

    tbody tr {
        border-bottom: 1px solid ${(props: { theme: DefaultTheme }) => props.theme.colors.adminBorder}; /* Direct theme access */
        transition: background-color 0.2s ease-out;

        &:last-child { border-bottom: none; }
        &:hover { background-color: ${(props) => rgba(props.theme.colors.accent1, 0.03)}; } /* Direct theme access */
    }

    tbody td {
        padding: ${(props: { theme: DefaultTheme }) => props.theme.spacing(4)}; /* Direct theme access */
        font-family: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.fontFamily}; /* Direct theme access */
        font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.sizes.dataCell}; /* Direct theme access */
        color: ${(props: { theme: DefaultTheme }) => props.theme.colors.adminText}; /* Direct theme access */
        line-height: 1.4;

        img {
            width: 40px;
            height: 40px;
            border-radius: 4px;
            object-fit: cover;
            vertical-align: middle;
            margin-right: ${(props: { theme: DefaultTheme }) => props.theme.spacing(2)}; /* Direct theme access */
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            border: 1px solid ${(props: { theme: DefaultTheme }) => props.theme.colors.adminBorder}; /* Direct theme access */
        }

        input[type="number"] {
            width: 70px;
            padding: 5px 8px;
            border: 1px solid ${(props: { theme: DefaultTheme }) => props.theme.colors.adminBorder}; /* Direct theme access */
            border-radius: 4px;
            font-size: inherit;
            font-family: inherit;
            background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.adminSurface}; /* Direct theme access */
            -moz-appearance: textfield;
            &::-webkit-inner-spin-button, 
            &::-webkit-outer-spin-button { 
                -webkit-appearance: none; 
                margin: 0; 
            }
            &:focus {
                outline: none;
                border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.accent1}; /* Direct theme access */
                box-shadow: 0 0 0 2px ${props => rgba(props.theme.colors.accent1, 0.15)}; /* Direct theme access */
            }
        }
    }
`;

export const TableActionButton = styled.button`
    background: none;
    border: none;
    color: ${(props: { theme: DefaultTheme }) => props.theme.colors.adminTextSecondary}; /* Direct theme access */
    cursor: pointer;
    font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.sizes.bodyBase}; /* Direct theme access */
    transition: color 0.2s ease-out;

    &:hover { color: ${(props: { theme: DefaultTheme }) => props.theme.colors.accent1}; } /* Direct theme access */
    &:not(:last-child) { margin-right: ${(props: { theme: DefaultTheme }) => props.theme.spacing(3)}; } /* Direct theme access */
`;

export const InventoryStatusBadge = styled.span<{ $status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'backorder' }>`
    padding: 4px 8px;
    border-radius: 6px;
    font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.sizes.xsmall}; /* Direct theme access */
    font-weight: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.weights.semiBold}; /* Direct theme access */
    text-transform: uppercase;
    letter-spacing: 0.3px;
    white-space: nowrap;

    ${(props) => props.$status === 'in_stock' && css`
        background-color: ${rgba(props.theme.colors.adminStatusSuccess, 0.15)};
        color: ${props.theme.colors.adminStatusSuccess};
    `}
    ${(props) => props.$status === 'low_stock' && css`
        background-color: ${rgba(props.theme.colors.adminStatusWarning, 0.15)};
        color: ${props.theme.colors.adminStatusWarning};
    `}
    ${(props) => props.$status === 'out_of_stock' && css`
        background-color: ${rgba(props.theme.colors.adminStatusError, 0.15)};
        color: ${props.theme.colors.adminStatusError};
    `}
    ${(props) => props.$status === 'backorder' && css`
        background-color: ${rgba(props.theme.colors.adminTextSecondary, 0.1)};
        color: ${props.theme.colors.adminTextSecondary};
    `}
`;

export const TableFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: ${(props: { theme: DefaultTheme }) => props.theme.spacing(4)}; /* Direct theme access */
    padding: ${(props: { theme: DefaultTheme }) => props.theme.spacing(2)} 0; /* Direct theme access */
    font-family: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.fontFamily}; /* Direct theme access */
    font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.sizes.small}; /* Direct theme access */
    color: ${(props: { theme: DefaultTheme }) => props.theme.colors.adminTextSecondary}; /* Direct theme access */
    border-top: 1px solid ${(props: { theme: DefaultTheme }) => props.theme.colors.adminBorder}; /* Direct theme access */

    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.tablet}) { /* Direct theme access */
        flex-direction: column;
        gap: ${(props: { theme: DefaultTheme }) => props.theme.spacing(2)}; /* Direct theme access */
    }
`;

export const PaginationContainer = styled.div`
    display: flex;
    gap: ${(props: { theme: DefaultTheme }) => props.theme.spacing(1)}; /* Direct theme access */
`;

export const PaginationButton = styled.button<{ $active?: boolean }>`
    padding: ${(props: { theme: DefaultTheme }) => props.theme.spacing(1)} ${(props: { theme: DefaultTheme }) => props.theme.spacing(2.5)}; /* Direct theme access */
    border: 1px solid ${(props) => props.$active ? props.theme.colors.accent1 : props.theme.colors.adminBorder}; /* Direct theme access */
    border-radius: 4px;
    background-color: ${(props) => props.$active ? props.theme.colors.accent1 : props.theme.colors.adminSurface}; /* Direct theme access */
    color: ${(props) => props.$active ? props.theme.colors.textLight : props.theme.colors.adminText}; /* Direct theme access */
    font-family: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.fontFamily}; /* Direct theme access */
    font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.sizes.small}; /* Direct theme access */
    cursor: pointer;
    transition: all 0.2s ease-out;

    &:hover:not(:disabled):not($active) {
        background-color: ${(props) => props.theme.colors.adminSecondaryBg}; /* Direct theme access */
        color: ${(props) => props.theme.colors.accent1}; /* Direct theme access */
        border-color: ${(props) => props.theme.colors.accent1}; /* Direct theme access */
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    &.prev-next-btn {
        padding: ${(props: { theme: DefaultTheme }) => props.theme.spacing(1)} ${(props: { theme: DefaultTheme }) => props.theme.spacing(3)}; /* Direct theme access */
    }
`;