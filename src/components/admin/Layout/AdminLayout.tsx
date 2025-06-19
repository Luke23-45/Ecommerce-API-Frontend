// src/components/admin/Layout/AdminLayout.tsx
import React, { useState } from "react"; // Added useState
import {
  AdminLayoutContainer,
  AdminMainContent,
  PageContentWrapper,
  PageTitle as StyledPageTitle // Aliased if 'PageTitle' is ambiguous
} from "./Layout.styles"; // Assuming Layout.styles.ts is in the same directory
import AdminHeader from "../Header/Header"; // Adjust path if necessary
import AdminSidebar from "../Sidebar/adminSidebar"; // Adjust path if necessary

import { useNotification } from "@/contexts/NotificationContext"; // Ensure path is correct
import type { UserRole } from "@/config/rolesConfig"; // Ensure path is correct
// If AdminHeader's onQuickActionClick navigates, you might need useNavigate here or in AdminHeader
// import { useNavigate } from "react-router-dom";

interface AdminLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  activePath: string;
  userRole: UserRole;
  onNavLinkClick: (path: string) => void; // For AdminRouter to handle navigation if needed
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  pageTitle,
  activePath,
  userRole,
  onNavLinkClick, // Passed from AdminRouter, mainly for non-Link triggered navigation
}) => {
  const { showNotification } = useNotification();
  // const navigate = useNavigate(); // Uncomment if any handlers here need to navigate

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  // --- Handlers for AdminHeader ---
  // These are passed to AdminHeader. Ensure their logic is complete or appropriately dummied.
  const handleSearch = (query: string) => {
    console.log(`[AdminLayout] Search Triggered (Role: ${userRole}):`, query);
    // Implement actual search logic or API call here
    showNotification(`Search for: "${query}" (Feature not fully implemented)`, "info");
  };

  const handleNotificationsClick = () => {
    console.log(`[AdminLayout] Notifications Clicked (Role: ${userRole})`);
    // Implement logic to show notifications panel/dropdown
    showNotification("You have 3 new notifications! (Demo)", "info", 4000);
  };

  // This handler now matches the AdminHeader's expectation of receiving an 'actionType'
  const handleQuickActionClick = (actionType: string) => {
    console.log(`[AdminLayout] Quick Action Triggered (Role: ${userRole}, Action: ${actionType})`);
    // Based on actionType, perform an action.
    // This might involve showing a modal, navigating, or calling an API.
    // Example:
    // if (actionType === 'vendor:addProduct') {
    //   onNavLinkClick('/products/new'); // Assuming onNavLinkClick handles navigation relative to /admin
    // }
    showNotification(
      `Quick action "${actionType}" initiated! (Demo)`,
      "success",
      4000
    );
  };

  const handleLogout = () => {
    console.log(`[AdminLayout] Logout Initiated (Role: ${userRole})`);
    // Implement actual logout:
    // 1. Clear Redux auth state / local storage tokens
    // 2. Call logout API endpoint
    // 3. Navigate to login page: onNavLinkClick('/auth/login'); or navigate('/auth/login');
    showNotification("You have been logged out (Demo). Implement actual logout.", "info", 4000);
    // For demonstration, let's assume onNavLinkClick can take full paths for non-admin areas
    // onNavLinkClick('/login'); // Or whatever your login path is
  };

  const handleViewStore = () => {
    console.log(`[AdminLayout] View Store Front Clicked (Role: ${userRole})`);
    window.open("/", "_blank"); // Opens frontend store in new tab
    showNotification("Opening frontend store in a new tab...", "info", 2000);
  };

  return (
    <AdminLayoutContainer>
      <AdminHeader
        userRole={userRole}
        // Pass down all required handlers and state to AdminHeader
        onSearch={handleSearch}
        onNotificationsClick={handleNotificationsClick}
        onQuickActionClick={handleQuickActionClick}
        onLogout={handleLogout}
        onViewStore={handleViewStore}
        onToggleSidebar={handleToggleSidebar}
        isSidebarCollapsed={isSidebarCollapsed}
        // userDisplayName and userAvatarSrc would typically come from Redux state
        // and be selected here or in AdminRouter and passed down if needed.
        // For now, AdminHeader uses defaults if these are not provided.
    />
      <AdminMainContent>
        <AdminSidebar
          activePath={activePath} // For highlighting the current page link
          userRole={userRole}       // For filtering nav items
          onNavLinkClick={onNavLinkClick} // Sidebar uses <Link>, but prop kept for rare cases
          isCollapsed={isSidebarCollapsed} // To control sidebar's collapsed state
        />
        <PageContentWrapper>
          <StyledPageTitle>{pageTitle}</StyledPageTitle>
          {children} {/* This is where {routeElements} from AdminRouter will render */}
        </PageContentWrapper>
      </AdminMainContent>
    </AdminLayoutContainer>
  );
};

export default AdminLayout;