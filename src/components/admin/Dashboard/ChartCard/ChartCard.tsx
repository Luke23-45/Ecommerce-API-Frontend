// src/components/Admin/Dashboard/ChartCard/ChartCard.tsx
import React, { useState } from 'react';
import {
  ChartCardContainer,
  ChartHeader,
  ChartTitle,
  ChartPeriodSelect,
  ChartContent,
} from './ChartCard.styles';

interface ChartCardProps {
  title: string;
  chartType: string; // e.g., 'line', 'bar', 'pie'
  // In a real app, you'd pass data and potentially render actual chart libraries here.
  // For now, it's a placeholder.
}

const ChartCard: React.FC<ChartCardProps> = ({ title, chartType }) => {
  const [period, setPeriod] = useState('monthly'); // Example: 'monthly', 'weekly', 'yearly'

  return (
    <ChartCardContainer>
      <ChartHeader>
        <ChartTitle>{title}</ChartTitle>
        <ChartPeriodSelect value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </ChartPeriodSelect>
      </ChartHeader>
      <ChartContent>
        {/* Placeholder for your {chartType} chart data here */}
        <p>[{chartType} Chart Data for {period}]</p>
      </ChartContent>
    </ChartCardContainer>
  );
};

export default ChartCard;