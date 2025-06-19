// src/components/Admin/Shipping/Zones/ShippingZoneList.styles.ts
import styled, { type DefaultTheme, css, keyframes } from 'styled-components';
import { rgba, darken, lighten } from 'polished';

// Helper to get theme
const getTheme = (props: { theme: DefaultTheme }) => props.theme;

// FadeIn animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const ZoneListContainer = styled.div`
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

export const ZoneListHeader = styled.div`
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

// Reusable HeaderTitle
export const HeaderTitle = styled.h2`
    font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.sectionTitle || '1.75rem'};
    font-weight: ${(props) => getTheme(props).typography.admin?.weights?.bold || 700};
    color: ${(props) => getTheme(props).colors.adminText || '#333333'};
    margin: 0;
`;

// Search/Filter Bar (Optional for zones if not too many, but good for consistency)
export const SearchAndFilterBar = styled.div`
    display: flex;
    gap: ${(props) => getTheme(props).spacing(3)};
    margin-bottom: ${(props) => getTheme(props).spacing(5)};
    flex-wrap: wrap; 
    align-items: center;

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet || '768px'}) {
        flex-direction: column; 
        width: 100%;
        gap: ${(props) => getTheme(props).spacing(3)};
    }
`;

export const ZoneSearchInput = styled.input`
    /* Similar to AttributeSearchInput */
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

    &:focus { /* Standard focus style */ }
    &::placeholder { /* Standard placeholder style */ }

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet || '768px'}) {
        width: 100%; min-width: unset;
    }
`;

export const ZoneFilterSelect = styled.select`
    /* Similar to AttributeFilterSelect */
    padding: ${(props) => getTheme(props).spacing(2.5)} ${(props) => getTheme(props).spacing(4)};
    border: 1px solid ${(props) => getTheme(props).colors.adminBorder || '#E0E0E0'};
    /* ... other select styles ... */
    min-width: 180px;
    height: calc(${(props) => getTheme(props).spacing(2.5)} * 2 + 20px + 2px);

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet || '768px'}) { width: 100%; }
`;

// --- Reusable Table Styles ---
// Import or copy AdminTableWrapper, AdminTable, TableActionButton, 
// TableFooter, PaginationContainer, PaginationButton from previous style files
// For this example, assume they are available and correctly styled.
// We will, however, define specific badges for this context.

export const StatusBadge = styled.span<{ $active: boolean }>`
    padding: 5px 12px;
    border-radius: 16px;
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.xsmall || '0.7rem'};
    font-weight: ${(props) => getTheme(props).typography.admin?.weights?.semiBold || 600};
    text-transform: uppercase;
    letter-spacing: 0.4px;
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

export const CountryCountPill = styled.span`
    background-color: ${(props) => getTheme(props).colors.adminAccentAltBg || rgba(getTheme(props).colors.accent2 || '#6f42c1', 0.1)};
    color: ${(props) => getTheme(props).colors.adminAccentAltText || getTheme(props).colors.accent2 || '#6f42c1'};
    padding: 3px 8px;
    border-radius: 12px;
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.xsmall || '0.7rem'};
    font-weight: ${(props) => getTheme(props).typography.admin?.weights?.medium || 500};
`;

// Message for no zones found
export const NoZonesMessage = styled.div`
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
    p { max-width: 450px; line-height: 1.6; }
`;

// Manage Rates Button (can be similar to ManageOptionsButton or TableActionButton)
export const ManageRatesButton = styled.button`
    /* Using TableActionButton as a base and tweaking */
    background: none;
    border: 1px solid transparent;
    color: ${(props) => getTheme(props).colors.accent2 || '#6f42c1'}; /* Using accent2 for distinction */
    cursor: pointer;
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.small || '0.875rem'}; 
    font-weight: ${(props) => getTheme(props).typography.admin?.weights?.semiBold || 600};
    display: inline-flex;
    align-items: center;
    gap: ${(props) => getTheme(props).spacing(1)};
    padding: ${(props) => getTheme(props).spacing(1)} ${(props) => getTheme(props).spacing(1.5)};
    border-radius: 6px;
    transition: all 0.2s ease-out;
    white-space: nowrap;

    svg {
        font-size: 0.9em;
    }

    &:hover {
        background-color: ${(props) => rgba(getTheme(props).colors.accent2 || '#6f42c1', 0.08)};
        border-color: ${(props) => rgba(getTheme(props).colors.accent2 || '#6f42c1', 0.3)};
        color: ${(props) => darken(0.05, getTheme(props).colors.accent2 || '#6f42c1')};
    }
    /* Space from other action buttons */
    &:not(:first-child) { margin-left: ${(props) => getTheme(props).spacing(1)}; }
`;