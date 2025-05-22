// src/components/Admin/Dashboard/MetricCard/MetricCard.tsx
import React from 'react';
import { FaDollarSign, FaShoppingCart, FaUsers, FaBox, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';
import {
  MetricCardContainer,
  CardHeader,
  MetricTitle,
  MetricIcon,
  MetricValue,
  MetricFooter,
  Trend,
} from './MetricCard.styles';

// Mapped icons for easy use
const iconMap = {
    sales: FaDollarSign,
    orders: FaShoppingCart,
    customers: FaUsers,
    products: FaBox,
};

// Trend icon map
const trendIconMap = {
    positive: FaArrowUp,
    negative: FaArrowDown,
    neutral: FaMinus,
};

interface MetricCardProps {
  title: string;
  value: string;
  type: 'sales' | 'orders' | 'customers' | 'products';
  trendPercentage?: number; // E.g., 5.2 (for 5.2%)
  trendPeriod?: string; // E.g., 'since last month'
  onClick?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  type,
  trendPercentage,
  trendPeriod,
  onClick,
}) => {
  const IconComponent = iconMap[type];
  const trendType = trendPercentage === undefined
    ? 'neutral'
    : trendPercentage > 0
      ? 'positive'
      : trendPercentage < 0
        ? 'negative'
        : 'neutral';
  const TrendIconComponent = trendIconMap[trendType];

  return (
    <MetricCardContainer onClick={onClick}>
      <CardHeader>
        <MetricTitle>{title}</MetricTitle>
        <MetricIcon as={IconComponent} />
      </CardHeader>
      <MetricValue>{value}</MetricValue>
      <MetricFooter>
        {trendPercentage !== undefined && (
          <Trend $type={trendType}>
            <TrendIconComponent /> {Math.abs(trendPercentage)}%
          </Trend>
        )}
        <span>{trendPeriod || 'compared to last period'}</span>
      </MetricFooter>
    </MetricCardContainer>
  );
};

export default MetricCard;