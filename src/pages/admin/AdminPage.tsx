import React, { useState } from "react";

import AdminLayout from "@/components/admin/Layout/Layout";
import DashboardRouter from "@/components/admin/Dashboard/DashboardRouter";
import ProductList from "@/components/admin/Products/ProductList";
import ProductDetail_ from "@/components/admin/Products/ProductDetail";
import type {
  Product,
  ProductDetail as ProductDetailType,
} from "@/types/product";
import CategoryList from "@/components/Categories/CategoryList";
import OrderList from "@/components/admin/Orders/OrderList";
import OrderDetail from "@/components/admin/Orders/OrderDetail";
import type { Order } from "@/types/order";
import CustomerList from "@/components/admin/Customers/CustomerList";
import type { Customer } from "@/types/customer";
import CustomerDetail from "@/components/admin/Customers/CustomerDetail";
import ReportsOverview from "@/components/admin/Reports/ReportsOverview";
import type { PromotionBanner } from "@/types/marketing";
import BannerEditModal from "@/components/admin/Marketing/BannerEditModal";
import MarketingList from "@/components/admin/Marketing/MarketingList";
import SettingsOverview from "@/components/admin/settings/SettingsOverview";
import { type PlatformUser } from "@/types/settings";
import { type GeneralSettings } from "@/types/settings";
import ConfirmationModal from "@/components/admin/common/ConfirmationModal/ConfirmationModal";
import { useNotification } from "@/contexts/NotificationContext";
import AttributesOverview from "@/components/admin/Products/AttributesOverview";
import InventoryOverview from "@/components/admin/Products/InventoryOverview";
import BrandingSettings from "@/components/admin/Sidebar/BrandingSettings";
import ShippingTaxSettings from "@/components/admin/Sidebar/ShippingTaxSettings";
import PaymentGatewaySettings from "@/components/admin/Sidebar/PaymentGatewaySettings";

// --- CENTRALIZED DUMMY DATA FOR ALL MODULES (Define ONCE OUTSIDE THE COMPONENT) ---
const mockId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
const getGenericImage = (
  seed: string,
  width: number = 800,
  height: number = 450,
  tags: string = ""
) =>
  `https://picsum.photos/seed/${seed.replace(/\s/g, "-")}/${width}/${height}/?${tags}`;

const allDummyProducts: Product[] = [
  {
    _id: mockId("PRD"),
    name: "Élan Solid Oak Console",
    sku: "ELOAK001",
    category: "Living Room",
    price: 580,
    currency: "USD",
    inventory: 15,
    stockStatus: "in_stock",
    status: "active",
    sellerType: "vendor",
    mainImageUrl: getGenericImage("consoledesk", 100, 100),
    vendorName: "Artisan Wood Co.",
    createdAt: "2023-01-15T10:00:00Z",
  },
  {
    _id: mockId("PRD"),
    name: "Ceramic Glaze Vase Set",
    sku: "ELVASE002",
    category: "Decor",
    price: 95,
    currency: "USD",
    inventory: 0,
    stockStatus: "out_of_stock",
    status: "active",
    sellerType: "individual_seller",
    mainImageUrl: getGenericImage("vaseset", 100, 100),
    sellerName: "Studio Potter",
    createdAt: "2023-02-20T11:30:00Z",
  },
  {
    _id: mockId("PRD"),
    name: "Nordic Wool Rug - Azure",
    sku: "ELRUG003",
    category: "Living Room",
    price: 320,
    currency: "USD",
    inventory: 5,
    stockStatus: "in_stock",
    status: "active",
    sellerType: "vendor",
    mainImageUrl: getGenericImage("woolrug", 100, 100),
    vendorName: "Scandinavian Weaves",
    createdAt: "2023-03-01T14:00:00Z",
    salePrice: 280,
  },
  {
    _id: mockId("PRD"),
    name: "Smart LED Floor Lamp",
    sku: "ELLAMP004",
    category: "Lighting",
    price: 180,
    currency: "USD",
    inventory: 10,
    stockStatus: "in_stock",
    status: "pending_review",
    sellerType: "vendor",
    mainImageUrl: getGenericImage("ledlamp", 100, 100),
    vendorName: "Bright Home",
    createdAt: "2023-03-10T09:15:00Z",
  },
  {
    _id: mockId("PRD"),
    name: "Handcrafted Ceramic Bowl",
    sku: "ELBOWL005",
    category: "Kitchen",
    price: 45,
    currency: "USD",
    inventory: 30,
    stockStatus: "in_stock",
    status: "draft",
    sellerType: "individual_seller",
    mainImageUrl: getGenericImage("ceramicbowl", 100, 100),
    sellerName: "Pottery Studio",
    createdAt: "2023-03-25T16:45:00Z",
  },
  {
    _id: mockId("PRD"),
    name: "Velvet Dining Chairs",
    sku: "ELDIN006",
    category: "Dining Room",
    price: 300,
    currency: "USD",
    inventory: 8,
    stockStatus: "in_stock",
    status: "active",
    sellerType: "vendor",
    mainImageUrl: getGenericImage("diningchair", 100, 100),
    vendorName: "Comfort Living",
    createdAt: "2023-04-01T11:00:00Z",
  },
];

const allDummyOrders: Order[] = [
  {
    _id: mockId("ORD"),
    customer: {
      customerId: mockId("CUST"),
      customerName: "Alice Johnson",
      customerEmail: "alice@example.com",
      customerPhone: "+1-555-123-4567",
    },
    orderItems: [
      {
        productId: mockId("PRD"),
        productName: "Élan Console",
        quantity: 1,
        priceAtTimeOfPurchase: 580,
        productMainImageUrl: getGenericImage("consoledesk", 100, 100),
      },
    ],
    totalAmount: 580,
    currency: "USD",
    paymentStatus: "paid",
    fulfillmentStatus: "processing",
    shippingAddress: {
      street: "123 Maple Ave",
      city: "Springfield",
      state: "IL",
      zipCode: "62704",
      country: "USA",
    },
    shippingMethod: "Standard Ground",
    createdAt: "2023-10-25T10:00:00Z",
    updatedAt: "2023-10-25T10:05:00Z",
  },
  {
    _id: mockId("ORD"),
    customer: {
      customerId: mockId("CUST"),
      customerName: "Bob Williams",
      customerEmail: "bob@example.com",
    },
    orderItems: [
      {
        productId: mockId("PRD"),
        productName: "Nordic Rug",
        quantity: 1,
        priceAtTimeOfPurchase: 280,
        productMainImageUrl: getGenericImage("woolrug", 100, 100),
      },
    ],
    totalAmount: 280,
    currency: "USD",
    paymentStatus: "paid",
    fulfillmentStatus: "shipped",
    trackingNumber: "FEDEX87654321",
    carrier: "FedEx",
    shippingAddress: {
      street: "45 Oak Lane",
      city: "Greenville",
      state: "SC",
      zipCode: "29601",
      country: "USA",
    },
    shippingMethod: "Express Shipping",
    createdAt: "2023-10-24T14:30:00Z",
    updatedAt: "2023-10-24T15:00:00Z",
  },
  {
    _id: mockId("ORD"),
    customer: {
      customerId: mockId("CUST"),
      customerName: "Carol D.",
      email: "carol@example.com",
    },
    orderItems: [
      {
        productId: mockId("PRD"),
        productName: "Ceramic Bowl",
        quantity: 3,
        priceAtTimeOfPurchase: 45,
        productMainImageUrl: getGenericImage("ceramicbowl", 100, 100),
      },
    ],
    totalAmount: 135,
    currency: "USD",
    paymentStatus: "pending",
    fulfillmentStatus: "processing",
    shippingAddress: {
      street: "78 Pine St",
      city: "Harmony",
      state: "KY",
      zipCode: "40037",
      country: "USA",
    },
    shippingMethod: "Standard",
    createdAt: "2023-10-23T09:00:00Z",
    updatedAt: "2023-10-23T09:10:00Z",
  },
];

const allDummyCustomers: Customer[] = [
  {
    _id: mockId("CUST"),
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@example.com",
    phone: "+1-555-101-1111",
    avatarUrl: getGenericImage("alice-j", 150, 150),
    registrationDate: "2022-01-10T09:00:00Z",
    lastLoginDate: "2023-10-25T14:30:00Z",
    totalOrders: 5,
    totalSpent: 750.5,
    accountStatus: "active",
    addresses: [
      {
        street: "123 Maple Ave",
        city: "Springfield",
        state: "IL",
        zipCode: "62704",
        country: "USA",
        type: "shipping",
        isDefault: true,
      },
      {
        street: "456 Oak Dr",
        city: "Springfield",
        state: "IL",
        zipCode: "62704",
        country: "USA",
        type: "billing",
      },
    ],
  },
  {
    _id: mockId("CUST"),
    firstName: "Bob",
    lastName: "Williams",
    email: "bob@example.com",
    phone: "+1-555-202-2222",
    avatarUrl: getGenericImage("bob-w", 150, 150),
    registrationDate: "2022-03-01T11:30:00Z",
    lastLoginDate: "2023-09-20T10:00:00Z",
    totalOrders: 1,
    totalSpent: 280.0,
    accountStatus: "active",
    addresses: [
      {
        street: "45 Oak Lane",
        city: "Greenville",
        state: "SC",
        zipCode: "29601",
        country: "USA",
        type: "shipping",
        isDefault: true,
      },
    ],
  },
  {
    _id: mockId("CUST"),
    firstName: "Carol",
    lastName: "Davis",
    email: "carol@example.com",
    phone: "+1-555-303-3333",
    avatarUrl: getGenericImage("carol-d", 150, 150),
    registrationDate: "2023-01-05T08:00:00Z",
    lastLoginDate: "2023-10-15T09:00:00Z",
    totalOrders: 2,
    totalSpent: 180.0,
    accountStatus: "pending_verification",
  },
];

const allDummyBanners: PromotionBanner[] = [
  {
    _id: mockId("BNR"),
    name: "Homepage Winter Sale 2023",
    imageUrl: getGenericImage("winter-sale", 800, 450, "winter-sale"),
    linkUrl: "/collections/winter-sale",
    startDate: "2023-11-01T00:00:00Z",
    endDate: "2023-12-31T23:59:59Z",
    status: "active",
    location: "homepage_hero",
    priority: 1,
  },
  {
    _id: mockId("BNR"),
    name: "New Arrivals Banner",
    imageUrl: getGenericImage("new-arrivals", 800, 450, "new-arrivals"),
    linkUrl: "/new-arrivals",
    startDate: "2023-10-01T00:00:00Z",
    endDate: null,
    status: "active",
    location: "homepage_cta",
    priority: 5,
  },
  {
    _id: mockId("BNR"),
    name: "Spring Collection Preview",
    imageUrl: getGenericImage(
      "spring-collection",
      800,
      450,
      "spring-collection"
    ),
    linkUrl: "/collections/spring-preview",
    startDate: "2024-02-15T00:00:00Z",
    endDate: "2024-03-31T23:59:59Z",
    status: "scheduled",
    location: "collection_top",
    priority: 1,
  },
];

const allPlatformUsers: PlatformUser[] = [
  {
    _id: mockId("USR"),
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@elan.com",
    role: "super_admin",
    status: "active",
    createdAt: "2022-01-01T00:00:00Z",
    lastLogin: "2023-11-20T10:00:00Z",
  },
  {
    _id: mockId("USR"),
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@vendor1.com",
    role: "vendor_staff",
    status: "active",
    createdAt: "2022-03-15T00:00:00Z",
    lastLogin: "2023-11-19T14:30:00Z",
    vendorId: mockId("VDR"),
  },
  {
    _id: mockId("USR"),
    firstName: "Emily",
    lastName: "Clark",
    email: "emily.c@seller.com",
    role: "individual_seller",
    status: "active",
    createdAt: "2022-05-01T00:00:00Z",
    lastLogin: "2023-11-18T09:00:00Z",
    sellerId: mockId("SLR"),
  },
  {
    _id: mockId("USR"),
    firstName: "David",
    lastName: "Brown",
    email: "david.b@vendor2.com",
    role: "vendor_staff",
    status: "suspended",
    createdAt: "2022-07-20T00:00:00Z",
    lastLogin: "2023-10-01T10:00:00Z",
    vendorId: mockId("VDR"),
  },
];

const currentGeneralSettings: GeneralSettings = {
  platformName: "Élan Homewares Marketplace",
  contactEmail: "support@elanhomewares.com",
  contactPhone: "+1-800-ELAN-HOME",
  defaultCurrency: "USD",
  defaultTimezone: "America/New_York",
  allowCustomerRegistrations: true,
  requireProductApproval: true,
  lowStockThreshold: 10,
};

const AdminPage: React.FC = () => {
  const [currentPath, setCurrentPath] = useState("/admin/dashboard");
  const [userRole] = useState<"seller" | "vendor" | "superAdmin">("superAdmin");

  // Modal state for banner editing
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<PromotionBanner | null>(
    null
  );

  // Confirmation Modal State (CENTRALIZED)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState<{
    title: string;
    message: string | React.ReactNode;
    onConfirm: () => void;
    confirmButtonText?: string;
    confirmVariant?: "primary" | "danger";
  } | null>(null);

  const { showNotification } = useNotification();

  const handleNavLinkClick = (path: string) => {
    setCurrentPath(path);
    console.log(`Admin navigating to: ${path}`);
  };

  const getIdFromPath = (path: string, segment: string): string | null => {
    const match = path.match(
      new RegExp(`\\/admin\\/${segment}\\/([^\\/]+)(?:\\/edit)?$`)
    );
    return match ? match[1] : null;
  };
  let isEditingProduct = false;
  // Product-specific path checks
  if (currentPath) {
    isEditingProduct =
      currentPath.startsWith("/admin/products/") &&
      currentPath.endsWith("/edit");
  }

  const isAddingProduct = currentPath === "/admin/products/new";
  const productIdToEdit = isEditingProduct
    ? getIdFromPath(currentPath, "products")
    : null;

  // Order-specific path checks
  const isViewingOrder =
    currentPath.startsWith("/admin/orders/") &&
    !currentPath.endsWith("/new") &&
    currentPath !== "/admin/orders";
  const orderIdToView = isViewingOrder
    ? getIdFromPath(currentPath, "orders")
    : null;

  // Customer-specific path checks
  const isViewingCustomer =
    currentPath.startsWith("/admin/customers/") &&
    currentPath !== "/admin/customers";
  const customerIdToView = isViewingCustomer
    ? getIdFromPath(currentPath, "customers")
    : null;

  // Marketing-specific path checks
  const isEditingBanner =
    currentPath.startsWith("/admin/marketing/") &&
    currentPath.endsWith("/edit");
  const isAddingBanner = currentPath === "/admin/marketing/new";
  const bannerIdToEdit = isEditingBanner
    ? getIdFromPath(currentPath, "marketing")
    : null;

  // --- Generic Confirmation Trigger ---
  const showConfirmModal = (
    title: string,
    message: string | React.ReactNode,
    onConfirm: () => void,
    confirmButtonText: string = "Confirm",
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

  // --- Confirmation Modal Handlers ---
  const handleConfirmModalCancel = () => {
    setIsConfirmModalOpen(false);
    setConfirmModalData(null); // Clear modal data
    showNotification("Action cancelled.", "info");
  };

  const handleConfirmModalConfirm = () => {
    if (confirmModalData && confirmModalData.onConfirm) {
      confirmModalData.onConfirm();
    }
    setIsConfirmModalOpen(false);
    setConfirmModalData(null);
  };

  // --- Handlers for Product Module ---
  const handleSaveProduct = (product: ProductDetailType, isNew: boolean) => {
    console.log(`Product ${isNew ? "CREATED" : "UPDATED"}:`, product);
    showNotification(
      `Product "${product.name}" ${isNew ? "created" : "updated"} successfully!`,
      "success"
    );
    handleNavLinkClick("/admin/products");
  };
  const handleDeleteProduct = (productId: string, productName: string) => {
    showConfirmModal(
      `Confirm Deletion: ${productName}`,
      `Are you sure you want to permanently delete "${productName}" (ID: ${productId})? This action cannot be undone.`,
      () => {
        console.log(`CONFIRMED DELETION of Product ID: ${productId}`);
        showNotification(
          `Product "${productName}" deleted successfully!`,
          "success"
        );
      },
      "Delete Permanently",
      "danger"
    );
  };
  const handleCancelProductEdit = () => {
    handleNavLinkClick("/admin/products");
  };

  // --- Handlers for Order Module ---
  const handleViewOrderDetails = (orderId: string) => {
    console.log(`Viewing order details for: ${orderId}`);
    handleNavLinkClick(`/admin/orders/${orderId}`);
  };

  // --- Handlers for Customer Module ---
  const handleViewCustomerDetails = (customerId: string) => {
    console.log(`Viewing customer details for: ${customerId}`);
    handleNavLinkClick(`/admin/customers/${customerId}`);
  };
  const handleDeleteCustomer = (customerId: string, customerName: string) => {
    showConfirmModal(
      `Confirm Deletion: ${customerName}`,
      `Are you sure you want to permanently delete customer "${customerName}" (ID: ${customerId})? This will also remove their associated data. This action cannot be undone.`,
      () => {
        console.log(`CONFIRMED DELETION of Customer ID: ${customerId}`);
        showNotification(
          `Customer "${customerName}" deleted successfully!`,
          "success"
        );
      },
      "Delete Customer",
      "danger"
    );
  };

  // --- Handlers for Marketing Module ---
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
    console.log(`Banner ${isNew ? "CREATED" : "UPDATED"}:`, banner);
    showNotification(
      `Banner "${banner.name}" ${isNew ? "created" : "updated"} successfully!`,
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
  const handleDeleteBanner = (bannerId: string, bannerName: string) => {
    showConfirmModal(
      `Confirm Deletion: ${bannerName}`,
      `Are you sure you want to permanently delete banner "${bannerName}" (ID: ${bannerId})? This will remove it from all displays.`,
      () => {
        console.log(`CONFIRMED DELETION of Banner ID: ${bannerId}`);
        showNotification(
          `Banner "${bannerName}" deleted successfully!`,
          "success"
        );
      },
      "Delete Banner",
      "danger"
    );
  };

  // --- Handlers for Settings Module (general settings and user management) ---
  const handleSaveGeneralSettings = (settings: GeneralSettings) => {
    console.log("Saving General Settings:", settings);
    showNotification("General Settings updated successfully!", "success");
  };
  const handleSavePlatformUser = (user: PlatformUser, isNew: boolean) => {
    console.log(`Platform User ${isNew ? "CREATED" : "UPDATED"}:`, user);
    showNotification(
      `User "${user.email}" ${isNew ? "created" : "updated"} successfully!`,
      "success"
    );
  };
  const handleDeletePlatformUser = (userId: string, userName: string) => {
    showConfirmModal(
      `Confirm User Deletion`,
      `Are you sure you want to permanently delete user "${userName}" (ID: ${userId})? They will lose all access. This action cannot be undone.`,
      () => {
        console.log(`CONFIRMED DELETION of User ID: ${userId}`);
        showNotification(`User "${userName}" deleted successfully!`, "success");
      },
      "Delete User",
      "danger"
    );
  };

  // --- Handlers for Category Module ---
  const handleSaveCategory = (category: any, isNew: boolean) => {
    // Temp any type, define actual category type
    console.log(`Category ${isNew ? "CREATED" : "UPDATED"}:`, category);
    showNotification(
      `Category "${category.name}" ${isNew ? "created" : "updated"} successfully!`,
      "success"
    );
    handleNavLinkClick("/admin/products/categories");
  };
  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    showConfirmModal(
      `Confirm Deletion: ${categoryName}`,
      `Are you sure you want to permanently delete category "${categoryName}" (ID: ${categoryId}) and ALL its subcategories and associated products? This action cannot be undone.`,
      () => {
        console.log(`CONFIRMED DELETION of Category ID: ${categoryId}`);
        showNotification(
          `Category "${categoryName}" deleted successfully!`,
          "success"
        );
      },
      "Delete Category & Subcategories",
      "danger"
    );
  };

  // Conditional rendering based on currentPath to switch between views
  const renderContent = () => {
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
    } else if (currentPath === "/admin/products/new" || isEditingProduct) {
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
            showNotification(
              "Navigating to detailed attributes management (demo).",
              "info"
            )
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
            showNotification(
              "Navigating to detailed inventory management (demo).",
              "info"
            )
          }
          onImportInventory={() =>
            showNotification("Inventory import initiated (demo).", "info")
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
    } else if (isViewingOrder) {
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
    } else if (isViewingCustomer) {
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
    }
    return (
      <div style={{ padding: "50px", textAlign: "center", color: "#999" }}>
        Page Not Found. Select an option from the sidebar.
      </div>
    );
  };

  const getPageTitle = (path: string) => {
    if (path === "/admin/dashboard") {
      if (userRole === "seller") return "My Dashboard Overview";
      if (userRole === "vendor") return "Vendor Dashboard";
      return "Platform Dashboard";
    } else if (path === "/admin/products") {
      return "All Products";
    } else if (path === "/admin/products/new") {
      return "Add New Product";
    } else if (isEditingProduct) {
      return `Edit Product (ID: ${productIdToEdit || "N/A"})`;
    } else if (path === "/admin/products/categories") {
      return "Product Categories";
    } else if (path === "/admin/products/attributes") {
      return "Product Attributes";
    } else if (path === "/admin/products/inventory") {
      return "Product Inventory";
    } else if (path === "/admin/orders") {
      return "All Orders";
    } else if (isViewingOrder) {
      return `Order Details (ID: ${orderIdToView || "N/A"})`;
    } else if (path === "/admin/customers") {
      return "All Customers";
    } else if (isViewingCustomer) {
      return `Customer Details (ID: ${customerIdToView || "N/A"})`;
    } else if (currentPath === "/admin/reports") {
      return "Reports & Analytics";
    } else if (currentPath === "/admin/marketing") {
      return "Promotional Banners";
    } else if (isAddingBanner) {
      return "Add New Banner";
    } else if (isEditingBanner) {
      return `Edit Banner (ID: ${bannerIdToEdit || "N/A"})`;
    } else if (currentPath.startsWith("/admin/settings")) {
      // Main settings parent path
      // Handle specific settings sub-titles
      if (currentPath === "/admin/settings/general") return "General Settings";
      if (currentPath === "/admin/settings/users") return "User Management";
      if (currentPath === "/admin/settings/payment-gateways")
        return "Payment Gateway Settings";
      if (currentPath === "/admin/settings/shipping-tax")
        return "Shipping & Tax Settings";
      if (currentPath === "/admin/settings/branding")
        return "Branding & Theme Settings";
      return "Platform Settings"; // Default for /admin/settings
    }
    return "Admin Panel";
  };

  return (
    <AdminLayout
      pageTitle={getPageTitle(currentPath)}
      activePath={currentPath}
      onNavLinkClick={handleNavLinkClick}
    >
      {renderContent()}

      {/* Render the BannerEditModal conditionally (based on Marketing module state) */}
      <BannerEditModal
        isOpen={isAddingBanner || isEditingBanner || isBannerModalOpen}
        onClose={handleCancelBannerEdit}
        onSave={handleSaveBanner}
        editingBanner={editingBanner}
      />

      {/* Confirmation Modal Render */}
      {isConfirmModalOpen && confirmModalData && (
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          title={confirmModalData.title}
          message={confirmModalData.message as string} // Assuming message is string here. If it can be JSX, remove `as string`.
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
