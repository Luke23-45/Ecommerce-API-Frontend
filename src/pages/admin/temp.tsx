// src/pages/admin/AdminRouter.tsx
import React, { useState, useEffect, useCallback, Suspense, useMemo } from 'react';
import {
  useRoutes,
  useLocation,
  useNavigate,
  Outlet,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTheme, type DefaultTheme } from 'styled-components';
import { FaSpinner } from 'react-icons/fa';

import AdminLayout from '@/components/admin/Layout/AdminLayout';
import { PageContainer } from '@/components/seller/ViewSellerApplication.styles';
import BannerEditModal from '@/components/admin/Marketing/BannerEditModal';
import ConfirmationModal from '@/components/admin/common/ConfirmationModal/ConfirmationModal';

// --- UPDATED IMPORT ---
// We now import the named 'adminRoutesConfig' array for logic, and the 'AdminRouteObject' type.
import { adminRoutesConfig, type AdminRouteObject } from '@/routes/AdminRoutes';

import { type RootState } from '@/store/types';
import { type UserRole, ROLES_CONFIG, type NavItem } from '@/config/rolesConfig';
import { useNotification } from '@/contexts/NotificationContext';
import { isPathAccessibleForRole, findNavItemByPath } from '@/utils/navigationUtils';

const AdminRouterComponent: React.FC = () => {
  const { user, loading: authLoading } = useSelector((state: RootState) => state.auth);
  const themeContext = useTheme();
  const theme = (themeContext && Object.keys(themeContext).length > 0 ? themeContext : undefined) as DefaultTheme | undefined;

  const location = useLocation();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);
  const [pageTitle, setPageTitle] = useState<string>('Admin Panel');

  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState<{
    title: string;
    message: string | React.ReactNode;
    onConfirm: () => void;
    confirmButtonText?: string;
    confirmVariant?: "primary" | "danger";
  } | null>(null);

  useEffect(() => {
    if (user?.roles) {
      const newRole = user.roles[1] as UserRole;
      if (newRole !== currentUserRole) {
        setCurrentUserRole(newRole);
      }
    } else if (!authLoading && !user) {
      console.warn("[AdminRouter] User not authenticated. Implement redirection to login.");
    }
  }, [user, authLoading, currentUserRole, navigate, location]);

  useEffect(() => {
    if (!currentUserRole) return;

    const currentFullPath = location.pathname;
    const activeNavItem = findNavItemByPath(currentFullPath, currentUserRole);

    if (activeNavItem?.label) {
      setPageTitle(activeNavItem.label);
    } else {
      const adminRelativePath = currentFullPath.startsWith('/admin/')
        ? currentFullPath.substring('/admin'.length).replace(/^\/+/, '')
        : currentFullPath.replace(/^\/+/, '');

      // --- USE RENAMED VARIABLE ---
      const matchedRoute = adminRoutesConfig.find(r => {
          const routePath = r.path?.replace(/:\w+/g, '[^/]+');
          return new RegExp(`^${routePath}(\\/.*|$)`).test(adminRelativePath);
      });

      if (matchedRoute?.handle?.title) {
        setPageTitle(matchedRoute.handle.title);
      } else {
        const defaultDashboardNavItem = findNavItemByPath(ROLES_CONFIG[currentUserRole]?.defaultDashboardPath, currentUserRole);
        setPageTitle(defaultDashboardNavItem?.label || ROLES_CONFIG[currentUserRole]?.defaultDashboardPath || 'Admin Panel');
      }
    }
  }, [location.pathname, currentUserRole]);

  useEffect(() => {
    if (!currentUserRole) return;

    const currentFullPath = location.pathname;
    if (!isPathAccessibleForRole(currentFullPath, currentUserRole)) {
      const roleDefaultPath = ROLES_CONFIG[currentUserRole]?.defaultDashboardPath || '/admin/dashboard';
      const destination = roleDefaultPath.startsWith('/admin/') ? roleDefaultPath : `/admin${roleDefaultPath.startsWith('/') ? '' : '/'}${roleDefaultPath}`;

      console.warn(`[AdminRouter] Access to "${currentFullPath}" denied for role "${currentUserRole}". Redirecting to "${destination}".`);
      showNotification(`Access to the requested page is restricted for your role.`, "warning");
      navigate(destination, { replace: true });
    }
  }, [location.pathname, currentUserRole, navigate, showNotification]);

  const routesToRender = useMemo(() => {
    if (!currentUserRole) return [];

    // --- USE RENAMED VARIABLE ---
    return adminRoutesConfig.map(route => {
      if (route.path === 'dashboard' && React.isValidElement(route.element)) {
        return { ...route, element: React.cloneElement(route.element as React.ReactElement, { userRole: currentUserRole }) };
      }
      return route;
    });
  }, [currentUserRole]);

  const routeElements = useRoutes(routesToRender);

  const handleNavigate = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  const handleSaveBanner = () => {
    setIsBannerModalOpen(false);
    setEditingBanner(null);
    showNotification('Banner saved successfully! (Demo)', 'success');
  };
  const handleCancelBannerEdit = () => {
    setIsBannerModalOpen(false);
    setEditingBanner(null);
  };

  const handleConfirmModalConfirm = () => {
    if (confirmModalData?.onConfirm) {
      confirmModalData.onConfirm();
    }
    setIsConfirmModalOpen(false);
    setConfirmModalData(null);
  };
  const handleConfirmModalCancel = () => {
    setIsConfirmModalOpen(false);
    setConfirmModalData(null);
  };

  if (authLoading || !theme || !currentUserRole) {
    return (
      <PageContainer style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: theme?.colors?.adminPrimaryBg || '#f4f6f8' }}>
        <div style={{ textAlign: "center", color: theme?.colors?.adminText || '#333' }}>
          <FaSpinner
            className="fa-spin"
            style={{
              fontSize: "3rem",
              marginBottom: theme?.spacing?.(4) || "16px",
              color: theme?.colors?.accent1 || "#007bff",
            }}
          />
          <p style={{ fontSize: theme?.typography?.admin?.sizes?.bodyLarge || "1.1rem", fontWeight: theme?.typography?.admin?.weights?.medium || 500 }}>
            Loading Admin Panel...
          </p>
        </div>
      </PageContainer>
    );
  }

  return (
    <AdminLayout
      pageTitle={pageTitle}
      activePath={location.pathname}
      userRole={currentUserRole}
      onNavLinkClick={handleNavigate}
    >
      <Suspense fallback={
        <PageContainer style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexGrow: 1, padding: "20px", minHeight: "calc(100vh - 150px)" }}>
           <div style={{ textAlign: "center", color: theme?.colors?.adminText || '#333' }}>
            <FaSpinner className="fa-spin" style={{ fontSize: "2.5rem", marginBottom: "15px", color: theme?.colors?.accent1 || "#007bff" }} />
            <p style={{ fontSize: theme?.typography?.admin?.sizes?.bodyBase || "1rem" }}>Loading page content...</p>
           </div>
        </PageContainer>
      }>
        {routeElements ? routeElements : <Outlet />}
      </Suspense>

      <BannerEditModal
        isOpen={isBannerModalOpen}
        onClose={handleCancelBannerEdit}
        onSave={handleSaveBanner}
        editingBanner={editingBanner}
      />
      {isConfirmModalOpen && confirmModalData && (
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          title={confirmModalData.title}
          message={confirmModalData.message}
          onConfirm={handleConfirmModalConfirm}
          onCancel={handleConfirmModalCancel}
          confirmButtonText={confirmModalData.confirmButtonText}
          confirmVariant={confirmModalData.confirmVariant}
        />
      )}
    </AdminLayout>
  );
};

export default AdminRouterComponent;
