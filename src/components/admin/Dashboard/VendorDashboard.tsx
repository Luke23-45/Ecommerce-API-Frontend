// src/components/Admin/Dashboard/VendorDashboard.tsx
import React from 'react';
import { FaUsers, FaTasks, FaStore } from 'react-icons/fa'; // Specific icons for vendor insights
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
import DashboardCard from './DashboardCard/DashboardCard'; // Reusable generic dashboard card
import { AdminButton } from './Common/Common.styles';
// Dummy data specific to a VENDOR
const dummyVendorMetrics = {
    totalVendorSales: '$525,450',
    totalOrdersProcessed: '1,890',
    activeStaffAccounts: '15',
    overallInventoryValue: '$380,000',
    salesTrend: 18.2, // For chart/metric trend
    ordersTrend: 7.5,
    staffTrend: 20.0,
    inventoryTrend: 5.1,
};

const dummyVendorActivity = [
    { id: 'va1', name: 'Order #V-001', type: 'New Customer Order', date: 'Just now', value: '$750.00', status: 'paid' },
    { id: 'va2', name: 'Product Update (SKU: EL102)', type: 'Inventory Updated', date: '5 mins ago', value: '+50 units', status: null },
    { id: 'va3', name: 'Staff Login (Sarah J.)', type: 'Activity Log', date: '15 mins ago', value: null, status: null },
    { id: 'va4', name: 'Order #V-002', type: 'Shipped', date: '1 hr ago', value: '$210.00', status: 'shipped' },
    { id: 'va5', name: 'New Vendor Staff', type: 'Account Created', date: '2 hrs ago', value: 'John P.', status: null },
    { id: 'va6', name: 'Élan Annoucement', type: 'Platform Update', date: '3 hrs ago', value: 'New Features', status: null },
];

const dummyVendorTopProducts = [
    { name: 'Élan Solid Oak Dining Table', sales: '$45,000' },
    { name: 'Velvet Dining Chair (Set of 2)', sales: '$28,000' },
    { name: 'Sculptural Ceramic Vase Collection', sales: '$19,500' },
    { name: 'Modern Arch Floor Lamp', sales: '$12,000' },
];

const dummyVendorStaff = [
    { id: 'staff1', name: 'Alice M.', role: 'Manager', lastLogin: '1 hour ago' },
    { id: 'staff2', name: 'Bob R.', role: 'Operations', lastLogin: 'Today' },
    { id: 'staff3', name: 'Carol K.', role: 'Inventory', lastLogin: 'Yesterday' },
];


const VendorDashboard: React.FC = () => {
  return (
    <DashboardGrid>
      <MetricCardsContainer>
        <MetricCard
          title="Total Vendor Sales"
          value={dummyVendorMetrics.totalVendorSales}
          type="sales"
          trendPercentage={dummyVendorMetrics.salesTrend}
          trendPeriod="since last month"
          onClick={() => console.log('Vendor: Go to Total Sales Report')}
        />
        <MetricCard
          title="Orders Processed"
          value={dummyVendorMetrics.totalOrdersProcessed}
          type="orders"
          trendPercentage={dummyVendorMetrics.ordersTrend}
          trendPeriod="since last week"
          onClick={() => console.log('Vendor: Go to Orders List')}
        />
        <MetricCard
          title="Active Staff Accounts"
          value={dummyVendorMetrics.activeStaffAccounts}
          type="users"
          trendPercentage={dummyVendorMetrics.staffTrend}
          trendPeriod="since last quarter"
          onClick={() => console.log('Vendor: Go to Staff Management')}
        />
        <MetricCard
          title="Overall Inventory Value"
          value={dummyVendorMetrics.overallInventoryValue}
          type="products" // Reusing products icon, but refers to value
          trendPercentage={dummyVendorMetrics.inventoryTrend}
          trendPeriod="current valuation"
          onClick={() => console.log('Vendor: Go to Inventory Management')}
        />
      </MetricCardsContainer>

      <DashboardChartSection>
        <ChartCard title="Vendor Sales Performance" chartType="line" />
      </DashboardChartSection>

      <DashboardRecentActivitySection>
        <RecentActivity title="Vendor Recent Activity" activities={dummyVendorActivity} />
      </DashboardRecentActivitySection>
      
      {/* Vendor-Specific Quick Insights */}
      <DashboardQuickInsightsSection>
         <DashboardCard title="Top Selling Products (Vendor)">
             <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                 {dummyVendorTopProducts.map((p, index) => (
                     <li key={index} style={{ padding: '8px 0', borderBottom: '1px dashed #EEE', display: 'flex', justifyContent: 'space-between', fontFamily: 'Inter, sans-serif', fontSize: '0.95rem' }}>
                         <span>{p.name}</span>
                         <span style={{ fontWeight: 600 }}>{p.sales}</span>
                     </li>
                 ))}
             </ul>
             <AdminButton $variant="secondary" style={{ marginTop: '20px' }} onClick={() => console.log('Vendor: View All Vendor Products')}>
                 <FaStore /> View My Store
             </AdminButton>
         </DashboardCard>
         
         <DashboardCard title="Vendor Staff Summary">
             <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                 {dummyVendorStaff.map(staff => (
                     <li key={staff.id} style={{ padding: '8px 0', borderBottom: '1px dashed #EEE', display: 'flex', justifyContent: 'space-between', fontFamily: 'Inter, sans-serif', fontSize: '0.95rem' }}>
                         <span>{staff.name}</span>
                         <span style={{color: '#666'}}>({staff.role}) - Last: {staff.lastLogin}</span>
                     </li>
                 ))}
             </ul>
             <AdminButton $variant="primary" style={{ marginTop: '20px' }} onClick={() => console.log('Vendor: Manage Staff Accounts')}>
                 <FaUsers /> Manage Staff
             </AdminButton>
             <AdminButton $variant="secondary" style={{ marginTop: '10px' }} onClick={() => console.log('Vendor: Assign Tasks')}>
                 <FaTasks /> Assign Tasks
             </AdminButton>
         </DashboardCard>

         <DashboardCard title="Élan Platform Announcements">
             {/* Simple announcement feed */}
             <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem' }}>
                 <li style={{ padding: '8px 0', borderBottom: '1px dashed #EEE', color: '#333' }}><strong>Important:</strong> Q4 Reporting Deadline - <span style={{ float: 'right', color: '#999' }}>Oct 20</span></li>
                 <li style={{ padding: '8px 0', borderBottom: '1px dashed #EEE', color: '#333' }}>New Shipping Policy - <span style={{ float: 'right', color: '#999' }}>Oct 15</span></li>
             </ul>
             <AdminButton $variant="secondary" style={{ marginTop: '20px' }} onClick={() => console.log('Vendor: View All Announcements')}>View All Announcements</AdminButton>
         </DashboardCard>
      </DashboardQuickInsightsSection>

    </DashboardGrid>
  );
};

export default VendorDashboard;