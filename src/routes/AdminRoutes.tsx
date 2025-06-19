import ShippingRateForm from "@/components/admin/checkoutsession/ShippingZoneList/ShippingRates/form/ShippingRateForm";
import ShippingRateList from "@/components/admin/checkoutsession/ShippingZoneList/ShippingRates/ShippingRateList";
import ShippingZoneForm from "@/components/admin/checkoutsession/ShippingZoneList/ShippingZoneDetail/ShippingZoneForm";
import ShippingZoneList from "@/components/admin/checkoutsession/ShippingZoneList/ShippingZoneList";
import TaxRateForm from "@/components/admin/checkoutsession/Tax/TaxDetail/TaxRateForm";
import TaxRateList from "@/components/admin/checkoutsession/Tax/TaxRateList";
import React, { Suspense } from "react";
import { type RouteObject, useRoutes, Navigate } from "react-router-dom";

export interface AdminRouteHandle {
  title?: string;
  sectionId?: string;
}

export interface AdminRouteObject
  extends Omit<RouteObject, "children" | "handle"> {
  handle?: AdminRouteHandle;
  children?: AdminRouteObject[];
  element: React.ReactNode;
}

const AdminDashboardRouter = React.lazy(
  () => import("@/components/admin/Dashboard/DashboardRouter")
);
const MyProfileComponent = React.lazy(
  () => import("@/pages/Others/ProfilePage")
);
const CategoryForm = React.lazy(
  () => import("@/components/Categories/CategoryForm")
);
const DiscountList = React.lazy(
  () => import("@/components/admin/checkoutsession/Discounts/DiscountList")
);
const DiscountForm = React.lazy(
  () =>
    import(
      "@/components/admin/checkoutsession/Discounts/DiscountForm/DiscountForm"
    )
);
const PlatformOverviewComponent = React.lazy(
  () => import("@/components/admin/placeholders/PlatformOverviewComponent")
);
const ProductList = React.lazy(
  () => import("@/components/admin/Products/ProductList")
);
const ProductDetail_ = React.lazy(
  () => import("@/components/admin/Products/product/productForm/index")
);
const ProductEditForm = React.lazy(
  () =>
    import("@/components/admin/Products/product/productForm/ProductEditForm")
);
const InventoryOverview = React.lazy(
  () => import("@/components/admin/Products/InventoryOverview")
);
const AttributeList = React.lazy(
  () => import("@/components/admin/Products/attributes/AttributeList")
);
const AttributeForm = React.lazy(
  () => import("@/components/admin/Products/attributes/AttributeForm")
);
const AttributeOptionForm = React.lazy(
  () => import("@/components/admin/Products/attributes/AttributeOptionForm")
);
const AttributeOptionList = React.lazy(
  () => import("@/components/admin/Products/attributes/AttributeOptionList")
);
const CategoryList = React.lazy(
  () => import("@/components/Categories/CategoryList")
);
const OrderList = React.lazy(
  () => import("@/components/admin/Orders/OrderList")
);
const OrderDetail = React.lazy(
  () => import("@/components/admin/Orders/OrderDetail")
);
const CustomerList = React.lazy(
  () => import("@/components/admin/Customers/CustomerList")
);
const CustomerDetail = React.lazy(
  () => import("@/components/admin/Customers/CustomerDetail")
);
const ReportsOverview = React.lazy(
  () => import("@/components/admin/Reports/ReportsOverview")
);
const MarketingList = React.lazy(
  () => import("@/components/admin/Marketing/MarketingList")
);
const SettingsOverview = React.lazy(
  () => import("@/components/admin/settings/SettingsOverview")
);
const ApplicationOverviewActual = React.lazy(
  () => import("@/components/admin/placeholders/ApplicationOverviewActual")
);
const SellerApplicationList = React.lazy(
  () =>
    import(
      "@/components/admin/Application/SellerApplications/SellerApplicationList"
    )
);
const SellerApplicationDetail = React.lazy(
  () =>
    import(
      "@/components/admin/Application/SellerApplications/SellerApplicationDetail"
    )
);
const VendorApplicationList = React.lazy(
  () =>
    import(
      "@/components/admin/Application/VendorApplications/VendorApplicationList"
    )
);
const VendorApplicationDetail = React.lazy(
  () =>
    import(
      "@/components/admin/Application/VendorApplications/VendorApplicationDetail"
    )
);
const GeneralSettingsComponent = React.lazy(
  () => import("@/components/admin/placeholders/GeneralSettingsComponent")
);
const UserManagementComponent = React.lazy(
  () => import("@/components/admin/placeholders/GeneralSettingsComponent")
);
const PaymentGatewaysComponent = React.lazy(
  () => import("@/components/admin/placeholders/PaymentGatewaysComponent")
);
const ShippingTaxComponent = React.lazy(
  () => import("@/components/admin/placeholders/ShippingTaxComponent")
);
const BrandingThemeComponent = React.lazy(
  () => import("@/components/admin/placeholders/BrandingThemeComponent")
);

export const adminRoutesConfig: any[] = [
  {
    index: true,
    element: <Navigate to="dashboard" replace />,
  },
  {
    path: "dashboard",
    element: <AdminDashboardRouter />,
    handle: { title: "Dashboard", sectionId: "dashboard" },
  },
  {
    path: "settings/profile",
    element: <MyProfileComponent />,
    handle: { title: "My Profile", sectionId: "profileSettingsddd" },
  },
  {
    path: "platform-overview",
    element: <PlatformOverviewComponent />,
    handle: { title: "Platform Overview", sectionId: "platformOverview" },
  },
  {
    path: "products",
    element: <ProductList />,
    handle: { title: "Products", sectionId: "platformProductList" },
  },
  {
    path: "products/new",
    element: <ProductDetail_ />,
    handle: { title: "Add New Product", sectionId: "platformProductList" },
  },
  {
    path: "products/edit/:productId",
    element: <ProductEditForm />,
    handle: { title: "Edit Product", sectionId: "platformProductList" },
  },
  {
    path: "products/categories",
    handle: { title: "Product Categories", sectionId: "platformCategories" },
    children: [
      {
        index: true,
        element: <CategoryList />,
        handle: { title: "Manage Categories", sectionId: "platformCategory" },
      },
      {
        path: "new",
        element: <CategoryForm />,
        handle: { title: "New Category", sectionId: "platformCategory" },
      },
      {
        path: ":categoryId/edit",
        element: <CategoryForm />,
        handle: { title: "Edit Category", sectionId: "platformCategory" },
      },
      {
        path: ":parentId/new-child",
        element: <CategoryForm />,
        handle: { title: "New Sub-category", sectionId: "platformCategory" },
      },
    ],
  },
  {
    path: "products/attributes",
    handle: { title: "Product Attributes", sectionId: "platformAttributes" },
    children: [
      {
        index: true,
        path: "list",
        element: <AttributeList />,
        handle: { title: "Manage Attributes", sectionId: "platformAttributes" },
      },
      {
        path: "new",
        element: <AttributeForm />,
        handle: {
          title: "Create New Attribute",
          sectionId: "platformAttributes",
        },
      },
      {
        path: "edit/:attributeId",
        element: <AttributeForm />,
        handle: { title: "Edit Attribute", sectionId: "platformAttributes" },
      },
      {
        path: ":attributeId/options",
        element: <AttributeOptionList />,
        handle: {
          title: "Manage Attribute Options",
          sectionId: "platformAttributes",
        },
      },
      {
        path: ":attributeId/options/new",
        element: <AttributeOptionForm />,
        handle: {
          title: "Add Attribute Option",
          sectionId: "platformAttributes",
        },
      },
      {
        path: ":attributeId/options/:optionId/edit",
        element: <AttributeOptionForm />,
        handle: {
          title: "Edit Attribute Option",
          sectionId: "platformAttributes",
        },
      },
    ],
  },
  {
    path: "products/inventory",
    element: <InventoryOverview />,
    handle: { title: "Product Inventory", sectionId: "platformInventory" },
  },
  {
    path: "checkoutsession/discount",

    handle: { title: "Checkout Session", sectionId: "checkoutsession" },
    children: [
      {
        path: "list",
        element: <DiscountList />,
        handle: { title: "Discount", sectionId: "DiscountList" },
      },
      {
        path: "edit/:discountId",
        element: <DiscountForm />,
        handle: { title: "Discount", sectionId: "DiscountUpdateForm" },
      },
      {
        path: "new",
        element: <DiscountForm />,
        handle: { title: "Discount", sectionId: "DiscountNewForm" },
      },
    ],
  },

  {
    path: "checkoutsession/tax",
    handle: { title: "Checkout Session", sectionId: "checkoutsession" },
    children: [
      {
        index: true,
        path: "list",
        element: <TaxRateList />,
        handle: { title: "Tax", sectionId: "TaxList" },
      },
      {
        path: "edit/:taxRateId",
        element: <TaxRateForm />,
        handle: { title: "Tax", sectionId: "TaxUpdateForm" },
      },
      {
        path: "new",
        element: <TaxRateForm />,
        handle: { title: "Tax", sectionId: "TaxNewForm" },
      },
    ],
  },

  {
    path: "checkoutsession/shippingzones",
    handle: { title: "Checkout Session", sectionId: "checkoutsession" },
    children: [
      {
        index: true,
        path: "list",
        element: <ShippingZoneList />,
        handle: { title: "Shipping Zones", sectionId: "ShippingZoneList" },
      },
      {
        path: "edit/:zoneId",
        element: <ShippingZoneForm />,
        handle: { title: "Edit", sectionId: "ShippingZoneUpdateForm" },
      },
      {
        path: "new",
        element: <ShippingZoneForm />,
        handle: { title: "New", sectionId: "ShippinZoneNewForm" },
      },
      {
        path: "shippingrates/:zoneId",
        element: <ShippingRateList />,
        handle: { title: "Shipping Rate", sectionId: "ShippingRateList" },
      },
      {
        path: "shippingrate/edit/:zoneId/:rateId",
        element: <ShippingRateForm />,
        handle: { title: "Edit", sectionId: "ShippingRateForm" },
      },
      {
        path: "shippingrate/new/:zoneId",
        element: <ShippingRateForm />,
        handle: { title: "New", sectionId: "ShippingRateNewForm" },
      },
    ],
  },

  {
    path: "orders",
    element: <OrderList />,
    handle: { title: "Orders", sectionId: "platformOrders" },
  },
  {
    path: "orders/:orderId",
    element: <OrderDetail />,
    handle: { title: "Order Details", sectionId: "platformOrders" },
  },
  {
    path: "customers",
    element: <CustomerList />,
    handle: { title: "Customers", sectionId: "platformCustomers" },
  },
  {
    path: "customers/:customerId",
    element: <CustomerDetail />,
    handle: { title: "Customer Details", sectionId: "platformCustomers" },
  },
  {
    path: "applications",
    handle: { title: "Applications", sectionId: "platformApplicationsMain" },
    children: [
      {
        index: true,
        element: <ApplicationOverviewActual />,
        handle: {
          title: "Applications Overview",
          sectionId: "platformApplicationsOverview",
        },
      },
      {
        path: "overview",
        element: <ApplicationOverviewActual />,
        handle: {
          title: "Applications Overview",
          sectionId: "platformApplicationsOverview",
        },
      },
      {
        path: "sellers",
        element: <SellerApplicationList />,
        handle: {
          title: "Seller Applications",
          sectionId: "platformSellerApplications",
        },
      },
      {
        path: "sellers/:applicationId",
        element: <SellerApplicationDetail />,
        handle: {
          title: "Seller Application Details",
          sectionId: "platformSellerApplications",
        },
      },
      {
        path: "vendors",
        element: <VendorApplicationList />,
        handle: {
          title: "Vendor Applications",
          sectionId: "platformVendorApplications",
        },
      },
      {
        path: "vendors/:applicationId",
        element: <VendorApplicationDetail />,
        handle: {
          title: "Vendor Application Details",
          sectionId: "platformVendorApplications",
        },
      },
    ],
  },
  {
    path: "marketing",
    element: <MarketingList />,
    handle: { title: "Marketing & Banners", sectionId: "platformMarketing" },
  },
  {
    path: "reports",
    element: <ReportsOverview />,
    handle: { title: "Reports", sectionId: "platformReports" },
  },
  {
    path: "settings",
    handle: { title: "Platform Settings", sectionId: "platformSettingsRoot" },
    children: [
      {
        index: true,
        element: <SettingsOverview />,
        handle: {
          title: "Platform Settings",
          sectionId: "platformSettingsRoot",
        },
      },
      {
        path: "general",
        element: <GeneralSettingsComponent />,
        handle: {
          title: "General Settings",
          sectionId: "platformGeneralSettings",
        },
      },
      {
        path: "users",
        element: <UserManagementComponent />,
        handle: {
          title: "User Management",
          sectionId: "platformUserManagement",
        },
      },
      {
        path: "payment-gateways",
        element: <PaymentGatewaysComponent />,
        handle: {
          title: "Payment Gateways",
          sectionId: "platformPaymentSettings",
        },
      },
      {
        path: "shipping-tax",
        element: <ShippingTaxComponent />,
        handle: {
          title: "Shipping & Tax",
          sectionId: "platformShippingTaxSettings",
        },
      },
      {
        path: "branding",
        element: <BrandingThemeComponent />,
        handle: {
          title: "Branding & Theme",
          sectionId: "platformBrandingSettings",
        },
      },
    ],
  },
  {
    path: "vendor/staff",
    element: <UserManagementComponent />,
    handle: { title: "Manage Staff", sectionId: "vendorStaffManagement" },
  },
  {
    path: "vendor/payouts",
    element: <div>Vendor Payouts Page</div>,
    handle: { title: "My Payouts", sectionId: "vendorPayouts" },
  },
  {
    path: "vendor/store-settings",
    element: <SettingsOverview />,
    handle: { title: "Store Settings", sectionId: "vendorStoreSettings" },
  },
  {
    path: "seller/payouts",
    element: <div>Seller Payouts Page</div>,
    handle: { title: "My Payouts", sectionId: "sellerPayouts" },
  },
  {
    path: "seller/shop-performance",
    element: <div>Shop Performance Page</div>,
    handle: { title: "Shop Performance", sectionId: "sellerShopPerformance" },
  },
];

const AdminRoutesComponent = () => {
  const routeElements = useRoutes(adminRoutesConfig);

  return <Suspense fallback={<div>Loading...</div>}>{routeElements}</Suspense>;
};

export default AdminRoutesComponent;
