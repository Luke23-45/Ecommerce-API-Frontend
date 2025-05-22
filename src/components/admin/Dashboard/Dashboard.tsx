// src/components/Admin/Dashboard/Dashboard.tsx
import React from 'react';
import {
  DashboardGrid,
  MetricCardsContainer,
  DashboardChartSection,
  DashboardRecentActivitySection,
  DashboardQuickInsightsSection,
} from './Dashboard.styles';

import MetricCard from './MetricCard/MetricCard';
import ChartCard from './ChartCard/ChartCard';
import RecentActivity from './RecentActivity/RecentActivity';

const Dashboard: React.FC = () => {
  return (
    <DashboardGrid>
      <MetricCardsContainer>
        <MetricCard
          title="Total Sales"
          value="$125,890"
          type="sales"
          trendPercentage={12.5}
          trendPeriod="since last month"
          onClick={() => console.log('Go to Sales Report')}
        />
        <MetricCard
          title="New Orders"
          value="456"
          type="orders"
          trendPercentage={-3.1}
          trendPeriod="since last week"
          onClick={() => console.log('Go to Order List')}
        />
        <MetricCard
          title="Active Customers"
          value="1,280"
          type="customers"
          trendPercentage={8.9}
          trendPeriod="since last quarter"
          onClick={() => console.log('Go to Customer List')}
        />
        <MetricCard
          title="Products in Stock"
          value="2,345"
          type="products"
          trendPercentage={0}
          trendPeriod="stable"
          onClick={() => console.log('Go to Inventory')}
        />
      </MetricCardsContainer>

      <DashboardChartSection>
        <ChartCard title="Sales Overview" chartType="line" />
      </DashboardChartSection>

      <DashboardRecentActivitySection>
        <RecentActivity />
      </DashboardRecentActivitySection>
      
      {/* Optional: Additional dashboard insights or quick actions */}
      <DashboardQuickInsightsSection>
         <ChartCard title="Product Views by Category" chartType="bar" />
         <ChartCard title="Conversion Rate Trend" chartType="line" />
         <ChartCard title="Top Selling Products (last 30 days)" chartType="bar" />
      </DashboardQuickInsightsSection>

    </DashboardGrid>
  );
};

export default Dashboard;