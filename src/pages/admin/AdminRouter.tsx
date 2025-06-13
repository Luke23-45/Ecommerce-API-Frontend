// src/pages/admin/AdminRouter.tsx
import React, { useState, useEffect, useCallback, Suspense, useMemo } from 'react';
import {
  useRoutes,
  useLocation,
  useNavigate,
  // Navigate, // Only if directly used for declarative redirect, typically navigate() hook is used
  Outlet, // Import Outlet if any top-level routes in adminRoutes are parent-only
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTheme, type DefaultTheme } from 'styled-components';
import { FaSpinner } from 'react-icons/fa';

import AdminLayout from '@/components/admin/Layout/AdminLayout';
import { PageContainer } from '@/components/seller/ViewSellerApplication.styles'; // Or your generic loading container
// ---- Global Modals: Import types if not already globally available in AdminRouter scope ----
// import type { PromotionBanner } from "@/types/marketing"; // Example type for editingBanner
import BannerEditModal from '@/components/admin/Marketing/BannerEditModal';
import ConfirmationModal from '@/components/admin/common/ConfirmationModal/ConfirmationModal';

import { adminRoutes, type AdminRouteObject } from '@/routes/AdminRoutes'; // Your route definitions
import { type RootState } from '@/store/types'; // Your Redux RootState
import { type UserRole, ROLES_CONFIG, type NavItem } from '@/config/rolesConfig'; // Core config
import { useNotification } from '@/contexts/NotificationContext';
import { isPathAccessibleForRole, findNavItemByPath } from '@/utils/navigationUtils'; // Your utility functions

const AdminRouterComponent: React.FC = () => {
  const { user, loading: authLoading } = useSelector((state: RootState) => state.auth);
  const themeContext = useTheme(); // from styled-components ThemeProvider
  const theme = (themeContext && Object.keys(themeContext).length > 0 ? themeContext : undefined) as DefaultTheme | undefined;

  const location = useLocation(); // Current URL details
  const navigate = useNavigate(); // For programmatic navigation
  const { showNotification } = useNotification(); // For displaying messages

  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);
  const [pageTitle, setPageTitle] = useState<string>('Admin Panel'); // Default page title

  // --- Global Modals State (Consider moving to a dedicated ModalContext) ---
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any | null>(null); // Replace 'any' with 'PromotionBanner' type
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState<{
    title: string;
    message: string | React.ReactNode;
    onConfirm: () => void;
    confirmButtonText?: string;
    confirmVariant?: "primary" | "danger";
  } | null>(null);

  // Effect 1: Determine User Role and Handle Authentication
  useEffect(() => {
    if (user?.roles) {
      const newRole = user.roles[1] as UserRole;
      if (newRole !== currentUserRole) { // Update only if role actually changes
        setCurrentUserRole(newRole);
      }
    } else if (!authLoading && !user) {
      // User is not authenticated, and auth loading is complete
      console.warn("[AdminRouter] User not authenticated. Implement redirection to login.");
      // Example: navigate('/login', { state: { from: location }, replace: true });
      // For now, let's assume a public admin page or auth is handled before reaching here
      // or that some routes are public within admin (unlikely for most admin panels).
      // If no public admin routes, this should ideally redirect.
    }
  }, [user, authLoading, currentUserRole, navigate, location]);

  // Effect 2: Determine Page Title based on current path and role
  useEffect(() => {
    if (!currentUserRole) return; // Wait for role

    const currentFullPath = location.pathname; // e.g., /admin/products or /products if basename="/admin"

    // Try to find NavItem for the most specific title (role-aware label)
    const activeNavItem = findNavItemByPath(currentFullPath, currentUserRole);

    if (activeNavItem?.label) {
      setPageTitle(activeNavItem.label);
    } else {
      // Fallback: Try to get title from the matched route config in adminRoutes.tsx
      // This helps for pages without direct NavItems (e.g., dynamic edit pages)
      const adminRelativePath = currentFullPath.startsWith('/admin/') // Assuming paths in adminRoutes are relative to /admin
        ? currentFullPath.substring('/admin'.length).replace(/^\/+/, '')
        : currentFullPath.replace(/^\/+/, '');

      // Simple match for demonstration; use useMatches() from RR v6.4+ for robust matching
      const matchedRoute = adminRoutes.find(r => {
          const routePath = r.path?.replace(/:\w+/g, '[^/]+'); // basic regex for params
          return new RegExp(`^${routePath}(\\/.*|$)`).test(adminRelativePath);
      });

      if (matchedRoute?.handle?.title) {
        setPageTitle(matchedRoute.handle.title);
      } else {
        // Ultimate fallback: role's default dashboard title or a generic admin title
        const defaultDashboardNavItem = findNavItemByPath(ROLES_CONFIG[currentUserRole]?.defaultDashboardPath, currentUserRole);
        setPageTitle(defaultDashboardNavItem?.label || ROLES_CONFIG[currentUserRole]?.defaultDashboardPath || 'Admin Panel');
      }
    }
  }, [location.pathname, currentUserRole]); // Removed adminRoutes from deps, title logic is self-contained with utils

  // Effect 3: Check Path Accessibility and Redirect if Necessary
  useEffect(() => {
    if (!currentUserRole) return; // Wait for role

    const currentFullPath = location.pathname;
    if (!isPathAccessibleForRole(currentFullPath, currentUserRole)) {
      const roleDefaultPath = ROLES_CONFIG[currentUserRole]?.defaultDashboardPath || '/admin/dashboard';
      const destination = roleDefaultPath.startsWith('/admin/') ? roleDefaultPath : `/admin${roleDefaultPath.startsWith('/') ? '' : '/'}${roleDefaultPath}`;

      console.warn(`[AdminRouter] Access to "${currentFullPath}" denied for role "${currentUserRole}". Redirecting to "${destination}".`);
      showNotification(`Access to the requested page is restricted for your role.`, "warning");
      navigate(destination, { replace: true });
    }
  }, [location.pathname, currentUserRole, navigate, showNotification]);
useEffect(() => {
  if (!currentUserRole) return;
  const currentFullPath = location.pathname;
  const accessible = isPathAccessibleForRole(currentFullPath, currentUserRole);
  console.log(`Checking path: ${currentFullPath}, Role: ${currentUserRole}, Accessible: ${accessible}`);
  if (!accessible) {
    // ... redirection logic
  }
}, [location.pathname, currentUserRole, navigate, showNotification]);
  // Memoize routes, adapting them if necessary (e.g., passing userRole to specific route elements)
  const routesToRender = useMemo(() => {
    if (!currentUserRole) return []; // No routes if role isn't determined yet

    return adminRoutes.map(route => {
      // Example: Pass currentUserRole to AdminDashboardRouter if it needs it as a prop
      if (route.path === 'dashboard' && React.isValidElement(route.element)) {
        return { ...route, element: React.cloneElement(route.element, { userRole: currentUserRole }) };
      }
      // Add more conditions here if other specific route elements need dynamic props from AdminRouter
      return route;
    });
  }, [currentUserRole]); // adminRoutes is stable, so not in deps

  const routeElements = useRoutes(routesToRender); // `useRoutes` hook renders the matched route

  // Callback for AdminLayout or other child components to trigger navigation
  const handleNavigate = useCallback((path: string) => {
    // Paths should be relative to the /admin base if BrowserRouter uses basename="/admin"
    // or full paths if not.
    navigate(path);
  }, [navigate]);


  // --- Handlers for Global Modals (Consider moving to ModalContext) ---
  const handleSaveBanner = (/*bannerData: PromotionBanner, isNew: boolean*/) => { // Use correct types
    setIsBannerModalOpen(false);
    setEditingBanner(null); // Clear editing state
    showNotification('Banner saved successfully! (Demo)', 'success');
    // Potentially refetch banner list or update Redux store
  };
  const handleCancelBannerEdit = () => {
    setIsBannerModalOpen(false);
    setEditingBanner(null);
  };

  const handleConfirmModalConfirm = () => {
    if (confirmModalData?.onConfirm) {
      confirmModalData.onConfirm(); // Execute the specific confirmation action
    }
    setIsConfirmModalOpen(false);
    setConfirmModalData(null); // Reset modal data
  };
  const handleConfirmModalCancel = () => {
    setIsConfirmModalOpen(false);
    setConfirmModalData(null);
  };
  // --- End Global Modal Handlers ---

  // Loading state: Wait for authentication, theme, and user role
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

  // Main Render: AdminLayout with Suspense for lazy-loaded route elements
  return (
    <AdminLayout
      pageTitle={pageTitle}
      activePath={location.pathname} // Sidebar uses this to highlight current item
      userRole={currentUserRole}       // For role-specific UI in Layout/Header/Sidebar
      onNavLinkClick={handleNavigate}  // For any layout-triggered navigation
    >
      <Suspense fallback={
        <PageContainer style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexGrow: 1, padding: "20px", minHeight: "calc(100vh - 150px)" /* Adjust based on header/footer height */ }}>
           <div style={{ textAlign: "center", color: theme?.colors?.adminText || '#333' }}>
            <FaSpinner className="fa-spin" style={{ fontSize: "2.5rem", marginBottom: "15px", color: theme?.colors?.accent1 || "#007bff" }} />
            <p style={{ fontSize: theme?.typography?.admin?.sizes?.bodyBase || "1rem" }}>Loading page content...</p>
           </div>
        </PageContainer>
      }>
        {routeElements ? routeElements : <Outlet />}
      </Suspense>

      {/* Render Global Modals: These could be moved into a ModalProvider/Context */}
      <BannerEditModal
        isOpen={isBannerModalOpen}
        onClose={handleCancelBannerEdit}
        onSave={handleSaveBanner}
        editingBanner={editingBanner}
        // You'll need to pass any other required props to BannerEditModal
        // promotionsData={[]} // Example: data it might need
        // onUploadImage={async (file) => { console.log(file); return 'url'; }} // Example: uploader
      />
      {isConfirmModalOpen && confirmModalData && (
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          title={confirmModalData.title}
          message={confirmModalData.message} // Can be string or ReactNode
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