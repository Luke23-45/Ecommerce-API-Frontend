import styled, { css } from 'styled-components';
import { rgba } from 'polished'; // For transparent colors if needed

export const MetricCardContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.adminSurface}; // Typically white
  border-radius: ${({ theme }) => theme.borderRadius.large}; // Generous rounding (was medium, using large for more visualboard feel)
  padding: ${({ theme }) => theme.spacing(6)}; // e.g., 24px
  box-shadow: ${({ theme }) => theme.shadows.md}; // Soft, diffused shadow
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)}; // Space between elements inside the card (e.g., 8px)
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    transform: translateY(-4px); // Subtle lift on hover
    box-shadow: ${({ theme }) => theme.shadows.lg}; // Slightly more pronounced shadow on hover
  }
`;

export const MetricCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; // If you have an icon/action on the right of the title
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const MetricTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.admin.fontFamily};
  font-size: ${({ theme }) => theme.typography.admin.sizes.bodyBase}; // e.g., 0.875rem / 14px
  font-weight: ${({ theme }) => theme.typography.admin.weights.medium}; // Was semiBold, making it slightly less prominent than value
  color: ${({ theme }) => theme.colors.adminTextSecondary}; // Muted color for the title
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
  text-transform: uppercase; // Common for metric card titles
  letter-spacing: ${({ theme }) => theme.typography.letterSpacings.wide}; // Slight spacing
`;

// Optional: If you want an icon next to the title or as a card action
export const MetricIconWrapper = styled.div`
  color: ${({ theme }) => theme.colors.adminTextMuted};
  font-size: 1.2rem; // Adjust as needed
  // Add styling if it's an action button (padding, hover)
`;

export const MetricValue = styled.p`
  font-family: ${({ theme }) => theme.typography.admin.fontFamily};
  font-size: ${({ theme }) => theme.typography.admin.sizes.metricValue}; // e.g., 2.25rem / 36px (Very prominent)
  font-weight: ${({ theme }) => theme.typography.admin.weights.bold}; // Or extraBold for more impact
  color: ${({ theme }) => theme.colors.adminText}; // Primary text color
  margin: ${({ theme }) => theme.spacing(1)} 0; // Minimal vertical margin
  line-height: ${({ theme }) => theme.typography.lineHeights.condensed};
`;

export const MetricTrend = styled.div<{ trendDirection?: 'up' | 'down' | 'stable' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1.5)}; // e.g., 6px
  font-family: ${({ theme }) => theme.typography.admin.fontFamily};
  font-size: ${({ theme }) => theme.typography.admin.sizes.smallText}; // e.g., 0.8125rem / 13px
  margin-top: ${({ theme }) => theme.spacing(1)};

  svg { // Styling for the trend icon (up/down arrow)
    font-size: 0.9em; // Relative to the trend text font size
    color: ${({ theme, trendDirection }) =>
      trendDirection === 'up' ? theme.colors.adminStatusSuccess :
      trendDirection === 'down' ? theme.colors.adminStatusError :
      theme.colors.adminTextMuted};
  }
`;

export const TrendPercentage = styled.span<{ trendDirection?: 'up' | 'down' | 'stable' }>`
  font-weight: ${({ theme }) => theme.typography.admin.weights.semiBold};
  color: ${({ theme, trendDirection }) =>
    trendDirection === 'up' ? theme.colors.adminStatusSuccess :
    trendDirection === 'down' ? theme.colors.adminStatusError :
    theme.colors.adminTextMuted};
`;

export const TrendPeriod = styled.span`
  color: ${({ theme }) => theme.colors.adminTextSecondary};
  margin-left: ${({ theme }) => theme.spacing(0.5)}; // Small space before the period text
`;

// Optional: If you have a small descriptive sub-text below the trend
export const MetricSubText = styled.p`
  font-family: ${({ theme }) => theme.typography.admin.fontFamily};
  font-size: ${({ theme }) => theme.typography.admin.sizes.xsmallText}; // e.g., 0.75rem / 12px
  color: ${({ theme }) => theme.colors.adminTextMuted};
  margin: 0;
  margin-top: ${({ theme }) => theme.spacing(2)};
  line-height: ${({ theme }) => theme.typography.lineHeights.base};
`;