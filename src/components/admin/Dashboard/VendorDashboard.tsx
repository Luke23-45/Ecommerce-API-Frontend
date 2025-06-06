import React from "react";
import { FaUsers, FaTasks, FaStore } from "react-icons/fa";
import {
  DashboardGrid,
  MetricCardsContainer,
  DashboardChartSection,
  DashboardHeroSection,
  DashboardSidebarSection,
  DashboardBottomWidgetsContainer,
  DashboardContentCard,
} from "./Dashboard.styles";

import MetricCard from "./MetricCard/MetricCard";
import ChartCard from "./ChartCard/ChartCard";
import RecentActivity from "./RecentActivity/RecentActivity";
import { AdminButton } from "./Common/Common.styles";

const dummyVendorMetrics = {
  totalVendorSales: "$525,450",
  salesTrend: 18.2,
  totalOrdersProcessed: "1,890",
  ordersTrend: 7.5,
  activeStaffAccounts: "15",
  staffTrend: -2.5,
  overallInventoryValue: "$380,000",
  inventoryTrend: 0,
};
const dummyVendorActivity = [
  {
    id: "va1",
    name: "Order #V-001",
    type: "New Customer Order",
    date: "Just now",
    value: "$750.00",
    status: "paid",
  },
  {
    id: "va2",
    name: "Product Update (SKU: EL102)",
    type: "Inventory Updated",
    date: "5 mins ago",
    value: "+50 units",
    status: null,
  },
  {
    id: "va3",
    name: "Staff Login (Sarah J.)",
    type: "Activity Log",
    date: "15 mins ago",
    value: null,
    status: null,
  },
  {
    id: "va4",
    name: "Order #V-002",
    type: "Shipped",
    date: "1 hr ago",
    value: "$210.00",
    status: "shipped",
  },
  {
    id: "va5",
    name: "New Vendor Staff",
    type: "Account Created",
    date: "2 hrs ago",
    value: "John P.",
    status: null,
  },
  {
    id: "va6",
    name: "Élan Annoucement",
    type: "Platform Update",
    date: "3 hrs ago",
    value: "New Features",
    status: null,
  },
];
const dummyVendorTopProducts = [
  { name: "Élan Solid Oak Dining Table", sales: "$45,000" },
  { name: "Velvet Dining Chair (Set of 2)", sales: "$28,000" },
  { name: "Sculptural Ceramic Vase Collection", sales: "$19,500" },
  { name: "Modern Arch Floor Lamp", sales: "$12,000" },
];
const dummyVendorStaff = [
  { id: "staff1", name: "Alice M.", role: "Manager", lastLogin: "1 hour ago" },
  { id: "staff2", name: "Bob R.", role: "Operations", lastLogin: "Today" },
  { id: "staff3", name: "Carol K.", role: "Inventory", lastLogin: "Yesterday" },
];

const VendorDashboard: React.FC = () => {
  const navigateTo = (path: string, message?: string) => {
    console.log(message || `Navigating to: ${path}`);
  };

  return (
    <DashboardGrid>
      {/* Optional Hero Section for Vendor - can be added if desired */}
      {/* <DashboardHeroSection style={{ gridColumn: '1 / -1' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px', color: '#1F2937' }}>Your Vendor Hub</h1>
          <p style={{ fontSize: '1rem', color: '#6B7280' }}>Manage your products, orders, and staff efficiently.</p>
        </div>
      </DashboardHeroSection> */}

      <MetricCardsContainer>
        {" "}
        {/* Spans full width */}
        <MetricCard
          title="Total Vendor Sales"
          value={dummyVendorMetrics.totalVendorSales}
          trendPercentage={dummyVendorMetrics.salesTrend}
          trendPeriod="since last month"
          onClick={() =>
            navigateTo(
              "/admin/vendor/reports/sales",
              "Vendor: Go to Total Sales Report"
            )
          }
        />
        <MetricCard
          title="Orders Processed"
          value={dummyVendorMetrics.totalOrdersProcessed}
          trendPercentage={dummyVendorMetrics.ordersTrend}
          trendPeriod="since last week"
          onClick={() =>
            navigateTo("/admin/vendor/orders", "Vendor: Go to Orders List")
          }
        />
        <MetricCard
          title="Active Staff Accounts"
          value={dummyVendorMetrics.activeStaffAccounts}
          trendPercentage={dummyVendorMetrics.staffTrend}
          trendPeriod="since last quarter"
          onClick={() =>
            navigateTo("/admin/vendor/staff", "Vendor: Go to Staff Management")
          }
        />
        <MetricCard
          title="Overall Inventory Value"
          value={dummyVendorMetrics.overallInventoryValue}
          trendPercentage={dummyVendorMetrics.inventoryTrend}
          trendPeriod="current valuation"
          onClick={() =>
            navigateTo(
              "/admin/vendor/inventory",
              "Vendor: Go to Inventory Management"
            )
          }
        />
      </MetricCardsContainer>

      {/* Main content area: Chart on left, other info cards on right */}
      <DashboardChartSection>
        {" "}
        {/* Spans 8 columns */}
        <ChartCard title="Vendor Sales Performance" chartType="line" />
      </DashboardChartSection>

      <DashboardSidebarSection>
        {" "}
        {/* Spans 4 columns */}
        <DashboardContentCard title="Recent Vendor Activity">
          <RecentActivity activities={dummyVendorActivity} itemsToShow={4} />{" "}
          {/* Limiting items */}
        </DashboardContentCard>
        <DashboardContentCard title="Quick Actions">
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.9rem",
              color: "#6B7280",
              marginBottom: "15px",
            }}
          >
            Quickly manage your vendor operations.
          </p>
          <AdminButton
            $variant="primary"
            style={{ width: "100%", marginBottom: "10px" }}
            onClick={() =>
              navigateTo(
                "/admin/vendor/products/new",
                "Vendor: Add New Product"
              )
            }
          >
            Add New Product
          </AdminButton>
          <AdminButton
            $variant="secondary"
            style={{ width: "100%", marginBottom: "10px" }}
            onClick={() =>
              navigateTo(
                "/admin/vendor/staff/manage",
                "Vendor: Manage Staff Accounts"
              )
            }
          >
            <FaUsers style={{ marginRight: "8px" }} /> Manage Staff
          </AdminButton>
          <AdminButton
            $variant="secondary"
            style={{ width: "100%" }}
            onClick={() =>
              navigateTo("/admin/vendor/tasks", "Vendor: Assign Tasks")
            }
          >
            <FaTasks style={{ marginRight: "8px" }} /> Assign Tasks
          </AdminButton>
        </DashboardContentCard>
      </DashboardSidebarSection>

      {/* Bottom full-width section for more widgets */}
      <DashboardBottomWidgetsContainer>
        <DashboardContentCard
          title="Top Selling Products (Vendor)"
          style={{ gridColumn: "span 6" }}
        >
          {" "}
          {/* Example span */}
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {dummyVendorTopProducts.map((p, index) => (
              <li
                key={index}
                style={{
                  padding: "10px 0",
                  borderBottom: "1px solid #E5E7EB",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: "0.875rem", color: "#374151" }}>
                  {p.name}
                </span>
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: "#1F2937",
                  }}
                >
                  {p.sales}
                </span>
              </li>
            ))}
          </ul>
          <AdminButton
            $variant="secondary"
            style={{ marginTop: "20px" }}
            onClick={() =>
              navigateTo("/vendor/storefront", "Vendor: View My Store Products")
            }
          >
            <FaStore /> View My Store
          </AdminButton>
        </DashboardContentCard>

        <DashboardContentCard
          title="Élan Platform Announcements"
          style={{ gridColumn: "span 6" }}
        >
          {" "}
          {/* Example span */}
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li
              style={{
                padding: "10px 0",
                borderBottom: "1px solid #E5E7EB",
                fontSize: "0.875rem",
                color: "#374151",
              }}
            >
              <strong>Important:</strong> Q4 Reporting Deadline
              <span style={{ float: "right", color: "#9CA3AF" }}>Oct 20</span>
            </li>
            <li
              style={{
                padding: "10px 0",
                borderBottom: "1px solid #E5E7EB",
                fontSize: "0.875rem",
                color: "#374151",
              }}
            >
              New Shipping Policy Update
              <span style={{ float: "right", color: "#9CA3AF" }}>Oct 15</span>
            </li>
            {/* Add more announcements or a "View All" link */}
          </ul>
          <AdminButton
            $variant="secondary"
            style={{ marginTop: "20px" }}
            onClick={() =>
              navigateTo(
                "/admin/platform/announcements/vendor",
                "Vendor: View All Announcements"
              )
            }
          >
            View All Announcements
          </AdminButton>
        </DashboardContentCard>
      </DashboardBottomWidgetsContainer>
    </DashboardGrid>
  );
};

export default VendorDashboard;
