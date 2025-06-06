// src/pages/admin/index.tsx (or your equivalent AdminPage file)

import React, { useState, useEffect } from "react";

import AdminLayout from "@/components/admin/Layout/AdminLayout";
import DashboardRouter from "@/components/admin/Dashboard/DashboardRouter";
import ProductList from "@/components/admin/Products/ProductList";
import ProductDetail_ from "@/components/admin/Products/ProductDetail";
import CategoryList from "@/components/Categories/CategoryList";
import OrderList from "@/components/admin/Orders/OrderList";
import OrderDetail from "@/components/admin/Orders/OrderDetail";
import CustomerList from "@/components/admin/Customers/CustomerList";
import CustomerDetail from "@/components/admin/Customers/CustomerDetail";
import ReportsOverview from "@/components/admin/Reports/ReportsOverview";
import BannerEditModal from "@/components/admin/Marketing/BannerEditModal";
import MarketingList from "@/components/admin/Marketing/MarketingList";
import SettingsOverview from "@/components/admin/settings/SettingsOverview";
import ConfirmationModal from "@/components/admin/common/ConfirmationModal/ConfirmationModal";
import AttributesOverview from "@/components/admin/Products/AttributesOverview";
import InventoryOverview from "@/components/admin/Products/InventoryOverview";
import SellerApplicationList from "@/components/admin/Application/SellerApplications/SellerApplicationList";
import SellerApplicationDetail from "@/components/admin/Application/SellerApplications/SellerApplicationDetail";
import VendorApplicationList from "@/components/admin/Application/VendorApplications/VendorApplicationList";
import VendorApplicationDetail from "@/components/admin/Application/VendorApplications/VendorApplicationDetail";

import type { ProductDetail as ProductDetailType } from "@/types/product";

import type { PromotionBanner } from "@/types/marketing";
import type { PlatformUser, GeneralSettings } from "@/types/settings";

// Contexts
import { useNotification } from "@/contexts/NotificationContext";

import type { UserRole } from "@/config/rolesConfig";
import { ROLES_CONFIG } from "@/config/rolesConfig";
import { isPathAccessibleForRole } from "@/utils/navigationUtils";

import { allDummyProducts } from "@/data/adminMockData/mockData";
import { allDummyOrders } from "@/data/adminMockData/mockData";
import { allDummyCustomers } from "@/data/adminMockData/mockData";
import { allDummyBanners } from "@/data/adminMockData/mockData";
import { allPlatformUsers } from "@/data/adminMockData/mockData";
import { currentGeneralSettings } from "@/data/adminMockData/mockData";
import { allDummySellerApplications } from "@/data/adminMockData/mockData";
import { allDummyVendorApplications } from "@/data/adminMockData/mockData";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/types";
import { PageContainer } from "@/components/seller/ViewSellerApplication.styles";
import { FaSpinner } from "react-icons/fa";
import { useTheme, type DefaultTheme } from "styled-components";

const ApplicationOverview: React.FC<{
  onNavigateToSection: (path: string) => void;
}> = ({ onNavigateToSection }) => (
  <div
    style={{
      padding: 20,
      border: "1px solid #ccc",
      background: "#f9f9f9",
      borderRadius: 8,
      textAlign: "center",
    }}
  >
    {" "}
    <h2>Application Management Overview</h2>{" "}
    <p>
      This page provides a central point for managing seller and vendor
      applications.
    </p>{" "}
    <div style={{ marginTop: "20px" }}>
      {" "}
      <button
        onClick={() => onNavigateToSection("/admin/applications/sellers")}
        style={{ marginRight: "10px", padding: "10px 15px" }}
      >
        View Seller Applications
      </button>{" "}
      <button
        onClick={() => onNavigateToSection("/admin/applications/vendors")}
        style={{ padding: "10px 15px" }}
      >
        View Vendor Applications
      </button>{" "}
    </div>{" "}
  </div>
);

const AdminPage: React.FC = () => {
  const {
    isAuthenticated: reduxIsAuthenticated,
    user,
    loading: authLoading,
  } = useSelector((state: RootState) => state.auth);

  // const roleName = getAdminRole((user.role?user.role:null));

  const themeFromContext = useTheme();
  const theme = (themeFromContext &&
    Object.keys(themeFromContext).length > 10 &&
    themeFromContext) as DefaultTheme;

  const [userRole] = useState<UserRole>("superAdmin");

  const [currentPath, setCurrentPath] = useState<string>(() => {
    const roleConfig = ROLES_CONFIG[userRole];
    return roleConfig ? roleConfig.defaultDashboardPath : "/admin/dashboard";
  });

  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<PromotionBanner | null>(
    null
  );

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState<{
    title: string;
    message: string | React.ReactNode;
    onConfirm: () => void;
    confirmButtonText?: string;
    confirmVariant?: "primary" | "danger";
  } | null>(null);

  const { showNotification } = useNotification();

  // This  ensures the user starts at their designated default dashboard
  // or if the currentPath somehow becomes invalid for their role.
  useEffect(() => {
    const roleConfig = ROLES_CONFIG[userRole];
    const defaultPath = roleConfig
      ? roleConfig.defaultDashboardPath
      : "/admin/dashboard";

    // If currentPath is not accessible for the role, redirect to default
    // This also handles the initial mount ensuring user is on their correct default.
    if (!isPathAccessibleForRole(currentPath, userRole)) {
      console.warn(
        `[AdminPage] Role "${userRole}" was on/attempted path "${currentPath}" which is not accessible. Redirecting to "${defaultPath}".`
      );
      setCurrentPath(defaultPath);
    } else if (
      currentPath !== defaultPath &&
      currentPath === "/admin/dashboard" &&
      defaultPath !== "/admin/dashboard"
    ) {
      // If current path is the generic dashboard but role has a more specific default, use that.
      // This handles the initial load better if useState's initial function isn't re-evaluated as expected on role change.
      setCurrentPath(defaultPath);
    }
  }, [userRole, currentPath]);
  const handleNavLinkClick = (path: string) => {
    // Before setting path, check if it's accessible.
    // The sidebar should already filter, but this is a safeguard,
    // especially if navigation can occur through other means (e.g. buttons in content).
    if (isPathAccessibleForRole(path, userRole)) {
      setCurrentPath(path);
      console.log(`[AdminPage] Navigating to: ${path} (Role: ${userRole})`);
    } else {
      const roleDefaultPath =
        ROLES_CONFIG[userRole]?.defaultDashboardPath || "/admin/dashboard";
      console.warn(
        `[AdminPage] Role "${userRole}" attempted to navigate to unconfigured/inaccessible path "${path}". Redirecting to "${roleDefaultPath}".`
      );
      setCurrentPath(roleDefaultPath);
      showNotification(
        `Access to "${path}" is restricted for your role.`,
        "warning"
      );
    }
  };

  const getIdFromPath = (path: string, segment: string): string | null => {
    const match = path.match(
      new RegExp(`\\/admin\\/${segment}\\/([^\\/]+)(?:\\/edit)?$`)
    );
    return match ? match[1] : null;
  };

  function getAdminRole(
    role: string
  ): "seller" | "vendor" | "superuser" | null {
    const adminRoles = ["seller", "vendor", "superuser"] as const;
    return adminRoles.includes(role as (typeof adminRoles)[number])
      ? (role as (typeof adminRoles)[number])
      : null;
  }

  // Path-based booleans and ID extractions
  let isEditingProductPage =
    currentPath.startsWith("/admin/products/") && currentPath.endsWith("/edit");
  const isAddingProductPage = currentPath === "/admin/products/new";
  const productIdToEdit = isEditingProductPage
    ? getIdFromPath(currentPath, "products")
    : null;

  const isViewingApplicationOverviewPage =
    currentPath === "/admin/applications";
  const isViewingSellerApplicationListPage =
    currentPath === "/admin/applications/sellers";
  const isViewingSellerApplicationDetailPage =
    currentPath.startsWith("/admin/applications/sellers/") &&
    !currentPath.endsWith("/edit") &&
    getIdFromPath(currentPath, "applications/sellers") !== null;
  const sellerApplicationIdToView = isViewingSellerApplicationDetailPage
    ? getIdFromPath(currentPath, "applications/sellers")
    : null;
  const isViewingVendorApplicationListPage =
    currentPath === "/admin/applications/vendors";
  const isViewingVendorApplicationDetailPage =
    currentPath.startsWith("/admin/applications/vendors/") &&
    !currentPath.endsWith("/edit") &&
    getIdFromPath(currentPath, "applications/vendors") !== null;
  const vendorApplicationIdToView = isViewingVendorApplicationDetailPage
    ? getIdFromPath(currentPath, "applications/vendors")
    : null;

  const isViewingOrderPage =
    currentPath.startsWith("/admin/orders/") &&
    !currentPath.endsWith("/new") &&
    currentPath !== "/admin/orders";
  const orderIdToView = isViewingOrderPage
    ? getIdFromPath(currentPath, "orders")
    : null;

  const isViewingCustomerPage =
    currentPath.startsWith("/admin/customers/") &&
    currentPath !== "/admin/customers";
  const customerIdToView = isViewingCustomerPage
    ? getIdFromPath(currentPath, "customers")
    : null;

  let isEditingBannerPage =
    currentPath.startsWith("/admin/marketing/") &&
    currentPath.endsWith("/edit");
  const isAddingBannerPage = currentPath === "/admin/marketing/new";
  const bannerIdToEdit = isEditingBannerPage
    ? getIdFromPath(currentPath, "marketing")
    : null;

  // Generic Confirmation Trigger
  const showConfirmModal = (
    title: string,
    message: string | React.ReactNode,
    onConfirm: () => void,
    confirmButtonText = "Confirm",
    confirmVariant: "primary" | "danger" = "primary"
  ) => {
    setConfirmModalData({
      title,
      message,
      onConfirm,
      confirmButtonText,
      confirmVariant,
    });
    setIsConfirmModalOpen(true);
  };
  const handleConfirmModalCancel = () => {
    setIsConfirmModalOpen(false);
    setConfirmModalData(null);
    showNotification("Action cancelled.", "info");
  };
  const handleConfirmModalConfirm = () => {
    if (confirmModalData?.onConfirm) confirmModalData.onConfirm();
    setIsConfirmModalOpen(false);
    setConfirmModalData(null);
  };

  // CRUD Handlers
  const handleSaveProduct = (product: ProductDetailType, isNew: boolean) => {
    console.log(`Product ${isNew ? "CREATED" : "UPDATED"}:`, product.name);
    showNotification(
      `Product "${product.name}" ${isNew ? "created" : "updated"}!`,
      "success"
    );
    handleNavLinkClick("/admin/products");
  };
  const handleDeleteProduct = (productId: string, productName: string) =>
    showConfirmModal(
      `Delete: ${productName}`,
      `Delete "${productName}"?`,
      () => {
        console.log(`DELETED Product ID: ${productId}`);
        showNotification(`Product "${productName}" deleted!`, "success");
      },
      "Delete",
      "danger"
    );
  const handleCancelProductEdit = () => handleNavLinkClick("/admin/products");
  const handleViewOrderDetails = (orderId: string) =>
    handleNavLinkClick(`/admin/orders/${orderId}`);
  const handleViewCustomerDetails = (customerId: string) =>
    handleNavLinkClick(`/admin/customers/${customerId}`);
  const handleDeleteCustomer = (customerId: string, customerName: string) =>
    showConfirmModal(
      `Delete: ${customerName}`,
      `Delete customer "${customerName}"?`,
      () => {
        console.log(`DELETED Customer ID: ${customerId}`);
        showNotification(`Customer "${customerName}" deleted!`, "success");
      },
      "Delete",
      "danger"
    );
  const handleAddBanner = () => {
    setEditingBanner(null);
    setIsBannerModalOpen(true);
    handleNavLinkClick("/admin/marketing/new");
  };
  const handleEditBanner = (bannerId: string) => {
    const bannerToEdit = allDummyBanners.find((b) => b._id === bannerId);
    setEditingBanner(bannerToEdit || null);
    setIsBannerModalOpen(true);
    handleNavLinkClick(`/admin/marketing/${bannerId}/edit`);
  };
  const handleSaveBanner = (banner: PromotionBanner, isNew: boolean) => {
    console.log(`Banner ${isNew ? "CREATED" : "UPDATED"}:`, banner.name);
    showNotification(
      `Banner "${banner.name}" ${isNew ? "created" : "updated"}!`,
      "success"
    );
    setIsBannerModalOpen(false);
    setEditingBanner(null);
    handleNavLinkClick("/admin/marketing");
  };
  const handleCancelBannerEdit = () => {
    setIsBannerModalOpen(false);
    setEditingBanner(null);
    handleNavLinkClick("/admin/marketing");
  };
  const handleDeleteBanner = (bannerId: string, bannerName: string) =>
    showConfirmModal(
      `Delete: ${bannerName}`,
      `Delete banner "${bannerName}"?`,
      () => {
        console.log(`DELETED Banner ID: ${bannerId}`);
        showNotification(`Banner "${bannerName}" deleted!`, "success");
      },
      "Delete",
      "danger"
    );
  const handleSaveGeneralSettings = (settings: GeneralSettings) => {
    console.log("Saving General Settings:", settings);
    showNotification("General Settings updated!", "success");
  };
  const handleSavePlatformUser = (user: PlatformUser, isNew: boolean) => {
    console.log(`Platform User ${isNew ? "CREATED" : "UPDATED"}:`, user.email);
    showNotification(
      `User "${user.email}" ${isNew ? "created" : "updated"}!`,
      "success"
    );
  };
  const handleDeletePlatformUser = (userId: string, userName: string) =>
    showConfirmModal(
      `Delete User: ${userName}`,
      `Delete user "${userName}"?`,
      () => {
        console.log(`DELETED User ID: ${userId}`);
        showNotification(`User "${userName}" deleted!`, "success");
      },
      "Delete User",
      "danger"
    );
  const handleViewSellerApplicationDetails = (applicationId: string) =>
    handleNavLinkClick(`/admin/applications/sellers/${applicationId}`);
  const handleViewVendorApplicationDetails = (applicationId: string) =>
    handleNavLinkClick(`/admin/applications/vendors/${applicationId}`);
  const handleApplicationAction = (
    appId: string,
    appType: "seller" | "vendor",
    action: "approve" | "reject" | "suspend",
    appName: string
  ) => {
    const actionText = action.charAt(0).toUpperCase() + action.slice(1);
    showConfirmModal(
      `Confirm ${actionText}: ${appName}`,
      `Confirm ${action} for ${appType} "${appName}"?`,
      () => {
        console.log(
          `CONFIRMED ${action.toUpperCase()} for ${appType} app ID: ${appId}`
        );
        showNotification(
          `${appName} application has been ${action}d.`,
          "success"
        );
      },
      `${actionText} App`,
      action === "reject" || action === "suspend" ? "danger" : "primary"
    );
  };
  const handleSaveCategory = (category: any, isNew: boolean) => {
    console.log(`Category ${isNew ? "CREATED" : "UPDATED"}:`, category.name);
    showNotification(
      `Category "${category.name}" ${isNew ? "created" : "updated"}!`,
      "success"
    );
    handleNavLinkClick("/admin/products/categories");
  };
  const handleDeleteCategory = (categoryId: string, categoryName: string) =>
    showConfirmModal(
      `Delete: ${categoryName}`,
      `Delete category "${categoryName}" and subcategories?`,
      () => {
        console.log(`DELETED Category ID: ${categoryId}`);
        showNotification(`Category "${categoryName}" deleted!`, "success");
      },
      "Delete Category",
      "danger"
    );

  const renderContent = () => {
    if (!isPathAccessibleForRole(currentPath, userRole)) {
      const roleDefaultPath =
        ROLES_CONFIG[userRole]?.defaultDashboardPath || "/admin/dashboard";
      console.warn(
        `[AdminPage Render] Role "${userRole}" cannot render path "${currentPath}". Expected redirect to "${roleDefaultPath}" via useEffect or handleNavLinkClick.`
      );
      // Show an access denied message or a loader while redirecting
      return (
        <div
          style={{
            padding: "50px",
            textAlign: "center",
            color: "#cc0000",
            fontWeight: "bold",
          }}
        >
          Access Denied. You (Role: {userRole}) do not have permission to view
          the page at '{currentPath}'.
          <br />
          You should be redirected shortly. If not, please click{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNavLinkClick(roleDefaultPath);
            }}
          >
            here
          </a>
          .
        </div>
      );
    }

    if (currentPath === "/admin/dashboard") {
      return <DashboardRouter userRole={userRole} />;
    } else if (currentPath === "/admin/products") {
      return (
        <ProductList
          onAddProduct={() => handleNavLinkClick("/admin/products/new")}
          onEditProduct={(id) =>
            handleNavLinkClick(`/admin/products/${id}/edit`)
          }
          onDeleteProduct={handleDeleteProduct}
        />
      );
    } else if (isAddingProductPage || isEditingProductPage) {
      return (
        <ProductDetail_
          productId={productIdToEdit}
          onSave={handleSaveProduct}
          onDelete={handleDeleteProduct}
          onCancel={handleCancelProductEdit}
        />
      );
    } else if (currentPath === "/admin/products/categories") {
      return (
        <CategoryList
          onSaveCategory={handleSaveCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      );
    } else if (currentPath === "/admin/products/attributes") {
      return (
        <AttributesOverview
          onManageAttributes={() =>
            showNotification("Nav to detailed attributes (demo).", "info")
          }
          onAddAttribute={() =>
            showNotification("Attribute added (demo).", "success")
          }
        />
      );
    } else if (currentPath === "/admin/products/inventory") {
      return (
        <InventoryOverview
          allProductsData={allDummyProducts}
          globalLowStockThreshold={currentGeneralSettings.lowStockThreshold}
          onManageInventory={() =>
            showNotification("Nav to detailed inventory (demo).", "info")
          }
          onImportInventory={() =>
            showNotification("Inventory import (demo).", "info")
          }
        />
      );
    } else if (currentPath === "/admin/orders") {
      return (
        <OrderList
          ordersData={allDummyOrders}
          onViewOrderDetails={handleViewOrderDetails}
        />
      );
    } else if (isViewingOrderPage && orderIdToView) {
      return (
        <OrderDetail
          ordersData={allDummyOrders}
          orderId={orderIdToView}
          onBackToList={() => handleNavLinkClick("/admin/orders")}
        />
      );
    } else if (currentPath === "/admin/customers") {
      return (
        <CustomerList
          customersData={allDummyCustomers}
          onViewCustomerDetails={handleViewCustomerDetails}
          onDeleteCustomer={handleDeleteCustomer}
        />
      );
    } else if (isViewingCustomerPage && customerIdToView) {
      return (
        <CustomerDetail
          customersData={allDummyCustomers}
          customerId={customerIdToView}
          onBackToList={() => handleNavLinkClick("/admin/customers")}
          onViewOrderDetails={handleViewOrderDetails}
        />
      );
    } else if (currentPath === "/admin/reports") {
      return <ReportsOverview />;
    } else if (currentPath === "/admin/marketing") {
      return (
        <MarketingList
          onAddBanner={handleAddBanner}
          onEditBanner={handleEditBanner}
          onDeleteBanner={handleDeleteBanner}
        />
      );
    } else if (currentPath.startsWith("/admin/settings")) {
      return (
        <SettingsOverview
          generalSettingsData={currentGeneralSettings}
          platformUsersData={allPlatformUsers}
          onSaveGeneralSettings={handleSaveGeneralSettings}
          onSavePlatformUser={handleSavePlatformUser}
          onDeletePlatformUser={handleDeletePlatformUser}
          onNavigateToSection={handleNavLinkClick}
          currentPath={currentPath}
        />
      );
    } else if (isViewingApplicationOverviewPage) {
      return <ApplicationOverview onNavigateToSection={handleNavLinkClick} />;
    } else if (isViewingSellerApplicationListPage) {
      return (
        <SellerApplicationList
          applicationsData={allDummySellerApplications}
          onViewDetails={handleViewSellerApplicationDetails}
          onApplicationAction={handleApplicationAction}
        />
      );
    } else if (
      isViewingSellerApplicationDetailPage &&
      sellerApplicationIdToView
    ) {
      return (
        <SellerApplicationDetail
          applicationId={sellerApplicationIdToView}
          applicationsData={allDummySellerApplications}
          onBackToList={() => handleNavLinkClick("/admin/applications/sellers")}
          onApplicationAction={handleApplicationAction}
        />
      );
    } else if (isViewingVendorApplicationListPage) {
      return (
        <VendorApplicationList
          applicationsData={allDummyVendorApplications}
          onViewDetails={handleViewVendorApplicationDetails}
          onApplicationAction={handleApplicationAction}
        />
      );
    } else if (
      isViewingVendorApplicationDetailPage &&
      vendorApplicationIdToView
    ) {
      return (
        <VendorApplicationDetail
          applicationId={vendorApplicationIdToView}
          applicationsData={allDummyVendorApplications}
          onBackToList={() => handleNavLinkClick("/admin/applications/vendors")}
          onApplicationAction={handleApplicationAction}
        />
      );
    }

    console.error(
      `[AdminPage Render] Unhandled accessible path for role "${userRole}": ${currentPath}`
    );
    return (
      <div style={{ padding: "50px", textAlign: "center", color: "#999" }}>
        Content for '{currentPath}' is under construction or misconfigured for
        role '{userRole}'.
      </div>
    );
  };

  const getPageTitle = (path: string) => {
    if (path === "/admin/dashboard") {
      if (userRole === "seller") return "My Seller Dashboard";
      if (userRole === "vendor") return "Vendor Dashboard";
      if (userRole === "superAdmin") return "Platform Dashboard";
    } else if (path === "/admin/products") return "Products";
    else if (isAddingProductPage) return "Add New Product";
    else if (isEditingProductPage)
      return `Edit Product (ID: ${productIdToEdit || "N/A"})`;
    else if (path === "/admin/products/categories") return "Product Categories";
    else if (path === "/admin/products/attributes") return "Product Attributes";
    else if (path === "/admin/products/inventory") return "Product Inventory";
    else if (path === "/admin/orders") return "Orders";
    else if (isViewingOrderPage)
      return `Order Details (ID: ${orderIdToView || "N/A"})`;
    else if (path === "/admin/customers") return "Customers";
    else if (isViewingCustomerPage)
      return `Customer Details (ID: ${customerIdToView || "N/A"})`;
    else if (currentPath === "/admin/reports") return "Reports & Analytics";
    else if (currentPath === "/admin/marketing") return "Promotional Banners";
    else if (isAddingBannerPage) return "Add New Banner";
    else if (isEditingBannerPage)
      return `Edit Banner (ID: ${bannerIdToEdit || "N/A"})`;
    else if (currentPath.startsWith("/admin/settings")) {
      if (currentPath === "/admin/settings/general") return "General Settings";
      if (currentPath === "/admin/settings/users") return "User Management";
      if (currentPath === "/admin/settings/payment-gateways")
        return "Payment Gateways";
      if (currentPath === "/admin/settings/shipping-tax")
        return "Shipping & Tax";
      if (currentPath === "/admin/settings/branding") return "Branding & Theme";
      return "Platform Settings";
    } else if (currentPath === "/admin/applications")
      return "Application Management";
    else if (isViewingSellerApplicationListPage) return "Seller Applications";
    else if (isViewingSellerApplicationDetailPage)
      return `Seller App: ${sellerApplicationIdToView || "N/A"}`;
    else if (isViewingVendorApplicationListPage) return "Vendor Applications";
    else if (isViewingVendorApplicationDetailPage)
      return `Vendor App: ${vendorApplicationIdToView || "N/A"}`;
    return "Admin Panel";
  };

  if (authLoading) {
    return (
      <PageContainer
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <FaSpinner
            className="fa-spin"
            style={{
              fontSize: "2.8rem",
              marginBottom: theme.spacing(3),
              color: theme.colors.accent1,
            }}
          />
        </div>
      </PageContainer>
    );
  }

  return (
    <AdminLayout
      pageTitle={getPageTitle(currentPath)}
      activePath={currentPath}
      onNavLinkClick={handleNavLinkClick}
      userRole={userRole}
    >
      {renderContent()}

      <BannerEditModal
        isOpen={isBannerModalOpen || isAddingBannerPage || isEditingBannerPage}
        onClose={handleCancelBannerEdit}
        onSave={handleSaveBanner}
        editingBanner={editingBanner}
      />
      {isConfirmModalOpen && confirmModalData && (
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          title={confirmModalData.title}
          message={confirmModalData.message as string}
          onConfirm={handleConfirmModalConfirm}
          onCancel={handleConfirmModalCancel}
          confirmButtonText={confirmModalData.confirmButtonText}
          confirmVariant={confirmModalData.confirmVariant}
        />
      )}
    </AdminLayout>
  );
};

export default AdminPage;
