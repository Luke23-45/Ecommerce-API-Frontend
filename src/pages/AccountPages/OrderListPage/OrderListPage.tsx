// src/pages/AccountPages/OrderListPage/OrderListPage.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  useNavigate, // Assuming useCurrentUser for auth state
} from "react-router-dom";
import { useTheme } from "styled-components";
import {
  FaBoxOpen,
  FaUserCircle,
  FaMapMarkedAlt,
  FaCreditCard,
  FaFilter,
  FaSortAmountDown,
} from "react-icons/fa"; // More icons

// --- Component Imports ---
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner"; // VERIFY PATH
import OrderCard from "./OrderCard/OrderCard";

import { PrimaryCtaButton as PrimaryButton } from "@/pages/BecomeAPartnerPage/BecomeAPartnerPage.styles";
import { SecondaryButton } from "@/components/auth/AuthForms";
// --- Styled Components ---
import {
  OrderListPageWrapper,
  ProfileHeroSection,
  HeroContent,
  QuickActionIcons,
  OrdersContentWrapper,
  OrdersSectionCard,
  OrdersPageTitle,
  FilterSortControlsWrapper,
  FilterGroup,
  StyledSelect, // Added Filter/Sort styles
  OrderListGrid,
  NoOrdersMessage,
  PaginationControlsContainer,
  StatusBadge, // This one is actually used inside OrderCard via its styles
} from "./OrderListPage.styles";

// Import useGetOrders and types for OrderListItem
// import { useGetOrders } from '@/hooks/order/useOrder'; // Will use this later
// export interface OrderListItem { ... } // Type already defined above (Phase 1)
// For now using mockUserOrders, mockCurrentUser

// Interface for OrderListItem (copied from Phase 1 plan for self-containment)
// export interface OrderListItem {
//   _id: string;
//   orderNumber: string;
//   createdAt: string;
//   status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'paid';
//   paymentStatus?: 'paid' | 'pending' | 'failed' | 'refunded';
//   fulfillmentStatus?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'partially_shipped' | 'cancelled';
//   grandTotal: number;
//   currency: string;
//   itemCount: number;
//   firstItemImage?: string;
//   firstItemName?: string;
// }

export interface OrderListItem {
  _id: string;
  orderNumber: string;
  createdAt: string; // ISO Date string
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded"
    | "paid"; // Added 'paid'
  paymentStatus?: "paid" | "pending" | "failed" | "refunded"; // From your API response
  fulfillmentStatus?:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "partially_shipped"
    | "cancelled"; // From API items
  grandTotal: number;
  currency: string;
  itemCount: number;
  // For a quick visual, often the first item's image and name
  firstItemImage?: string;
  firstItemName?: string;
}

// MOCK DATA
const mockUserOrders: OrderListItem[] = [
  {
    _id: "order_elan_001",
    orderNumber: "ORD-20240515-001A",
    createdAt: "2024-05-15T10:30:00Z",
    status: "delivered",
    paymentStatus: "paid",
    fulfillmentStatus: "delivered",
    grandTotal: 175.5,
    currency: "USD",
    itemCount: 2,
    firstItemImage: "https://picsum.photos/seed/item1_order1/80/80",
    firstItemName: "Élan Signature Linen Throw",
  },
  {
    _id: "order_elan_002",
    orderNumber: "ORD-20240510-007C",
    createdAt: "2024-05-10T14:15:00Z",
    status: "shipped",
    paymentStatus: "paid",
    fulfillmentStatus: "shipped",
    grandTotal: 89.99,
    currency: "USD",
    itemCount: 1,
    firstItemImage: "https://picsum.photos/seed/item1_order2/80/80",
    firstItemName: "Artisan Hand-Poured Candle",
  },
  {
    _id: "order_elan_003",
    orderNumber: "ORD-20240428-015B",
    createdAt: "2024-04-28T09:00:00Z",
    status: "processing",
    paymentStatus: "paid",
    fulfillmentStatus: "processing",
    grandTotal: 320.0,
    currency: "USD",
    itemCount: 3,
    firstItemImage: "https://picsum.photos/seed/item1_order3/80/80",
    firstItemName: "Minimalist Sculptural Vase",
  },
  {
    _id: "order_elan_004",
    orderNumber: "ORD-20240315-002D",
    createdAt: "2024-03-15T17:45:00Z",
    status: "cancelled",
    paymentStatus: "refunded",
    fulfillmentStatus: "cancelled",
    grandTotal: 55.75,
    currency: "USD",
    itemCount: 1,
    firstItemImage: "https://picsum.photos/seed/item1_order4/80/80",
    firstItemName: "Velvet Cushion Cover",
  },
  {
    _id: "order_elan_005",
    orderNumber: "ORD-20240518-003A",
    createdAt: "2024-05-18T11:00:00Z",
    status: "pending", // Payment might be pending or order is new
    paymentStatus: "pending",
    fulfillmentStatus: "pending",
    grandTotal: 210.2,
    currency: "USD",
    itemCount: 2,
    firstItemImage: "https://picsum.photos/seed/item1_order5/80/80",
    firstItemName: "Organic Cotton Bedding Set",
  },
];

// Placeholder User data for Hero Section
const mockCurrentUser = {
  firstName: "Elara",
  lastName: "Vance",
  email: "elara.vance@example.com",
  // ... other user fields if needed by hero or quick actions
};

const OrderListPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  // const { data: orderData, isLoading, error } = useGetOrders({ page: currentPage, limit: itemsPerPage, sort, filters });
  // const orders = orderData?.orders || []; // Replace mock with this later

  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Simulate loading
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Or make this configurable

  // Filter & Sort State (for future implementation)
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all_time");
  const [sortBy, setSortBy] = useState<string>("createdAt:desc");

  // Simulate data fetching for mock data
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setOrders(mockUserOrders); // Using the full mockUserOrders for now
      setIsLoading(false);
    }, 1000); // Simulate API delay
  }, []);

  const heroQuickActions = [
    {
      label: "My Profile",
      icon: FaUserCircle,
      action: () => navigate("/account/profile"),
    },
    {
      label: "My Orders",
      icon: FaBoxOpen,
      action: () => navigate("/account/orders"),
    },
    {
      label: "Addresses",
      icon: FaMapMarkedAlt,
      action: () => navigate("/account/addresses"),
    },
    {
      label: "Payment Methods",
      icon: FaCreditCard,
      action: () => navigate("/account/payment-methods"),
    },
  ];

  // Apply filtering and sorting to mock data (will be handled by API params later)
  const filteredAndSortedOrders = useMemo(() => {
    let processedOrders = [...orders];
    if (statusFilter !== "all") {
      processedOrders = processedOrders.filter(
        (order) => order.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    // Date filter logic here (more complex for mock data)
    // Sort logic
    if (sortBy === "createdAt:desc") {
      processedOrders.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortBy === "createdAt:asc") {
      processedOrders.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }
    // Add more sort options
    return processedOrders;
  }, [orders, statusFilter, dateFilter, sortBy]);

  // Pagination logic for mock data
  const totalPages = Math.ceil(filteredAndSortedOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedOrders.slice(startIndex, endIndex);
  }, [filteredAndSortedOrders, currentPage, itemsPerPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // --- Main Render ---
  return (
    <OrderListPageWrapper>
      <ProfileHeroSection>
        <HeroContent>
          <h1>Welcome, {mockCurrentUser.firstName || "Valued Member"}.</h1>
          <p className="subtitle">
            Here are your recent orders with Élan Homewares. Track shipments,
            view details, and manage your purchase history.
          </p>
          <QuickActionIcons>
            {heroQuickActions.map((actionItem, idx) => (
              <button
                key={actionItem.label}
                onClick={actionItem.action}
                title={actionItem.label}
                className={
                  actionItem.label === "My Orders" ? "active-hero-action" : ""
                }
                style={{ animationDelay: `${0.9 + idx * 0.1}s` }} // Example staggering
              >
                <actionItem.icon /> {actionItem.label}
              </button>
            ))}
          </QuickActionIcons>
        </HeroContent>
      </ProfileHeroSection>

      <OrdersContentWrapper>
        <OrdersSectionCard $animationDelay="0.2s">
          {" "}
          {/* Stagger animation of content card */}
          <OrdersPageTitle>
            <h2>
              <FaBoxOpen /> My Orders
            </h2>
            {/* <button className="page-action"><FaFilter/> Filter</button> // Placeholder for filter toggle */}
          </OrdersPageTitle>
          {/* Filter and Sort Controls */}
          <FilterSortControlsWrapper>
            <FilterGroup>
              <label htmlFor="status-filter">Filter by Status:</label>
              <StyledSelect
                id="status-filter"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </StyledSelect>
            </FilterGroup>
            {/* <FilterGroup>
              <label htmlFor="date-filter">Filter by Date:</label>
              <StyledSelect id="date-filter" value={dateFilter} onChange={(e) => {setDateFilter(e.target.value); setCurrentPage(1);}}>
                <option value="all_time">All Time</option>
                <option value="last_30_days">Last 30 Days</option>
                <option value="last_6_months">Last 6 Months</option>
                <option value="2024">2024</option> 
              </StyledSelect>
            </FilterGroup> */}
            <FilterGroup>
              <label htmlFor="sort-by">Sort By:</label>
              <StyledSelect
                id="sort-by"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="createdAt:desc">Date: Newest First</option>
                <option value="createdAt:asc">Date: Oldest First</option>
                {/* <option value="grandTotal:desc">Total: High to Low</option> */}
                {/* <option value="grandTotal:asc">Total: Low to High</option> */}
              </StyledSelect>
            </FilterGroup>
          </FilterSortControlsWrapper>
          {isLoading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: theme.spacing(10),
              }}
            >
              <LoadingSpinner size="2.5rem" message="Loading your orders..." />
            </div>
          )}
          {!isLoading && error && (
            <p style={{ color: theme.colors.error, textAlign: "center" }}>
              Error loading orders: {error}
            </p>
          )}
          {!isLoading && !error && paginatedOrders.length === 0 && (
            <NoOrdersMessage>
              <p>You haven't placed any orders yet.</p>
              <PrimaryButton onClick={() => navigate("/")}>
                Start Shopping
              </PrimaryButton>
            </NoOrdersMessage>
          )}
          {!isLoading && !error && paginatedOrders.length > 0 && (
            <OrderListGrid>
              {paginatedOrders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </OrderListGrid>
          )}
          {!isLoading && !error && totalPages > 1 && (
            <PaginationControlsContainer>
              <SecondaryButton
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </SecondaryButton>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <SecondaryButton
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </SecondaryButton>
            </PaginationControlsContainer>
          )}
        </OrdersSectionCard>
      </OrdersContentWrapper>
    </OrderListPageWrapper>
  );
};

export default OrderListPage;
