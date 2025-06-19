// src/components/Admin/Settings/Taxes/TaxRateList.styles.ts
import styled, { type DefaultTheme, css, keyframes } from 'styled-components';
import { rgba, darken, lighten } from 'polished';

// Helper to get theme
const getTheme = (props: { theme: DefaultTheme }) => props.theme;

// FadeIn animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Main Container for the Tax Rate List Page ---
export const TaxRateListContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${(props) => getTheme(props).colors.adminSurface || '#FFFFFF'};
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    padding: ${(props) => getTheme(props).spacing(6)};
    min-height: 70vh;
    
    opacity: 0;
    animation: ${fadeIn} 0.6s ease-out forwards;
    animation-delay: 0.2s;

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet || '768px'}) {
        padding: ${(props) => getTheme(props).spacing(4)};
        border-radius: 0; 
        box-shadow: none;
    }
`;

// --- Header Section ---
export const TaxRateListHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${(props) => getTheme(props).spacing(6)};
    flex-wrap: wrap;
    gap: ${(props) => getTheme(props).spacing(3)};

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet || '768px'}) {
        flex-direction: column;
        align-items: flex-start;
    }
`;

// Reusable HeaderTitle (can be common)
export const HeaderTitle = styled.h2`
    font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.sectionTitle || '1.75rem'};
    font-weight: ${(props) => getTheme(props).typography.admin?.weights?.bold || 700};
    color: ${(props) => getTheme(props).colors.adminText || '#333333'};
    margin: 0;
`;

// --- Search and Filter Bar ---
export const SearchAndFilterBar = styled.div`
    display: flex;
    gap: ${(props) => getTheme(props).spacing(3)};
    margin-bottom: ${(props) => getTheme(props).spacing(6)};
    flex-wrap: wrap; 
    align-items: center;

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet || '768px'}) {
        flex-direction: column; 
        width: 100%;
        gap: ${(props) => getTheme(props).spacing(4)};
        margin-bottom: ${(props) => getTheme(props).spacing(4)};
    }
`;

export const TaxSearchInput = styled.input` /* Similar to AttributeSearchInput */
    padding: ${(props) => getTheme(props).spacing(2.5)} ${(props) => getTheme(props).spacing(4)};
    border: 1px solid ${(props) => getTheme(props).colors.adminBorder || '#E0E0E0'};
    border-radius: 8px;
    font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.dataCell || '0.9rem'};
    background-color: ${props => getTheme(props).colors.adminSecondaryBg || '#F8F9FA'};
    color: ${props => getTheme(props).colors.adminText || '#333333'};
    min-width: 250px;
    flex-grow: 1;
    max-width: 400px;
    transition: all 0.2s ease-out;

    &:focus {
        outline: none;
        border-color: ${props => getTheme(props).colors.accent1 || '#007BFF'};
        box-shadow: 0 0 0 2px ${props => rgba(getTheme(props).colors.accent1 || '#007BFF', 0.15)};
    }
    &::placeholder {
        color: ${props => getTheme(props).colors.adminTextSecondary || '#6c757d'};
    }

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet || '768px'}) {
        width: 100%;
        min-width: unset;
    }
`;

export const TaxFilterSelect = styled.select` /* Similar to AttributeFilterSelect */
    padding: ${(props) => getTheme(props).spacing(2.5)} ${(props) => getTheme(props).spacing(4)};
    border: 1px solid ${(props) => getTheme(props).colors.adminBorder || '#E0E0E0'};
    border-radius: 8px;
    background-color: ${props => getTheme(props).colors.adminSecondaryBg || '#F8F9FA'};
    font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.dataCell || '0.9rem'};
    color: ${props => getTheme(props).colors.adminText || '#333333'};
    cursor: pointer;
    outline: none;
    transition: border-color 0.2s ease-out;
    min-width: 180px;
    height: calc(${(props) => getTheme(props).spacing(2.5)} * 2 + 20px + 2px);

    &:focus {
        border-color: ${props => getTheme(props).colors.accent1 || '#007BFF'};
    }
    
    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet || '768px'}) {
        width: 100%;
    }
`;

// --- Table Styles (Reusing AdminTableWrapper, AdminTable, TableActionButton from common or ProductList.styles.ts) ---
// If these are truly generic, they should be in a common style file and imported.
// For this example, I'll assume they are defined here for completeness or are available globally.
export {
    AdminTableWrapper,
    AdminTable,
    TableActionButton,
    TableFooter,
    PaginationContainer,
    PaginationButton
} from '../../Products/ProductList.styles'; // Example of re-exporting if using from there

// --- Specific Badges/Elements for Tax List ---
export const TaxRateValue = styled.span`
    font-weight: ${(props) => getTheme(props).typography.admin?.weights?.semiBold || 600};
    color: ${(props) => getTheme(props).colors.accent2 || '#17a2b8'}; /* Using accent2 or a specific color for rates */
`;

export const TaxTypeChip = styled.span<{ $type: 'percentage' | 'fixed_amount' }>`
    padding: 4px 10px;
    border-radius: 16px; /* Pill shape */
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.xsmall || '0.7rem'};
    font-weight: ${(props) => getTheme(props).typography.admin?.weights?.medium || 500};
    text-transform: capitalize;
    white-space: nowrap;
    display: inline-block;
    border: 1px solid transparent;

    ${(props) => props.$type === 'percentage' && css`
        background-color: ${rgba(getTheme(props).colors.adminStatusInfo || '#17a2b8', 0.15)};
        color: ${getTheme(props).colors.adminStatusInfo || '#17a2b8'};
        border-color: ${rgba(getTheme(props).colors.adminStatusInfo || '#17a2b8', 0.3)};
    `}
    ${(props) => props.$type === 'fixed_amount' && css`
        background-color: ${rgba(getTheme(props).colors.accent2 || '#6f42c1', 0.15)}; /* Example color for fixed */
        color: ${getTheme(props).colors.accent2 || '#6f42c1'};
        border-color: ${rgba(getTheme(props).colors.accent2 || '#6f42c1', 0.3)};
    `}
`;

export const TaxStatusBadge = styled.span<{ $active: boolean }>`
    /* Can reuse BooleanBadge or define specifically for Active/Inactive status */
    padding: 5px 10px;
    border-radius: 16px;
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.xsmall || '0.7rem'};
    font-weight: ${(props) => getTheme(props).typography.admin?.weights?.medium || 500};
    text-transform: capitalize;
    white-space: nowrap;
    display: inline-block;

    ${(props) => props.$active ? css`
        background-color: ${rgba(getTheme(props).colors.adminStatusSuccess || '#28a745', 0.15)};
        color: ${getTheme(props).colors.adminStatusSuccess || '#28a745'};
    ` : css`
        background-color: ${rgba(getTheme(props).colors.adminTextSecondary || '#6c757d', 0.1)};
        color: ${getTheme(props).colors.adminTextSecondary || '#6c757d'};
    `}
`;

// --- Message for No Tax Rates ---
export const NoTaxRatesMessage = styled.div`
    /* Similar to NoAttributesMessage */
    text-align: center;
    padding: ${(props) => getTheme(props).spacing(10)} ${(props) => getTheme(props).spacing(4)};
    font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.bodyBase || '1rem'};
    color: ${(props) => getTheme(props).colors.adminTextSecondary || '#6c757d'};
    border: 1px dashed ${(props) => getTheme(props).colors.adminBorder || '#E0E0E0'};
    border-radius: 8px;
    background-color: ${(props) => getTheme(props).colors.adminSecondaryBg || '#F8F9FA'};
    margin-top: ${(props) => getTheme(props).spacing(4)};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px;

    svg { 
        font-size: 3em;
        margin-bottom: ${(props) => getTheme(props).spacing(3)};
        color: ${(props) => getTheme(props).colors.adminBorder || '#D1D1D1'};
    }
    p {
        max-width: 450px;
        line-height: 1.6;
    }
`;