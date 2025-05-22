// src/components/Admin/Layout/Layout.tsx
import React from 'react';
import {
  AdminLayoutContainer,
  AdminMainContent,
  PageContentWrapper,
  PageTitle,
} from './Layout.styles';
import AdminHeader from '../Header/Header';
import AdminSidebar from '../Sidebar/Sidebar';

import { useNotification } from '@/contexts/NotificationContext';


interface AdminLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  activePath: string;
  onNavLinkClick?: (path: string) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, pageTitle, activePath, onNavLinkClick }) => {
    const { showNotification } = useNotification(); 

    const handleSearch = (query: string) => { console.log("Admin Global Search:", query); };
    

    const handleNotificationsClick = () => {
        showNotification("You have 3 new notifications!", "info", 4000); // Increased duration for testing
        console.log("Notifications clicked - should see a notification now.");
    };

    const handleQuickAction = () => {
        showNotification("Quick action performed successfully!", "success", 4000); // Increased duration for testing
        console.log("Quick action triggered - should see a notification now.");
    };

    const handleLogout = () => {
        showNotification("You have been logged out (Demo).", "info", 4000);
        console.log("Admin logout");
        // In a real app, implement actual logout logic here.
    };

    const handleViewStore = () => {
        console.log("View Store Front clicked");
        window.open('/', '_blank');
        showNotification("Opening frontend store...", "info", 2000);
    };

  return (
    <AdminLayoutContainer>
      <AdminHeader
        adminName="Élan Admin"
        onSearch={handleSearch}
        onNotificationsClick={handleNotificationsClick} 
        onQuickActionClick={handleQuickAction} 
        onLogout={handleLogout}
        onViewStore={handleViewStore}
      />
      <AdminMainContent>
        <AdminSidebar activePath={activePath} onNavLinkClick={onNavLinkClick} />
        <PageContentWrapper>
          <PageTitle>{pageTitle}</PageTitle>
          {children}
        </PageContentWrapper>
      </AdminMainContent>
    </AdminLayoutContainer>
  );
};

export default AdminLayout;