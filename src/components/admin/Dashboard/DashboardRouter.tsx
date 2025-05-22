import React from "react";
import SellerDashboard from "./SellerDashboard";
import VendorDashboard from "./VendorDashboard";
import SuperAdminDashboard from "./SuperAdminDashboard";

interface DashboardRouterProps {
  userRole: "seller" | "vendor" | "superAdmin";
}

const DashboardRouter: React.FC<DashboardRouterProps> = ({ userRole }) => {
  switch (userRole) {
    case "seller":
      return <SellerDashboard />;
    case "vendor":
      return <VendorDashboard />;
    case "superAdmin":
      return <SuperAdminDashboard />;
    default:
      console.warn(
        `Dashboard for role "${userRole}" not yet implemented or invalid.`
      );
      return <SellerDashboard />;
  }
};

export default DashboardRouter;
