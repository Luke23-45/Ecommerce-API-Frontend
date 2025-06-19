// src/pages/CheckoutReviewPage/CheckoutReviewPage.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useTheme } from "styled-components";
import {
  FaShippingFast,
  FaCreditCard,
  FaShoppingCart,
  FaLock,
  FaUndo,
  FaReceipt,
  FaSpinner,
  FaRegAddressCard, // Added FaRegAddressCard for billing address icon
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
  BreakdownItem,
  BreakdownLabel,
  BreakdownValue,
  BreakdownCard,
} from "./CheckoutReviewPage.styles";

// --- React Query Hooks & Types ---
import { useGetOrderSummary, usePlaceOrder } from "@/hooks/general/useCheckout"; // VERIFY PATH
import type {
  OrderSummaryResult,
  PlaceOrderRequestDTO,
} from "@/types/checkout.types"; // VERIFY PATH

// --- Common Components ---
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner"; // VERIFY PATH
import { useNotification } from "@/contexts/NotificationContext"; // Assuming this path and hook exists

// --- Type Definitions for this Page's Processed Data ---
interface ReviewItemProduct {
  _id: string;
  name: string;
  sku?: string;
  imageUrls: string[]; // Expecting at least one image
  brand?: string;
}

interface ReviewItemAttribute {
  name: string;
  optionValue: string;
} // From your API "attributes"

interface ReviewItem {
  _id: string; // From item in items array (e.g., "684ac116d58fb2f49c558468")
  productId: ReviewItemProduct;
  quantity: number;
  price: number; // priceAtCheckout or product price
  lineTotal: number;
  attributes?: ReviewItemAttribute[];
  slug?: string;
  mainImageUrl?: string; // Often on the item itself too
}

interface AddressDetail {
  name?: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string; // Not in your address example, but good to have
  email?: string; // Not in your address example
}

interface ShippingMethodDetail {
  id: string;
  name: string;
  description?: string;
  estimatedDeliveryTime?: string; // Your API has this on the top level methods
  cost: number;
}

interface PaymentMethodDetail {
  typeDescription: string; // e.g., "Visa ending in 5556"
  cardBrand?: string;
  last4?: string;
}

interface DiscountDetail {
  code: string;
  summaryDescription: string;
  amountApplied: number;
}

interface TaxDetail {
  totalTaxAmount: number;
  // Could add breakdowns if needed by UI
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

// --- Data Transformation Function ---
const processApiResponseToFullOrderSummary = (
  apiResponseData: OrderSummaryResult["data"] | undefined | null
): FullOrderSummary | null => {
  if (!apiResponseData) {
    console.warn("processApiResponse: No API data provided.");
    return null;
  }
  const raw = apiResponseData; // This is the direct response (content of apiResponse.data)

  const toNumber = (val: any, defaultValue = 0): number =>
    typeof val === "number" && !isNaN(val) ? val : defaultValue;

  // 1. Chosen Shipping Method
  let chosenShippingMethod: ShippingMethodDetail = {
    id: raw.selectedShippingMethodId || "N/A",
    name: "Not Selected",
    cost: toNumber(raw.calculatedShippingTotal), // Use calculated if available
    description: "",
    estimatedDeliveryTime: "",
  };
  const foundMethod = Array.isArray(raw.shippingMethod)
    ? raw.shippingMethod.find((sm) => sm.id === raw.selectedShippingMethodId)
    : null; // Add null check for raw.shippingMethod
  if (foundMethod) {
    chosenShippingMethod = {
      id: foundMethod.id,
      name: foundMethod.name,
      description: foundMethod.description,
      estimatedDeliveryTime: foundMethod.estimatedDeliveryTime,
      cost: toNumber(foundMethod.cost), // The method's base cost
    };
  }
  // Override cost with final calculated if available
  chosenShippingMethod.cost = toNumber(
    raw.finalShippingCostTotal ??
      raw.calculatedShippingTotal ??
      chosenShippingMethod.cost
  );

  // 2. Chosen Payment Method
  let chosenPayment: PaymentMethodDetail = { typeDescription: "Not Specified" };
  if (raw.selectedPaymentDetails) {
    // Your API sends selectedPaymentDetails
    const pd = raw.selectedPaymentDetails;
    chosenPayment = {
      typeDescription: `${
        pd.cardBrand
          ? pd.cardBrand.charAt(0).toUpperCase() + pd.cardBrand.slice(1)
          : "Card"
      } ending in ${pd.cardLast4 || "****"}`,
      cardBrand: pd.cardBrand,
      last4: pd.cardLast4,
    };
  }

  // 3. Discounts Applied
  const discountsApplied: DiscountDetail[] = (raw.discount || []).map(
    (d: any) => ({
      code: d.code || "N/A",
      summaryDescription:
        d.summaryDescription || `${d.details?.percentage || 0}% Off`,
      amountApplied: toNumber(
        d.details?.maximumDiscountAmountApplied || d.amount || 0
      ),
    })
  );

  // 4. Processed Items
  const processedItems: ReviewItem[] = (raw.items || []).map(
    (item: any): ReviewItem => {
      const productInfo = item.productId || {}; // productId field contains product details in your item
      const price = toNumber(item.price ?? productInfo.price ?? 0); // Use item.price if available (priceAtCheckout)

      // Map attributes if they exist
      const itemAttributes: ReviewItemAttribute[] = (item.attributes || []).map(
        (attr: any) => ({
          name: attr.attributeName || "Attribute",
          optionValue: attr.optionValue || "N/A",
        })
      );

      return {
        _id: item._id || item._id || `item-${Math.random()}`, // Ensure unique key
        productId: {
          _id: item._id || "N/A",
          name: item.name || "Unknown Item",
          sku: item.sku,
          imageUrls: item.imageUrls || [
            item.image || item.mainImageUrl || "",
          ], // Use item's image if product's isn't there
          brand: item.brand,
        },
        quantity: toNumber(item.quantity),
        price: price,
        lineTotal: toNumber(item.quantity) * price,
        attributes: itemAttributes,
        slug: item.slug,
        mainImageUrl: item.image || item.mainImageUrl,
      };
    }
  );

  // 5. Addresses
  const mapAddress = (
    apiAddr: any,
    defaultName: string = "N/A"
  ): AddressDetail => {
    if (!apiAddr)
      return {
        name: defaultName,
        street: "N/A",
        city: "N/A",
        state: "N/A",
        zipCode: "N/A",
        country: "N/A",
      };
    return {
      name: apiAddr.name || "N/A", // Your API seems to send 'name' directly in shippingAddress/billingAddress
      street: apiAddr.street || "N/A",
      apartment: apiAddr.apartment,
      city: apiAddr.city || "N/A",
      state: apiAddr.state || "N/A",
      zipCode: apiAddr.zipCode || "N/A",
      country: apiAddr.country || "N/A",
      phone: apiAddr.phone, // Assuming your API address objects might have phone
      email: apiAddr.email, // Assuming your API address objects might have email
    };
  };
  const shippingAddress = mapAddress(raw.shippingAddress, "Shipping Address");
  const billingAddress = mapAddress(raw.billingAddress, "Billing Address");

  const isBillingSameAsShipping =
    raw.selectedShippingAddress === raw.selectedbillingAddress ||
    (!!raw.shippingAddress &&
      !!raw.billingAddress &&
      raw.shippingAddress.street === raw.billingAddress.street &&
      raw.shippingAddress.zipCode === raw.billingAddress.zipCode &&
      raw.shippingAddress.city === raw.billingAddress.city &&
      raw.shippingAddress.country === raw.billingAddress.country &&
      raw.shippingAddress.state === raw.billingAddress.state);

  return {
    sessionId: raw.sessionId || raw._id || "N/A",
    items: processedItems,
    chosenShippingMethod: chosenShippingMethod,
    shippingAddress: shippingAddress,
    billingAddress: billingAddress,
    chosenPaymentMethod: chosenPayment,
    discountsApplied: discountsApplied,
    taxes: { totalTaxAmount: toNumber(raw.calculatedTaxTotal) },
    totals: {
      itemsTotal: toNumber(raw.calculatedItemsTotal),
      shippingTotal: toNumber(
        raw.finalShippingCostTotal ?? raw.calculatedShippingTotal
      ),
      discountTotal: toNumber(raw.calculatedDiscountTotal),
      taxTotal: toNumber(raw.calculatedTaxTotal),
      grandTotal: toNumber(raw.calculatedGrandTotal),
      currency:
        raw.items?.[0]?.productId?.currency ||
        raw.items?.[0]?.currency ||
        raw.currency ||
        "USD",
    },
    userId: raw.userId,
    isBillingSameAsShipping: isBillingSameAsShipping,
  };
};

// --- Checkout Review Page Component ---
const CheckoutReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { showNotification } = useNotification();

  const temps = useParams();
  const checkoutSessionId = temps.checkoutSessionId;
  const [sessionIdFromState, setCheckoutSessionId] = useState<string | null>(
    temps.checkoutSessionId || null
  );

  console.log("OPOPOPOPOPOPPOPOP", checkoutSessionId);

  useEffect(() => {
    if (!sessionIdFromState) {
      showNotification(
        "Your checkout session has expired or is invalid. Please start again.",
        "error"
      );
      navigate("/cart", { replace: true });
    }
  }, [sessionIdFromState, navigate, showNotification]);

  const {
    data: apiOrderSummaryResult,
    isLoading: isLoadingSummary,
    error: summaryError,
    refetch: refetchSummary,
  } = useGetOrderSummary(checkoutSessionId, { enabled: !!checkoutSessionId });

  const { mutateAsync: placeOrder, isLoading: isPlacingOrder } =
    usePlaceOrder();

  const orderSummary: FullOrderSummary | null = useMemo(() => {
    if (apiOrderSummaryResult) {
      return processApiResponseToFullOrderSummary(apiOrderSummaryResult);
    }
    return null;
  }, [apiOrderSummaryResult]);

  console.log(orderSummary,"Order ItemsOrder ItemsOrder Items")

  const handleEdit = (checkoutStepPathFragment: string) => {
    navigate(`/checkout#${checkoutStepPathFragment}`, {
      state: { sessionId: checkoutSessionId },
    });
  };

  const handlePlaceOrder = async () => {
    if (!checkoutSessionId || !orderSummary) {
      showNotification(
        "Cannot place order: critical information missing.",
        "error"
      );
      return;
    }
    try {
      const orderPayload: Omit<PlaceOrderRequestDTO, "idempotencyKey"> = {
        checkoutSessionId: checkoutSessionId,
      };
      // Add other fields to orderPayload if your usePlaceOrder hook expects them
      // e.g. if backend needs to re-verify totals or takes specific notes
      const createdOrder = await placeOrder(orderPayload);
      // The usePlaceOrder hook's onSuccess should ideally handle navigation to the confirmation page.
      // If not, you can navigate here based on `createdOrder` data:
      // navigate(`/order-confirmation/${createdOrder._id}`, { replace: true });
    } catch (apiError: any) {
      // Notification is handled by the hook's onError
      console.error("Error placing order (from component):", apiError);
      // Additional UI error state can be set here if needed beyond notification
    }
  };

  const renderAddress = (
    address: AddressDetail,
    type: "Shipping" | "Billing"
  ) => (
    <div className="address-block">
      {" "}
      {/* Ensure styles exist for .address-block, .detail-label, .detail-value or remove classes */}
      <p
        className="detail-label"
        style={{
          fontWeight: theme.typography.body.weights.medium,
          marginBottom: theme.spacing(1),
          display: "flex",
          alignItems: "center",
        }}
      >
        {type === "Shipping" ? (
          <FaShippingFast
            style={{
              marginRight: theme.spacing(1.5),
              color: theme.colors.accent1,
            }}
          />
        ) : (
          <FaRegAddressCard
            style={{
              marginRight: theme.spacing(1.5),
              color: theme.colors.accent1,
            }}
          />
        )}
        {type} Address:
      </p>
      <strong
        className="detail-value"
        style={{
          display: "block",
          color: theme.colors.textDark,
          marginBottom: theme.spacing(0.5),
        }}
      >
        {address.name || `${address.street}, ${address.city}`}
      </strong>
      {(address.name ? true : false) && (
        <span style={{ display: "block" }}>
          {address.street}
          {address.apartment ? `, ${address.apartment}` : ""}
        </span>
      )}
      <span style={{ display: "block" }}>
        {address.city}, {address.state} {address.zipCode}
      </span>
      <span style={{ display: "block" }}>
        {address.country === "US" ? "United States" : address.country}
      </span>
      {address.phone && (
        <span
          style={{
            display: "block",
            fontSize: theme.typography.body.sizes.small,
            color: theme.colors.textMuted,
          }}
        >
          Phone: {address.phone}
        </span>
      )}
      {address.email && (
        <span
          style={{
            display: "block",
            fontSize: theme.typography.body.sizes.small,
            color: theme.colors.textMuted,
          }}
        >
          Email: {address.email}
        </span>
      )}
    </div>
  );

  const formatCurrency = (amount?: number) => {
    if (typeof amount !== "number" || isNaN(amount)) return "N/A";
    const currencySymbol =
      orderSummary?.totals.currency === "USD"
        ? "$"
        : orderSummary?.totals.currency || "$";
    return `${currencySymbol}${amount.toFixed(2)}`;
  };

  if (isLoadingSummary && !apiOrderSummaryResult) {
    // Show loader only if no data yet AND loading
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
          message="Loading your order summary..."
        />
      </ReviewPageWrapper>
    );
  }

  if (summaryError || !orderSummary) {
    // If error, or if data is null after loading (processing failed)
    return (
      <ReviewPageWrapper>
        <ReviewContentLimiter
          style={{ textAlign: "center", paddingTop: theme.spacing(10) }}
        >
          <ReviewHeader>
            <h1>Order Review</h1>
          </ReviewHeader>
          <p
            style={{
              fontSize: theme.typography.body.sizes.large,
              color: theme.colors.error,
            }}
          >
            We're sorry, but we couldn't retrieve your complete order summary.
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
              The order details could not be processed correctly.
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
              <FaUndo /> Back to Edit Checkout
            </PrimaryCtaButton>
            {/* Optional: Button to retry fetching summary if refetchSummary is available and makes sense */}
            {/* <SecondaryButton onClick={() => refetchSummary?.()}>Try Reloading Summary</SecondaryButton> */}
          </div>
        </ReviewContentLimiter>
      </ReviewPageWrapper>
    );
  }

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
                {renderAddress(orderSummary.shippingAddress, "Shipping")}
              </CardBody>
              <CardBody
                style={{
                  borderTop: `1px solid ${theme.colors.border}`,
                  paddingTop: theme.spacing(3),
                  marginTop: theme.spacing(3),
                }}
              >
                <div className="detail-block">
                  <span
                    className="detail-label"
                    style={{ fontWeight: theme.typography.body.weights.medium }}
                  >
                    Delivery Method:
                  </span>
                  <strong
                    className="detail-value"
                    style={{
                      display: "block",
                      color: theme.colors.textDark,
                      marginTop: theme.spacing(1),
                    }}
                  >
                    {orderSummary.chosenShippingMethod.name}
                  </strong>
                  {orderSummary.chosenShippingMethod.estimatedDeliveryTime && (
                    <span
                      style={{
                        fontSize: theme.typography.body.sizes.small,
                        color: theme.colors.textMuted,
                        display: "block",
                      }}
                    >
                      {orderSummary.chosenShippingMethod.estimatedDeliveryTime}
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: theme.typography.body.sizes.small,
                      color: theme.colors.textMuted,
                      display: "block",
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
                    style={{
                      display: "block",
                      color: theme.colors.textDark,
                      marginTop: theme.spacing(1),
                    }}
                  >
                    {orderSummary.chosenPaymentMethod.typeDescription}
                  </strong>
                </div>
                <div
                  className="detail-block"
                  style={{
                    marginTop: theme.spacing(3),
                    borderTop: `1px solid ${theme.colors.border}`,
                    paddingTop: theme.spacing(3),
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
                          marginTop: theme.spacing(1),
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
                style={{ paddingTop: theme.spacing(2), paddingBottom: 0 }}
              >
                <ItemList>
                  {orderSummary.items.map((item) => (
                    <Item key={item._id || item.productId._id}>
                      <ItemThumbnail>
                        <img
                          src={
                            item.productId.imageUrls[0] ||
                            item.mainImageUrl ||
                            `https://via.placeholder.com/80x80/${theme.colors.lightGray.replace(
                              "#",
                              ""
                            )}/${theme.colors.accent1.replace(
                              "#",
                              ""
                            )}?text=${item.productId.name.substring(0, 1)}`
                          }
                          alt={item.productId.name}
                        />
                      </ItemThumbnail>
                      <ItemDetails>
                        <ItemName>{item.productId.name}</ItemName>
                        {item.attributes && item.attributes.length > 0 ? (
                          <ItemVariant>
                            {item.attributes
                              .map(
                                (attr) => `${attr.name}: ${attr.optionValue}`
                              )
                              .join(" / ")}
                          </ItemVariant>
                        ) : (
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
                            {!item.productId.brand &&
                              !item.productId.sku &&
                              "No additional details"}
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

            {orderSummary.discountsApplied.length > 0 && (
              <BreakdownCard>
                {" "}
                {/* Or ReviewCard if using the same base style */}
                <CardHeader>
                  <SectionTitle>
                    {/* <FaPercent style={{color: theme.colors.success}} /> */}{" "}
                    Discount Details
                  </SectionTitle>
                  {/* No EditLink here typically, as discounts are usually from cart/summary */}
                </CardHeader>
                <CardBody>
                  {orderSummary.discountsApplied.map((discount, index) => (
                    <div
                      key={discount.code + index}
                      style={{ marginBottom: theme.spacing(3) }}
                    >
                      <p
                        style={{
                          fontWeight: theme.typography.body.weights.semiBold,
                          color: theme.colors.textPrimary,
                        }}
                      >
                        Code: {discount.code} - {discount.summaryDescription}
                      </p>
                      <BreakdownItem>
                        <BreakdownLabel>Amount Deducted:</BreakdownLabel>
                        <BreakdownValue style={{ color: theme.colors.success }}>
                          -{formatCurrency(discount.amountApplied)}
                        </BreakdownValue>
                      </BreakdownItem>
                      {/* Example for percentage details from your API */}
                      {apiOrderSummaryResult?.data?.discount?.[index]?.details
                        ?.percentage && (
                        <BreakdownItem>
                          <BreakdownLabel>
                            Applied as:{" "}
                            {
                              apiOrderSummaryResult.data.discount[index].details
                                .percentage
                            }
                            % off eligible items
                          </BreakdownLabel>
                          <BreakdownValue>
                            (on subtotal of{" "}
                            {formatCurrency(
                              apiOrderSummaryResult.data.discount[index].details
                                .applicableItemsSubtotal
                            )}
                            )
                          </BreakdownValue>
                        </BreakdownItem>
                      )}
                      {apiOrderSummaryResult?.data?.discount?.[index]?.details
                        ?.maximumDiscountAmountApplied <
                        apiOrderSummaryResult?.data?.discount?.[index]?.details
                          ?.maximumDiscountAmount && (
                        <BreakdownItem>
                          <BreakdownLabel>Note:</BreakdownLabel>
                          <BreakdownValue>
                            Maximum discount limit reached.
                          </BreakdownValue>
                        </BreakdownItem>
                      )}
                      {/* Add more details from discount.details if available */}
                    </div>
                  ))}
                </CardBody>
              </BreakdownCard>
            )}

            {/* Similar structure for Tax Breakdown Card */}
            {orderSummary.taxes.totalTaxAmount > 0 &&
              apiOrderSummaryResult?.data?.tax && (
                <BreakdownCard>
                  <CardHeader>
                    <SectionTitle>Tax Calculation</SectionTitle>
                  </CardHeader>
                  <CardBody>
                    {(
                      apiOrderSummaryResult.data.tax.itemTaxBreakdown || []
                    ).map((itemTax: any, idx: number) => (
                      <BreakdownItem key={`itemtax-${idx}`}>
                        <BreakdownLabel>
                          Tax on item (ID: {itemTax.productId})
                        </BreakdownLabel>{" "}
                        {/* Replace ID with item name if resolvable */}
                        <BreakdownValue>
                          {formatCurrency(itemTax.taxAmount)}
                        </BreakdownValue>
                      </BreakdownItem>
                    ))}
                    {(
                      apiOrderSummaryResult.data.tax.shippingTaxBreakdown
                        ?.appliedRates || []
                    ).map((rate: any, idx: number) => (
                      <BreakdownItem key={`shiptaxrate-${idx}`}>
                        <BreakdownLabel>
                          {rate.rateName} ({rate.ratePercentage * 100}%) on
                          shipping
                        </BreakdownLabel>
                        <BreakdownValue>
                          {formatCurrency(rate.calculatedTax)}
                        </BreakdownValue>
                      </BreakdownItem>
                    ))}
                    <BreakdownItem
                      style={{
                        borderTop: `1px solid ${theme.colors.border}`,
                        marginTop: theme.spacing(2),
                        paddingTop: theme.spacing(2),
                      }}
                    >
                      <BreakdownLabel
                        style={{
                          fontWeight: theme.typography.body.weights.bold,
                        }}
                      >
                        Total Estimated Tax:
                      </BreakdownLabel>
                      <BreakdownValue
                        style={{
                          fontWeight: theme.typography.body.weights.bold,
                        }}
                      >
                        {formatCurrency(orderSummary.taxes.totalTaxAmount)}
                      </BreakdownValue>
                    </BreakdownItem>
                  </CardBody>
                </BreakdownCard>
              )}
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
                  Processing Order...
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
