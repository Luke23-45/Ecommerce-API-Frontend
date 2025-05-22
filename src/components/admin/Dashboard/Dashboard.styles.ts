// src/components/Admin/Dashboard/Dashboard.styles.ts
import styled, { type DefaultTheme, keyframes } from 'styled-components';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const DashboardGrid = styled.div`
    display: grid;
    /* Main dashboard layout: 1st row for metrics, 2nd row for charts/lists */
    grid-template-columns: repeat(4, 1fr); /* Default 4 columns for metric cards */
    gap: ${(props) => getTheme(props).spacing(6)}; /* Consistent spacing */
    
    /* Animation for overall dashboard content entry */
    opacity: 0;
    animation: ${fadeIn} 0.8s ease-out forwards;
    animation-delay: 0.1s; /* Slight delay after page title appears */


    @media (max-width: ${(props) => getTheme(props).breakpoints.laptopL}) {
        grid-template-columns: repeat(2, 1fr); /* 2 columns on larger laptops */
        grid-auto-rows: minmax(auto, auto);
    }

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        grid-template-columns: 1fr; /* Single column on tablet/mobile */
    }
`;

export const MetricCardsContainer = styled.div`
    grid-column: 1 / -1; /* Spans full width of the grid */
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); /* Auto-fit responsive metric cards */
    gap: ${(props) => getTheme(props).spacing(6)};

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        grid-template-columns: 1fr; /* Single column on mobile */
    }
`;

export const DashboardChartSection = styled.div`
    grid-column: 1 / span 3; /* Chart takes 3/4 width on desktop */
    min-height: 400px; /* Ensure chart has space */

    @media (max-width: ${(props) => getTheme(props).breakpoints.laptopL}) {
        grid-column: 1 / -1; /* Takes full width on smaller laptops */
        min-height: 350px;
    }
`;

export const DashboardRecentActivitySection = styled.div`
    grid-column: 4 / 5; /* Activity list takes 1/4 width on desktop */
    min-height: 400px;

    @media (max-width: ${(props) => getTheme(props).breakpoints.laptopL}) {
        grid-column: 1 / -1; /* Takes full width on smaller laptops */
        min-height: 300px;
    }
`;

export const DashboardQuickInsightsSection = styled.div`
    grid-column: 1 / -1; /* Spans full width, might be below everything else */
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: ${(props) => getTheme(props).spacing(6)};
    margin-top: ${(props) => getTheme(props).spacing(8)}; /* Space above this section */
`;