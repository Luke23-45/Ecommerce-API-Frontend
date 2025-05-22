// src/components/Admin/Customers/CustomerList.styles.ts
import styled, { type DefaultTheme, css, keyframes } from 'styled-components';
import { rgba, darken } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const CustomerListContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${(props) => props.theme.colors.adminSurface};
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    padding: ${(props) => props.theme.spacing(6)};
    min-height: 70vh; /* Ensure some height for empty state or short lists */
    
    opacity: 0;
    animation: ${fadeIn} 0.6s ease-out forwards;
    animation-delay: 0.2s;

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        padding: ${(props) => props.theme.spacing(4)};
        border-radius: 0;
        box-shadow: none;
    }
`;

export const CustomerListHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${(props) => props.theme.spacing(6)};

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        flex-direction: column;
        align-items: flex-start;
        gap: ${(props) => props.theme.spacing(3)};
    }
`;

export const HeaderTitle = styled.h2`
    font-family: ${(props) => props.theme.typography.admin.fontFamily};
    font-size: ${(props) => props.theme.typography.admin.sizes.sectionTitle};
    font-weight: ${(props) => props.theme.typography.admin.weights.bold};
    color: ${(props) => props.theme.colors.adminText};
`;

export const CustomerSearchInput = styled.input`
    padding: ${(props) => props.theme.spacing(2.5)} ${(props) => props.theme.spacing(4)};
    border: 1px solid ${(props) => props.theme.colors.adminBorder};
    border-radius: 8px;
    font-family: ${(props) => props.theme.typography.admin.fontFamily};
    font-size: ${(props) => props.theme.typography.admin.sizes.dataCell};
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

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        width: 100%;
        margin-top: ${(props) => props.theme.spacing(3)};
    }
`;

export const FilterBar = styled.div`
    display: flex;
    gap: ${(props) => props.theme.spacing(3)};
    margin-bottom: ${(props) => props.theme.spacing(6)};
    flex-wrap: wrap;

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        flex-direction: column;
        width: 100%;
        gap: ${(props) => props.theme.spacing(4)};
        margin-bottom: ${(props) => props.theme.spacing(4)};
    }
`;

export const FilterSelect = styled.select`
    padding: ${(props) => props.theme.spacing(2.5)} ${(props) => props.theme.spacing(4)};
    border: 1px solid ${(props) => props.theme.colors.adminBorder};
    border-radius: 8px;
    background-color: ${props => props.theme.colors.adminSecondaryBg};
    font-family: ${(props) => props.theme.typography.admin.fontFamily};
    font-size: ${(props) => props.theme.typography.admin.sizes.dataCell};
    color: ${props => props.theme.colors.adminText};
    cursor: pointer;
    outline: none;
    transition: border-color 0.2s ease-out;

    &:focus {
        border-color: ${props => props.theme.colors.accent1};
    }
    
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        width: 100%;
    }
`;

export const AdminTableWrapper = styled.div`
    overflow-x: auto;
    width: 100%;
    background-color: ${(props) => props.theme.colors.adminSurface};
    border-radius: 12px;
    padding-bottom: ${(props) => props.theme.spacing(4)};

    scrollbar-width: thin;
    scrollbar-color: ${(props) => props.theme.colors.adminBorder} transparent;

    &::-webkit-scrollbar {
        height: 8px;
    }
    &::-webkit-scrollbar-track {
        background: ${(props) => props.theme.colors.adminSecondaryBg};
        border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: ${(props) => props.theme.colors.adminBorder};
        border-radius: 10px;
        &:hover {
            background-color: ${(props) => darken(0.1, props.theme.colors.adminBorder)};
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
        padding: ${(props) => props.theme.spacing(3)} ${(props) => props.theme.spacing(4)};
        font-family: ${(props) => props.theme.typography.admin.fontFamily};
        font-size: ${(props) => props.theme.typography.admin.sizes.label};
        font-weight: ${(props) => props.theme.typography.admin.weights.semiBold};
        color: ${(props) => props.theme.colors.adminTextSecondary};
        text-transform: uppercase;
        letter-spacing: 0.3px;
        background-color: ${(props) => props.theme.colors.adminSecondaryBg};
        border-bottom: 1px solid ${(props) => props.theme.colors.adminBorder};

        &:first-child { border-top-left-radius: 12px; }
        &:last-child { border-top-right-radius: 12px; }
    }

    tbody tr {
        border-bottom: 1px solid ${(props) => props.theme.colors.adminBorder};
        transition: background-color 0.2s ease-out;

        &:last-child {
            border-bottom: none;
        }

        &:hover {
            background-color: ${(props) => rgba(props.theme.colors.accent1, 0.03)};
        }
    }

    tbody td {
        padding: ${(props) => props.theme.spacing(4)};
        font-family: ${(props) => props.theme.typography.admin.fontFamily};
        font-size: ${(props) => props.theme.typography.admin.sizes.dataCell};
        color: ${(props) => props.theme.colors.adminText};
        line-height: 1.4;

        img { /* Styles for avatar/product image in table */
            width: 40px; /* Slightly smaller avatar */
            height: 40px;
            border-radius: 50%; /* Circle for avatar */
            object-fit: cover;
            vertical-align: middle;
            margin-right: ${(props) => props.theme.spacing(2)};
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
    }
`;

export const TableActionButton = styled.button`
    background: none;
    border: none;
    color: ${(props) => props.theme.colors.adminTextSecondary};
    cursor: pointer;
    font-size: ${(props) => props.theme.typography.admin.sizes.bodyBase};
    transition: color 0.2s ease-out;

    &:hover {
        color: ${(props) => props.theme.colors.accent1};
    }

    &:not(:last-child) {
        margin-right: ${(props) => props.theme.spacing(3)};
    }
`;

export const CustomerStatusBadge = styled.span<{ $status: 'active' | 'suspended' | 'blocked' | 'pending_verification' }>`
    padding: 4px 8px;
    border-radius: 6px;
    font-size: ${(props) => props.theme.typography.admin.sizes.xsmall};
    font-weight: ${(props) => props.theme.typography.admin.weights.semiBold};
    text-transform: uppercase;
    letter-spacing: 0.3px;
    white-space: nowrap;

    ${(props) => props.$status === 'active' && css`
        background-color: ${rgba(props.theme.colors.adminStatusSuccess, 0.15)};
        color: ${props.theme.colors.adminStatusSuccess};
    `}
    ${(props) => props.$status === 'suspended' && css`
        background-color: ${rgba(props.theme.colors.adminStatusWarning, 0.15)};
        color: ${props.theme.colors.adminStatusWarning};
    `}
    ${(props) => props.$status === 'blocked' && css`
        background-color: ${rgba(props.theme.colors.adminStatusError, 0.15)};
        color: ${props.theme.colors.adminStatusError};
    `}
    ${(props) => props.$status === 'pending_verification' && css`
        background-color: ${rgba(props.theme.colors.adminTextSecondary, 0.1)};
        color: ${props.theme.colors.adminTextSecondary};
    `}
`;

export const TableFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: ${(props) => props.theme.spacing(4)};
    padding: ${(props) => props.theme.spacing(2)} 0;
    font-family: ${(props) => props.theme.typography.admin.fontFamily};
    font-size: ${(props) => props.theme.typography.admin.sizes.small};
    color: ${(props) => props.theme.colors.adminTextSecondary};
    border-top: 1px solid ${(props) => props.theme.colors.adminBorder};

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        flex-direction: column;
        gap: ${(props) => props.theme.spacing(2)};
    }
`;

export const PaginationContainer = styled.div`
    display: flex;
    gap: ${(props) => props.theme.spacing(1)};
`;

export const PaginationButton = styled.button<{ $active?: boolean }>`
    padding: ${(props) => props.theme.spacing(1)} ${(props) => props.theme.spacing(2.5)};
    border: 1px solid ${(props) => props.$active ? props.theme.colors.accent1 : props.theme.colors.adminBorder};
    border-radius: 4px;
    background-color: ${(props) => props.$active ? props.theme.colors.accent1 : props.theme.colors.adminSurface};
    color: ${(props) => props.$active ? props.theme.colors.textLight : props.theme.colors.adminText};
    font-family: ${(props) => props.theme.typography.admin.fontFamily};
    font-size: ${(props) => props.theme.typography.admin.sizes.small};
    cursor: pointer;
    transition: all 0.2s ease-out;

    &:hover:not(:disabled):not($active) {
        background-color: ${(props) => props.theme.colors.adminSecondaryBg};
        color: ${(props) => props.theme.colors.accent1};
        border-color: ${(props) => props.theme.colors.accent1};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    &.prev-next-btn {
        padding: ${(props) => props.theme.spacing(1)} ${(props) => props.theme.spacing(3)};
    }
`;