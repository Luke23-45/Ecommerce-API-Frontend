// src/components/Admin/Reports/ReportsOverview.styles.ts
import styled, { type DefaultTheme, keyframes } from 'styled-components';
import { rgba } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const ReportsOverviewContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: ${(props) => getTheme(props).spacing(0)}; /* Padding handled by internal sections */

    /* Animation for the whole page entry */
    opacity: 0;
    animation: ${fadeIn} 0.6s ease-out forwards;
    animation-delay: 0.2s;
`;

export const ReportsHeader = styled.div`
    background-color: ${(props) => getTheme(props).colors.adminSurface};
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    padding: ${(props) => getTheme(props).spacing(6)};
    margin-bottom: ${(props) => getTheme(props).spacing(8)};
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: ${(props) => getTheme(props).spacing(4)};

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        flex-direction: column;
        align-items: flex-start;
        padding: ${(props) => getTheme(props).spacing(4)};
        border-radius: 0;
        box-shadow: none;
    }
`;

export const HeaderTitle = styled.h2`
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.sectionTitle};
    font-weight: ${(props) => getTheme(props).typography.admin.weights.bold};
    color: ${(props) => getTheme(props).colors.adminText};
    margin-bottom: 0;
`;

export const ActionButtonsGroup = styled.div`
    display: flex;
    gap: ${(props) => getTheme(props).spacing(3)};
    flex-wrap: wrap; /* Allow buttons to wrap */

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        width: 100%;
        justify-content: flex-end;
        margin-top: ${(props) => getTheme(props).spacing(3)};
    }
`;

export const ReportGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Flexible columns for charts/metrics */
    gap: ${(props) => getTheme(props).spacing(6)};
`;

export const ChartFiltersContainer = styled.div`
    background-color: ${(props) => getTheme(props).colors.adminSurface};
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    padding: ${(props) => getTheme(props).spacing(6)};
    margin-bottom: ${(props) => getTheme(props).spacing(8)};
    display: flex;
    flex-wrap: wrap;
    gap: ${(props) => getTheme(props).spacing(4)};
    align-items: center;

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        flex-direction: column;
        align-items: flex-start;
        padding: ${(props) => getTheme(props).spacing(4)};
        border-radius: 0;
        box-shadow: none;
    }
`;

export const FilterLabel = styled.label`
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.label};
    font-weight: ${(props) => getTheme(props).typography.admin.weights.medium};
    color: ${(props) => getTheme(props).colors.adminTextSecondary};
    margin-right: ${(props) => getTheme(props).spacing(1.5)};
    white-space: nowrap;
`;

export const FilterGroup = styled.div`
    display: flex;
    align-items: center;
    gap: ${(props) => getTheme(props).spacing(2)};

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        width: 100%;
        justify-content: space-between;
        gap: ${(props) => getTheme(props).spacing(3)};
    }
`;

export const DateRangeInput = styled.input` /* For date inputs */
    padding: ${(props) => getTheme(props).spacing(2.5)} ${(props) => getTheme(props).spacing(3)};
    border: 1px solid ${(props) => getTheme(props).colors.adminBorder};
    border-radius: 8px;
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.dataCell};
    background-color: ${props => props.theme.colors.adminSecondaryBg};
    color: ${props => props.theme.colors.adminText};
    width: 140px; /* Fixed width for date input */
    transition: all 0.2s ease-out;

    &:focus {
        outline: none;
        border-color: ${props => props.theme.colors.accent1};
        box-shadow: 0 0 0 2px ${props => rgba(props.theme.colors.accent1, 0.15)};
    }
    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        flex-grow: 1; /* Allow date input to grow */
        width: auto;
    }
`;