import React from "react";
import {
  AdminLayoutContainer,
  AdminMainContent,
  PageContentWrapper,
  PageTitle,
} from "./Layout.styles";
import AdminHeader from "../Header/Header";
import AdminSidebar from "../Sidebar/adminSidebar";

import { useNotification } from "@/contexts/NotificationContext";
import type { UserRole } from "@/config/rolesConfig";

interface AdminLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  activePath: string;
  userRole: UserRole;
  onNavLinkClick?: (path: string) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  pageTitle,
  activePath,
  userRole,
  onNavLinkClick,
}) => {
  const { showNotification } = useNotification();

  const handleSearch = (query: string) => {
    console.log(`Admin Global Search (Role: ${userRole}):`, query);
  };

  const handleNotificationsClick = () => {
    showNotification("You have 3 new notifications! (Demo)", "info", 4000);
    console.log(
      `Notifications clicked (Role: ${userRole}) - should see a notification.`
    );
  };

  const handleQuickAction = () => {
    showNotification(
      "Quick action performed successfully! (Demo)",
      "success",
      4000
    );
    console.log(
      `Quick action triggered (Role: ${userRole}) - should see a notification.`
    );
  };

  const handleLogout = () => {
    showNotification("You have been logged out (Demo).", "info", 4000);
    console.log(`Admin logout initiated (Role: ${userRole})`);
  };

  const handleViewStore = () => {
    console.log(`View Store Front clicked (Role: ${userRole})`);
    window.open("/", "_blank");
    showNotification("Opening frontend store...", "info", 2000);
  };

  return (
    <AdminLayoutContainer>
      <AdminHeader
        adminName="Élan Admin"
        userRole={userRole}
        onSearch={handleSearch}
        onNotificationsClick={handleNotificationsClick}
        onQuickActionClick={handleQuickAction}
        onLogout={handleLogout}
        onViewStore={handleViewStore}
      />
      <AdminMainContent>
        <AdminSidebar
          activePath={activePath}
          userRole={userRole}
          onNavLinkClick={onNavLinkClick}
        />
        <PageContentWrapper>
          <PageTitle>{pageTitle}</PageTitle>
          {children}
        </PageContentWrapper>
      </AdminMainContent>
    </AdminLayoutContainer>
  );
};

export default AdminLayout;
