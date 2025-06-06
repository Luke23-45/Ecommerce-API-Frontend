import styled, { type DefaultTheme, keyframes } from 'styled-components';
import { rgba } from 'polished'; // You might not need rgba directly if theme handles opacity

// Keep your fadeIn animation - it's a nice touch!
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); } // Slightly less translateY
  to { opacity: 1; transform: translateY(0); }
`;

// --- Main Dashboard Grid Container ---
export const DashboardGrid = styled.div`
  display: grid;
  // For a layout similar to Visualboard, we might have a hero + 2-column, or more flexible widget area
  // Let's try a more adaptive grid. The actual number of columns a section spans will be defined on the section itself.
  grid-template-columns: repeat(12, 1fr); // A 12-column grid offers great flexibility
  gap: ${({ theme }) => theme.spacing(8)}; // Generous gap like Visualboard (e.g., 32px)
  padding-top: ${({ theme }) => theme.spacing(2)}; // Space below the header
  background-color: ${({ theme }) => theme.colors.adminPrimaryBg}; // The very light page background

  // Animation (Good to keep)
  opacity: 0;
  animation: ${fadeIn} 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; // Smoother ease
  animation-delay: 0.1s;
`;

// --- Hero/Welcome Section (Inspired by Visualboard's "Here's happening...") ---
export const DashboardHeroSection = styled.section`
  grid-column: 1 / -1; // Spans all 12 columns
  background-color: ${({ theme }) => theme.colors.adminSurface}; // White surface
  // Or could use a subtle gradient from your theme if desired:
  // background-image: ${({ theme }) => theme.colors.gradients?.accent1ToVibrant}; // Example
  border-radius: ${({ theme }) => theme.borderRadius.large}; // e.g., 16px
  padding: ${({ theme }) => theme.spacing(8)} ${({ theme }) => theme.spacing(10)}; // Generous padding
  box-shadow: ${({ theme }) => theme.shadows.lg}; // Slightly more elevated than cards
  margin-bottom: ${({ theme }) => theme.spacing(4)}; // Space below hero
  display: flex; // For content layout within hero (e.g., text on left, illustration on right)
  align-items: center;
  justify-content: space-between; // If you have text and an image side-by-side

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    text-align: center;
    padding: ${({ theme }) => theme.spacing(6)};
  }
`;

// --- Metric Cards Container ---
export const MetricCardsContainer = styled.div`
  grid-column: 1 / -1; // Spans all 12 columns for the row of metric cards
  display: grid;
  // Using auto-fit for responsiveness as you had, but ensure minmax aligns with card design
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); // Adjust minmax as needed
  gap: ${({ theme }) => theme.spacing(6)}; // Gap between metric cards

  // Individual metric cards themselves will get their styling from MetricCard.styles.ts
`;

// --- Main Chart Section ---
// This will contain a ChartCard component (which itself is styled)
export const DashboardChartSection = styled.section`
  // Example: Spans 8 of 12 columns for a main chart area (Visualboard has a large chart)
  grid-column: span 8;
  // If you want a 2/3 width like your old layout:
  // grid-column: 1 / span 8; (on a 12-col grid) or 1 / span 2 (on a 3-col conceptual grid)

  // Individual ChartCards inside this will have their own styling (bg, shadow, radius)
  // This section is more about placement in the main DashboardGrid.
  min-height: 380px; // Ensure space

  @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) { // Wider breakpoint than laptopL
    grid-column: 1 / -1; // Full width on smaller laptops and tablets
    min-height: 320px;
  }
`;

// --- Sidebar-like Section (e.g., Recent Activity, Top Categories like Visualboard) ---
export const DashboardSidebarSection = styled.aside`
  // Example: Spans 4 of 12 columns (the remaining space next to the chart)
  grid-column: span 4;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)}; // Space between cards within this sidebar section
  min-height: 380px;


  @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) {
    grid-column: 1 / -1; // Full width on smaller laptops and tablets, stacked below chart
    min-height: auto;
    margin-top: ${({ theme }) => theme.spacing(6)}; // Add space when it stacks
  }
`;

// --- General Purpose Card Wrapper for other sections (like Top Selling Products) ---
// This could be your existing DashboardCard styles, adapted to the new theme.
// Or a new, more specific styling for content cards.
// For now, let's assume your `DashboardCard` uses `adminSurface`, `borderRadius.large`, `shadows.md`.
export const DashboardContentCard = styled.div`
  background-color: ${({ theme }) => theme.colors.adminSurface};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing(6)};
  box-shadow: ${({ theme }) => theme.shadows.md};
  // This is a generic card, its placement in the grid will be ad-hoc
  // e.g., <DashboardContentCard style={{ gridColumn: 'span 6' }}>...</DashboardContentCard>
`;


// --- Grid for "Quick Insights" or bottom row of cards (like your old one) ---
// Renamed from DashboardQuickInsightsSection to be more generic for bottom sections
export const DashboardBottomWidgetsContainer = styled.section`
  grid-column: 1 / -1; // Spans all 12 columns for a new row of content
  display: grid;
  // Example: 3 columns for "Top Selling", "Events", etc.
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing(6)};
  margin-top: ${({ theme }) => theme.spacing(4)}; // Space above this section

  // Cards within this will be instances of DashboardContentCard or specialized cards
`;

// --- Removing your old DashboardRecentActivitySection and DashboardQuickInsightsSection ---
// We're replacing them with the more flexible DashboardSidebarSection for the right column,
// and DashboardBottomWidgetsContainer for a full-width row of content cards at the bottom.
// The specific components (RecentActivity, TopSellingProductsCard, etc.) will be placed
// into DashboardSidebarSection or DashboardBottomWidgetsContainer as needed.

// For example, Dashboard.styles.ts might NOT define specific areas like "RecentActivity"
// but rather general layout containers (like DashboardGrid, DashboardChartSection, DashboardSidebarSection)
// and general card styles (like DashboardContentCard).
// The dashboard page itself (e.g., SellerDashboard.tsx) then places specific components
// (MetricCard, ChartCard, RecentActivityComponent, TopProductsComponent) into these layout areas.

// Helper for animating individual cards if desired, can be applied to MetricCardContainer > div etc.
export const AnimatedCardItem = styled.div`
  opacity: 0;
  transform: translateY(10px);
  animation: ${fadeIn} 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  // animation-delay can be staggered in the component using style prop or nth-child
`;