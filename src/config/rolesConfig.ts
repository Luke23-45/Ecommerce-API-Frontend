import React from "react";
import {
  FaHome,
  FaUserCog,
  FaTachometerAlt,
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaClipboardList,
  FaBullhorn,
  FaChartLine,
  FaCogs,
  FaStoreAlt,
  FaBox,
  FaUserFriends,
  FaMoneyCheckAlt,
  FaStore,
  FaChartBar,
  FaGift,
  FaPiggyBank,
  FaRegChartBar,
  FaDolly,
  FaThLarge,
  FaCog,
} from "react-icons/fa";

export interface NavItem {
  path: string;
  label: string;
  sectionId: string;
  icon?: React.ElementType | string;
  children?: NavItem[];
  isExternal?: boolean;
  category?: string;
  badge?:
    | string
    | number
    | {
        text: string | number;
        variant: "primary" | "danger" | "warning" | "info";
      };
}

export interface RoleConfig {
  allowedNavSections: string[];
  defaultDashboardPath: string;
}

export const USER_ROLES_LIST = ["admin", "vendor", "individual_seller"] as const;
export type UserRole = (typeof USER_ROLES_LIST)[number];

export const ALL_NAV_ITEMS: NavItem[] = [
  {
    path: "/admin/dashboard",
    label: "Dashboard",
    sectionId: "dashboard",
    icon: FaThLarge,
    category: "GENERAL",
  },
  {
    path: "/admin/settings/profile",
    label: "My Profile",
    sectionId: "profileSettingsddd",
    icon: FaUserCog,
  },

  {
    path: "/admin/platform-overview",
    label: "Platform Overview",
    sectionId: "platformOverview",
    icon: FaTachometerAlt,
  },
  {
    path: "/admin/products",
    label: "Platform Products",
    sectionId: "platformProductsMain",
    icon: FaBoxOpen,
    children: [
      {
        path: "/admin/products",
        label: "Product List",
        sectionId: "platformProductList",
      },
      {
        path: "/admin/products/categories",
        label: "Categories",
        sectionId: "platformCategories",
      },
      {
        path: "/admin/products/attributes",
        label: "Attributes",
        sectionId: "platformAttributes",
      },
      {
        path: "/admin/products/inventory",
        label: "Global Inventory",
        sectionId: "platformInventory",
      },
    ],
  },

  {
    path: "/admin/orders",
    label: "Platform Orders",
    sectionId: "platformOrders",
    icon: FaShoppingCart,
  },
  {
    path: "/admin/customers",
    label: "Customers",
    sectionId: "platformCustomers",
    icon: FaUsers,
  },
  {
    path: "/admin/applications",
    label: "Applications",
    sectionId: "platformApplicationsMain",
    icon: FaClipboardList,
    children: [
      {
        path: "/admin/applications",
        label: "Overview",
        sectionId: "platformApplicationsOverview",
      },
      {
        path: "/admin/applications/sellers",
        label: "Seller Apps",
        sectionId: "platformSellerApplications",
      },
      {
        path: "/admin/applications/vendors",
        label: "Vendor Apps",
        sectionId: "platformVendorApplications",
      },
    ],
  },
  {
    path: "/admin/marketing",
    label: "Marketing & Banners",
    sectionId: "platformMarketing",
    icon: FaBullhorn,
  },
  {
    path: "/admin/reports",
    label: "Platform Reports",
    sectionId: "platformReports",
    icon: FaChartLine,
  },
  {
    path: "/admin/settings",
    label: "Platform Settings",
    sectionId: "platformSettingsRoot",
    icon: FaCogs,
    children: [
      {
        path: "/admin/settings/general",
        label: "General",
        sectionId: "platformGeneralSettings",
      },
      {
        path: "/admin/settings/users",
        label: "User Management",
        sectionId: "platformUserManagement",
      },
      {
        path: "/admin/settings/payment-gateways",
        label: "Payment Gateways",
        sectionId: "platformPaymentSettings",
      },
      {
        path: "/admin/settings/shipping-tax",
        label: "Shipping & Tax",
        sectionId: "platformShippingTaxSettings",
      },
      {
        path: "/admin/settings/branding",
        label: "Branding & Theme",
        sectionId: "platformBrandingSettings",
      },
    ],
  },

  {
    path: "/admin/products",
    label: "My Products ",
    sectionId: "vendorProducts",
    icon: FaStoreAlt,
  },
  {
    path: "/admin/orders",
    label: "My Orders ",
    sectionId: "vendorOrders",
    icon: FaBox,
  },
  {
    path: "/admin/vendor/staff",
    label: "Manage Staff",
    sectionId: "vendorStaffManagement",
    icon: FaUserFriends,
  },
  {
    path: "/admin/vendor/payouts",
    label: "My Payouts ",
    sectionId: "vendorPayouts",
    icon: FaMoneyCheckAlt,
  },
  {
    path: "/admin/vendor/store-settings",
    label: "Store Settings ",
    sectionId: "vendorStoreSettings",
    icon: FaStore,
  },
  {
    path: "/admin/vendor/reports",
    label: "My Reports ",
    sectionId: "vendorReports",
    icon: FaChartBar,
  },

  {
    path: "/admin/products",
    label: "My Products ",
    sectionId: "sellerProducts",
    icon: FaGift,
  },
  {
    path: "/admin/orders",
    label: "My Orders ",
    sectionId: "sellerOrders",
    icon: FaDolly,
  },
  {
    path: "/admin/seller/payouts",
    label: "My Payouts ",
    sectionId: "sellerPayouts",
    icon: FaPiggyBank,
  },
  {
    path: "/admin/seller/shop-performance",
    label: "Shop Performance",
    sectionId: "sellerShopPerformance",
    icon: FaRegChartBar,
  },
];

export const ROLES_CONFIG: Record<UserRole, RoleConfig> = {
  admin: {
    defaultDashboardPath: "/admin/dashboard",
    allowedNavSections: [
      "dashboard",
      "profileSettings",
      "platformOverview",
      "platformProductsMain",
      "platformProductList",
      "platformCategories",
      "platformAttributes",
      "platformInventory",
      "platformOrders",
      "platformCustomers",
      "platformApplicationsMain",
      "platformApplicationsOverview",
      "platformSellerApplications",
      "platformVendorApplications",
      "platformMarketing",
      "platformReports",
      "platformSettingsRoot",
      "platformGeneralSettings",
      "platformUserManagement",
      "platformPaymentSettings",
      "platformShippingTaxSettings",
      "platformBrandingSettings",
    ],
  },
  vendor: {
    defaultDashboardPath: "/admin/dashboard",
    allowedNavSections: [
      "dashboard",
      "profileSettings",
      "vendorProducts",
      "vendorOrders",
      "vendorStaffManagement",
      "vendorPayouts",
      "vendorStoreSettings",
      "vendorReports",
    ],
  },
  individual_seller: {
    defaultDashboardPath: "/admin/dashboard",
    allowedNavSections: [
      "dashboard",
      "profileSettings",
      "sellerProducts",
      "sellerOrders",
      "sellerPayouts",
      "sellerShopPerformance",
    ],
  },
};

const validateRolesConfig = () => {
  let isValid = true;
  const allDefinedSectionIds = new Set(
    ALL_NAV_ITEMS.flatMap((item) => {
      const ids = [item.sectionId];
      if (item.children) {
        item.children.forEach((child) => ids.push(child.sectionId));
      }
      return ids;
    })
  );

  USER_ROLES_LIST.forEach((role) => {
    const config = ROLES_CONFIG[role];
    if (!config) {
      console.error(
        `[RolesConfigValidation] Missing configuration for role: ${role}`
      );
      isValid = false;
      return;
    }
    config.allowedNavSections.forEach((sectionId) => {
      if (!allDefinedSectionIds.has(sectionId)) {
        console.warn(
          `[RolesConfigValidation] Role "${role}" refers to an unknown sectionId: "${sectionId}"`
        );
      }
    });
  });
  return isValid;
};

if (process.env.NODE_ENV === "development") {
  validateRolesConfig();
}
