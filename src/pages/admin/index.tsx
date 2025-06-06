// src/pages/admin/index.tsx

import React, { useState, useEffect, useCallback } from "react";
import { useTheme, type DefaultTheme } from "styled-components";
import { useSelector } from "react-redux";
import { FaSpinner } from "react-icons/fa";
import { Types } from "mongoose";

// Layout & Core
import AdminLayout from "@/components/admin/Layout/AdminLayout";
import DashboardRouter from "@/components/admin/Dashboard/DashboardRouter";

// Feature Components
import ProductList from "@/components/admin/Products/ProductList";
import ProductDetail_ from "@/components/admin/Products/ProductDetail";
import AttributesOverview from "@/components/admin/Products/AttributesOverview";
import InventoryOverview from "@/components/admin/Products/InventoryOverview";
import AttributeList from "@/components/admin/Products/attributes/AttributeList";
import AttributeForm from "@/components/admin/Products/attributes/AttributeForm";
// --- ATTRIBUTE OPTION PAGE IMPORTS ---
// import AttributeOptionList from "@/components/admin/Products/attributes/Options/AttributeOptionList";
// import AttributeOptionForm from "@/components/admin/Products/attributes/Options/AttributeOptionForm";
import AttributeOptionForm from "@/components/admin/Products/attributes/AttributeOptionForm";
import AttributeOptionList from "@/components/admin/Products/attributes/AttributeOptionList";
// --- END ATTRIBUTE OPTION PAGE IMPORTS ---
// import CategoryList from "@/components/admin/Categories/CategoryList";
import CategoryList from "@/components/Categories/CategoryList"; // Using this path
import OrderList from "@/components/admin/Orders/OrderList";
import OrderDetail from "@/components/admin/Orders/OrderDetail";
import CustomerList from "@/components/admin/Customers/CustomerList";
import CustomerDetail from "@/components/admin/Customers/CustomerDetail";
import ReportsOverview from "@/components/admin/Reports/ReportsOverview";
import MarketingList from "@/components/admin/Marketing/MarketingList";
import BannerEditModal from "@/components/admin/Marketing/BannerEditModal";
import SettingsOverview from "@/components/admin/settings/SettingsOverview";
import ApplicationOverview from "@/components/admin/Products/AttributesOverview";
import SellerApplicationList from "@/components/admin/Application/SellerApplications/SellerApplicationList";
import SellerApplicationDetail from "@/components/admin/Application/SellerApplications/SellerApplicationDetail";
import VendorApplicationList from "@/components/admin/Application/VendorApplications/VendorApplicationList";
import VendorApplicationDetail from "@/components/admin/Application/VendorApplications/VendorApplicationDetail";

// Common Components
import ConfirmationModal from "@/components/admin/common/ConfirmationModal/ConfirmationModal";
import { PageContainer } from "@/components/seller/ViewSellerApplication.styles";

// Types
import type { ProductDetail as ProductDetailType } from "@/types/product";
import type { PromotionBanner } from "@/types/marketing";
import type { PlatformUser, GeneralSettings } from "@/types/settings";
import type { UserRole } from "@/config/rolesConfig";
// type { IAttributeDisplayType } from "@/types/attribute"; // Not directly used by useModalState anymore for options

// Contexts, Configs, Utils
import { useNotification } from "@/contexts/NotificationContext";
import { ROLES_CONFIG } from "@/config/rolesConfig";
import { isPathAccessibleForRole } from "@/utils/navigationUtils";
import { type RootState } from "@/store/types";

// Mock Data
import {
  allDummyProducts,
  allDummyOrders,
  allDummyCustomers,
  allDummyBanners,
  allPlatformUsers,
  currentGeneralSettings,
  allDummySellerApplications,
  allDummyVendorApplications,
} from "@/data/adminMockData/mockData";

// useModalState is not needed for attribute options if using pages
// const useModalState = <T = any>() => { ... };

const AdminPage: React.FC = () => {
  const { user, loading: authLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const themeFromContext = useTheme();
  const theme = (
    themeFromContext && Object.keys(themeFromContext).length > 0
      ? themeFromContext
      : undefined
  ) as DefaultTheme | undefined;

  const determinedUserRole = (user?.role as UserRole) || "superAdmin";
  const [userRole, setUserRole] = useState<UserRole>(determinedUserRole);

  useEffect(() => {
    if (user?.role && user.role !== userRole) {
      setUserRole(user.role as UserRole);
    }
  }, [user, userRole]);

  const [currentPath, setCurrentPath] = useState<string>(() => {
    const roleConfig = ROLES_CONFIG[determinedUserRole];
    return roleConfig ? roleConfig.defaultDashboardPath : "/admin/dashboard";
  });

  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<PromotionBanner | null>(
    null
  );

  const [attributeOptionId,setAttributeOptionId] = useState('');

  const [attributeSuccess, setAttributeSuccess] = useState(false);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState<{
    title: string;
    message: string | React.ReactNode;
    onConfirm: () => void;
    confirmButtonText?: string;
    confirmVariant?: "primary" | "danger";
  } | null>(null);

  const [attibuteIdOption, setAttibuteIdOption] = useState("");


  const { showNotification } = useNotification();

  useEffect(() => {
    const roleConfig = ROLES_CONFIG[userRole];
    const defaultPath = roleConfig
      ? roleConfig.defaultDashboardPath
      : "/admin/dashboard";
    if (!isPathAccessibleForRole(currentPath, userRole)) {
      setCurrentPath(defaultPath);
    } else if (
      currentPath !== defaultPath &&
      currentPath === "/admin/dashboard" &&
      defaultPath !== "/admin/dashboard"
    ) {
      setCurrentPath(defaultPath);
    }
  }, [userRole, currentPath]);

  const handleNavLinkClick = useCallback(
    (path: string) => {
      if (isPathAccessibleForRole(path, userRole)) {
        setCurrentPath(path);
      } else {
        const roleDefaultPath =
          ROLES_CONFIG[userRole]?.defaultDashboardPath || "/admin/dashboard";
        setCurrentPath(roleDefaultPath);
        showNotification(
          `Access to "${path}" is restricted for your role.`,
          "warning"
        );
      }
    },
    [userRole, showNotification]
  );

  const getIdFromPath = (
    path: string,
    basePathSegments: string,
    segmentIndexAfterBase: number = 0
  ): string | null => {
    const adminRelativePath = path.startsWith("/admin/")
      ? path.substring("/admin".length)
      : path;
    const normalizedBase = `/${basePathSegments.replace(/^\/+|\/+$/g, "")}`;

    if (adminRelativePath.startsWith(normalizedBase)) {
      const remainingPath = adminRelativePath.substring(normalizedBase.length);
      const segments = remainingPath.split("/").filter((s) => s.length > 0);
      if (segments.length > segmentIndexAfterBase) {
        const potentialId = segments[segmentIndexAfterBase];
        return Types.ObjectId.isValid(potentialId) ? potentialId : null;
      }
    }
    return null;
  };

  const isProductsRoot = currentPath === "/admin/products";
  const isAddingProductPage = currentPath === "/admin/products/new";
  const isEditingProductPage =
    currentPath.startsWith("/admin/products/") &&
    currentPath.endsWith("/edit") &&
    !currentPath.includes("/attributes/") &&
    !currentPath.includes("/categories/");
  const productIdToEdit = isEditingProductPage
    ? getIdFromPath(currentPath, "products")
    : null;

  const isCategoryListPage = currentPath === "/admin/products/categories";

  const productsAttributesBasePath = "products/attributes";
  const isAttributesOverviewPage =
    currentPath === `/admin/${productsAttributesBasePath}`;
  const isAttributeListPage =
    currentPath === `/admin/${productsAttributesBasePath}/list`;
  const isAddingAttributePage =
    currentPath === `/admin/${productsAttributesBasePath}/new`;

  const isEditingAttributePage =
    currentPath.startsWith(`/admin/${productsAttributesBasePath}/`) &&
    currentPath.endsWith("/edit") &&
    !currentPath.includes("/options/");
  const attributeIdForForm = isEditingAttributePage
    ? getIdFromPath(currentPath, productsAttributesBasePath)
    : null;

  // Example paths:
  // /admin/products/attributes/:attributeId/options        (List options)
  // /admin/products/attributes/:attributeId/options/new    (New option form)
  // /admin/products/attributes/:attributeId/options/:optionId/edit (Edit option form)

  const isAttributeOptionListPage =
    currentPath.startsWith(`/admin/${productsAttributesBasePath}/`) &&
    currentPath.endsWith("/options") &&
    !currentPath.endsWith("/new") && 
    !currentPath.includes("/edit"); 
  const attributeIdForOptionList = isAttributeOptionListPage
    ? getIdFromPath(currentPath, productsAttributesBasePath, 0) 
    : null;

  const isAddingAttributeOptionPage =
    currentPath.startsWith(`/admin/${productsAttributesBasePath}/`) &&
    currentPath.includes("/options/new");
  const attributeIdForNewOptionForm = isAddingAttributeOptionPage
    ? getIdFromPath(currentPath, productsAttributesBasePath, 0)
    : null;

  const isEditingAttributeOptionPage =
    currentPath.startsWith(`/admin/${productsAttributesBasePath}/`) &&
    currentPath.includes("/options/") &&
    currentPath.endsWith("/edit");
  const attributeIdForEditOptionForm = isEditingAttributeOptionPage
    ? getIdFromPath(currentPath, productsAttributesBasePath, 0)
    : null;
  const optionIdForEditOptionForm = isEditingAttributeOptionPage
    ? getIdFromPath(
        currentPath,
        `${productsAttributesBasePath}/${attributeIdForEditOptionForm}/options`,
        0
      ) 
    : null;

  const isInventoryOverviewPage = currentPath === "/admin/products/inventory";
  const isOrderListPage = currentPath === "/admin/orders";
  const orderIdToView = getIdFromPath(currentPath, "orders");
  const isViewingOrderPage =
    !!orderIdToView && currentPath === `/admin/orders/${orderIdToView}`;

  const isCustomerListPage = currentPath === "/admin/customers";
  const customerIdToView = getIdFromPath(currentPath, "customers");
  const isViewingCustomerPage =
    !!customerIdToView &&
    currentPath === `/admin/customers/${customerIdToView}`;

  const isMarketingListPage = currentPath === "/admin/marketing";
  const bannerIdToEdit = getIdFromPath(currentPath, "marketing", 0);
  const isAddingBannerPage = currentPath === "/admin/marketing/new";
  const isEditingBannerPage =
    !!bannerIdToEdit &&
    currentPath === `/admin/marketing/${bannerIdToEdit}/edit`;

  const isSettingsRoot =
    currentPath === "/admin/settings" ||
    currentPath.startsWith("/admin/settings/");

  const isApplicationOverviewPage = currentPath === "/admin/applications";
  const sellerApplicationIdToView = getIdFromPath(
    currentPath,
    "applications/sellers"
  );
  const isSellerApplicationListPage =
    currentPath === "/admin/applications/sellers";
  const isSellerApplicationDetailPage =
    !!sellerApplicationIdToView &&
    currentPath === `/admin/applications/sellers/${sellerApplicationIdToView}`;

  const vendorApplicationIdToView = getIdFromPath(
    currentPath,
    "applications/vendors"
  );
  
  const isVendorApplicationListPage =
    currentPath === "/admin/applications/vendors";
  const isVendorApplicationDetailPage =
    !!vendorApplicationIdToView &&
    currentPath === `/admin/applications/vendors/${vendorApplicationIdToView}`;


  const showConfirmModal = useCallback(/* ... */);
  const handleConfirmModalCancel = useCallback(/* ... */);
  const handleConfirmModalConfirm = useCallback(/* ... */);
  const handleSaveProduct = (product: ProductDetailType, isNew: boolean) => {
    handleNavLinkClick("/admin/products");
  };
  const handleDeleteProduct = (productId: string, productName: string) => {
    /* ... */
  };
  const handleCancelProductEdit = () => handleNavLinkClick("/admin/products");
  const handleViewOrderDetails = (orderId: string) =>
    handleNavLinkClick(`/admin/orders/${orderId}`);
  const handleViewCustomerDetails = (customerId: string) =>
    handleNavLinkClick(`/admin/customers/${customerId}`);
  const handleDeleteCustomer = (customerId: string, customerName: string) => {
    /* ... */
  };
  const handleAddBanner = () => {
    setIsBannerModalOpen(true);
    setEditingBanner(null);
  };
  const handleEditBanner = (bannerId: string) => {
    /* ... */ setIsBannerModalOpen(true);
  };
  const handleSaveBanner = (banner: PromotionBanner, isNew: boolean) => {
    /* ... */ setIsBannerModalOpen(false);
  };
  const handleCancelBannerEdit = () => {
    setIsBannerModalOpen(false);
    setEditingBanner(null);
  };
  const handleDeleteBanner = (bannerId: string, bannerName: string) => {
    /* ... */
  };
  const handleSaveGeneralSettings = (settings: GeneralSettings) => {
    /* ... */
  };
  const handleSavePlatformUser = (user: PlatformUser, isNew: boolean) => {
    /* ... */
  };
  const handleDeletePlatformUser = (userId: string, userName: string) => {
    /* ... */
  };
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
    /* ... */
  };
  const handleSaveCategory = (category: any, isNew: boolean) => {
    handleNavLinkClick("/admin/products/categories");
  };
  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    /* ... */
  };

  //  ATTRIBUTE HANDLERS 

  let attributeId;

  const onOptionSelectedAttribute = (value) => {
    attributeId = value;
  };
  const handleAddAttribute = useCallback(() => {
    setAttributeSuccess(false);
      setAttibuteIdOption('');
    handleNavLinkClick(`/admin/${productsAttributesBasePath}/new`);
  }, [handleNavLinkClick, productsAttributesBasePath]);

  const handleAddAttributeOption = useCallback(
    (attributeOptionIdToEdit: string) => {
      console.log(attributeOptionIdToEdit)
      setAttibuteIdOption(attributeOptionIdToEdit);
      handleNavLinkClick(
        `/admin/${productsAttributesBasePath}/${attributeOptionIdToEdit}/options/new`
      );
    },
    [handleNavLinkClick, productsAttributesBasePath]
  );

  const handleManageAttributeOptions = useCallback(
    (attributeIdToManage: string) => {
      setAttibuteIdOption(attributeIdToManage);
      handleNavLinkClick(
        `/admin/${productsAttributesBasePath}/${attributeIdToManage}/options`
      );
    },
    [handleNavLinkClick, productsAttributesBasePath]
  );

    const handleEditAttribute = useCallback(
    (attributeIdToEdit: string) => {
      handleNavLinkClick(
        `/admin/${productsAttributesBasePath}/${attributeIdToEdit}/edit`
      );
      setAttibuteIdOption(attributeIdToEdit);
    },
    [handleNavLinkClick, productsAttributesBasePath]
  );

  const handleCancelAttributeEdit = () =>
    handleNavLinkClick(`/admin/${productsAttributesBasePath}/list`);

  const handleAttributeSuccess = useCallback(
    () => {
      setAttributeSuccess(true);
      handleNavLinkClick(`/admin/${productsAttributesBasePath}/list`);
    },
    [handleNavLinkClick, productsAttributesBasePath]
  );

  const renderContent = () => {
    if (!isPathAccessibleForRole(currentPath, userRole)) {
      const roleDefaultPath =
        ROLES_CONFIG[userRole]?.defaultDashboardPath || "/admin/dashboard";
      return (
        <div style={{ padding: "50px", textAlign: "center" }}>
          {" "}
          Access Denied. Redirecting to{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNavLinkClick(roleDefaultPath);
            }}
          >
            {" "}
            {roleDefaultPath}{" "}
          </a>
          .{" "}
        </div>
      );
    }

    // ATTRIBUTE & ATTRIBUTE OPTION PAGE RENDERING 
    if (isAddingAttributeOptionPage && attributeIdForNewOptionForm) {
      // AttributeOptionForm will use useParams to get attributeId
      return <AttributeOptionForm />;
    }
    if (
      isEditingAttributeOptionPage &&
      attributeIdForEditOptionForm &&
      optionIdForEditOptionForm
    ) {
      return <AttributeOptionForm attributeId={attibuteIdOption} optionId = {attibuteIdOption} />;
    }
    if (isAttributeOptionListPage && attributeIdForOptionList) {
      // AttributeOptionList will use useParams to get attributeId
      return <AttributeOptionList onClickBackList={handleCancelAttributeEdit} attributId={attibuteIdOption} onEditAttributeOption = {handleAddAttributeOption} />;
    }

    if (isAddingAttributePage) {
      return <AttributeForm onClickBackList={handleCancelAttributeEdit} onSuccess={handleAttributeSuccess} attributId={attibuteIdOption} />;
    }
    if (isEditingAttributePage && attributeIdForForm) {
      return <AttributeForm onClickBackList={handleCancelAttributeEdit} onSuccess={handleAttributeSuccess} attributId={attibuteIdOption} />; 
    }
    if (isAttributeListPage) {
      return (
        <AttributeList
          onAddAttribute={handleAddAttribute}
          onEditAttribute={handleEditAttribute}
          onManageOptions={handleManageAttributeOptions}
          onClickOption={onOptionSelectedAttribute}
          isRefetch = {attributeSuccess}
        />
      );
    }
    if (isAttributesOverviewPage) {
      // Path: /admin/products/attributes
      return (
        <AttributesOverview
          onNavigateToAttributeList={() =>
            handleNavLinkClick(`/admin/${productsAttributesBasePath}/list`)
          }
          onNavigateToNewAttributeForm={() =>
            handleNavLinkClick(`/admin/${productsAttributesBasePath}/new`)
          }
        />
      );
    }
    // --- END ATTRIBUTE & ATTRIBUTE OPTION PAGE RENDERING ---

    // --- Original renderContent logic ---
    if (currentPath === "/admin/dashboard")
      return <DashboardRouter userRole={userRole} />;
    if (isProductsRoot)
      return (
        <ProductList
          onAddProduct={() => handleNavLinkClick("/admin/products/new")}
          onEditProduct={(id) =>
            handleNavLinkClick(`/admin/products/${id}/edit`)
          }
          onDeleteProduct={handleDeleteProduct}
        />
      );
    if (isAddingProductPage || (isEditingProductPage && productIdToEdit))
      return (
        <ProductDetail_
          productId={productIdToEdit}
          onSave={handleSaveProduct}
          onDelete={handleDeleteProduct}
          onCancel={handleCancelProductEdit}
        />
      );
    if (isCategoryListPage) return <CategoryList />;
    if (isInventoryOverviewPage)
      return (
        <InventoryOverview
          allProductsData={allDummyProducts}
          globalLowStockThreshold={currentGeneralSettings.lowStockThreshold}
          onManageInventory={() => {}}
          onImportInventory={() => {}}
        />
      );
    if (isOrderListPage)
      return (
        <OrderList
          ordersData={allDummyOrders}
          onViewOrderDetails={handleViewOrderDetails}
        />
      );
    if (isViewingOrderPage && orderIdToView)
      return (
        <OrderDetail
          ordersData={allDummyOrders}
          orderId={orderIdToView}
          onBackToList={() => handleNavLinkClick("/admin/orders")}
        />
      );
    if (isCustomerListPage)
      return (
        <CustomerList
          customersData={allDummyCustomers}
          onViewCustomerDetails={handleViewCustomerDetails}
          onDeleteCustomer={handleDeleteCustomer}
        />
      );
    if (isViewingCustomerPage && customerIdToView)
      return (
        <CustomerDetail
          customersData={allDummyCustomers}
          customerId={customerIdToView}
          onBackToList={() => handleNavLinkClick("/admin/customers")}
          onViewOrderDetails={handleViewOrderDetails}
        />
      );
    if (currentPath === "/admin/reports") return <ReportsOverview />;
    if (isMarketingListPage)
      return (
        <MarketingList
          onAddBanner={handleAddBanner}
          onEditBanner={handleEditBanner}
          onDeleteBanner={handleDeleteBanner}
        />
      );
    if (isSettingsRoot) {
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
    }
    if (isApplicationOverviewPage)
      return <ApplicationOverview onNavigateToSection={handleNavLinkClick} />; // Use actual component
    if (isSellerApplicationListPage)
      return (
        <SellerApplicationList
          /*applicationsData={allDummySellerApplications}*/ onViewDetails={
            handleViewSellerApplicationDetails
          }
          onApplicationAction={handleApplicationAction}
        />
      );
    if (isSellerApplicationDetailPage && sellerApplicationIdToView)
      return (
        <SellerApplicationDetail
          applicationId={sellerApplicationIdToView}
          /*applicationsData={allDummySellerApplications}*/ onBackToList={() =>
            handleNavLinkClick("/admin/applications/sellers")
          }
          onApplicationAction={handleApplicationAction}
        />
      );
    if (isVendorApplicationListPage)
      return (
        <VendorApplicationList
          /*applicationsData={allDummyVendorApplications}*/ onViewDetails={
            handleViewVendorApplicationDetails
          }
          onApplicationAction={handleApplicationAction}
        />
      );
    if (isVendorApplicationDetailPage && vendorApplicationIdToView)
      return (
        <VendorApplicationDetail
          applicationId={vendorApplicationIdToView}
          /*applicationsData={allDummyVendorApplications}*/ onBackToList={() =>
            handleNavLinkClick("/admin/applications/vendors")
          }
          onApplicationAction={handleApplicationAction}
        />
      );

    console.error(
      `[AdminPage Render] Unhandled accessible path for role "${userRole}": ${currentPath}`
    );
    return (
      <div>
        {" "}
        Content for '{currentPath}' is under construction or misconfigured.
        (Path: {currentPath}){" "}
      </div>
    );
  };

  const getPageTitle = (path: string): string => {
    // --- ATTRIBUTE & OPTION TITLES ---
    if (isAddingAttributeOptionPage && attributeIdForNewOptionForm)
      return `Add Option to Attribute ${attributeIdForNewOptionForm.substring(0, 6)}...`; // Maybe fetch parent attr name
    if (isEditingAttributeOptionPage && optionIdForEditOptionForm)
      return `Edit Option ${optionIdForEditOptionForm.substring(0, 6)}...`; // Maybe fetch option value
    if (isAttributeOptionListPage && attributeIdForOptionList)
      return `Manage Options for Attribute ${attributeIdForOptionList.substring(0, 6)}...`; // Maybe fetch parent attr name

    if (isAttributesOverviewPage) return "Product Attributes";
    if (isAttributeListPage) return "Manage Product Attributes";
    if (isAddingAttributePage) return "Create New Attribute";
    if (isEditingAttributePage && attributeIdForForm) return `Edit Attribute`; // AttributeForm can set a more specific title with name

    // --- Original getPageTitle logic ---
    if (path === "/admin/dashboard") {
      /* ... */
    }
    // ... (rest of existing getPageTitle logic)
    // ... Ensure to merge your existing title logic here ...
    if (path === "/admin/dashboard") {
      if (userRole === "seller") return "My Seller Dashboard";
      if (userRole === "vendor") return "Vendor Dashboard";
      if (userRole === "superAdmin") return "Platform Dashboard";
    } else if (path === "/admin/products") return "Products";
    else if (isAddingProductPage) return "Add New Product";
    else if (isEditingProductPage && productIdToEdit) return `Edit Product`;
    else if (isCategoryListPage) return "Product Categories";
    else if (isInventoryOverviewPage) return "Product Inventory";
    else if (isOrderListPage) return "Orders";
    else if (isViewingOrderPage && orderIdToView)
      return `Order Details: #${orderIdToView.substring(0, 8)}`;
    else if (isCustomerListPage) return "Customers";
    else if (isViewingCustomerPage && customerIdToView)
      return `Customer Details`;
    else if (currentPath === "/admin/reports") return "Reports & Analytics";
    else if (isMarketingListPage) return "Promotional Banners";
    else if (isAddingBannerPage) return "Add New Banner";
    else if (isEditingBannerPage && bannerIdToEdit) return `Edit Banner`;
    else if (currentPath.startsWith("/admin/settings")) {
      if (currentPath === "/admin/settings/general") return "General Settings";
      if (currentPath === "/admin/settings/users") return "User Management";
      return "Platform Settings";
    } else if (isApplicationOverviewPage) return "Application Management";
    else if (isSellerApplicationListPage) return "Seller Applications";
    else if (isSellerApplicationDetailPage && sellerApplicationIdToView)
      return `Seller App Details: #${sellerApplicationIdToView.substring(0, 8)}`;
    else if (isVendorApplicationListPage) return "Vendor Applications";
    else if (isVendorApplicationDetailPage && vendorApplicationIdToView)
      return `Vendor App Details: #${vendorApplicationIdToView.substring(0, 8)}`;

    return "Admin Panel";
  };

  if (authLoading || !theme) {
    return (
      <PageContainer
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
        }}
      >
        {" "}
        <div style={{ textAlign: "center" }}>
          {" "}
          <FaSpinner
            className="fa-spin"
            style={{
              fontSize: "2.8rem",
              marginBottom: theme?.spacing?.(3) || "12px",
              color: theme?.colors?.accent1 || "#007bff",
            }}
          />{" "}
        </div>{" "}
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

      {/* REMOVED AttributeOptionManagerModal global instance */}

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
