import React from 'react';
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa'; // Example trend icons

// Import our new styled components
import {
  MetricCardContainer,
  MetricCardHeader, // If used for title + optional action icon
  MetricTitle,
  // MetricIconWrapper, // Optional, if you add a top-right icon to the card
  MetricValue,
  MetricTrend,
  TrendPercentage,
  TrendPeriod,
  MetricSubText,    // Optional
} from './MetricCard.styles';

interface MetricCardProps {
  title: string;
  value: string | number; // e.g., "$125,890" or 456
  trendPercentage?: number; // e.g., 12.5 for +12.5%, -3.1 for -3.1%
  trendPeriod?: string; // e.g., "since last month"
  onClick?: () => void; // Action when card is clicked
  subText?: string; // Optional additional text at the bottom
  // type?: 'sales' | 'orders' | 'customers' | 'products'; // Original 'type' prop - can be used for more specific icons if needed
                                                          // For now, focusing on trend direction for styling
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  trendPercentage,
  trendPeriod,
  onClick,
  subText,
  // type, // Not directly used in this visual redesign, but can be reintroduced
}) => {
  let trendDirection: 'up' | 'down' | 'stable' = 'stable';
  let TrendIconComponent: React.ElementType | null = FaMinus; // Default to stable

  if (trendPercentage !== undefined && trendPercentage !== null) {
    if (trendPercentage > 0) {
      trendDirection = 'up';
      TrendIconComponent = FaArrowUp;
    } else if (trendPercentage < 0) {
      trendDirection = 'down';
      TrendIconComponent = FaArrowDown;
    } else { // trendPercentage is 0
      trendDirection = 'stable';
      TrendIconComponent = FaMinus; // Or no icon for stable, or a different one like FaEquals
    }
  } else {
    // If trendPercentage is not provided, treat as stable or hide trend section
    TrendIconComponent = null; // Or FaMinus if you always want something
  }

  // Format trend percentage to always show sign for up/down, and handle stable
  const formattedTrendPercentage = () => {
    if (trendPercentage === undefined || trendPercentage === null) return null;
    if (trendDirection === 'stable' && trendPercentage === 0) return `0%`; // Or 'Stable' or similar text
    return `${trendPercentage > 0 ? '+' : ''}${trendPercentage.toFixed(1)}%`;
  };

  return (
    <MetricCardContainer onClick={onClick} style={onClick ? { cursor: 'pointer' } : {}}>
      <MetricCardHeader>
        <MetricTitle>{title}</MetricTitle>
        {/* Optional: If you wanted an icon on the right of title (like a settings cog for the card)
            <MetricIconWrapper> <FaCog /> </MetricIconWrapper>
        */}
      </MetricCardHeader>

      <MetricValue>{value}</MetricValue>

      {(trendPercentage !== undefined && trendPercentage !== null && trendPeriod) && ( // Only show trend if data is available
        <MetricTrend trendDirection={trendDirection}>
          {TrendIconComponent && <TrendIconComponent />}
          {formattedTrendPercentage() && (
            <TrendPercentage trendDirection={trendDirection}>
              {formattedTrendPercentage()}
            </TrendPercentage>
          )}
          {trendPeriod && <TrendPeriod>{trendPeriod}</TrendPeriod>}
        </MetricTrend>
      )}

      {subText && <MetricSubText>{subText}</MetricSubText>}
    </MetricCardContainer>
  );
};

export default MetricCard;