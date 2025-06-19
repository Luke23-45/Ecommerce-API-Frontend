// src/components/Admin/Shipping/Rates/ShippingRateList.styles.ts
import styled, { type DefaultTheme, css, keyframes } from 'styled-components';
import { rgba, darken } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const RateListContainer = styled.div`
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

export const RateListHeader = styled.div`
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

export const ParentZoneContext = styled.span`
    font-weight: ${(props) => getTheme(props).typography.admin?.weights?.regular || 400};
    color: ${(props) => getTheme(props).colors.adminTextSecondary || '#6c757d'};
    font-size: 0.95em;
    margin-left: ${(props) => getTheme(props).spacing(1.5)};
    border-left: 2px solid ${(props) => getTheme(props).colors.adminBorder || '#E0E0E0'};
    padding-left: ${(props) => getTheme(props).spacing(1.5)};

    strong {
      color: ${(props) => getTheme(props).colors.accent1 || '#007BFF'};
      font-weight: ${(props) => getTheme(props).typography.admin?.weights?.semiBold || 600};
    }
`;

// Search/Filter Bar (usually not many rates per zone to require extensive filtering beyond search)
export const RateSearchAndFilterBar = styled.div`
    display: flex;
    gap: ${(props) => getTheme(props).spacing(3)};
    margin-bottom: ${(props) => getTheme(props).spacing(5)};
    align-items: center;

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet || '768px'}) {
        flex-direction: column;
        width: 100%;
        align-items: stretch; /* Make input take full width */
    }
`;

export const RateSearchInput = styled.input`
    /* Similar to ZoneSearchInput / AttributeSearchInput */
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
        width: 100%; max-width: 100%; min-width: unset;
    }
`;

// Reusable Table Styles - AdminTableWrapper, AdminTable, TableActionButton from previous files
// For brevity, we'll assume they are imported or copied.

export const RateTypeChip = styled.span<{ $rateType: string }>`
    padding: 4px 10px;
    border-radius: 6px;
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.xsmall || '0.7rem'};
    font-weight: ${(props) => getTheme(props).typography.admin?.weights?.medium || 500};
    text-transform: capitalize;
    white-space: nowrap;
    display: inline-block;
    border: 1px solid; /* Base border */

    ${(props) => {
        const theme = getTheme(props);
        let bgColor = theme.colors.adminSecondaryBg || '#E9ECEF';
        let textColor = theme.colors.adminTextSecondary || '#495057';
        let borderColor = theme.colors.adminBorderLight || '#DEE2E6';

        switch (props.$rateType) {
            case 'flat':
                bgColor = rgba(theme.colors.accent1 || '#007bff', 0.1);
                textColor = darken(0.1, theme.colors.accent1 || '#007bff');
                borderColor = rgba(theme.colors.accent1 || '#007bff', 0.3);
                break;
            case 'per_item':
                bgColor = rgba(theme.colors.adminStatusInfo || '#17a2b8', 0.1);
                textColor = darken(0.1, theme.colors.adminStatusInfo || '#17a2b8');
                borderColor = rgba(theme.colors.adminStatusInfo || '#17a2b8', 0.3);
                break;
            case 'by_weight':
            case 'by_price':
            case 'by_quantity':
                bgColor = rgba(theme.colors.adminStatusWarning || '#ffc107', 0.15);
                textColor = darken(0.2, theme.colors.adminStatusWarning || '#ffc107');
                borderColor = rgba(theme.colors.adminStatusWarning || '#ffc107', 0.4);
                break;
            case 'tiered':
                 bgColor = rgba(theme.colors.accent2 || '#6f42c1', 0.1);
                 textColor = darken(0.05, theme.colors.accent2 || '#6f42c1');
                 borderColor = rgba(theme.colors.accent2 || '#6f42c1', 0.3);
                break;
        }
        return css`
            background-color: ${bgColor};
            color: ${textColor};
            border-color: ${borderColor};
        `;
    }}
`;

export const ConditionsText = styled.div`
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.xsmall || '0.75rem'};
    color: ${(props) => getTheme(props).colors.adminTextMuted || '#6c757d'};
    line-height: 1.4;
    max-width: 250px; /* Prevent overly wide conditions column */
    
    span {
        display: block;
        margin-bottom: ${(props) => getTheme(props).spacing(0.5)};
        &:last-child {
            margin-bottom: 0;
        }
    }
`;

// Reusable StatusBadge from ZoneList
// export { StatusBadge } from '../Zones/ShippingZoneList.styles';
export { StatusBadge } from '../ShippingZoneList.styles';
// Message for no rates found
export const NoRatesMessage = styled.div`
    /* Similar to NoZonesMessage */
    text-align: center;
    padding: ${(props) => getTheme(props).spacing(8)} ${(props) => getTheme(props).spacing(4)};
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
    min-height: 150px;

    svg { 
        font-size: 2.8em;
        margin-bottom: ${(props) => getTheme(props).spacing(2.5)};
        color: ${(props) => getTheme(props).colors.adminBorder || '#D1D1D1'};
    }
    p { max-width: 400px; line-height: 1.6; }
`;

