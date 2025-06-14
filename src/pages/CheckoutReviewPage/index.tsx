// src/pages/CheckoutReviewPage/CheckoutReviewPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // useLocation can be used to pass session ID or state
import { useTheme } from 'styled-components'; // If needed for dynamic styles
import {
  FaShippingFast, FaCreditCard, FaShoppingCart, FaLock, FaUndo, FaReceipt,
  FaCcVisa, FaCcMastercard, FaCcAmex, FaRegAddressCard, FaSpinner // Added icons
} from 'react-icons/fa';

// --- Import Beautiful New Styles ---
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
  PlaceOrderButtonStyled, // Use the styled version
  SecurityNotice,
} from './CheckoutReviewPage.styles';

// Import common Button or use PlaceOrderButtonStyled
// Assuming PrimaryCtaButton for now for the Place Order button style.
// import { PrimaryCtaButton } from '@/components/common/Button/Button.styles';

// --- Type Definitions (align with API response and component needs) ---

// Simplified Product structure for items in review
interface ReviewItemProduct {
  _id: string;
  name: string;
  sku?: string;
  imageUrls: string[];
  brand?: string;
  // variantAttributes?: { name: string; value: string }[]; // Assuming your API might provide structured variants
}
interface ReviewItem {
  productId: ReviewItemProduct;
  quantity: number;
  price: number; // Price per unit AT THE TIME OF ADDING TO CART/SESSION
  lineTotal?: number; // Calculated: quantity * price
  // variantInfo?: string; // Could be pre-formatted variant string
  // Potentially per-item discount/tax info if available and needed
}

interface AddressDetail {
  name?: string; // If backend resolves name with address ID
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string; // Corrected from 'zip' in some earlier examples
  country: string; // e.g., "US" -> map to "United States" for display
}

interface ShippingMethodDetail {
  id: string;
  name: string;
  description?: string;
  estimatedDeliveryTime?: string;
  cost: number;
}

interface PaymentMethodDetail {
  typeDescription: string; // e.g., "Visa ending in 1234" or "New Card"
  // Potentially more details if needed for display like expiry for saved card
}

interface DiscountDetail {
  code: string;
  summaryDescription: string; // e.g., "20% Off"
  amountApplied: number; // The actual discount value applied to this order
}

interface TaxDetail {
  totalTaxAmount: number;
  // itemTaxBreakdown?: { itemId: string; taxAmount: number; rateDescription?: string }[];
  // shippingTaxBreakdown?: any; // More detailed if needed
}

interface OrderTotals {
  itemsTotal: number;       // Sum of (item.price * item.quantity) BEFORE discounts specific to items
  shippingTotal: number;
  discountTotal: number;    // Total discount amount applied
  taxTotal: number;
  grandTotal: number;
  currency: string;         // e.g., "USD"
}

// Structure for the entire order summary data fetched by useGetOrderSummary
interface FullOrderSummary {
  sessionId: string;
  items: ReviewItem[];
  chosenShippingMethod: ShippingMethodDetail; // Processed from selectedShippingMethodId
  shippingAddress: AddressDetail;
  billingAddress: AddressDetail;
  chosenPaymentMethod: PaymentMethodDetail; // Processed from selectedPaymentMethodId
  discountsApplied: DiscountDetail[]; // Processed from discount array
  taxes: TaxDetail;
  totals: OrderTotals;
  // Additional useful fields from API:
  userId?: string;
  isBillingSameAsShipping?: boolean; // Derived or from API
}

// --- Mock Data Processing (Simulating what useGetOrderSummary hook would do) ---
// This function would take the raw API response and transform it into FullOrderSummary
const processApiResponse = (apiData: any): FullOrderSummary => {
  const data = apiData.data;

  // 1. Find chosen shipping method
  const chosenShippingMethod = data.shippingMethod.find(
    (sm: any) => sm.id === data.selectedShippingMethodId
  ) || { id: 'unknown', name: 'Not Selected', cost: 0, description: 'N/A' };
  
  // 2. Resolve payment method (this is highly dependent on how you store/retrieve PM details)
  // For mock, we'll assume some logic. In reality, this needs access to previously selected/created PM info.
  let chosenPaymentMethod: PaymentMethodDetail;
  if (data.selectedPaymentMethodId) { // Assume it's a saved card ID
      // In real app: const savedCard = findSavedCardById(data.selectedPaymentMethodId);
      // Mocking a lookup:
      const mockSavedPM = mockSavedPaymentMethods.find(pm => pm.id === data.selectedPaymentMethodId);
      if(mockSavedPM) {
          chosenPaymentMethod = { typeDescription: `${mockSavedPM.cardBrand || mockSavedPM.type} ending in ${mockSavedPM.last4}`};
      } else if (data.selectedPaymentMethodId.startsWith('pm_new_temp')) { // Temp ID for new card before tokenization
          chosenPaymentMethod = { typeDescription: 'New Card (Details Pending Confirmation)' };
      } else { // Should be a tokenized new card ID passed from previous step if logic is complete
          chosenPaymentMethod = { typeDescription: `Card (Details Confirmed)` }; // Replace with actual brand/last4 if passed
      }
  } else {
    chosenPaymentMethod = { typeDescription: "Payment Not Specified" };
  }


  // 3. Process discounts
  const discountsApplied: DiscountDetail[] = (data.discount || []).map((d: any) => ({
    code: d.code,
    summaryDescription: d.summaryDescription || `${d.discountType === 'percentage' ? d.details?.percentage + '%' : '$' + d.amount.toFixed(2)} Off`,
    amountApplied: d.details?.maximumDiscountAmountApplied || d.amount, // Use applied amount if available
  }));

  // 4. Process items
  const processedItems: ReviewItem[] = data.items.map((item: any) => ({
      ...item,
      productId: {
          _id: item.productId._id,
          name: item.productId.name,
          sku: item.productId.sku,
          imageUrls: item.productId.imageUrls,
          brand: item.productId.brand,
      },
      price: item.productId.price, // Ensure price comes from product in this context
      lineTotal: item.quantity * item.productId.price,
  }));
  
  const isBillingSameAsShipping = data.selectedShippingAddress === data.selectedbillingAddress &&
                                  JSON.stringify(data.shippingAddress) === JSON.stringify(data.billingAddress);


  return {
    sessionId: data.sessionId,
    items: processedItems,
    chosenShippingMethod: {
      id: chosenShippingMethod.id,
      name: chosenShippingMethod.name,
      description: chosenShippingMethod.description,
      cost: data.finalShippingCostTotal !== undefined ? data.finalShippingCostTotal : data.calculatedShippingTotal, // Prioritize finalShippingCostTotal
      estimatedDeliveryTime: chosenShippingMethod.estimatedDeliveryTime,
    },
    shippingAddress: { // Assuming backend structure maps directly for name, otherwise construct it
      name: data.shippingAddress.name || "Recipient Name Placeholder", // Add name field resolution if needed
      ...data.shippingAddress,
      zipCode: data.shippingAddress.zipCode || data.shippingAddress.zip, // Handle zip variation
    },
    billingAddress: {
      name: data.billingAddress.name || "Billing Contact Placeholder",
      ...data.billingAddress,
      zipCode: data.billingAddress.zipCode || data.billingAddress.zip,
    },
    chosenPaymentMethod,
    discountsApplied,
    taxes: {
      totalTaxAmount: data.calculatedTaxTotal || 0,
    },
    totals: {
      itemsTotal: data.calculatedItemsTotal,
      shippingTotal: data.finalShippingCostTotal !== undefined ? data.finalShippingCostTotal : data.calculatedShippingTotal,
      discountTotal: data.calculatedDiscountTotal,
      taxTotal: data.calculatedTaxTotal || 0,
      grandTotal: data.calculatedGrandTotal,
      currency: data.items[0]?.productId.currency || 'USD', // Get currency from first item
    },
    isBillingSameAsShipping: isBillingSameAsShipping,
  };
};
// Use the provided API JSON for mocking
const rawApiData = {"statusCode":200,"data":{"sessionId":"681ddc1007de719f9bde4c5b","items":[{"productId":{"_id":"6814ba0631c396c291a6eda0","name":"Handcrafted Wooden Spoon","sku":"HW-SPOON-100a01","description":"A beautiful, hand-carved wooden spoon made from sustainable maple wood. Perfect for cooking and serving.","shortDescription":"Handcrafted maple wooden spoon.","price":15.99,"currency":"USD","categoryId":"68136f0c076d48c8c20eccb6","brand":"Artisan Woods","tags":["wood","spoon","handmade","kitchen"],"inventory":50,"stockStatus":"in_stock","imageUrls":["https://picsum.photos/seed/spoon1/80/80","https://picsum.photos/seed/spoon2/80/80"],"sellerType":"individual_seller","individualSellerId":"6813578803db6a64a5003ab7","status":"draft","visibility":"hidden","hazardousMaterial":false,"ageRestricted":false,"createdBy":"6813578803db6a64a5003ab7","updatedBy":"6813578803db6a64a5003ab7","createdAt":"2025-05-02T12:26:46.270Z","updatedAt":"2025-05-02T12:26:46.270Z","__v":0},"quantity":25},{"productId":{"_id":"6813ab08f8801fe2d4a0d5b9","name":"Artisan Ceramic Mug Set","sku":"HW-MUGSET-10001","description":"Set of two artisan ceramic mugs, perfect for your morning coffee.","shortDescription":"Artisan ceramic mugs.","price":45.50,"currency":"USD","categoryId":"68136f0c076d48c8c20eccb6","brand":"ClayWorks","tags":["ceramic","mug","handmade","kitchen"],"inventory":30,"stockStatus":"in_stock","imageUrls":["https://picsum.photos/seed/mug1/80/80"],"sellerType":"vendor","vendorId":"68139c4172cab92bec1fc72d","status":"draft","visibility":"hidden","hazardousMaterial":false,"ageRestricted":false,"createdBy":"681398c1a474e1b9c54d60c6","updatedBy":"681398c1a474e1b9c54d60c6","createdAt":"2025-05-01T17:10:32.131Z","updatedAt":"2025-05-01T17:49:30.955Z","__v":0},"quantity":2}],"_id":"681ddc1007de719f9bde4c5b","userId":"681a4991f6f9c659a79f64a8","cartId":"681a49a7f6f9c659a79f64af","status":"active","expiresAt":"2025-05-14T10:42:24.035Z", "shippingMethod":[{"id":"681b61b953222ef2b728c517","name":"Standard Shipping","description":"5-7 Business Days","estimatedDeliveryTime":"May 15 - May 17","cost":10},{"id":"681b61f7790a1331ee35655d","name":"Express Shipping","description":"1-2 Business Days","estimatedDeliveryTime":"May 10 - May 11","cost":25}],"discount":[{"code":"ELAN20","amount":0,"discountType":"percentage","isFreeShipping":false,"applicability":"all_products","summaryDescription":"20% Off Total Order","details":{"percentage":20,"applicableItemsSubtotal":490.75,"maximumDiscountAmount":1000,"maximumDiscountAmountApplied":98.15}}],"createdAt":"2025-05-09T10:42:24.042Z","updatedAt":"2025-05-09T10:42:24.046Z","__v":0,"selectedShippingAddress":"addr_mock_ship_001","selectedShippingMethodId":"681b61b953222ef2b728c517","selectedbillingAddress":"addr_mock_bill_001","selectedPaymentMethodId":"pm_mock_visa_1234","tax":{"shippingTaxBreakdown":{"shippingTotalBeforeTax":10,"shippingTaxAmount":0.80,"appliedRates":[{"id":"txr_abc","name":"State Tax","percentage":8}]},"totalTaxAmount":40.06,"itemTaxBreakdown":[{"productId":"6814ba0631c396c291a6eda0","taxableAmount":399.75,"taxAmount":31.98},{"productId":"6813ab08f8801fe2d4a0d5b9","taxableAmount":91.00,"taxAmount":7.28}]},"calculatedDiscountTotal":98.15,"calculatedGrandTotal":442.66,"calculatedItemsTotal":490.75,"calculatedShippingTotal":10,"calculatedTaxTotal":40.06,"shippingAddress":{"name":"Elara Vance","street":"123 Serenity Lane","apartment":"Apt 4B","city":"Willow Creek","state":"CA","zipCode":"90210","country":"US"},"billingAddress":{"name":"Elara Vance","street":"456 Harmony Ave","apartment":"","city":"Silverlake","state":"CA","zipCode":"90029","country":"US"},"finalShippingCostTotal":10},"message":"Order summary retrieved successfully.","success":true};
// Placeholder until API hook is ready
const useGetOrderSummary = (sessionId: string | null) => {
    // In real app, this would be a React Query hook:
    // const { data, isLoading, error } = useQuery(['orderSummary', sessionId], fetchOrderSummaryFn);
    // return { orderSummary: data ? processApiResponse(data) : null, isLoading, error };
    const [isLoading, setIsLoading] = useState(true);
    const [orderSummary, setOrderSummary] = useState<FullOrderSummary | null>(null);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => { // Simulate API call
            if (sessionId) { // Only "fetch" if sessionId is present
                try {
                    setOrderSummary(processApiResponse(rawApiData)); // Use the provided full JSON
                } catch (e) {
                    setError("Failed to process order summary.");
                    console.error(e);
                }
            } else {
                setError("No session ID provided for order summary.");
            }
            setIsLoading(false);
        }, 1000); // Simulate 1 second delay
    }, [sessionId]);

    return { orderSummary, isLoading, error };
};


const CheckoutReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme(); // For direct theme access

  // Assuming sessionId might be passed via state from /checkout or fetched from context/URL
  const sessionId = (location.state as { sessionId?: string })?.sessionId || "sess_mock_123"; // Example

  const { orderSummary, isLoading, error } = useGetOrderSummary(sessionId);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handleEdit = (sectionPath: string) => {
    // Navigate back to the main checkout page, ideally to the specific section.
    // The main checkout page would need to handle URL fragments (e.g., #shipping)
    // to open the correct accordion/step.
    navigate(`/checkout#${sectionPath}`);
  };

  const handlePlaceOrder = async () => {
    if (!orderSummary) return;
    setIsPlacingOrder(true);
    console.log("Placing order with sessionId:", orderSummary.sessionId);
    // Simulate API call for placing order
    // const result = await placeOrderMutation.mutateAsync({ sessionId: orderSummary.sessionId /*, idempotencyKey */ });
    try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
        // On success:
        // showNotification({ type: 'success', message: 'Your order has been placed successfully!' });
        alert("Order Placed Successfully! (Simulated)");
        navigate(`/order-confirmation/${orderSummary.sessionId}_mock_order_id`, { replace: true }); // Pass some unique ID
    } catch (apiError) {
        // showNotification({ type: 'error', message: 'There was an issue placing your order. Please try again.' });
        alert("Failed to place order. Please try again. (Simulated)");
        console.error("Place order error:", apiError);
    } finally {
        setIsPlacingOrder(false);
    }
  };

  // --- Content Render Functions for Clarity ---
  const renderAddress = (address: AddressDetail, type: 'Shipping' | 'Billing') => (
    <div className="address-block">
      <span className="detail-label">{type} Address:</span>
      <strong className="detail-value">{address.name || `${address.street}, ${address.city}`}</strong>
      {!address.name && <span>{address.street}{address.apartment ? `, ${address.apartment}` : ''}</span>}
      {address.name && <span>{address.street}{address.apartment ? `, ${address.apartment}` : ''}</span>}
      <span>{address.city}, {address.state} {address.zipCode}</span>
      <span>{address.country === 'US' ? 'United States' : address.country}</span>
    </div>
  );


  if (isLoading) {
    return ( // Elegant Full Page Loader
      <ReviewPageWrapper style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <FaSpinner size="3em" color={theme.colors.accent1} style={{ animation: 'spin 1s linear infinite' }} />
      </ReviewPageWrapper>
    );
  }

  if (error || !orderSummary) {
    return ( // Elegant Error Display
      <ReviewPageWrapper>
        <ReviewContentLimiter style={{ textAlign: 'center', paddingTop: theme.spacing(10) }}>
          <ReviewHeader><h1>Review Order</h1></ReviewHeader>
          <p style={{fontSize: theme.typography.body.sizes.large, color: theme.colors.error }}>
            We're sorry, but we couldn't retrieve your order summary at this time.
          </p>
          <p style={{color: theme.colors.textMedium, marginBottom: theme.spacing(6)}}>
            Error: {typeof error === 'string' ? error : 'Unknown error.'}
          </p>
          <BackButton onClick={() => navigate('/cart')} style={{margin: '0 auto'}}>
            <FaUndo /> Back to Cart
          </BackButton>
        </ReviewContentLimiter>
      </ReviewPageWrapper>
    );
  }

  // Currency formatting helper
  const formatCurrency = (amount: number) => {
    return `${orderSummary.totals.currency === 'USD' ? '$' : orderSummary.totals.currency}${amount.toFixed(2)}`;
  };

  return (
    <ReviewPageWrapper>
      <ReviewContentLimiter>
        <ReviewHeader>
          <h1>Review & Confirm Your Order</h1>
          <BackButton onClick={() => navigate('/checkout')} aria-label="Go back to edit checkout details">
            <FaUndo /> Back to Edit Checkout
          </BackButton>
        </ReviewHeader>

        <ReviewLayout>
          <MainContent>
            {/* --- SHIPPING DETAILS --- */}
            <ReviewCard>
              <CardHeader>
                <SectionTitle><FaShippingFast /> Shipping Details</SectionTitle>
                <EditLink onClick={() => handleEdit('shippingAddress')}>Change</EditLink>
              </CardHeader>
              <CardBody>
                {renderAddress(orderSummary.shippingAddress, 'Shipping')}
                <div className="detail-block" style={{marginTop: theme.spacing(4)}}>
                    <span className="detail-label">Delivery Method:</span>
                    <strong className="detail-value">{orderSummary.chosenShippingMethod.name}</strong>
                    {orderSummary.chosenShippingMethod.estimatedDeliveryTime && <span>{orderSummary.chosenShippingMethod.estimatedDeliveryTime}</span>}
                </div>
              </CardBody>
            </ReviewCard>
            
            {/* --- PAYMENT DETAILS --- */}
            <ReviewCard>
              <CardHeader>
                <SectionTitle><FaCreditCard /> Payment Information</SectionTitle>
                <EditLink onClick={() => handleEdit('paymentMethod')}>Change</EditLink>
              </CardHeader>
              <CardBody>
                <div className="detail-block">
                    <span className="detail-label">Payment Method:</span>
                    <strong className="detail-value">{orderSummary.chosenPaymentMethod.typeDescription}</strong>
                </div>
                {orderSummary.isBillingSameAsShipping ? (
                    <div className="detail-block" style={{marginTop: theme.spacing(4)}}>
                        <span className="detail-label">Billing Address:</span>
                        <strong className="detail-value">Same as shipping address</strong>
                    </div>
                ) : (
                    renderAddress(orderSummary.billingAddress, 'Billing')
                )}
              </CardBody>
            </ReviewCard>

            {/* --- ITEMS IN ORDER --- */}
            <ReviewCard>
              <CardHeader>
                <SectionTitle><FaShoppingCart /> Order Items ({orderSummary.items.length})</SectionTitle>
                <EditLink onClick={() => navigate('/cart')}>Edit Cart</EditLink> 
              </CardHeader>
              {/* Set CardBody padding to 0 if ItemList handles its own internal padding */}
              <CardBody style={{paddingLeft: theme.spacing(7), paddingRight: theme.spacing(7), paddingTop: 0, paddingBottom: 0 }}> 
                <ItemList>
                  {orderSummary.items.map(item => (
                    <Item key={item.productId._id}>
                      <ItemThumbnail>
                        <img src={item.productId.imageUrls[0] || `https://via.placeholder.com/80x80/${theme.colors.background.slice(1)}/${theme.colors.accent1.slice(1)}?text=N/A`} alt={item.productId.name} />
                      </ItemThumbnail>
                      <ItemDetails>
                        <ItemName>{item.productId.name}</ItemName>
                        {/* Placeholder for variant attributes, adapt if your ProductId has structured variants */}
                        {/* <ItemVariant>Color: Red, Size: M</ItemVariant> */}
                        <ItemVariant>Brand: {item.productId.brand || 'N/A'} / SKU: {item.productId.sku || 'N/A'}</ItemVariant>
                      </ItemDetails>
                      <ItemQuantityPrice>
                        <span className="item-quantity">Qty: {item.quantity}</span>
                        <div className="item-total-price">
                            <strong>{formatCurrency(item.lineTotal || (item.price * item.quantity))}</strong>
                        </div>
                      </ItemQuantityPrice>
                    </Item>
                  ))}
                </ItemList>
              </CardBody>
            </ReviewCard>
          </MainContent>

          <Sidebar>
            <SummaryCard>
              <SectionTitle style={{paddingBottom: theme.spacing(4), borderBottom: `1px solid ${theme.colors.border}`, marginBottom: theme.spacing(4)}}>
                <FaReceipt /> Order Totals
              </SectionTitle>
              <TotalRow>
                <InfoLabel>Subtotal ({orderSummary.items.reduce((acc, item) => acc + item.quantity, 0)} items)</InfoLabel>
                <InfoValue>{formatCurrency(orderSummary.totals.itemsTotal)}</InfoValue>
              </TotalRow>
              <TotalRow>
                <InfoLabel>Shipping</InfoLabel>
                <InfoValue>
                    {orderSummary.totals.shippingTotal === 0 && orderSummary.chosenShippingMethod.cost === 0 
                        ? 'FREE' 
                        : formatCurrency(orderSummary.totals.shippingTotal)}
                </InfoValue>
              </TotalRow>
              {orderSummary.discountsApplied.map((discount, index) => (
                <DiscountRow key={discount.code + index}>
                  <InfoLabel>Discount ({discount.code})</InfoLabel>
                  <InfoValue>-{formatCurrency(discount.amountApplied)}</InfoValue>
                </DiscountRow>
              ))}
              {orderSummary.totals.taxTotal > 0 && (
                <TotalRow>
                    <InfoLabel>Estimated Tax</InfoLabel>
                    <InfoValue>{formatCurrency(orderSummary.totals.taxTotal)}</InfoValue>
                </TotalRow>
              )}
              <GrandTotalRow>
                <InfoLabel>Grand Total</InfoLabel>
                <InfoValue>{formatCurrency(orderSummary.totals.grandTotal)}</InfoValue>
              </GrandTotalRow>
            </SummaryCard>
            
            <PlaceOrderButtonStyled // Using the specifically styled button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              className={isPlacingOrder ? 'is-loading' : ''} // For potential CSS loading state styling
            >
              {isPlacingOrder ? (
                <>
                  <FaSpinner aria-hidden="true" style={{ animation: 'spin 1s linear infinite', marginRight: theme.spacing(2) }} />
                  Processing...
                </>
              ) : (
                'Place Your Order' // Updated text
              )}
            </PlaceOrderButtonStyled>
            <SecurityNotice>
              <FaLock /> By placing your order, you agree to Élan Homewares' Terms & Conditions and Privacy Policy.
            </SecurityNotice>
          </Sidebar>
        </ReviewLayout>
      </ReviewContentLimiter>
    </ReviewPageWrapper>
  );
};

export default CheckoutReviewPage;