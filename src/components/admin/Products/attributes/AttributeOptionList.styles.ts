import styled, { type DefaultTheme, css, keyframes } from 'styled-components';
import { rgba, darken } from 'polished';

// Helper to get theme, assuming it's consistent across your styled files
const getTheme = (props: { theme: DefaultTheme }) => props.theme;

// FadeIn animation (can be from a common animations file too)
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Main Container for the Option List Page ---
export const OptionListContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${(props) => getTheme(props).colors.adminSurface || '#FFFFFF'};
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    padding: ${(props) => getTheme(props).spacing(6)};
    min-height: 70vh; // Similar to AttributeListContainer
    
    opacity: 0;
    animation: ${fadeIn} 0.6s ease-out forwards;
    animation-delay: 0.2s; // Consistent entry animation

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet || '768px'}) {
        padding: ${(props) => getTheme(props).spacing(4)};
        border-radius: 0; 
        box-shadow: none;
    }
`;

// --- Header for the Option List Page ---
export const OptionListHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap; /* Allow items to wrap if space is tight */
    gap: ${(props) => getTheme(props).spacing(3)}; /* Gap between title block and buttons */
    margin-bottom: ${(props) => getTheme(props).spacing(6)};

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet || '768px'}) {
        flex-direction: column;
        align-items: flex-start;
    }
`;

// Reusable HeaderTitle (assuming it's exactly the same)
// If it needs to be different, define OptionHeaderTitle
export const HeaderTitle = styled.h2` // Can be imported from a common styles or AttributeList.styles
    font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.sectionTitle || '1.75rem'};
    font-weight: ${(props) => getTheme(props).typography.admin?.weights?.bold || 700};
    color: ${(props) => getTheme(props).colors.adminText || '#333333'};
    margin: 0;
`;

export const ParentAttributeName = styled.span`
    font-weight: ${(props) => getTheme(props).typography.admin?.weights?.regular || 400};
    color: ${(props) => getTheme(props).colors.adminTextSecondary || '#6c757d'};
    font-size: 0.9em; /* Slightly smaller than main title */
    margin-left: ${(props) => getTheme(props).spacing(1.5)};
    border-left: 2px solid ${(props) => getTheme(props).colors.adminBorder || '#E0E0E0'};
    padding-left: ${(props) => getTheme(props).spacing(1.5)};

    strong { /* For the actual attribute name within this span */
      color: ${(props) => getTheme(props).colors.accent1 || '#007BFF'};
      font-weight: ${(props) => getTheme(props).typography.admin?.weights?.semiBold || 600};
    }
`;

// --- Search Bar (Simpler, as filters are less common for options within one attribute) ---
export const OptionSearchAndFilterBar = styled.div`
    display: flex;
    gap: ${(props) => getTheme(props).spacing(3)};
    margin-bottom: ${(props) => getTheme(props).spacing(5)}; /* Slightly less margin than AttributeList */
    flex-wrap: wrap; 
    align-items: center;

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet || '768px'}) {
        flex-direction: column; 
        width: 100%;
        gap: ${(props) => getTheme(props).spacing(3)};
    }
`;

export const OptionSearchInput = styled.input`
    padding: ${(props) => getTheme(props).spacing(2.5)} ${(props) => getTheme(props).spacing(4)};
    border: 1px solid ${(props) => getTheme(props).colors.adminBorder || '#E0E0E0'};
    border-radius: 8px;
    font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.dataCell || '0.9rem'};
    background-color: ${props => getTheme(props).colors.adminSecondaryBg || '#F8F9FA'};
    color: ${props => getTheme(props).colors.adminText || '#333333'};
    min-width: 250px;
    flex-grow: 1;
    max-width: 450px; /* Can be a bit wider for options if needed */
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

// --- Table Styles (These can be direct re-exports or copies from a common table style file) ---
// Assuming AdminTableWrapper, AdminTable, TableActionButton, TableFooter,
// PaginationContainer, PaginationButton are generic enough from ProductList.styles.ts
// or a shared ../common/Table.styles.ts
// For this complete file, I'll copy their definitions with minor tweaks if needed.

export const AdminTableWrapper = styled.div`
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

export const AdminTable = styled.table`
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    min-width: 600px; /* Options table might not need to be as wide as product/attribute table */
    
    thead th {
        text-align: left;
        padding: ${(props) => getTheme(props).spacing(2.5)} ${(props) => getTheme(props).spacing(3.5)}; /* Slightly less padding */
        font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
        font-size: ${(props) => getTheme(props).typography.admin?.sizes?.small || '0.8rem'}; /* Slightly smaller header */
        font-weight: ${(props) => getTheme(props).typography.admin?.weights?.semiBold || 600};
        color: ${(props) => getTheme(props).colors.adminTextSecondary || '#6c757d'};
        text-transform: uppercase;
        letter-spacing: 0.4px;
        background-color: ${(props) => getTheme(props).colors.adminSecondaryBg || '#F8F9FA'};
        border-bottom: 2px solid ${(props) => getTheme(props).colors.adminBorder || '#E0E0E0'};
        cursor: pointer;
        transition: background-color 0.2s ease;

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
        padding: ${(props) => getTheme(props).spacing(3)} ${(props) => getTheme(props).spacing(3.5)}; /* Slightly less padding */
        font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
        font-size: ${(props) => getTheme(props).typography.admin?.sizes?.dataCell || '0.9rem'};
        color: ${(props) => getTheme(props).colors.adminText || '#333333'};
        line-height: 1.5;
        vertical-align: middle;
    }
`;

export const TableActionButton = styled.button`
    background: none;
    border: none;
    color: ${(props) => getTheme(props).colors.adminTextSecondary || '#6c757d'};
    cursor: pointer;
    padding: ${(props) => getTheme(props).spacing(1)};
    font-size: 0.9rem; /* Slightly smaller for option actions if needed */
    transition: color 0.2s ease-out;
    border-radius: 4px;

    &:hover {
        color: ${(props) => getTheme(props).colors.accent1 || '#007BFF'};
        background-color: ${(props) => rgba(getTheme(props).colors.accent1 || '#007BFF', 0.1)};
    }
    &:not(:last-child) {
        margin-right: ${(props) => getTheme(props).spacing(1.5)}; /* Slightly less margin */
    }
`;


// --- Swatch Preview (as defined before) ---
export const SwatchPreview = styled.div<{ $color?: string; $imageUrl?: string }>`
    width: 24px;
    height: 24px;
    border-radius: 4px;
    border: 1px solid ${props => getTheme(props).colors.adminBorder || '#E0E0E0'};
    background-color: ${props => props.$color || 'transparent'};
    background-image: ${props => props.$imageUrl ? `url(${props.$imageUrl})` : 'none'};
    background-size: cover;
    background-position: center;
    display: inline-block;
    vertical-align: middle;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1); /* Subtle shadow */
`;


// --- Table Footer and Pagination (can be direct re-exports or copies) ---
export const TableFooter = styled.div`
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

export const PaginationContainer = styled.div`
    display: flex;
    gap: ${(props) => getTheme(props).spacing(1.5)};
`;

export const PaginationButton = styled.button<{ $active?: boolean }>`
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

// --- Message for when no options are found ---
export const NoOptionsMessage = styled.div`
    text-align: center;
    padding: ${(props) => getTheme(props).spacing(8)} ${(props) => getTheme(props).spacing(4)}; /* Increased padding */
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
    min-height: 150px; /* Shorter than NoAttributesMessage */

    svg { 
        font-size: 2.5em;
        margin-bottom: ${(props) => getTheme(props).spacing(2.5)};
        color: ${(props) => getTheme(props).colors.adminBorder || '#D1D1D1'};
    }

    p {
        max-width: 400px; /* Slightly narrower message */
        line-height: 1.5;
    }
`;