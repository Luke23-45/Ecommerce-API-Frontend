// src/components/Admin/Dashboard/SuperAdminDashboard.tsx
import React from 'react';
import { FaStore, FaChartPie, FaPercent, FaHeadset,FaCog } from 'react-icons/fa'; // Icons for platform insights
import {
  DashboardGrid,
  MetricCardsContainer,
  DashboardChartSection,
  DashboardRecentActivitySection,
  DashboardQuickInsightsSection,
} from './Dashboard.styles'; // Styles are reusable

import MetricCard from './MetricCard/MetricCard';
import ChartCard from './ChartCard/ChartCard';
import RecentActivity from './RecentActivity/RecentActivity';
import DashboardCard from './DashboardCard/DashboardCard'; // Reusable generic dashboard card
import { AdminButton } from './Common/Common.styles';
import { rgba } from 'polished'; // For status background colors

// Dummy data specific to a SUPER ADMIN (Platform-wide metrics)
const dummySuperAdminMetrics = {
    platformGrossSales: '$1,850,000',
    totalUsers: '5,000', // All sellers, vendors, customers
    liveProducts: '12,500', // Across all vendors/sellers
    activeVendors: '120',
    salesTrend: 22.8,
    userTrend: 15.5,
    productTrend: 10.2,
    vendorTrend: 8.0,
};

const dummySuperAdminActivity = [
    { id: 'sa1', name: 'New Vendor (Global Goods)', type: 'Account Created', date: 'Just now', value: null, status: null },
    { id: 'sa2', name: 'Product Update (All Products)', type: 'Global Inventory Sync', date: '10 mins ago', value: '1.2M updates', status: null },
    { id: 'sa3', name: 'Platform Sales Review', type: 'Report Generated', date: '30 mins ago', value: '$1.8M', status: null },
    { id: 'sa4', name: 'User Login (Super Admin)', type: 'Security Alert', date: '1 hr ago', value: null, status: null }, // Example: Security alert
    { id: 'sa5', name: 'System Maintenance', type: 'Scheduled', date: 'Tomorrow', value: 'Server downtime', status: null },
];

const dummyPlatformIssues = [
    { type: 'High', description: 'Payment gateway API error spikes', status: 'critical', link: '#issues-payment' },
    { type: 'Medium', description: 'Vendor payout discrepancy (ID: V123)', status: 'warning', link: '#issues-payout' },
    { type: 'Low', description: 'Customer feedback: slow image loads', status: 'info', link: '#issues-images' },
];

const dummyCustomerSupportQueue = [
    { id: 'cs1', customer: 'Jane Doe', issue: 'Order tracking inquiry', status: 'Open', link: '#support-jane' },
    { id: 'cs2', customer: 'John Smith', issue: 'Product refund request', status: 'Pending', link: '#support-john' },
];

const SuperAdminDashboard: React.FC = () => {
  return (
    <DashboardGrid>
      <MetricCardsContainer>
        <MetricCard
          title="Platform Gross Sales"
          value={dummySuperAdminMetrics.platformGrossSales}
          type="sales"
          trendPercentage={dummySuperAdminMetrics.salesTrend}
          trendPeriod="since last quarter"
          onClick={() => console.log('SuperAdmin: View Global Sales Report')}
        />
        <MetricCard
          title="Total Registered Users"
          value={dummySuperAdminMetrics.totalUsers}
          type="customers"
          trendPercentage={dummySuperAdminMetrics.userTrend}
          trendPeriod="since last year"
          onClick={() => console.log('SuperAdmin: View All Users')}
        />
        <MetricCard
          title="Total Live Products"
          value={dummySuperAdminMetrics.liveProducts}
          type="products"
          trendPercentage={dummySuperAdminMetrics.productTrend}
          trendPeriod="across all vendors"
          onClick={() => console.log('SuperAdmin: Manage All Products')}
        />
        <MetricCard
          title="Active Vendor Stores"
          value={dummySuperAdminMetrics.activeVendors}
          type="store" // Reusing 'store' icon for vendor stores
          trendPercentage={dummySuperAdminMetrics.vendorTrend}
          trendPeriod="new registrations"
          onClick={() => console.log('SuperAdmin: Manage Vendors')}
        />
      </MetricCardsContainer>

      <DashboardChartSection>
        <ChartCard title="Global Sales Trend" chartType="line" />
      </DashboardChartSection>

      <DashboardRecentActivitySection>
        <RecentActivity title="Platform Activity Log" activities={dummySuperAdminActivity} />
      </DashboardRecentActivitySection>
      
      {/* Super Admin-Specific Quick Insights/Management Areas */}
      <DashboardQuickInsightsSection>
         <DashboardCard title="Key Performance Indicators (KPIs)">
             {/* Could display overall commission rates, payment gateway health, etc. */}
             <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.95rem', color: '#333' }}>
                 <li style={{ padding: '8px 0', borderBottom: '1px dashed #EEE', display: 'flex', justifyContent: 'space-between' }}>
                     <span>Commission Rate:</span><span style={{ fontWeight: 600 }}>10%</span>
                 </li>
                 <li style={{ padding: '8px 0', borderBottom: '1px dashed #EEE', display: 'flex', justifyContent: 'space-between' }}>
                     <span>Customer Retention:</span><span style={{ fontWeight: 600 }}>65%</span>
                 </li>
                 <li style={{ padding: '8px 0', display: 'flex', justifyContent: 'space-between' }}>
                     <span>Average Order Value:</span><span style={{ fontWeight: 600 }}>$150</span>
                 </li>
             </ul>
             <AdminButton $variant="secondary" style={{ marginTop: '20px' }} onClick={() => console.log('SuperAdmin: View All Platform Metrics')}>
                 <FaChartPie /> View Platform Metrics
             </AdminButton>
         </DashboardCard>
         
         <DashboardCard title="Active System Alerts & Issues">
             <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                 {dummyPlatformIssues.length > 0 ? (
                     dummyPlatformIssues.map(issue => (
                         <li key={issue.description} style={{ padding: '8px 0', borderBottom: '1px dashed #EEE', fontSize: '0.95rem' }}>
                             <span style={{
                                 fontWeight: 600,
                                 color: issue.status === 'critical' ? 'red' : issue.status === 'warning' ? 'orange' : '#999',
                                 marginRight: '8px'
                             }}>{issue.type}:</span>
                             <a href={issue.link} style={{ color: '#333', textDecoration: 'none' }}>{issue.description}</a>
                             <span style={{
                                 display: 'inline-block',
                                 padding: '3px 8px',
                                 borderRadius: '4px',
                                 fontSize: '0.7rem',
                                 fontWeight: 'bold',
                                 marginLeft: '10px',
                                 backgroundColor: issue.status === 'critical' ? rgba('red', 0.1) : issue.status === 'warning' ? rgba('orange', 0.1) : rgba('#999', 0.1),
                                 color: issue.status === 'critical' ? 'red' : issue.status === 'warning' ? 'orange' : '#999',
                             }}>{issue.status?.toUpperCase()}</span>
                         </li>
                     ))
                 ) : (
                     <li style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No active issues.</li>
                 )}
             </ul>
  <AdminButton
  $variant="danger"
  onClick={() => console.log('SuperAdmin: Manage All Alerts')}
  style={{ marginTop: 20 }}
>
  <FaCog />
  Manage Alerts
</AdminButton>
             <AdminButton $variant="secondary" style={{ marginTop: '10px' }} onClick={() => console.log('SuperAdmin: System Logs')}>
                 View System Logs
             </AdminButton>
         </DashboardCard>

         <DashboardCard title="Customer Support Queue">
             <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.95rem' }}>
                 {dummyCustomerSupportQueue.length > 0 ? (
                     dummyCustomerSupportQueue.map(ticket => (
                         <li key={ticket.id} style={{ padding: '8px 0', borderBottom: '1px dashed #EEE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                             <div>
                                 <strong>{ticket.customer}:</strong> {ticket.issue}
                             </div>
                             <span style={{
                                 display: 'inline-block',
                                 padding: '3px 8px',
                                 borderRadius: '4px',
                                 fontSize: '0.75rem',
                                 fontWeight: 'bold',
                                 backgroundColor: ticket.status === 'Open' ? rgba('red', 0.1) : rgba('orange', 0.1), // Simplified for demo
                                 color: ticket.status === 'Open' ? 'red' : 'orange',
                             }}>{ticket.status?.toUpperCase()}</span>
                         </li>
                     ))
                 ) : (
                     <li style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No pending tickets.</li>
                 )}
             </ul>
             <AdminButton $variant="primary" style={{ marginTop: '20px' }} onClick={() => console.log('SuperAdmin: Go to Support Tickets')}>
                 <FaHeadset /> View Support Tickets
             </AdminButton>
             <AdminButton $variant="secondary" style={{ marginTop: '10px' }} onClick={() => console.log('SuperAdmin: FAQ Management')}>
                 Manage FAQs
             </AdminButton>
         </DashboardCard>
      </DashboardQuickInsightsSection>

    </DashboardGrid>
  );
};

export default SuperAdminDashboard;