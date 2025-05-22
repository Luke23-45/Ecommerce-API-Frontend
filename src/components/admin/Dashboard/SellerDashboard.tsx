// src/components/Admin/Dashboard/SellerDashboard.tsx (Adjusted existing Dashboard code)
import React from 'react';
import {
  DashboardGrid,
  MetricCardsContainer,
  DashboardChartSection,
  DashboardRecentActivitySection,
  DashboardQuickInsightsSection, // Can be repurposed or removed for seller
} from './Dashboard.styles'; // Styles remain global for all dashboards unless specific tweaks needed

import MetricCard from './MetricCard/MetricCard';
import ChartCard from './ChartCard/ChartCard';
import RecentActivity from './RecentActivity/RecentActivity';
import { AdminButton } from './Common/Common.styles';
// NEW COMPONENT: A simple card wrapper for various content
import {
    DashboardCardContainer,
    CardHeader,
    CardTitle,
    CardContent,
} from './DashboardCard/DashboardCard.styles'; // Styles for a generic dashboard card


// --- Common Dashboard Card Component (to be placed in Dashboard/DashboardCard/DashboardCard.tsx) ---
interface DashboardCardProps {
    title?: string; // Optional title for generic cards
    children: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, children }) => (
    <DashboardCardContainer>
        {title && <CardHeader><CardTitle>{title}</CardTitle></CardHeader>}
        <CardContent>
            {children}
        </CardContent>
    </DashboardCardContainer>
);


// Dummy data specific to a SELLER
const dummySellerOrders = [
    { id: 'so1', name: 'Order #S001', type: 'New Customer Order', date: 'Just now', value: '$75.00', status: 'pending' },
    { id: 'so2', name: 'Order #S002', type: 'Shipped', date: '1 hr ago', value: '$120.00', status: 'shipped' },
    { id: 'so3', name: 'Product Review (Throw)', type: 'New Review', date: 'Yesterday', value: '5 stars', status: null },
    { id: 'so4', name: 'Order #S003', type: 'Refunded', date: '2 days ago', value: '-$50.00', status: 'returned' },
    { id: 'so5', name: 'Order #S004', type: 'Payment Rec\'d', date: '3 days ago', value: '$90.00', status: 'paid' },
];

const dummySellerProducts = [
    { id: 'sp1', name: 'Linen Throw (Low Stock)', stock: 5 },
    { id: 'sp2', name: 'Ceramic Vase', stock: 20 },
    { id: 'sp3', name: 'Oak Coffee Table', stock: 12 },
    { id: 'sp4', name: 'Velvet Dining Chair (Low Stock)', stock: 8 },
];

const SellerDashboard: React.FC = () => {
  return (
    <DashboardGrid>
      <MetricCardsContainer>
        <MetricCard
          title="My Total Sales"
          value="$15,200"
          type="sales"
          trendPercentage={15.2}
          trendPeriod="since last month"
          onClick={() => console.log('Seller: Go to My Sales Report')}
        />
        <MetricCard
          title="Orders to Fulfill"
          value="12"
          type="orders"
          trendPercentage={20.0}
          trendPeriod="since last week"
          onClick={() => console.log('Seller: Go to My Orders')}
        />
        <MetricCard
          title="Products Live"
          value="58"
          type="products"
          trendPercentage={0}
          trendPeriod="stable"
          onClick={() => console.log('Seller: Go to My Products')}
        />
        <MetricCard
          title="Next Payout Due"
          value="$2,800"
          type="sales" // Reusing 'sales' icon for currency
          trendPercentage={10.0}
          trendPeriod="next week"
          onClick={() => console.log('Seller: Go to Payouts')}
        />
      </MetricCardsContainer>

      <DashboardChartSection>
        <ChartCard title="My Sales Overview" chartType="line" />
      </DashboardChartSection>

      <DashboardRecentActivitySection>
        <RecentActivity title="My Recent Activity" activities={dummySellerOrders} />
      </DashboardRecentActivitySection>
      
      {/* Repurpose DashboardQuickInsightsSection for Seller-specific quick views */}
      <DashboardQuickInsightsSection>
         <DashboardCard title="My Top Selling Products">
             {/* Simple list of top products */}
             <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                 {dummySellerProducts.slice(0,3).map(p => (
                     <li key={p.id} style={{ padding: '8px 0', borderBottom: '1px dashed #EEE', display: 'flex', justifyContent: 'space-between', fontFamily: 'Inter, sans-serif', fontSize: '0.95rem' }}>
                         <span>{p.name}</span>
                         <span style={{ fontWeight: 600 }}>{p.stock <= 10 ? `(Low Stock: ${p.stock})` : `(Stock: ${p.stock})`}</span>
                     </li>
                 ))}
             </ul>
             <AdminButton $variant="secondary" style={{ marginTop: '20px' }} onClick={() => console.log('Seller: Manage Products')}>Manage My Products</AdminButton>
         </DashboardCard>
         
         <DashboardCard title="My Shop Health Check">
             {/* Example of quick stats/alerts specific to seller */}
             <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#666', marginBottom: '15px' }}>
                 Your shop is performing well! Keep an eye on low stock items.
             </p>
             <AdminButton $variant="primary" onClick={() => console.log('Seller: Add New Product')}>Add New Product</AdminButton>
             <AdminButton $variant="secondary" style={{ marginTop: '10px' }} onClick={() => console.log('Seller: Respond to Reviews')}>Respond to Reviews</AdminButton>
         </DashboardCard>

         <DashboardCard title="Customer Messages">
             {/* Placeholder for simple customer messages */}
             <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                 <li style={{ padding: '8px 0', borderBottom: '1px dashed #EEE', fontFamily: 'Inter, sans-serif', fontSize: '0.95rem' }}><span>From: Jane D.</span><span style={{float: 'right', color: '#666'}}>2 hours ago</span></li>
                 <li style={{ padding: '8px 0', borderBottom: '1px dashed #EEE', fontFamily: 'Inter, sans-serif', fontSize: '0.95rem' }}><span>From: John S.</span><span style={{float: 'right', color: '#666'}}>Yesterday</span></li>
             </ul>
             <AdminButton $variant="secondary" style={{ marginTop: '20px' }} onClick={() => console.log('Seller: View All Messages')}>View All Messages</AdminButton>
         </DashboardCard>
      </DashboardQuickInsightsSection>

    </DashboardGrid>
  );
};

export default SellerDashboard;