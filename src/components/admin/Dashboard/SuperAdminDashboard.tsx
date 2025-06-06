import React from "react";
import {
  FaStore,
  FaChartPie,
  FaHeadset,
  FaCog,
  FaExclamationTriangle,
  FaListAlt,
  FaBullhorn,
} from "react-icons/fa";
import styled, { type DefaultTheme } from "styled-components";

import heroImg from '@/assets/bgseller.png'
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

import { rgba } from "polished";

const dummySuperAdminMetrics = {
  platformGrossSales: "$1,850,000",
  salesTrend: 22.8,
  totalUsers: "5,000",
  userTrend: 15.5,
  liveProducts: "12,500",
  productTrend: -5.0,
  activeVendors: "120",
  vendorTrend: 0,
};
const dummySuperAdminActivity = [
  {
    id: "sa1",
    name: "New Vendor (Global Goods)",
    type: "Account Created",
    date: "Just now",
    value: null,
    status: null,
  },
  {
    id: "sa2",
    name: "Product Update (All Products)",
    type: "Global Inventory Sync",
    date: "10 mins ago",
    value: "1.2M updates",
    status: null,
  },
  {
    id: "sa3",
    name: "Platform Sales Review",
    type: "Report Generated",
    date: "30 mins ago",
    value: "$1.8M",
    status: null,
  },
  {
    id: "sa4",
    name: "User Login (Super Admin)",
    type: "Security Alert",
    date: "1 hr ago",
    value: null,
    status: null,
  },
  {
    id: "sa5",
    name: "System Maintenance",
    type: "Scheduled",
    date: "Tomorrow",
    value: "Server downtime",
    status: null,
  },
];
const dummyPlatformIssues = [
  {
    type: "High",
    description: "Payment gateway API error spikes",
    status: "critical",
    link: "#issues-payment",
  },
  {
    type: "Medium",
    description: "Vendor payout discrepancy (ID: V123)",
    status: "warning",
    link: "#issues-payout",
  },
  {
    type: "Low",
    description: "Customer feedback: slow image loads",
    status: "info",
    link: "#issues-images",
  },
];
const dummyCustomerSupportQueue = [
  {
    id: "cs1",
    customer: "Jane Doe",
    issue: "Order tracking inquiry",
    status: "Open",
    link: "#support-jane",
  },
  {
    id: "cs2",
    customer: "John Smith",
    issue: "Product refund request",
    status: "Pending",
    link: "#support-john",
  },
];

const InsightList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${({ theme }) => theme.spacing(2.5)} 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.adminBorder};
    font-size: ${({ theme }) => theme.typography.admin.sizes.bodyBase};
    color: ${({ theme }) => theme.colors.adminText};
    &:last-child {
      border-bottom: none;
    }
    span:first-child {
      color: ${({ theme }) => theme.colors.adminTextSecondary};
    }
    strong,
    span[style*="fontWeight: 600"] {
      font-weight: ${({ theme }) => theme.typography.admin.weights.semiBold};
      color: ${({ theme }) => theme.colors.adminText};
    }
  }
`;

const AlertListItem = styled.li`
  padding: ${({ theme }) => theme.spacing(2.5)} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.adminBorder};
  font-size: ${({ theme }) => theme.typography.admin.sizes.bodyBase};
  &:last-child {
    border-bottom: none;
  }

  .alert-type {
    font-weight: ${({ theme }) => theme.typography.admin.weights.semiBold};
    margin-right: ${({ theme }) => theme.spacing(2)};
  }
  .alert-link {
    color: ${({ theme }) => theme.colors.adminText};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
      color: ${({ theme }) => theme.colors.adminAccent};
    }
  }
  .alert-status-badge {
    display: inline-block;
    padding: 3px 8px;
    border-radius: ${({ theme }) => theme.borderRadius.pill};
    font-size: ${({ theme }) => theme.typography.admin.sizes.xsmallText};
    font-weight: ${({ theme }) => theme.typography.admin.weights.bold};
    margin-left: ${({ theme }) => theme.spacing(2.5)};
    text-transform: uppercase;
  }
`;

const SuperAdminDashboard: React.FC = () => {
  const navigateTo = (path: string, message?: string) => {
    console.log(message || `Navigating to: ${path}`);
  };

  const getAlertColors = (status: string | undefined, theme: DefaultTheme) => {
    switch (status) {
      case "critical":
        return {
          text: theme.colors.adminStatusError,
          bg: rgba(theme.colors.adminStatusError, 0.1),
        };
      case "warning":
        return {
          text: theme.colors.adminStatusWarning,
          bg: rgba(theme.colors.adminStatusWarning, 0.1),
        };
      case "info":
        return {
          text: theme.colors.adminStatusInfo,
          bg: rgba(theme.colors.adminStatusInfo, 0.1),
        };
      default:
        return {
          text: theme.colors.adminTextMuted,
          bg: rgba(theme.colors.adminTextMuted, 0.1),
        };
    }
  };

  return (
    <DashboardGrid>
      <DashboardHeroSection
        style={{
          gridColumn: "1 / -1",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2rem",
              marginBottom: "10px",
              color: "#1F2937",
            }}
          >
            Platform Command Center
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              color: "#4B5563",
              maxWidth: "650px",
              lineHeight: 1.6,
            }}
          >
            Oversee all operations, manage users, monitor system health, and
            drive platform growth. Your insights shape Élan's success.
          </p>
        </div>
        {/* <img src={} alt="Platform overview" style={{ maxHeight: '180px', opacity: 0.8 }} /> */}
        <AdminButton
          $variant="primary"
          onClick={() =>
            navigateTo("/admin/settings/general", "Go to General Settings")
          }
        >
          <FaCog style={{ marginRight: "8px" }} /> Configure Platform
        </AdminButton>
      </DashboardHeroSection>

      <MetricCardsContainer>
        {" "}
        {/* Spans full width */}
        <MetricCard
          title="Platform Gross Sales"
          value={dummySuperAdminMetrics.platformGrossSales}
          trendPercentage={dummySuperAdminMetrics.salesTrend}
          trendPeriod="since last quarter"
          onClick={() =>
            navigateTo(
              "/admin/reports/global-sales",
              "SuperAdmin: View Global Sales Report"
            )
          }
        />
        <MetricCard
          title="Total Registered Users"
          value={dummySuperAdminMetrics.totalUsers}
          trendPercentage={dummySuperAdminMetrics.userTrend}
          trendPeriod="since last year"
          onClick={() =>
            navigateTo("/admin/users/all", "SuperAdmin: View All Users")
          }
        />
        <MetricCard
          title="Total Live Products"
          value={dummySuperAdminMetrics.liveProducts}
          trendPercentage={dummySuperAdminMetrics.productTrend}
          trendPeriod="across all vendors"
          onClick={() =>
            navigateTo(
              "/admin/products/manage-all",
              "SuperAdmin: Manage All Products"
            )
          }
        />
        <MetricCard
          title="Active Vendor Stores"
          value={dummySuperAdminMetrics.activeVendors}
          trendPercentage={dummySuperAdminMetrics.vendorTrend}
          trendPeriod="new registrations"
          onClick={() =>
            navigateTo("/admin/vendors/manage", "SuperAdmin: Manage Vendors")
          }
        />
      </MetricCardsContainer>

      <DashboardChartSection>
        {" "}
        {/* Spans 8 columns */}
        <ChartCard
          title="Global Sales Trend (Last 12 Months)"
          chartType="line"
        />
      </DashboardChartSection>

      <DashboardSidebarSection>
        {" "}
        {/* Spans 4 columns */}
        <DashboardContentCard title="Key Platform Indicators">
          <InsightList>
            <li>
              <span>Commission Rate:</span> <strong>10%</strong>
            </li>
            <li>
              <span>Customer Retention:</span> <strong>65%</strong>
            </li>
            <li>
              <span>Average Order Value:</span> <strong>$150</strong>
            </li>
            <li>
              <span>Support Ticket Resolution:</span> <strong>92%</strong>
            </li>
          </InsightList>
          <AdminButton
            $variant="secondary"
            style={{ marginTop: "20px", width: "100%" }}
            onClick={() =>
              navigateTo(
                "/admin/metrics/platform",
                "SuperAdmin: View All Platform Metrics"
              )
            }
          >
            <FaChartPie style={{ marginRight: "8px" }} /> View Detailed Metrics
          </AdminButton>
        </DashboardContentCard>
        <DashboardContentCard title="Recent Platform Activity">
          <RecentActivity
            activities={dummySuperAdminActivity}
            itemsToShow={3}
          />
          <AdminButton
            $variant="text"
            style={{ marginTop: "15px", width: "100%", textAlign: "center" }}
            onClick={() =>
              navigateTo(
                "/admin/logs/activity",
                "SuperAdmin: View Full Activity Log"
              )
            }
          >
            View Full Activity Log
          </AdminButton>
        </DashboardContentCard>
      </DashboardSidebarSection>

      <DashboardBottomWidgetsContainer>
        <DashboardContentCard
          title="Active System Alerts"
          style={{ gridColumn: "span 6" }}
        >
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {dummyPlatformIssues.length > 0 ? (
              dummyPlatformIssues.map((issue, index, arr) => {
                const colors = getAlertColors(issue.status, theme);
                return (
                  <AlertListItem
                    key={issue.description}
                    style={
                      index === arr.length - 1 ? { borderBottom: "none" } : {}
                    }
                  >
                    <span className="alert-type" style={{ color: colors.text }}>
                      <FaExclamationTriangle
                        style={{
                          marginRight: "6px",
                          transform: "translateY(1px)",
                        }}
                      />{" "}
                      {issue.type}:
                    </span>
                    <a href={issue.link} className="alert-link">
                      {issue.description}
                    </a>
                    {issue.status && (
                      <span
                        className="alert-status-badge"
                        style={{
                          backgroundColor: colors.bg,
                          color: colors.text,
                        }}
                      >
                        {issue.status}
                      </span>
                    )}
                  </AlertListItem>
                );
              })
            ) : (
              <li
                style={{
                  textAlign: "center",
                  color: "#9CA3AF",
                  padding: "20px 0",
                }}
              >
                No active system issues.
              </li>
            )}
          </ul>
          <AdminButton
            $variant="danger"
            onClick={() =>
              navigateTo(
                "/admin/alerts/manage",
                "SuperAdmin: Manage All Alerts"
              )
            }
            style={{ marginTop: "20px", width: "100%" }}
          >
            <FaCog style={{ marginRight: "8px" }} /> Manage System Alerts
          </AdminButton>
        </DashboardContentCard>

        <DashboardContentCard
          title="Customer Support Overview"
          style={{ gridColumn: "span 6" }}
        >
          <InsightList>
            <li>
              <span>Open Tickets:</span>{" "}
              <strong>
                {
                  dummyCustomerSupportQueue.filter((t) => t.status === "Open")
                    .length
                }
              </strong>
            </li>
            <li>
              <span>Pending Tickets:</span>{" "}
              <strong>
                {
                  dummyCustomerSupportQueue.filter(
                    (t) => t.status === "Pending"
                  ).length
                }
              </strong>
            </li>
            <li>
              <span>Avg. Response Time:</span> <strong>2.5 Hrs</strong>
            </li>
          </InsightList>
          <AdminButton
            $variant="primary"
            style={{ marginTop: "20px", width: "100%" }}
            onClick={() =>
              navigateTo(
                "/admin/support/tickets",
                "SuperAdmin: Go to Support Tickets"
              )
            }
          >
            <FaHeadset style={{ marginRight: "8px" }} /> View Support Queue
          </AdminButton>
          <AdminButton
            $variant="secondary"
            style={{ marginTop: "10px", width: "100%" }}
            onClick={() =>
              navigateTo(
                "/admin/support/faq/manage",
                "SuperAdmin: FAQ Management"
              )
            }
          >
            Manage FAQs
          </AdminButton>
        </DashboardContentCard>
      </DashboardBottomWidgetsContainer>
    </DashboardGrid>
  );
};

const theme = {
  colors: {
    adminStatusError: "#EF4444",
    adminStatusWarning: "#F59E0B",
    adminStatusInfo: "#3B82F6",
    adminTextMuted: "#9CA3AF",
  },
} as DefaultTheme;

export default SuperAdminDashboard;
