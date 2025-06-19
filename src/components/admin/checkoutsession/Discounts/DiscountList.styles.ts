import styled, { type DefaultTheme, css, keyframes } from 'styled-components';
import { rgba, darken, lighten } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Main Container ---
export const DiscountListContainer = styled.div`
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

// --- Header ---
export const DiscountListHeader = styled.div`
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

export const DiscountSearchInput = styled.input`
    /* Similar to AttributeSearchInput or ProductSearchInput */
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

export const DiscountFilterSelect = styled.select`
    /* Similar to AttributeFilterSelect */
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
    height: calc(${(props) => getTheme(props).spacing(2.5)} * 2 + 20px + 2px); /* Approx input height */


    &:focus {
        border-color: ${props => getTheme(props).colors.accent1 || '#007BFF'};
    }
    
    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet || '768px'}) {
        width: 100%;
    }
`;


// --- Admin Table Styles (Can be imported from a common table styles file if available) ---
export const AdminTableWrapper = styled.div`/* ... (Same as AttributeList.styles or common) ... */
    overflow-x: auto;
    width: 100%;
    background-color: ${(props) => getTheme(props).colors.adminSurface || '#FFFFFF'};
    border-radius: 10px;
    padding-bottom: ${(props) => getTheme(props).spacing(1)};
    scrollbar-width: thin;
    scrollbar-color: ${(props) => getTheme(props).colors.adminBorder || '#D1D1D1'} transparent;
    &::-webkit-scrollbar { height: 8px; width: 6px; }
    &::-webkit-scrollbar-track { background: ${(props) => getTheme(props).colors.adminSecondaryBg || '#F0F0F0'}; border-radius: 10px; }
    &::-webkit-scrollbar-thumb {
        background-color: ${(props) => getTheme(props).colors.adminBorder || '#D1D1D1'};
        border-radius: 10px;
        &:hover { background-color: ${(props) => darken(0.1, getTheme(props).colors.adminBorder || '#D1D1D1')}; }
    }
`;

export const AdminTable = styled.table`/* ... (Same as AttributeList.styles or common, min-width might adjust) ... */
    width: 100%;
    border-collapse: separate; 
    border-spacing: 0;
    min-width: 1000px; /* Discounts might have more columns */
    
    thead th {
        text-align: left;
        padding: ${(props) => getTheme(props).spacing(3)} ${(props) => getTheme(props).spacing(4)};
        font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
        font-size: ${(props) => getTheme(props).typography.admin?.sizes?.label || '0.75rem'};
        font-weight: ${(props) => getTheme(props).typography.admin?.weights?.semiBold || 600};
        color: ${(props) => getTheme(props).colors.adminTextSecondary || '#6c757d'};
        text-transform: uppercase;
        letter-spacing: 0.5px;
        background-color: ${(props) => getTheme(props).colors.adminSecondaryBg || '#F8F9FA'};
        border-bottom: 2px solid ${(props) => getTheme(props).colors.adminBorder || '#E0E0E0'};
        cursor: pointer;
        transition: background-color 0.2s ease;
        white-space: nowrap;

        &:hover { background-color: ${(props) => darken(0.03, getTheme(props).colors.adminSecondaryBg || '#F8F9FA')}; }
        &:first-child { border-top-left-radius: 10px; }
        &:last-child { border-top-right-radius: 10px; }
        svg { margin-left: ${(props) => getTheme(props).spacing(1)}; vertical-align: middle; }
    }

    tbody tr {
        border-bottom: 1px solid ${(props) => getTheme(props).colors.adminBorderLight || '#EEEEEE'};
        transition: background-color 0.15s ease-out;
        &:last-child { border-bottom: none; }
        &:hover { background-color: ${(props) => rgba(getTheme(props).colors.accent1 || '#007BFF', 0.04)}; }
    }

    tbody td {
        padding: ${(props) => getTheme(props).spacing(3.5)} ${(props) => getTheme(props).spacing(4)};
        font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
        font-size: ${(props) => getTheme(props).typography.admin?.sizes?.dataCell || '0.9rem'};
        color: ${(props) => getTheme(props).colors.adminText || '#333333'};
        line-height: 1.5;
        vertical-align: middle;
    }
`;

export const TableActionButton = styled.button`/* ... (Same as AttributeList.styles or common) ... */
    background: none;
    border: none;
    color: ${(props) => getTheme(props).colors.adminTextSecondary || '#6c757d'};
    cursor: pointer;
    padding: ${(props) => getTheme(props).spacing(1)};
    font-size: 1rem;
    transition: color 0.2s ease-out;
    border-radius: 4px;
    &:hover {
        color: ${(props) => getTheme(props).colors.accent1 || '#007BFF'};
        background-color: ${(props) => rgba(getTheme(props).colors.accent1 || '#007BFF', 0.1)};
    }
    &:not(:last-child) { margin-right: ${(props) => getTheme(props).spacing(2)}; }
`;

// --- Specific Badge for Discount Status (Active/Inactive) ---
export const DiscountStatusBadge = styled.span<{ $isActive: boolean }>`
    padding: 5px 12px;
    border-radius: 16px;
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.xsmall || '0.7rem'};
    font-weight: ${(props) => getTheme(props).typography.admin?.weights?.medium || 500};
    text-transform: capitalize;
    white-space: nowrap;
    display: inline-block;

    ${(props) => props.$isActive ? css`
        background-color: ${rgba(getTheme(props).colors.adminStatusSuccess || '#28a745', 0.15)};
        color: ${getTheme(props).colors.adminStatusSuccess || '#28a745'};
    ` : css`
        background-color: ${rgba(getTheme(props).colors.adminTextMuted || '#6c757d', 0.12)};
        color: ${getTheme(props).colors.adminTextMuted || '#6c757d'};
    `}
`;

// --- Chip for Discount Type & Applicability ---
export const InfoChip = styled.span`
    padding: 4px 10px;
    border-radius: 6px;
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.xsmall || '0.7rem'};
    font-weight: ${(props) => getTheme(props).typography.admin?.weights?.regular || 400};
    background-color: ${(props) => getTheme(props).colors.adminSecondaryBg || '#E9ECEF'};
    color: ${(props) => getTheme(props).colors.adminTextSecondary || '#495057'};
    border: 1px solid ${(props) => getTheme(props).colors.adminBorderLight || '#DEE2E6'};
    text-transform: capitalize;
    white-space: nowrap;
    display: inline-block;
    margin: ${(props) => getTheme(props).spacing(0.5)} ${(props) => getTheme(props).spacing(1)} ${(props) => getTheme(props).spacing(0.5)} 0;
`;


// --- Table Footer and Pagination (Can be from a common file or ProductList.styles.ts) ---
export const TableFooter = styled.div`/* ... (Same as AttributeList.styles or common) ... */
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: ${(props) => getTheme(props).spacing(5)};
    padding: ${(props) => getTheme(props).spacing(3)} 0;
    font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.small || '0.875rem'};
    color: ${(props) => getTheme(props).colors.adminTextSecondary || '#6c757d'};
    border-top: 1px solid ${(props) => getTheme(props).colors.adminBorder || '#E0E0E0'};
    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet || '768px'}) {
        flex-direction: column;
        gap: ${(props) => getTheme(props).spacing(3)};
        padding-top: ${(props) => getTheme(props).spacing(4)};
    }
`;

export const PaginationContainer = styled.div`/* ... (Same as AttributeList.styles or common) ... */
    display: flex;
    gap: ${(props) => getTheme(props).spacing(1.5)};
`;

export const PaginationButton = styled.button<{ $active?: boolean }>`/* ... (Same as AttributeList.styles or common, with aria-current styling) ... */
    padding: ${(props) => getTheme(props).spacing(1.5)} ${(props) => getTheme(props).spacing(2.5)};
    border: 1px solid ${(props) => props.$active ? (getTheme(props).colors.accent1 || '#007BFF') : (getTheme(props).colors.adminBorder || '#E0E0E0')};
    border-radius: 6px;
    background-color: ${(props) => props.$active ? (getTheme(props).colors.accent1 || '#007BFF') : (getTheme(props).colors.adminSurface || '#FFFFFF')};
    color: ${(props) => props.$active ? (getTheme(props).colors.textLight || '#FFFFFF') : (getTheme(props).colors.adminText || '#333333')};
    font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.small || '0.875rem'};
    font-weight: ${(props) => props.$active ? (getTheme(props).typography.admin?.weights?.semiBold || 600) : (getTheme(props).typography.admin?.weights?.regular || 400)};
    cursor: pointer;
    transition: all 0.2s ease-out;
    min-width: 38px;
    text-align: center;
    &:hover:not(:disabled):not([aria-current="page"]) {
        background-color: ${(props) => getTheme(props).colors.adminSecondaryBg || '#F8F9FA'};
        color: ${(props) => getTheme(props).colors.accent1 || '#007BFF'};
        border-color: ${(props) => getTheme(props).colors.accent1 || '#007BFF'};
    }
    &[aria-current="page"] {
        background-color: ${(props) => getTheme(props).colors.accent1 || '#007BFF'};
        color: ${(props) => getTheme(props).colors.textLight || '#FFFFFF'};
        border-color: ${(props) => getTheme(props).colors.accent1 || '#007BFF'};
        font-weight: ${(props) => getTheme(props).typography.admin?.weights?.bold || 700};
    }
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background-color: ${(props) => getTheme(props).colors.adminBorderLight || '#F0F0F0'};
        border-color: ${(props) => getTheme(props).colors.adminBorderLight || '#F0F0F0'};
        color: ${(props) => getTheme(props).colors.adminTextSecondary || '#6c757d'};
    }
    &.prev-next-btn {
        padding: ${(props) => getTheme(props).spacing(1.5)} ${(props) => getTheme(props).spacing(3)};
    }
`;

// --- Message for No Discounts ---
export const NoDiscountsMessage = styled.div`
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