// src/components/Admin/Dashboard/ChartCard/ChartCard.tsx
import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  // Import other chart types if needed: BarChart, PieChart, AreaChart etc.
} from 'recharts';
import { useTheme } from 'styled-components'; // To access theme colors for chart

// Import our styled components
import {
  ChartCardContainer,
  ChartHeader,
  ChartTitle,
  ChartControls,
  StyledSelect, // If you use a custom styled select
  ChartWrapper,
  NoDataMessage,
} from './ChartCard.styles';

interface ChartCardProps {
  title: string;
  chartType: 'line' | 'bar' | 'area'; // Extend as needed
  // Data structure will depend on your API and chart type
  // Example for a simple line chart: data = [{ name: 'Jan', uv: 400, pv: 2400, amt: 2400 }, ...]
  data?: Array<Record<string, any>>;
  // For more complex data handling or fetching, you might pass a loading state
  isLoading?: boolean;
  // If you have time period filters
  availablePeriods?: string[]; // e.g., ['Daily', 'Weekly', 'Monthly', 'Yearly']
  defaultPeriod?: string;
  onPeriodChange?: (period: string) => void;
}

// Example dummy data for line chart
const generateDummyChartData = (period: string) => {
  let count = 12; // Monthly
  if (period === 'Weekly') count = 52;
  if (period === 'Daily') count = 30;

  return Array.from({ length: count }, (_, i) => ({
    name: period === 'Monthly' ? new Date(0, i).toLocaleString('default', { month: 'short' }) : `W${i + 1}`,
    Sales: Math.floor(Math.random() * 3000) + 1000,
    Profit: Math.floor(Math.random() * 2000) + 500,
  }));
};

const CustomTooltip = ({ active, payload, label }: any) => {
  const theme = useTheme();
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: theme.colors.adminSurface,
        padding: theme.spacing(2.5), // 10px
        border: `1px solid ${theme.colors.adminBorder}`,
        borderRadius: theme.borderRadius.medium,
        boxShadow: theme.shadows.md,
      }}>
        <p style={{
          margin: 0,
          marginBottom: theme.spacing(1),
          color: theme.colors.adminTextSecondary,
          fontSize: theme.typography.admin.sizes.smallText
        }}>{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{
            margin: `2px 0`,
            color: entry.color || theme.colors.adminText, // Use line color or default
            fontSize: theme.typography.admin.sizes.bodyBase,
            fontWeight: theme.typography.admin.weights.medium,
          }}>
            {`${entry.name}: ${entry.value.toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};


const ChartCard: React.FC<ChartCardProps> = ({
  title,
  chartType, // We'll focus on 'line' for this example
  data: propData,
  isLoading = false,
  availablePeriods = ['Monthly', 'Weekly', 'Yearly'], // Default periods
  defaultPeriod = 'Monthly',
  onPeriodChange,
}) => {
  const theme = useTheme(); // Access theme for styling chart elements
  const [currentPeriod, setCurrentPeriod] = useState(defaultPeriod);
  const [chartData, setChartData] = useState<Array<Record<string, any>> | undefined>(propData);

  useEffect(() => {
    // If propData is provided, use it. Otherwise, generate dummy data.
    // In a real app, you'd fetch data based on currentPeriod here or if propData changes.
    if (propData) {
      setChartData(propData);
    } else {
      // Simulate data fetching or use dummy data if propData isn't passed
      console.log(`[ChartCard] Generating dummy data for period: ${currentPeriod}`);
      setChartData(generateDummyChartData(currentPeriod));
    }
  }, [currentPeriod, propData]);

  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPeriod = event.target.value;
    setCurrentPeriod(newPeriod);
    if (onPeriodChange) {
      onPeriodChange(newPeriod);
    }
    // If not using propData, refetch/regenerate dummy data:
    if (!propData) {
        setChartData(generateDummyChartData(newPeriod));
    }
  };

  const renderChart = () => {
    if (isLoading) {
      return <NoDataMessage>Loading chart data...</NoDataMessage>; // Replace with a skeleton loader later
    }
    if (!chartData || chartData.length === 0) {
      return <NoDataMessage>No data available for the selected period.</NoDataMessage>;
    }

    // Define Recharts elements based on chartType (focusing on line for now)
    if (chartType === 'line') {
      const lines = Object.keys(chartData[0] || {}).filter(key => key !== 'name'); // Get data keys dynamically

      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}> {/* Adjusted margins */}
            <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.adminBorder} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: theme.typography.admin.sizes.xsmallText, fill: theme.colors.adminTextMuted }}
              axisLine={{ stroke: theme.colors.adminBorder }}
              tickLine={{ stroke: theme.colors.adminBorder }}
              dy={5} // Offset ticks down slightly
            />
            <YAxis
              tickFormatter={(value) => typeof value === 'number' ? value.toLocaleString() : value} // Format Y-axis numbers
              tick={{ fontSize: theme.typography.admin.sizes.xsmallText, fill: theme.colors.adminTextMuted }}
              axisLine={{ stroke: theme.colors.adminBorder }}
              tickLine={{ stroke: theme.colors.adminBorder }}
              dx={-5} // Offset ticks left slightly
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: theme.colors.adminAccent, strokeWidth: 1, strokeDasharray: '3 3' }} />
            <Legend
                wrapperStyle={{ fontSize: theme.typography.admin.sizes.smallText, paddingTop: theme.spacing(4)}}
                iconType="circle"
                iconSize={8}
            />
            {/* Dynamically create lines based on data keys, assign colors from theme */}
            {lines.map((key, index) => (
                <Line
                    key={key}
                    type="monotone" // "linear" or "natural" or "step"
                    dataKey={key}
                    // Assign colors from your theme's dataVis palette
                    stroke={theme.colors[`dataVis${['Green', 'Blue', 'Orange', 'Purple', 'Pink'][index % 5]}` as keyof DefaultTheme['colors']] || theme.colors.adminAccent}
                    strokeWidth={2.5}
                    dot={{ r: 4, strokeWidth: 2, fill: theme.colors.adminSurface }}
                    activeDot={{ r: 6, stroke: theme.colors.adminSurface, strokeWidth: 2, fill: theme.colors[`dataVis${['Green', 'Blue', 'Orange', 'Purple', 'Pink'][index % 5]}` as keyof DefaultTheme['colors']] || theme.colors.adminAccent }}
                />
            ))}
            {/* Example specific lines:
            <Line type="monotone" dataKey="Sales" stroke={theme.colors.adminAccent} strokeWidth={2} dot={{r:3}} activeDot={{r:5}} />
            <Line type="monotone" dataKey="Profit" stroke={theme.colors.dataVisGreen} strokeWidth={2} dot={{r:3}} activeDot={{r:5}} />
            */}
          </LineChart>
        </ResponsiveContainer>
      );
    }
    // Add else if for 'bar', 'area' etc.
    return <NoDataMessage>Chart type "{chartType}" not yet implemented.</NoDataMessage>;
  };

  return (
    <ChartCardContainer>
      <ChartHeader>
        <ChartTitle>{title}</ChartTitle>
        {availablePeriods && availablePeriods.length > 0 && (
          <ChartControls>
            <StyledSelect value={currentPeriod} onChange={handlePeriodChange}>
              {availablePeriods.map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </StyledSelect>
          </ChartControls>
        )}
      </ChartHeader>
      <ChartWrapper>
        {renderChart()}
      </ChartWrapper>
    </ChartCardContainer>
  );
};

export default ChartCard;