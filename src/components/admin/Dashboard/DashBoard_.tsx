// src/components/admin/Dashboard/DashboardRouter.tsx
import React from 'react';
import styled, { useTheme, type DefaultTheme } from 'styled-components'; // Optional: for styling within this component
import type { UserRole } from '@/config/rolesConfig';

// --- Styled Components (Optional - for this component's internal layout) ---
const DashboardContainer = styled.div`
  padding: ${(props) => props.theme.spacing(2)}; // Example padding
  // Add more styles as needed for the dashboard area
`;

const WelcomeMessage = styled.h2`
  color: ${(props) => props.theme.colors.accent1};
  margin-bottom: ${(props) => props.theme.spacing(4)};
  font-weight: 600;
`;

const SectionTitle = styled.h3`
  color: ${(props) => props.theme.colors.accent1Active};
  margin-top: ${(props) => props.theme.spacing(5)};
  margin-bottom: ${(props) => props.theme.spacing(3)};
  border-bottom: 1px solid ${(props) => props.theme.colors.accent1};
  padding-bottom: ${(props) => props.theme.spacing(2)};
  font-size: ${(props) => props.theme.typography.admin.sizes.metricValue};
`;

const WidgetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${(props) => props.theme.spacing(4)};
`;

const WidgetPlaceholder = styled.div`
  background-color: ${(props) => props.theme.colors.accent1};
  border: 1px solid ${(props) => props.theme.colors.accent1};
  padding: ${(props) => props.theme.spacing(4)};
  border-radius: ${(props) => props.theme.borderRadius.medium};

  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h4 {
    margin-top: 0;
    margin-bottom: ${(props) => props.theme.spacing(2)};
    color: ${(props) => props.theme.colors.accent1Active};
  }
  p {
    color: ${(props) => props.theme.colors.accent2};
    font-size: 14px;
  }
`;

// --- Role-Specific Dashboard Components (Placeholders) ---

const AdminDashboardView: React.FC = () => {
  // In a real app, these would be actual components fetching and displaying data
  return (
    <>
      <SectionTitle>Platform Overview</SectionTitle>
      <WidgetGrid>
        <WidgetPlaceholder><h4>Total Sales</h4><p>Sum of all platform sales.</p></WidgetPlaceholder>
        <WidgetPlaceholder><h4>New Users</h4><p>Recently registered users.</p></WidgetPlaceholder>
        <WidgetPlaceholder><h4>Pending Applications</h4><p>Seller/Vendor applications awaiting review.</p></WidgetPlaceholder>
        <WidgetPlaceholder><h4>System Health</h4><p>Current status of platform services.</p></WidgetPlaceholder>
      </WidgetGrid>
      <SectionTitle>Quick Stats</SectionTitle>
      <WidgetGrid>
        <WidgetPlaceholder><h4>Active Products</h4><p>Total count of active products.</p></WidgetPlaceholder>
        <WidgetPlaceholder><h4>Orders Today</h4><p>Number of orders placed today.</p></WidgetPlaceholder>
      </WidgetGrid>
    </>
  );
};

const VendorDashboardView: React.FC = () => {
  return (
    <>
      <SectionTitle>My Store Overview</SectionTitle>
      <WidgetGrid>
        <WidgetPlaceholder><h4>My Sales Today</h4><p>Your total sales for today.</p></WidgetPlaceholder>
        <WidgetPlaceholder><h4>New Orders</h4><p>Number of new orders received.</p></WidgetPlaceholder>
        <WidgetPlaceholder><h4>Low Stock Items</h4><p>Products that are running low on stock.</p></WidgetPlaceholder>
        <WidgetPlaceholder><h4>Payout Balance</h4><p>Your current available payout.</p></WidgetPlaceholder>
      </WidgetGrid>
      <SectionTitle>Recent Activity</SectionTitle>
        <WidgetPlaceholder><h4>Last 5 Orders</h4><p>List or summary of recent orders.</p></WidgetPlaceholder>
    </>
  );
};

const SellerDashboardView: React.FC = () => {
  return (
    <>
      <SectionTitle>My Shop Performance</SectionTitle>
      <WidgetGrid>
        <WidgetPlaceholder><h4>My Earnings Today</h4><p>Your earnings from sales today.</p></WidgetPlaceholder>
        <WidgetPlaceholder><h4>Pending Shipments</h4><p>Orders awaiting shipment.</p></WidgetPlaceholder>
        <WidgetPlaceholder><h4>Product Views</h4><p>Total views on your listed items.</p></WidgetPlaceholder>
        <WidgetPlaceholder><h4>Messages</h4><p>Unread customer inquiries.</p></WidgetPlaceholder>
      </WidgetGrid>
      <SectionTitle>Quick Links</SectionTitle>
        <WidgetPlaceholder><h4>List New Item</h4><p>Shortcut to add a new product.</p></WidgetPlaceholder>
    </>
  );
};

// --- Main AdminDashboardRouter Component ---
interface AdminDashboardRouterProps {
  userRole?: UserRole | null; // Make userRole optional as it's passed by AdminRouter
}

const AdminDashboardRouter: React.FC<AdminDashboardRouterProps> = ({ userRole }) => {
  const themeContext = useTheme();
  const theme = (themeContext || {}) as DefaultTheme; // Provide a default empty theme if not available

  let DashboardComponentToRender: React.ElementType = () => <p>Loading dashboard or role not recognized...</p>;
  let welcomeText = "Welcome!";

  if (userRole) {
    switch (userRole) {
      case 'admin':
        DashboardComponentToRender = AdminDashboardView;
        welcomeText = "Welcome, Platform Administrator!";
        break;
      case 'vendor':
        DashboardComponentToRender = VendorDashboardView;
        welcomeText = "Welcome to your Vendor Portal!";
        break;
      case 'individual_seller':
        DashboardComponentToRender = SellerDashboardView;
        welcomeText = "Welcome to your Seller Central!";
        break;
      default:
        // This case should ideally not be reached if userRole is always one of the defined UserRole types
        console.warn(`[AdminDashboardRouter] Unrecognized user role: ${userRole}`);
        welcomeText = "Welcome!";
        DashboardComponentToRender = () => <p>Dashboard for role '{userRole}' is not configured.</p>;
        break;
    }
  } else if (userRole === null) { // Explicitly null means role is not yet determined
      return <DashboardContainer><p>Loading user data...</p></DashboardContainer>;
  }


  // Ensure theme is available before rendering styled components that depend on it.
  // This check is mostly for robustness; AdminRouter should ensure theme is loaded.
  if (!theme || Object.keys(theme).length === 0) {
    return <div>Loading theme...</div>; // Or a more sophisticated loader
  }

  return (
    <DashboardContainer>
      <WelcomeMessage>{welcomeText}</WelcomeMessage>
      <DashboardComponentToRender />
    </DashboardContainer>
  );
};

export default AdminDashboardRouter;