// src/components/Admin/Attributes/AttributeList.styles.ts
import styled, { type DefaultTheme, css, keyframes } from 'styled-components';
import { rgba, darken } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const AttributeListContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${(props) => getTheme(props).colors.adminSurface};
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    padding: ${(props) => getTheme(props).spacing(6)};
    min-height: 70vh; /* Ensure some height for empty state or short lists */
    
    opacity: 0;
    animation: ${fadeIn} 0.6s ease-out forwards;
    animation-delay: 0.2s; // Consistent with ProductList

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        padding: ${(props) => getTheme(props).spacing(4)};
        border-radius: 0; 
        box-shadow: none;
    }
`;

export const AttributeListHeader = styled.div`
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

export const SearchAndFilterBar = styled.div`
    display: flex;
    gap: ${(props) => getTheme(props).spacing(3)};
    margin-bottom: ${(props) => getTheme(props).spacing(6)};
    flex-wrap: wrap; 

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        flex-direction: column; 
        width: 100%;
        gap: ${(props) => getTheme(props).spacing(4)};
        margin-bottom: ${(props) => getTheme(props).spacing(4)};
    }
`;

// Reusing ProductSearchInput and FilterSelect styles from ProductList or define Attribute specific if needed
export const AttributeSearchInput = styled.input`
    padding: ${(props) => getTheme(props).spacing(2.5)} ${(props) => getTheme(props).spacing(4)};
    border: 1px solid ${(props) => getTheme(props).colors.adminBorder};
    border-radius: 8px;
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.dataCell};
    background-color: ${props => props.theme.colors.adminSecondaryBg};
    color: ${props => props.theme.colors.adminText};
    min-width: 250px; /* Give it a decent minimum width */
    flex-grow: 1; /* Allow it to grow if space allows */
    max-width: 400px; /* But not too much */
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
        min-width: unset;
    }
`;

export const AttributeFilterSelect = styled.select`
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
    min-width: 180px; /* Good width for filter dropdowns */

    &:focus {
        border-color: ${props => props.theme.colors.accent1};
    }
    
    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        width: 100%;
    }
`;

// --- Reusing Admin Table Styles from ProductList.styles.ts ---
// For brevity, assume AdminTableWrapper, AdminTable, TableActionButton are imported
// or copied from ProductList.styles.ts if they are generic enough.
// If there are attribute-specific table styles, define them here.

// Example of potentially unique badge for Attributes:
export const BooleanBadge = styled.span<{ $active: boolean }>`
    padding: 4px 8px;
    border-radius: 100px; /* Pill shape */
    font-size: ${(props) => getTheme(props).typography.admin.sizes.xsmall};
    font-weight: ${(props) => getTheme(props).typography.admin.weights.semiBold};
    text-transform: capitalize; /* Yes/No instead of uppercase */
    white-space: nowrap;

    ${(props) => props.$active ? css`
        background-color: ${rgba(getTheme(props).colors.adminStatusSuccess, 0.15)};
        color: ${getTheme(props).colors.adminStatusSuccess};
    ` : css`
        background-color: ${rgba(getTheme(props).colors.adminTextSecondary, 0.1)};
        color: ${getTheme(props).colors.adminTextSecondary};
    `}
`;

export const DisplayTypeChip = styled.span`
    padding: 4px 10px;
    border-radius: 6px;
    font-size: ${(props) => getTheme(props).typography.admin.sizes.xsmall};
    font-weight: ${(props) => getTheme(props).typography.admin.weights.medium};
    background-color: ${(props) => getTheme(props).colors.adminSecondaryBg};
    color: ${(props) => getTheme(props).colors.adminText};
    border: 1px solid ${(props) => getTheme(props).colors.adminBorder};
    text-transform: capitalize;
    white-space: nowrap;
`;


// Reusing TableFooter, PaginationContainer, PaginationButton
// from ProductList.styles.ts as they are generic.

export const NoAttributesMessage = styled.div`
    text-align: center;
    padding: ${(props) => getTheme(props).spacing(10)} ${(props) => getTheme(props).spacing(4)};
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.bodyBase};
    color: ${(props) => getTheme(props).colors.adminTextSecondary};
    border: 1px dashed ${(props) => getTheme(props).colors.adminBorder};
    border-radius: 8px;
    background-color: ${(props) => getTheme(props).colors.adminSecondaryBg};
    margin-top: ${(props) => getTheme(props).spacing(4)};

    svg { /* Icon for empty state */
        font-size: 2.5em;
        margin-bottom: ${(props) => getTheme(props).spacing(2)};
        color: ${(props) => getTheme(props).colors.adminBorder};
    }
`;

// Specific style for the "Manage Options" button if needed, or use generic TableActionButton
export const ManageOptionsButton = styled.button`
    // Could inherit from TableActionButton or be custom
    // Example: making it slightly more prominent or adding text
    background: none;
    border: none;
    color: ${(props) => getTheme(props).colors.accent1}; /* Make it accent color */
    cursor: pointer;
    font-size: ${(props) => getTheme(props).typography.admin.sizes.small}; 
    font-weight: ${(props) => getTheme(props).typography.admin.weights.semiBold};
    display: inline-flex;
    align-items: center;
    gap: ${(props) => getTheme(props).spacing(1)};
    padding: ${(props) => getTheme(props).spacing(1)} ${(props) => getTheme(props).spacing(1.5)};
    border-radius: 4px;
    transition: all 0.2s ease-out;

    &:hover {
        background-color: ${(props) => rgba(getTheme(props).colors.accent1, 0.1)};
        color: ${(props) => darken(0.05, getTheme(props).colors.accent1)};
    }
`;