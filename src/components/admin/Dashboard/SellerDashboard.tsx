
import React from 'react';
import {
  DashboardGrid,
  MetricCardsContainer,
  DashboardChartSection,
  
  
  DashboardHeroSection,         
  DashboardSidebarSection,      
  DashboardBottomWidgetsContainer, 
  DashboardContentCard,         
                                  
} from './Dashboard.styles';

import MetricCard from './MetricCard/MetricCard';
import ChartCard from './ChartCard/ChartCard'; 
import RecentActivity from './RecentActivity/RecentActivity'; 
import { AdminButton } from './Common/Common.styles';




const dummySellerMetrics = {
    myTotalSales: '$15,200', salesTrend: 15.2,
    ordersToFulfill: '12', ordersTrend: -20.0,
    productsLive: '58', productsTrend: 0,
    nextPayoutDue: '$2,800', payoutTrend: 10.0,
};
const dummySellerOrders = [
    { id: 'so1', name: 'Order #S001', type: 'New Customer Order', date: 'Just now', value: '$75.00', status: 'pending' },
    { id: 'so2', name: 'Order #S002', type: 'Shipped', date: '1 hr ago', value: '$120.00', status: 'shipped' },
    { id: 'so3', name: 'Product Review (Throw)', type: 'New Review', date: 'Yesterday', value: '5 stars', status: null },
    { id: 'so4', name: 'Order #S003', type: 'Refunded', date: '2 days ago', value: '-$50.00', status: 'returned' },
    { id: 'so5', name: 'Order #S004', type: 'Payment Rec\'d', date: '3 days ago', value: '$90.00', status: 'paid' },
];
const dummySellerProducts = [
    { id: 'sp1', name: 'Linen Throw (Low Stock)', stock: 5 }, { id: 'sp2', name: 'Ceramic Vase', stock: 20 },
    { id: 'sp3', name: 'Oak Coffee Table', stock: 12 }, { id: 'sp4', name: 'Velvet Dining Chair (Low Stock)', stock: 8 },
];

const SellerDashboard: React.FC = () => {
  const navigateTo = (path: string, message?: string) => {
    console.log(message || `Navigating to: ${path}`);
  };

  return (
    <DashboardGrid>
      {/* Optional Hero Section (Example for Seller) */}
      <DashboardHeroSection style={{ gridColumn: '1 / -1' }}> {/* Ensure hero spans full width */}
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px', color: '#1F2937' }}>Welcome Back, Seller!</h1>
          <p style={{ fontSize: '1rem', color: '#6B7280', maxWidth: '600px' }}>
            Here's a quick overview of your shop's performance. Keep up the great work and check your pending orders!
          </p>
          <AdminButton $variant="primary" style={{ marginTop: '20px' }} onClick={() => navigateTo('/seller/products/new', 'Seller: Add New Product')}>
            List New Item
          </AdminButton>
        </div>
        {/* Optional: Add an illustration/image here */}
        {/* <img src="/path-to-seller-hero-illustration.svg" alt="Seller dashboard illustration" style={{maxWidth: '300px', marginLeft: 'auto'}} /> */}
      </DashboardHeroSection>

      <MetricCardsContainer> {/* This will span full width based on its own style in Dashboard.styles.ts */}
        <MetricCard title="My Total Sales" value={dummySellerMetrics.myTotalSales} trendPercentage={dummySellerMetrics.salesTrend} trendPeriod="since last month" onClick={() => navigateTo('/seller/reports/sales', 'Seller: Go to My Sales Report')} />
        <MetricCard title="Orders to Fulfill" value={dummySellerMetrics.ordersToFulfill} trendPercentage={dummySellerMetrics.ordersTrend} trendPeriod="since last week" onClick={() => navigateTo('/seller/orders/pending', 'Seller: Go to My Orders')} />
        <MetricCard title="Products Live" value={dummySellerMetrics.productsLive} trendPercentage={dummySellerMetrics.productsTrend} trendPeriod="currently active" onClick={() => navigateTo('/seller/products', 'Seller: Go to My Products')} />
        <MetricCard title="Next Payout Due" value={dummySellerMetrics.nextPayoutDue} trendPercentage={dummySellerMetrics.payoutTrend} trendPeriod="estimated next week" onClick={() => navigateTo('/seller/payouts', 'Seller: Go to Payouts')} />
      </MetricCardsContainer>

      {/* Main content area: Chart on left, other info cards on right */}
      <DashboardChartSection> {/* Spans 8 columns by default */}
        <ChartCard title="My Sales Overview" chartType="line" />
      </DashboardChartSection>

      <DashboardSidebarSection> {/* Spans 4 columns by default, stacks on smaller screens */}
        <DashboardContentCard title="Recent Shop Activity"> {/* Using new styled card */}
          <RecentActivity activities={dummySellerOrders} itemsToShow={3} /> {/* Limiting items for this card size */}
        </DashboardContentCard>

        <DashboardContentCard title="Quick Actions">
             <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#6B7280', marginBottom: '15px' }}>
                 Manage your shop efficiently.
             </p>
             <AdminButton $variant="primary" style={{width: '100%', marginBottom: '10px'}} onClick={() => navigateTo('/seller/products/new', 'Seller: Add New Product')}>Add New Product</AdminButton>
             <AdminButton $variant="secondary" style={{width: '100%'}} onClick={() => navigateTo('/seller/reviews', 'Seller: Respond to Reviews')}>Respond to Reviews</AdminButton>
        </DashboardContentCard>
      </DashboardSidebarSection>

      {/* Bottom full-width section for more widgets if needed */}
      <DashboardBottomWidgetsContainer>
         <DashboardContentCard title="My Top Selling Products" style={{ gridColumn: 'span 6' }}> {/* Example spanning half width of this container */}
             <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                 {dummySellerProducts.slice(0,3).map(p => (
                     <li key={p.id} style={{ padding: '8px 0', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between' }}>
                         <span style={{fontSize: '0.875rem', color: '#374151'}}>{p.name}</span>
                         <span style={{ fontWeight: 600, fontSize: '0.875rem', color: p.stock <= 10 ? '#EF4444' : '#1F2937' }}>
                           {p.stock <= 10 ? `Low Stock (${p.stock})` : `Stock: ${p.stock}`}
                         </span>
                     </li>
                 ))}
             </ul>
             <AdminButton $variant="secondary" style={{ marginTop: '20px' }} onClick={() => navigateTo('/seller/products/manage', 'Seller: Manage Products')}>Manage My Products</AdminButton>
         </DashboardContentCard>

         <DashboardContentCard title="Customer Messages" style={{ gridColumn: 'span 6' }}> {/* Example spanning other half */}
             <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                 <li style={{ padding: '8px 0', borderBottom: '1px solid #E5E7EB', fontSize: '0.875rem', color: '#374151' }}>From: Jane D. - "Question about my order..." <span style={{float: 'right', color: '#9CA3AF'}}>2hr</span></li>
                 <li style={{ padding: '8px 0', borderBottom: '1px solid #E5E7EB', fontSize: '0.875rem', color: '#374151' }}>From: John S. - "Can I return this?" <span style={{float: 'right', color: '#9CA3AF'}}>1d</span></li>
             </ul>
             <AdminButton $variant="secondary" style={{ marginTop: '20px' }} onClick={() => navigateTo('/seller/messages', 'Seller: View All Messages')}>View All Messages</AdminButton>
         </DashboardContentCard>
      </DashboardBottomWidgetsContainer>
    </DashboardGrid>
  );
};

export default SellerDashboard;