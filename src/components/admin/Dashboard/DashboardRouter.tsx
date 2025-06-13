import React from "react";
import SellerDashboard from "./SellerDashboard";
import VendorDashboard from "./VendorDashboard";
import AdminDashboard from "./SuperAdminDashboard";
interface DashboardRouterProps {
  userRole: "seller" | "vendor" | "admin";
}

const DashboardRouter: React.FC<DashboardRouterProps> = ({ userRole }) => {
  switch (userRole) {
    case "seller":
      return <SellerDashboard />;
    case "vendor":
      return <VendorDashboard />;
    case "admin":
      return <AdminDashboard />;
    default:
      console.warn(
        `Dashboard for role "${userRole}" not yet implemented or invalid.`
      );
      return <SellerDashboard />;
  }
};

export default DashboardRouter;
