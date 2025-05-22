// src/components/Admin/Reports/ReportsOverview.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTheme } from 'styled-components'; 
import { FaDownload, FaChartLine, FaChartBar, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';
import { FaChartPie } from 'react-icons/fa';
import {
  ReportsOverviewContainer,
  ReportsHeader,
  HeaderTitle,
  ActionButtonsGroup,
  ReportGrid,
  ChartFiltersContainer,
  FilterLabel,
  FilterGroup,
  DateRangeInput,
} from './ReportsOverview.styles';


import { AdminButton } from '../Dashboard/Common/Common.styles';
import AdminSelect from '../common/AdminSelect/AdminSelect';
import MetricCard from '../Dashboard/MetricCard/MetricCard'; // Re-use MetricCard
import ChartCard from '../Dashboard/ChartCard/ChartCard'; // Re-use ChartCard


const ReportsOverview: React.FC = () => {
    // Dummy filter states
    const [dateRange, setDateRange] = useState('last_30_days');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportType, setReportType] = useState('sales'); // 'sales', 'product', 'customer'
    const [groupBy, setGroupBy] = useState('day'); // 'day', 'week', 'month', 'category'
     const theme = useTheme();

    // Dummy data for report metrics (these would be fetched based on filters)
    const dummyReportMetrics = useMemo(() => ({
        totalRevenue: { value: '$1.5M', trend: 15.2, period: 'last 30 days', type: 'sales' },
        avgOrderValue: { value: '$145.20', trend: 3.1, period: 'last 30 days', type: 'sales' },
        newCustomers: { value: '850', trend: 20.0, period: 'last 30 days', type: 'customers' },
        productViews: { value: '250K', trend: 10.5, period: 'last 30 days', type: 'products' },
    }), [dateRange, reportType]); // Re-calculate when filters change

    // Generate dummy date ranges for inputs if custom
    useEffect(() => {
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);
    }, []);

    // Handlers
    const handleDateRangeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setDateRange(e.target.value);
        if (e.target.value !== 'custom') {
            const today = new Date();
            const newStartDate = new Date(today);
            if (e.target.value === 'last_7_days') newStartDate.setDate(today.getDate() - 7);
            else if (e.target.value === 'last_30_days') newStartDate.setDate(today.getDate() - 30);
            else if (e.target.value === 'last_90_days') newStartDate.setDate(today.getDate() - 90);
            else if (e.target.value === 'this_month') { newStartDate.setDate(1); } // Start of month
            setStartDate(newStartDate.toISOString().split('T')[0]);
            setEndDate(today.toISOString().split('T')[0]);
        }
    }, []);

    const handleExport = useCallback((format: 'csv' | 'pdf') => {
        console.log(`Exporting ${reportType} report for ${dateRange} as ${format}`);
        alert(`Export initiated for ${reportType} report as ${format}!`);
    }, [dateRange, reportType]);

    // Dummy Chart titles based on report type
    const getChartTitle = useCallback((baseTitle: string) => {
        return `${baseTitle} (${dateRange.replace(/_/g, ' ')})`;
    }, [dateRange]);

    return (
        <ReportsOverviewContainer>
            {/* Header with quick actions */}
            <ReportsHeader>
                <HeaderTitle>Reports Overview</HeaderTitle>
                <ActionButtonsGroup>
                    <AdminButton $variant="secondary" onClick={() => handleExport('csv')}>
                        <FaDownload /> Export CSV
                    </AdminButton>
                    <AdminButton $variant="secondary" onClick={() => handleExport('pdf')}>
                        <FaDownload /> Export PDF
                    </AdminButton>
                </ActionButtonsGroup>
            </ReportsHeader>

            {/* Filters Section */}
            <ChartFiltersContainer>
                <FilterGroup>
                    <FilterLabel htmlFor="reportType">Report Type:</FilterLabel>
                    <AdminSelect 
                        id="reportType" 
                        value={reportType} 
                        onChange={(e) => setReportType(e.target.value)}
                        options={[
                            { value: 'sales', label: 'Sales Report' },
                            { value: 'product', label: 'Product Performance' },
                            { value: 'customer', label: 'Customer Behavior' },
                        ]}
                        style={{width: '180px'}}
                    />
                </FilterGroup>

                <FilterGroup>
                    <FilterLabel htmlFor="dateRange">Date Range:</FilterLabel>
                    <AdminSelect 
                        id="dateRange" 
                        value={dateRange} 
                        onChange={handleDateRangeChange}
                        options={[
                            { value: 'last_7_days', label: 'Last 7 Days' },
                            { value: 'last_30_days', label: 'Last 30 Days' },
                            { value: 'last_90_days', label: 'Last 90 Days' },
                            { value: 'this_month', label: 'This Month' },
                            { value: 'custom', label: 'Custom Range' },
                        ]}
                        style={{width: '150px'}}
                    />
                </FilterGroup>

                {dateRange === 'custom' && (
                    <FilterGroup>
                        <FilterLabel htmlFor="startDate">From:</FilterLabel>
                        <DateRangeInput type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        <FilterLabel htmlFor="endDate">To:</FilterLabel>
                        <DateRangeInput type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </FilterGroup>
                )}
                
                {reportType !== 'customer' && ( // Group by options usually relevant for sales/product data
                    <FilterGroup>
                        <FilterLabel htmlFor="groupBy">Group By:</FilterLabel>
                        <AdminSelect 
                            id="groupBy" 
                            value={groupBy} 
                            onChange={(e) => setGroupBy(e.target.value)}
                            options={[
                                { value: 'day', label: 'Day' },
                                { value: 'week', label: 'Week' },
                                { value: 'month', label: 'Month' },
                                { value: 'category', label: 'Category' },
                                { value: 'vendor', label: 'Vendor' },
                            ]}
                            style={{width: '120px'}}
                        />
                    </FilterGroup>
                )}
            </ChartFiltersContainer>

            {/* Metrics Section (always visible) */}
            <ReportGrid>
                <MetricCard
                    title="Total Revenue"
                    value={dummyReportMetrics.totalRevenue.value}
                    type="sales" // Reuses sales icon for currency
                    trendPercentage={dummyReportMetrics.totalRevenue.trend}
                    trendPeriod={dummyReportMetrics.totalRevenue.period}
                />
                <MetricCard
                    title="Avg. Order Value"
                    value={dummyReportMetrics.avgOrderValue.value}
                    type="sales"
                    trendPercentage={dummyReportMetrics.avgOrderValue.trend}
                    trendPeriod={dummyReportMetrics.avgOrderValue.period}
                />
                <MetricCard
                    title="New Customers"
                    value={dummyReportMetrics.newCustomers.value}
                    type="customers"
                    trendPercentage={dummyReportMetrics.newCustomers.trend}
                    trendPeriod={dummyReportMetrics.newCustomers.period}
                />
                <MetricCard
                    title="Product Views"
                    value={dummyReportMetrics.productViews.value}
                    type="products"
                    trendPercentage={dummyReportMetrics.productViews.trend}
                    trendPeriod={dummyReportMetrics.productViews.period}
                />
            </ReportGrid>

            {/* Charts Section */}
            <ReportGrid style={{marginTop: theme.spacing(8)}}>
                {reportType === 'sales' && (
                    <>
                        <ChartCard title={getChartTitle("Sales Trend Over Time")} chartType="line" style={{gridColumn: '1 / -1'}} />
                        <ChartCard title={getChartTitle("Sales by Category")} chartType="bar" />
                        <ChartCard title={getChartTitle("Sales by Payment Method")} chartType="pie" />
                    </>
                )}
                {reportType === 'product' && (
                    <>
                        <ChartCard title={getChartTitle("Top Products by Revenue")} chartType="bar" style={{gridColumn: '1 / -1'}} />
                        <ChartCard title={getChartTitle("Product Performance Trend")} chartType="line" />
                        <ChartCard title={getChartTitle("Top Performing Categories")} chartType="pie" />
                    </>
                )}
                {reportType === 'customer' && (
                    <>
                        <ChartCard title={getChartTitle("New Customer Registrations")} chartType="line" style={{gridColumn: '1 / -1'}} />
                        <ChartCard title={getChartTitle("Customer Total Spent Distribution")} chartType="bar" />
                        <ChartCard title={getChartTitle("Customer Loyalty")} chartType="pie" />
                    </>
                )}
            </ReportGrid>
        </ReportsOverviewContainer>
    );
};

export default ReportsOverview;