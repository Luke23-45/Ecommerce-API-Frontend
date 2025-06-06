import styled from 'styled-components';
import { rgba } from 'polished';
export const ChartCardContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.adminSurface}; // White
  border-radius: ${({ theme }) => theme.borderRadius.large};    // e.g., 16px
  padding: ${({ theme }) => theme.spacing(6)};                  // e.g., 24px
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  flex-direction: column;
  height: 100%; // Allow it to fill the grid cell height
`;

export const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing(5)}; // e.g., 20px
`;

export const ChartTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.admin.fontFamily};
  font-size: ${({ theme }) => theme.typography.admin.sizes.moduleTitle}; // e.g., "My Sales Overview" (was sectionHeader)
  font-weight: ${({ theme }) => theme.typography.admin.weights.semiBold};
  color: ${({ theme }) => theme.colors.adminText};
  margin: 0;
`;

export const ChartControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
`;

// Example for a styled dropdown/select if you have one
// If using a library select, you'll style it via its props or global overrides
export const StyledSelect = styled.select`
  font-family: ${({ theme }) => theme.typography.admin.fontFamily};
  font-size: ${({ theme }) => theme.typography.admin.sizes.bodyBase};
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border: 1px solid ${({ theme }) => theme.colors.adminBorder};
  background-color: ${({ theme }) => theme.colors.adminSurface};
  color: ${({ theme }) => theme.colors.adminTextSecondary};
  min-width: 120px; // Adjust as needed
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.adminAccent};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.adminAccentSubtleBg};
  }
`;

export const ChartWrapper = styled.div`
  flex-grow: 1; // Make the chart itself take available vertical space
  width: 100%;
  min-height: 250px; // Minimum height for the chart drawing area

  // Recharts often needs specific dimensions on its ResponsiveContainer
  // or direct chart component. This wrapper helps manage that.
  .recharts-responsive-container {
    width: 100% !important;
    height: 100% !important;
  }
`;

export const NoDataMessage = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 200px; /* Match ChartWrapper min-height roughly */
    color: ${({ theme }) => theme.colors.adminTextMuted};
    font-size: ${({ theme }) => theme.typography.admin.sizes.bodyBase};
    border: 1px dashed ${({ theme }) => theme.colors.adminBorder};
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    background-color: ${({ theme }) => rgba(theme.colors.adminPrimaryBg, 0.5)};
`;