// src/pages/AccountPages/OrderDetailPage/index.tsx

import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTheme } from "styled-components";
import {
  FaArrowLeft,
  FaBoxOpen,
  FaMapMarkerAlt,
  FaCreditCard,
  FaFileInvoiceDollar,
  FaTruckMoving,
  FaPrint,
  FaRedoAlt,
  FaQuestionCircle,
  FaShippingFast,
  FaTimesCircle,
  FaUndo,
} from "react-icons/fa";

// --- Styles ---
import {
  OrderDetailPageWrapper,
  OrderDetailContentLimiter,
  OrderDetailHeader,
  BackLink,
  OrderMetaInfo,
  MetaItem,
  OrderSectionCard,
  SectionTitle,
  AddressBlock,
  ItemList,
  OrderItemStyled,
  ItemThumbnail,
  ItemDetails,
  ItemName,
  ItemVariantInfo,
  ItemPriceAndQuantity,
  OrderSummaryGrid,
  SummaryRow,
  SummaryLabel,
  SummaryValue,
  OrderActionsWrapper,
} from "./OrderDetailPage.styles";

import { PrimaryCtaButton } from "../BecomeAPartnerPage/BecomeAPartnerPage.styles";
import { SecondaryButton } from "../AccountPages/OrderListPage/OrderCard/OrderCard.styles";

import {
  type IOrder,
  type IOrderItem,
  OrderStatus,
  PaymentStatus,
  FulfillmentStatus,
} from "@/types/order.types";
import { useGetOrderSummary } from "@/hooks/general/useCheckout";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";

// Helper to format dates nicely
const formatDate = (dateString: string | Date | undefined): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};


// Helper to get status display
const getStatusDisplay = (
  status: string | undefined,
  type: "order" | "payment" | "fulfillment"
) => {
  if (!status) return { text: "Unknown", color: "#888" };
  const s = status.toLowerCase();
  // Add more specific colors based on your theme
  switch (s) {
    case OrderStatus.PENDING:
    case PaymentStatus.PENDING:
    case FulfillmentStatus.PENDING:
      return { text: "Pending", color: "#f0ad4e" };
    case OrderStatus.PROCESSING:
    case FulfillmentStatus.PROCESSING:
      return { text: "Processing", color: "#0275d8" };
    case OrderStatus.SHIPPED:
    case FulfillmentStatus.SHIPPED:
      return { text: "Shipped", color: "#5bc0de" };
    case OrderStatus.DELIVERED:
    case PaymentStatus.PAID:
    case FulfillmentStatus.DELIVERED:
      return { text: "Delivered / Paid", color: "#5cb85c" };
    case OrderStatus.CANCELLED:
    case FulfillmentStatus.CANCELLED:
      return { text: "Cancelled", color: "#d9534f" };
    case OrderStatus.REFUNDED:
    case PaymentStatus.REFUNDED:
      return { text: "Refunded", color: "#777" };
    default:
      return {
        text: status
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        color: "#555",
      };
  }
};

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();

  const {
    data: orderData,
    isLoading,
    isError,
    error,
  } = useGetOrderSummary(orderId, { enabled: !!orderId });

  // Replace with useGetOrderById(orderId) hook later
  const order: IOrder | undefined = orderData; // Using mock data

  if (!order) {
    // Add a loading spinner for when the hook is fetching
    return (
      <OrderDetailPageWrapper>
        <OrderDetailContentLimiter
          style={{ textAlign: "center", paddingTop: "5rem" }}
        >
          Loading order details...
        </OrderDetailContentLimiter>
      </OrderDetailPageWrapper>
    );
  }

  const orderStatusDisplay = getStatusDisplay(order.status, "order");
  const paymentStatusDisplay = getStatusDisplay(order.paymentStatus, "payment");
  const fulfillmentStatusDisplay = getStatusDisplay(
    order.fulfillmentStatus,
    "fulfillment"
  );

  if (isLoading && !orderData) {
    return (
      <OrderDetailPageWrapper
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 100px)",
        }}
      >
        <LoadingSpinner
          size="3em"
          color={theme.colors.accent1}
          message="Loading your order summary..."
        />
      </OrderDetailPageWrapper>
    );
  }

  if (error || !orderData) {
    return (
      <OrderDetailPageWrapper>
        <OrderDetailContentLimiter
          style={{ textAlign: "center", paddingTop: theme.spacing(10) }}
        >
          <OrderDetailHeader>
            <h1>Order Review</h1>
          </OrderDetailHeader>
          <p
            style={{
              fontSize: theme.typography.body.sizes.large,
              color: theme.colors.error,
            }}
          >
            We're sorry, but we couldn't retrieve your complete order summary.
          </p>
          {error && (
            <p
              style={{
                color: theme.colors.textMuted,
                marginTop: theme.spacing(1),
              }}
            >
              Error: {error.message}
            </p>
          )}
          {!orderData && !error && (
            <p
              style={{
                color: theme.colors.textMuted,
                marginTop: theme.spacing(1),
              }}
            >
              The order details could not be processed correctly.
            </p>
          )}
          <div style={{ marginTop: theme.spacing(6) }}>
            <PrimaryCtaButton
              onClick={() => navigate("/")}
              style={{ marginRight: theme.spacing(2) }}
            >
              <FaUndo /> Back to Edit Checkout
            </PrimaryCtaButton>
            {/* Optional: Button to retry fetching summary if refetchSummary is available and makes sense */}
            {/* <SecondaryButton onClick={() => refetchSummary?.()}>Try Reloading Summary</SecondaryButton> */}
          </div>
        </OrderDetailContentLimiter>
      </OrderDetailPageWrapper>
    );
  }

  return (
    <OrderDetailPageWrapper>
      <OrderDetailContentLimiter>
        <OrderDetailHeader>
          <h1>Order Details</h1>
          <BackLink onClick={() => navigate("/account/orders")}>
            <FaArrowLeft /> My Orders
          </BackLink>
        </OrderDetailHeader>

        <OrderMetaInfo>
          <MetaItem>
            <strong>Order Number:</strong> {order.orderNumber}
          </MetaItem>
          <MetaItem>
            <strong>Date Placed:</strong> {formatDate(order.createdAt)}
          </MetaItem>
          <MetaItem>
            <strong>Status:</strong>{" "}
            <span
              style={{ color: orderStatusDisplay.color, fontWeight: "bold" }}
            >
              {orderStatusDisplay.text}
            </span>
          </MetaItem>
        </OrderMetaInfo>

        <OrderSectionCard>
          <SectionTitle>
            <FaShippingFast /> Shipping Information
          </SectionTitle>
          <AddressBlock>
            {order.shippingAddress.firstName && (
              <strong>
                {order.shippingAddress.firstName}{" "}
                {order.shippingAddress.lastName}
              </strong>
            )}
            <span>
              {order.shippingAddress.street}
              {order.shippingAddress.apartment
                ? `, ${order.shippingAddress.apartment}`
                : ""}
            </span>
            <span>
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.zipCode}
            </span>
            <span>{order.shippingAddress.country}</span>
            {order.shippingAddress.phone && (
              <span>Phone: {order.shippingAddress.phone}</span>
            )}
          </AddressBlock>
          <div
            style={{
              marginTop: theme.spacing(4),
              paddingTop: theme.spacing(3),
              borderTop: `1px dashed ${theme.colors.lightGray}`,
            }}
          >
            <p
              style={{
                margin: "0 0 4px 0",
                fontWeight: 500,
                color: theme.colors.textDark,
              }}
            >
              Delivery Method:
            </p>
            <p style={{ margin: 0, color: theme.colors.textMedium }}>
              {order.shippingDetails.name}
              {order.shippingDetails.deliveryEstimate &&
                ` (Estimated: ${order.shippingDetails.deliveryEstimate})`}
            </p>
            {order.shippingDetails.trackingNumber && (
              <PrimaryCtaButton
                as="a"
                href={
                  order.shippingDetails.trackingUrl ||
                  `https://www.google.com/search?q=${order.shippingDetails.carrier}+${order.shippingDetails.trackingNumber}`
                } // Fallback to Google search
                target="_blank"
                rel="noopener noreferrer"
                $variant="outline"
                $size="small"
                style={{ marginTop: theme.spacing(3) }}
              >
                <FaTruckMoving /> Track Package ({order.shippingDetails.carrier}
                )
              </PrimaryCtaButton>
            )}
          </div>
        </OrderSectionCard>

        <OrderSectionCard>
          <SectionTitle>
            <FaCreditCard /> Payment & Billing
          </SectionTitle>
          <AddressBlock>
            <strong>Billing Address:</strong>
            {order.billingAddress.firstName && (
              <span>
                {order.billingAddress.firstName} {order.billingAddress.lastName}
              </span>
            )}
            <span>
              {order.billingAddress.street}
              {order.billingAddress.apartment
                ? `, ${order.billingAddress.apartment}`
                : ""}
            </span>
            <span>
              {order.billingAddress.city}, {order.billingAddress.state}{" "}
              {order.billingAddress.zipCode}
            </span>
            <span>{order.billingAddress.country}</span>
          </AddressBlock>
          <div
            style={{
              marginTop: theme.spacing(4),
              paddingTop: theme.spacing(3),
              borderTop: `1px dashed ${theme.colors.lightGray}`,
            }}
          >
            <p
              style={{
                margin: "0 0 4px 0",
                fontWeight: 500,
                color: theme.colors.textDark,
              }}
            >
              Payment Method:
            </p>
            <p style={{ margin: 0, color: theme.colors.textMedium }}>
              {order.paymentDetails.cardBrand} ending in ••••{" "}
              {order.paymentDetails.cardLast4}
            </p>
            <p
              style={{
                margin: "4px 0 0 0",
                fontWeight: 500,
                color: paymentStatusDisplay.color,
              }}
            >
              Payment Status: {paymentStatusDisplay.text}
            </p>
          </div>
        </OrderSectionCard>

        <OrderSectionCard>
          <SectionTitle>
            <FaBoxOpen /> Items in this Order ({order.items.length})
          </SectionTitle>
          <ItemList>
            {order.items.map((item: IOrderItem) => (
              <OrderItemStyled
                key={
                  item.productId.toString() +
                  (item.variationId?.toString() || "")
                }
              >
                <ItemThumbnail
                  src={
                    item.imageUrl || "https://picsum.photos/seed/default/90/90"
                  }
                  alt={item.name}
                />
                <ItemDetails>
                  <ItemName as={Link} to={`/product/${item.productId}`}>
                    {item.name}
                  </ItemName>
                  {item.attributes && item.attributes.length > 0 && (
                    <ItemVariantInfo>
                      {item.attributes
                        .map(
                          (attr) => `${attr.attributeName}: ${attr.optionValue}`
                        )
                        .join(" | ")}
                    </ItemVariantInfo>
                  )}
                  <ItemVariantInfo>SKU: {item.sku || "N/A"}</ItemVariantInfo>
                </ItemDetails>
                <ItemPriceAndQuantity>
                  ${item.price.toFixed(2)} x {item.quantity}
                  <br />
                  <strong>${item.subtotal.toFixed(2)}</strong>
                </ItemPriceAndQuantity>
              </OrderItemStyled>
            ))}
          </ItemList>
        </OrderSectionCard>

        <OrderSectionCard>
          <SectionTitle>
            <FaFileInvoiceDollar /> Order Totals
          </SectionTitle>
          <OrderSummaryGrid>
            <SummaryRow>
              <SummaryLabel>Subtotal:</SummaryLabel>{" "}
              <SummaryValue>${order.totals.itemsTotal.toFixed(2)}</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>Shipping:</SummaryLabel>{" "}
              <SummaryValue>
                {order.totals.shippingTotal === 0
                  ? "FREE"
                  : `$${order.totals.shippingTotal.toFixed(2)}`}
              </SummaryValue>
            </SummaryRow>
            {order.totals.discountTotal > 0 && (
              <SummaryRow
                style={{ color: theme.colors.adminStatusSuccess || "#388E3C" }}
              >
                {" "}
                {/* Use theme success color */}
                <SummaryLabel>Discount Applied:</SummaryLabel>
                <SummaryValue>
                  -${order.totals.discountTotal.toFixed(2)}
                </SummaryValue>
              </SummaryRow>
            )}
            <SummaryRow>
              <SummaryLabel>Tax:</SummaryLabel>{" "}
              <SummaryValue>${order.totals.taxTotal.toFixed(2)}</SummaryValue>
            </SummaryRow>
            <SummaryRow className="grand-total">
              <SummaryLabel>Grand Total:</SummaryLabel>{" "}
              <SummaryValue>
                ${order.totals.grandTotal.toFixed(2)} {order.totals.currency}
              </SummaryValue>
            </SummaryRow>
          </OrderSummaryGrid>
        </OrderSectionCard>

        <OrderActionsWrapper>
          {order.status === OrderStatus.DELIVERED && (
            <PrimaryCtaButton $variant="outline">
              <FaRedoAlt /> Request Return or Exchange
            </PrimaryCtaButton>
          )}
          {order.status === OrderStatus.PENDING && (
            <SecondaryButton $variant="danger">
              <FaTimesCircle /> Cancel Order
            </SecondaryButton>
          )}
          <SecondaryButton>
            <FaPrint /> Print Invoice
          </SecondaryButton>
        </OrderActionsWrapper>
      </OrderDetailContentLimiter>
    </OrderDetailPageWrapper>
  );
};

export default OrderDetailPage;
