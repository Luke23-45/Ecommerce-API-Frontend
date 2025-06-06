import styled, { type DefaultTheme, css, keyframes } from 'styled-components';
import { rgba, darken } from 'polished';

// Helper to get theme (though we might access props.theme directly)
// const getTheme = (props: { theme: DefaultTheme }) => props.theme;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const SellerApplicationListContainer = styled.div`
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

export const SellerApplicationListHeader = styled.div`
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

export const ApplicationSearchInput = styled.input`
    padding: ${(props) => props.theme.spacing(2.5)} ${(props) => props.theme.spacing(4)};
    border: 1px solid ${(props) => props.theme.colors.adminBorder};
    border-radius: 8px;
    font-family: ${(props) => props.theme.typography.admin.fontFamily};
    font-size: ${(props) => props.theme.typography.admin.sizes.dataCell};
    background-color: ${props => props.theme.colors.adminSecondaryBg};
    color: ${props => props.theme.colors.adminText};
    width: 300px; /* Slightly wider for potentially longer names/emails */
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

// Reusable Table Styles (can be extracted to a common location if not already)
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
    min-width: 900px; /* Adjusted min-width for application details */
    
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
        cursor: pointer; /* Indicate sortable columns */
        transition: color 0.2s ease-out;

        &:hover {
            color: ${(props) => props.theme.colors.adminText};
        }

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
        vertical-align: middle;

        .seller-name {
            font-weight: ${(props) => props.theme.typography.admin.weights.semiBold};
            color: ${(props) => props.theme.colors.adminText};
        }
    }
`;

export const TableActionButton = styled.button`
    background: none;
    border: none;
    color: ${(props) => props.theme.colors.adminTextSecondary};
    cursor: pointer;
    font-size: ${(props) => props.theme.typography.admin.sizes.bodyBase}; /* Base for regular icons */
    transition: color 0.2s ease-out;
    padding: ${(props) => props.theme.spacing(1)};
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &:hover {
        color: ${(props) => props.theme.colors.accent1};
    }

    &:not(:last-child) {
        margin-right: ${(props) => props.theme.spacing(2)};
    }
`;

export const ApplicationStatusBadge = styled.span<{ $status: "pending" | "approved" | "rejected" | "suspended" }>`
    padding: 4px 8px;
    border-radius: 6px;
    font-size: ${(props) => props.theme.typography.admin.sizes.xsmall};
    font-weight: ${(props) => props.theme.typography.admin.weights.semiBold};
    text-transform: uppercase;
    letter-spacing: 0.3px;
    white-space: nowrap;
    display: inline-block; // Ensure it behaves as a block for consistent spacing

    ${(props) => props.$status === 'pending' && css`
        background-color: ${rgba(props.theme.colors.adminStatusWarning, 0.2)};
        color: ${props.theme.colors.adminStatusWarning};
    `}
    ${(props) => props.$status === 'approved' && css`
        background-color: ${rgba(props.theme.colors.adminStatusSuccess, 0.2)};
        color: ${props.theme.colors.adminStatusSuccess};
    `}
    ${(props) => props.$status === 'rejected' && css`
        background-color: ${rgba(props.theme.colors.adminStatusError, 0.2)};
        color: ${props.theme.colors.adminStatusError};
    `}
    ${(props) => props.$status === 'suspended' && css`
        background-color: ${rgba(props.theme.colors.adminTextSecondary, 0.15)};
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

export const ActionButtonsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing(1.5)};
`;

export const LoadingOverlay = styled.div`
  position: absolute; // Or relative to a positioned parent
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.adminText};

  .spinner {
    font-size: 2rem;
    margin-bottom: 1rem;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
export const ErrorMessage = styled.div`
    padding: 20px;
    text-align: center;
    color: ${props => props.theme.colors.adminStatusError};
    background-color: ${props => props.theme.colors.errorSubtleBg}; // Assuming a light error bg
    border: 1px solid ${props => props.theme.colors.adminStatusError};
    border-radius: ${props => props.theme.borderRadius.medium};
    margin: 20px;
`;