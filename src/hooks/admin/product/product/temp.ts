// src/pages/CheckoutReviewPage/CheckoutReviewPage.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "styled-components";
import {
  FaShippingFast,
  FaCreditCard,
  FaShoppingCart,
  FaLock,
  FaUndo,
  FaReceipt,
  FaSpinner, // Keep FaSpinner for buttons or specific loaders
  FaRegAddressCard,
} from "react-icons/fa";
import { PrimaryCtaButton } from "../BecomeAPartnerPage/BecomeAPartnerPage.styles";
// --- Styled Components ---
import {
  ReviewPageWrapper,
  ReviewContentLimiter,
  ReviewHeader,
  BackButton,
  ReviewLayout,
  MainContent,
  Sidebar,
  ReviewCard,
  CardHeader,
  SectionTitle,
  EditLink,
  CardBody,
  ItemList,
  Item,
  ItemThumbnail,
  ItemDetails,
  ItemName,
  ItemVariant,
  ItemQuantityPrice,
  SummaryCard,
  TotalRow,
  InfoLabel,
  InfoValue,
  DiscountRow,
  GrandTotalRow,
  PlaceOrderButtonStyled,
  SecurityNotice,
} from "./CheckoutReviewPage.styles";

// --- React Query Hooks & Types ---
import { useGetOrderSummary, usePlaceOrder } from "@/hooks/general/useCheckout"; // VERIFY PATH
import type { OrderSummaryResult } from "@/types/checkout.types"; // VERIFY PATH

// --- Common Components ---
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner"; // VERIFY PATH
import { useNotification } from "@/contexts/NotificationContext";
// Assuming useNotification hook is available for user feedback
// import { useNotification } from '@/contexts/NotificationContext'; // EXAMPLE PATH

// --- Type Definitions for this Page's Processed Data ---
// These define the structure *after* transformation for UI display
interface ReviewItemProduct {
  _id: string;
  name: string;
  sku?: string;
  imageUrls: string[];
  brand?: string;
}
interface ReviewItem {
  productId: ReviewItemProduct;
  quantity: number;
  price: number;
  lineTotal: number;
  attributes?: { name: string; value: string }[];
  _id?: string;
} // Added _id for item mapping
interface AddressDetail {
  name?: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
interface ShippingMethodDetail {
  id: string;
  name: string;
  description?: string;
  estimatedDeliveryTime?: string;
  cost: number;
}
interface PaymentMethodDetail {
  typeDescription: string;
}
interface DiscountDetail {
  code: string;
  summaryDescription: string;
  amountApplied: number;
}
interface TaxDetail {
  totalTaxAmount: number;
}
interface OrderTotals {
  itemsTotal: number;
  shippingTotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  currency: string;
}

export interface FullOrderSummary {
  // Export if other components might use this processed shape
  sessionId: string;
  items: ReviewItem[];
  chosenShippingMethod: ShippingMethodDetail;
  shippingAddress: AddressDetail;
  billingAddress: AddressDetail;
  chosenPaymentMethod: PaymentMethodDetail;
  discountsApplied: DiscountDetail[];
  taxes: TaxDetail;
  totals: OrderTotals;
  userId?: string;
  isBillingSameAsShipping?: boolean;
}

// Placeholder for notification hook if not fully set up
const useNotificationSystem = () => ({
  showNotification: (
    message: string,
    type: "success" | "error" | "info" | "warning"
  ) => {
    console.log(`[Notification-${type.toUpperCase()}] ${message}`);
    if (type === "error" || type === "warning")
      alert(`${type.toUpperCase()}: ${message}`);
  },
});

// --- Data Transformation Function ---
const processApiResponseToFullOrderSummary = (
  apiOrderSummaryResult: OrderSummaryResult | undefined | null
): FullOrderSummary | null => {
  if (!apiOrderSummaryResult || !apiOrderSummaryResult.data) {
    console.warn(
      "processApiResponse: No API data provided or data field is missing."
    );
    return null;
  }
  const rawData = apiOrderSummaryResult.data; // This is the direct response from your API structure

  // Helper for safe number conversion
  const toNumber = (val: any, defaultValue = 0): number =>
    typeof val === "number" ? val : defaultValue;

  // 1. Chosen Shipping Method (already selected and present in rawData)
  // Assuming rawData.shippingMethod is the *selected* method object, not an array.
  // If rawData.shippingMethod is an array and you need to find by rawData.selectedShippingMethodId:
  // const smFromList = Array.isArray(rawData.shippingMethod) ? rawData.shippingMethod.find(sm => sm.id === rawData.selectedShippingMethodId) : rawData.shippingMethod;
  const chosenShippingMethodAPI: ShippingMethodDetail = {
    id:
      rawData.chosenShippingMethod?.id ||
      rawData.selectedShippingMethodId ||
      "N/A",
    name: rawData.chosenShippingMethod?.name || "N/A",
    description: rawData.chosenShippingMethod?.description,
    estimatedDeliveryTime: rawData.chosenShippingMethod?.estimatedDeliveryTime,
    cost: rawData.calculatedShippingTotal ?? 0, // Use calculated total from summary
  };

  // 2. Chosen Payment Method (API should provide resolved display data)
  const chosenPaymentMethodAPI: PaymentMethodDetail = {
    typeDescription:
      rawData.chosenPaymentMethod?.typeDescription || // If backend sends a pre-formatted string
      (rawData.selectedPaymentMethod
        ? `${rawData.selectedPaymentMethod.cardBrand || "Card"} ending in ${
            rawData.selectedPaymentMethod.last4
          }`
        : "Not Specified"),
  };

  // 3. Discounts Applied
  const discountsAppliedAPI: DiscountDetail[] = (rawData.discount || []).map(
    (d: any) => ({
      code: d.code,
      summaryDescription:
        d.summaryDescription ||
        `${
          d.discountType === "percentage"
            ? (d.details?.percentage || 0) + "%"
            : (rawData.currency || "$") +
              (d.details?.actualDiscountAmount || d.amount || 0).toFixed(2)
        } Off`,
      amountApplied:
        d.details?.actualDiscountAmount ||
        d.details?.maximumDiscountAmountApplied ||
        d.amount ||
        0,
    })
  );

  // 4. Processed Items
  const processedItemsAPI: ReviewItem[] = (rawData.items || []).map(
    (item: any) => {
      const product = item.productId || {}; // API response structure might vary
      const price = toNumber(item.priceAtCheckout ?? product.price);
      return {
        _id:
          product._id ||
          item._id ||
          `item-${Math.random().toString(36).substr(2, 9)}`, // Unique key for React
        productId: {
          _id: product._id || "N/A",
          name: product.name || "Unknown Item",
          sku: product.sku,
          imageUrls: product.imageUrls || [],
          brand: product.brand,
        },
        quantity: toNumber(item.quantity),
        price: price,
        lineTotal: toNumber(item.quantity) * price,
        attributes: (product.variants?.flatMap((v: any) =>
          v.options.map((o: any) => ({ name: v.name, value: o.name }))
        ) || []) as { name: string; value: string }[],
      };
    }
  );

  // 5. Addresses (assuming rawData.shippingAddress and rawData.billingAddress are structured AddressDetail-like)
  const mapAddress = (apiAddr: any): AddressDetail => ({
    name:
      apiAddr?.name ||
      `${apiAddr?.firstName || ""} ${apiAddr?.lastName || ""}`.trim() ||
      undefined,
    street: apiAddr?.street || "N/A",
    apartment: apiAddr?.apartment,
    city: apiAddr?.city || "N/A",
    state: apiAddr?.state || "N/A",
    zipCode: apiAddr?.zipCode || apiAddr?.zip || "N/A", // Handle both zip/zipCode
    country: apiAddr?.country || "N/A",
  });
  const shippingAddressAPI = mapAddress(rawData.shippingAddress);
  const billingAddressAPI = mapAddress(rawData.billingAddress);

  const isBillingSameAsShippingAPI =
    rawData.selectedShippingAddress === rawData.selectedbillingAddress || // If IDs match
    (!!rawData.shippingAddress &&
      !!rawData.billingAddress &&
      JSON.stringify(rawData.shippingAddress) ===
        JSON.stringify(rawData.billingAddress)); // Fallback deep compare

  return {
    sessionId: rawData.sessionId || rawData._id || "N/A",
    items: processedItemsAPI,
    chosenShippingMethod: chosenShippingMethodAPI,
    shippingAddress: shippingAddressAPI,
    billingAddress: billingAddressAPI,
    chosenPaymentMethod: chosenPaymentMethodAPI,
    discountsApplied: discountsAppliedAPI,
    taxes: { totalTaxAmount: toNumber(rawData.calculatedTaxTotal) },
    totals: {
      itemsTotal: toNumber(rawData.calculatedItemsTotal),
      shippingTotal: toNumber(rawData.calculatedShippingTotal), // Use calculated
      discountTotal: toNumber(rawData.calculatedDiscountTotal),
      taxTotal: toNumber(rawData.calculatedTaxTotal),
      grandTotal: toNumber(rawData.calculatedGrandTotal),
      currency: rawData.currency || "USD",
    },
    userId: rawData.userId,
    isBillingSameAsShipping: isBillingSameAsShippingAPI,
  };
};

const CheckoutReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  // const { showNotification } = useNotification(); // Use your actual notification context
  const { showNotification } = useNotification(); // Using placeholder for now

  const sessionIdFromState = '684dbe7f6eb52de7c5e18ef3';
  // Fallback to a development session ID if none is passed, for easier isolated testing of this page.
  // In production, sessionIdFromState should always be present.
  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(
  '684dbe7f6eb52de7c5e18ef3'
  );



  useEffect(() => {
    if (!sessionIdFromState) {
      showNotification(
        "Checkout session ID is missing. Please restart checkout.",
        "error"
      );
      // Consider navigating back or showing a more permanent error state if session ID is vital and missing.
      // navigate('/cart', { replace: true });
      // For development, you might temporarily set a mock ID:
      // setCheckoutSessionId("DEV_MOCK_SESSION_ID");
    }
  }, [sessionIdFromState, navigate, showNotification]);

  const {
    data: apiOrderSummary,
    isLoading: isLoadingSummary,
    error: summaryError,
    refetch: refetchSummary,
  } = useGetOrderSummary(checkoutSessionId, { enabled: !!checkoutSessionId }); // Hook enabled by sessionId

  const { mutateAsync: placeOrderMutation, isLoading: isPlacingOrder } =
    usePlaceOrder();

  const orderSummary: FullOrderSummary | null = useMemo(() => {
    if (apiOrderSummary) {
      return processApiResponseToFullOrderSummary(apiOrderSummary);
    }
    return null;
  }, [apiOrderSummary]);

  const handleEdit = (checkoutStepPathFragment: string) => {
    navigate(`/checkout#${checkoutStepPathFragment}`, {
      state: { sessionId: checkoutSessionId },
    });
  };

  const handlePlaceOrder = async () => {
    if (!checkoutSessionId || !orderSummary) {
      showNotification(
        "Cannot place order: order details are incomplete.",
        "error"
      );
      return;
    }
    // isPlacingOrder (from usePlaceOrder hook) manages button state automatically
    try {
      // usePlaceOrder expects { sessionId: string } (and optionally idempotencyKey if hook doesn't handle it)
      const createdOrder = await placeOrderMutation({
        sessionId: checkoutSessionId,
      });
      // The hook's onSuccess should handle navigation to confirmation page
      // If not, navigate here:
      // navigate(`/order-confirmation/${createdOrder._id}`, { replace: true }); // Assuming createdOrder has _id
    } catch (apiError: any) {
      // Hook's onError handles notification. This is for additional logging or specific UI.
      console.error("Error placing order:", apiError);
      // showNotification(apiError.message || "Failed to place your order. Please try again.", "error");
    }
  };

  const renderAddress = (
    address: AddressDetail,
    type: "Shipping" | "Billing"
  ) => (
console.log("    { ()=> console.log(address)}", address)

    // <div className="address-block">
    //   {" "}
    //   {/* Ensure styles exist for this class or remove */}
    //   <p
    //     className="detail-label"
    //     style={{
    //       fontWeight: theme.typography.body.weights.medium,
    //       marginBottom: theme.spacing(1),
    //     }}
    //   >
    //     {type === "Shipping" ? (
    //       <FaShippingFast style={{ marginRight: theme.spacing(1.5) }} />
    //     ) : (
    //       <FaRegAddressCard style={{ marginRight: theme.spacing(1.5) }} />
    //     )}
    //     {type} Address:
    //   </p>
    //   <strong
    //     className="detail-value"
    //     style={{
    //       display: "block",
    //       color: theme.colors.textDark,
    //       marginBottom: theme.spacing(0.5),
    //     }}
    //   >
    //     {address.name || `${address.street}, ${address.city}`}
    //   </strong>
    //   <span>
    //     {address.street}
    //     {address.apartment ? `, ${address.apartment}` : ""}
    //   </span>
    //   <span>
    //     {address.city}, {address.state} {address.zipCode}
    //   </span>
    //   <span>
    //     {address.country === "US" ? "United States" : address.country}
    //   </span>
    // </div>
  );

  const formatCurrency = (amount?: number) => {
    if (typeof amount !== "number") return "N/A"; // Handle cases where amount might be undefined/null
    return `${
      orderSummary?.totals.currency === "USD"
        ? "$"
        : orderSummary?.totals.currency || "$"
    }${amount.toFixed(2)}`;
  };

  if (isLoadingSummary) {
    return (
      <ReviewPageWrapper
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
          message="Loading your order details..."
          fullscreen={false}
        />
      </ReviewPageWrapper>
    );
  }

  if (summaryError) {
    return (
      <ReviewPageWrapper>
        <ReviewContentLimiter
          style={{ textAlign: "center", paddingTop: theme.spacing(10) }}
        >
          <ReviewHeader>
            <h1>Review Your Order</h1>
          </ReviewHeader>
          <p
            style={{
              fontSize: theme.typography.body.sizes.large,
              color: theme.colors.error,
            }}
          >
            We encountered an issue retrieving your order summary.
          </p>
          {summaryError && (
            <p
              style={{
                color: theme.colors.textMuted,
                marginTop: theme.spacing(1),
              }}
            >
              Error: {summaryError.message}
            </p>
          )}
          {!orderSummary && !summaryError && (
            <p
              style={{
                color: theme.colors.textMuted,
                marginTop: theme.spacing(1),
              }}
            >
              Order details could not be processed.
            </p>
          )}
          <div style={{ marginTop: theme.spacing(6) }}>
            <PrimaryCtaButton
              onClick={() =>
                navigate("/checkout", {
                  state: { sessionId: checkoutSessionId },
                })
              }
              style={{ marginRight: theme.spacing(2) }}
            >
              <FaUndo /> Back to Checkout
            </PrimaryCtaButton>
            {/* <SecondaryButton onClick={() => refetchSummary?.()}>Try Again</SecondaryButton> */}{" "}
            {/* Add SecondaryButton if available */}
          </div>
        </ReviewContentLimiter>
      </ReviewPageWrapper>
    );
  }

  console.log("orderSummary", orderSummary)

  return (
    <ReviewPageWrapper>
      <ReviewContentLimiter>
        <ReviewHeader>
          <h1>Review & Confirm Your Order</h1>
          <BackButton
            onClick={() =>
              navigate("/checkout", { state: { sessionId: checkoutSessionId } })
            }
            aria-label="Go back to edit checkout details"
          >
            <FaUndo /> Back to Edit Checkout
          </BackButton>
        </ReviewHeader>

        <ReviewLayout>
          <MainContent>
            <ReviewCard>
              <CardHeader>
                <SectionTitle>
                  <FaShippingFast /> Shipping Details
                </SectionTitle>
                <EditLink onClick={() => handleEdit("shippingAddress")}>
                  Change
                </EditLink>
              </CardHeader>
              <CardBody>
                {renderAddress(orderSummary?.shippingAddress, "Shipping")}
                <div
                  className="detail-block"
                  style={{
                    marginTop: theme.spacing(4),
                    borderTop: `1px solid ${theme.colors.border}`,
                    paddingTop: theme.spacing(4),
                  }}
                >
                  <span
                    className="detail-label"
                    style={{ fontWeight: theme.typography.body.weights.medium }}
                  >
                    Delivery Method:
                  </span>
                  <strong
                    className="detail-value"
                    style={{ display: "block", color: theme.colors.textDark }}
                  >
                    {orderSummary.chosenShippingMethod.name}
                  </strong>
                  {orderSummary.chosenShippingMethod.estimatedDeliveryTime && (
                    <span
                      style={{
                        fontSize: theme.typography.body.sizes.small,
                        color: theme.colors.textMuted,
                      }}
                    >
                      {orderSummary.chosenShippingMethod.estimatedDeliveryTime}
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: theme.typography.body.sizes.small,
                      color: theme.colors.textMuted,
                    }}
                  >
                    Cost:{" "}
                    {formatCurrency(orderSummary.chosenShippingMethod.cost)}
                  </span>
                </div>
              </CardBody>
            </ReviewCard>

            <ReviewCard>
              <CardHeader>
                <SectionTitle>
                  <FaCreditCard /> Payment Information
                </SectionTitle>
                <EditLink onClick={() => handleEdit("paymentMethod")}>
                  Change
                </EditLink>
              </CardHeader>
              <CardBody>
                <div className="detail-block">
                  <span
                    className="detail-label"
                    style={{ fontWeight: theme.typography.body.weights.medium }}
                  >
                    Payment Method:
                  </span>
                  <strong
                    className="detail-value"
                    style={{ display: "block", color: theme.colors.textDark }}
                  >
                    {orderSummary.chosenPaymentMethod.typeDescription}
                  </strong>
                </div>
                <div
                  className="detail-block"
                  style={{
                    marginTop: theme.spacing(4),
                    borderTop: `1px solid ${theme.colors.border}`,
                    paddingTop: theme.spacing(4),
                  }}
                >
                  {orderSummary.isBillingSameAsShipping ? (
                    <>
                      <span
                        className="detail-label"
                        style={{
                          fontWeight: theme.typography.body.weights.medium,
                        }}
                      >
                        Billing Address:
                      </span>
                      <strong
                        className="detail-value"
                        style={{
                          display: "block",
                          color: theme.colors.textDark,
                        }}
                      >
                        Same as shipping address
                      </strong>
                    </>
                  ) : (
                    renderAddress(orderSummary.billingAddress, "Billing")
                  )}
                </div>
              </CardBody>
            </ReviewCard>

            <ReviewCard>
              <CardHeader>
                <SectionTitle>
                  <FaShoppingCart /> Order Items ({orderSummary.items.length})
                </SectionTitle>
                <EditLink onClick={() => navigate("/cart")}>Edit Cart</EditLink>
              </CardHeader>
              <CardBody
                style={{
                  paddingTop: theme.spacing(2),
                  paddingBottom: theme.spacing(2),
                }}
              >
                <ItemList>
                  {orderSummary.items.map((item) => (
                    <Item key={item._id || item.productId._id}>
                      {" "}
                      {/* Ensure unique key */}
                      <ItemThumbnail>
                        <img
                          src={
                            item.productId.imageUrls[0] ||
                            `https://via.placeholder.com/80x80/${theme.colors.lightGray.slice(
                              1
                            )}/${theme.colors.accent1.slice(
                              1
                            )}?text=${item.productId.name.substring(0, 1)}`
                          }
                          alt={item.productId.name}
                        />
                      </ItemThumbnail>
                      <ItemDetails>
                        <ItemName>{item.productId.name}</ItemName>
                        {item.attributes && item.attributes.length > 0 && (
                          <ItemVariant>
                            {item.attributes
                              .map((attr) => `${attr.name}: ${attr.value}`)
                              .join(" / ")}
                          </ItemVariant>
                        )}
                        {(!item.attributes || item.attributes.length === 0) && (
                          <ItemVariant
                            style={{
                              color: theme.colors.textMuted,
                              fontSize: theme.typography.body.sizes.xsmall,
                            }}
                          >
                            {item.productId.brand &&
                              `Brand: ${item.productId.brand}`}
                            {item.productId.brand &&
                              item.productId.sku &&
                              " / "}
                            {item.productId.sku && `SKU: ${item.productId.sku}`}
                          </ItemVariant>
                        )}
                      </ItemDetails>
                      <ItemQuantityPrice>
                        <span
                          style={{
                            fontSize: theme.typography.body.sizes.small,
                            color: theme.colors.textMuted,
                          }}
                        >
                          Qty: {item.quantity}
                        </span>
                        <strong style={{ marginTop: theme.spacing(0.5) }}>
                          {formatCurrency(item.lineTotal)}
                        </strong>
                      </ItemQuantityPrice>
                    </Item>
                  ))}
                </ItemList>
              </CardBody>
            </ReviewCard>
          </MainContent>

          <Sidebar>
            <SummaryCard>
              <SectionTitle
                style={{
                  paddingBottom: theme.spacing(3),
                  borderBottom: `1px solid ${theme.colors.border}`,
                  marginBottom: theme.spacing(3),
                }}
              >
                <FaReceipt /> Order Totals
              </SectionTitle>
              <TotalRow>
                <InfoLabel>
                  Subtotal (
                  {orderSummary.items.reduce(
                    (acc, itm) => acc + itm.quantity,
                    0
                  )}{" "}
                  items)
                </InfoLabel>
                <InfoValue>
                  {formatCurrency(orderSummary.totals.itemsTotal)}
                </InfoValue>
              </TotalRow>
              <TotalRow>
                <InfoLabel>Shipping</InfoLabel>
                <InfoValue>
                  {orderSummary.totals.shippingTotal === 0
                    ? "FREE"
                    : formatCurrency(orderSummary.totals.shippingTotal)}
                </InfoValue>
              </TotalRow>
              {orderSummary.discountsApplied.map((discount, index) => (
                <DiscountRow key={discount.code + index}>
                  <InfoLabel>Discount ({discount.code})</InfoLabel>
                  <InfoValue>
                    -{formatCurrency(discount.amountApplied)}
                  </InfoValue>
                </DiscountRow>
              ))}
              {orderSummary.totals.taxTotal > 0 && (
                <TotalRow>
                  <InfoLabel>Tax</InfoLabel>
                  <InfoValue>
                    {formatCurrency(orderSummary.totals.taxTotal)}
                  </InfoValue>
                </TotalRow>
              )}
              <GrandTotalRow>
                <InfoLabel>Order Total</InfoLabel>
                <InfoValue>
                  {formatCurrency(orderSummary.totals.grandTotal)}
                </InfoValue>
              </GrandTotalRow>
            </SummaryCard>
            <PlaceOrderButtonStyled
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              isLoading={isPlacingOrder}
            >
              {isPlacingOrder ? (
                <>
                  <FaSpinner
                    style={{
                      animation: "spin 1s linear infinite",
                      marginRight: theme.spacing(2),
                    }}
                  />
                  Processing...
                </>
              ) : (
                "Confirm & Place Order"
              )}
            </PlaceOrderButtonStyled>
            <SecurityNotice>
              <FaLock /> By placing your order, you agree to Élan Homewares'
              Terms & Conditions and Privacy Policy.
            </SecurityNotice>
          </Sidebar>
        </ReviewLayout>
      </ReviewContentLimiter>
    </ReviewPageWrapper>
  );
};

export default CheckoutReviewPage;
