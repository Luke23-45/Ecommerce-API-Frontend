// src/interfaces/Checkout/checkout.interfaces.ts

// Assuming you have these types defined elsewhere and can import them
import { type IAddress, type AddressCreationDto, type AddressUpdateDto } from '../User/user.interfaces'; // Path to your user/address types
import { type DisplayCartItem } from '../Cart/cart.interfaces'; // Path to your cart types

export type ObjectId = string;

// ==========================================================================
// === DTOs (Data Transfer Objects) - Payloads Sent TO the Backend ===
// ==========================================================================

/**
 * Payload for starting or resuming a checkout session.
 * POST /api/checkout/start
 */
export interface StartCheckoutRequestDTO {
  cartId: ObjectId;
}

/**
 * Payload for setting the shipping address on a checkout session.
 * PUT /api/checkout/:sessionId/shipping/address
 */
export interface SetShippingAddressRequestDTO {
  // sessionId is part of the URL
  addressId: ObjectId;
}

/**
 * Payload for setting the billing address on a checkout session.
 * PUT /api/checkout/:sessionId/billing/paymentaddress
 */
export interface SetBillingAddressRequestDTO {
  // sessionId is part of the URL
  billingAddressId: ObjectId;
}

/**
 * Payload for setting the shipping method on a checkout session.
 * PUT /api/checkout/:sessionId/shipping/method
 */
export interface SetShippingMethodRequestDTO {
  // sessionId is part of the URL
  shippingMethodId: ObjectId;
}

/**
 * Payload for applying a discount code to a checkout session.
 * POST /api/checkout/:sessionId/discount
 */
export interface ApplyDiscountRequestDTO {
  // sessionId is part of the URL
  discountCode: string;
}

/**
 * Payload for setting the chosen payment method (saved or new) on a checkout session.
 * PUT /api/checkout/:sessionId/billing/payment
 * This endpoint on your backend seems to expect both billingAddressId and paymentMethodId.
 */
export interface SetPaymentDetailsRequestDTO {
  // sessionId is part of the URL
  billingAddressId?: ObjectId; // Optional if already set or same as shipping
  paymentMethodId: string;    // Stripe's pm_... or your internal ID for a saved method
}

/**
 * Payload for the final "Place Order" request.
 * POST /api/orders
 */
export interface PlaceOrderRequestDTO {
  checkoutSessionId: ObjectId;
  paymentDetails: {
    methodId: string; // Stripe's pm_... (PaymentMethod ID)
  };
  idempotencyKey: string; // Generated on frontend
  notes?: string;
}

// ==========================================================================
// === API Response Interfaces - Data Received FROM the Backend ===
// ==========================================================================

/**
 * Represents the core CheckoutSession object from the backend.
 */
export interface CheckoutSession {
  _id: ObjectId;
  userId: ObjectId;
  cartId: ObjectId;
  status: 'ACTIVE' | 'COMPLETED' | 'EXPIRED' | 'PENDING_PAYMENT' | string; // Added string for flexibility
  expiresAt?: string;
  selectedShippingAddress?: ObjectId; // ID of the selected IAddress
  selectedBillingAddress?: ObjectId; // ID of the selected IAddress
  selectedShippingMethodId?: ObjectId;
  selectedPaymentMethodId?: string; // Stripe's pm_... or your internal saved method ID
  // Include other fields from your backend ICheckoutSession if necessary
  // e.g., applied discount codes if they are stored directly on the session object
  discount?: AppliedDiscountResult[]; // Using the IDiscountCalculationResult structure
  tax?: TaxCalculationResult; // Using the TaxCalculationResult structure
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents a shipping option available to the user.
 * GET /api/checkout/:sessionId/shipping-methods (or /api/shipping/calculaterates)
 */
export interface ShippingOption {
  id: ObjectId; // The ID of this shipping rate/method
  name: string;
  description: string;
  cost: number;
  estimatedDeliveryTime?: string;
}

/**
 * Represents the details of an applied discount.
 * Returned by POST /api/checkout/:sessionId/discount
 * and also part of the IOrderSummaryResultDto.
 */
export interface AppliedDiscountResult {
  code: string;
  amount: number; // The actual discounted amount
  discountType: 'percentage' | 'fixed_amount' | string;
  isFreeShipping: boolean;
  summaryDescription: string; // e.g., "15% Off Your Order"
  details?: { // This structure comes from your sample response
    maximumDiscountAmountApplied?: number;
    maximumDiscountAmount?: number;
    percentage?: number;
    applicableItemsSubtotal?: number;
  };
}

/**
 * Represents the tax calculation result.
 * Part of the IOrderSummaryResultDto.
 */
export interface TaxCalculationResult {
  totalTaxAmount: number;
  itemTaxBreakdown?: Array<{
    productId: ObjectId;
    productName: string;
    itemTaxAmount: number;
    // ... other fields from your backend
  }>;
  shippingTaxBreakdown?: {
    shippingTotalBeforeTax: number;
    shippingTaxAmount: number;
    // ... other fields from your backend
  };
}

/**
 * Represents the complete, calculated order summary.
 * GET /api/checkout/:sessionId/summary
 */
export interface OrderSummaryResult {
  sessionId: ObjectId;
  items: DisplayCartItem[];       // Enriched cart items
  shippingAddress?: IAddress;   // Full shipping address object
  billingAddress?: IAddress;    // Full billing address object
  shippingDetails?: ShippingOption; // The selected shipping method details
  discountDetails?: AppliedDiscountResult[]; // Array of applied discounts
  taxDetails?: TaxCalculationResult;   // Tax calculation details
  totals: {
    itemsTotal: number;
    shippingTotal: number;
    discountTotal: number;
    taxTotal: number;
    grandTotal: number;
    currency: string;
  };
  // Include any other fields from your backend's IOrderSummaryResultDto
  // The sample response also had calculated fields directly on the session
  calculatedItemsTotal?: number; 
  calculatedShippingTotal?: number; 
  calculatedDiscountTotal?: number; 
  calculatedTaxTotal?: number; 
  calculatedGrandTotal?: number; 
  finalShippingCostTotal?: number; // From your sample, seems specific
}

/**
 * Represents the final, created order document.
 * POST /api/orders
 */
export interface OrderDocument {
  _id: ObjectId;
  orderNumber: string;
  userId: ObjectId;
  // ... include all other relevant fields from your backend IOrderDocument
  // For example:
  items: any[]; // Replace 'any' with a proper IOrderItem frontend type
  shippingAddress: any; // Replace 'any' with frontend IShippingAddressSnapshot
  billingAddress: any; // Replace 'any' with frontend IShippingAddressSnapshot
  shippingDetails: any; // Replace 'any' with frontend IOrderShippingDetails
  paymentDetails: any; // Replace 'any' with frontend IOrderPaymentDetails
  totals: any; // Replace 'any' with frontend IOrderTotals
  status: string;
  createdAt: string;
  updatedAt: string;
}

// --- Interfaces for User Address Management (from your AddressController) ---
// GET /api/addresses/getaddress returns IAddress[]
// POST /api/addresses/create uses AddressCreationDto and returns IAddress
// PUT /api/addresses/updateaddress/:addressId uses AddressUpdateDto and returns IAddress

// --- Interfaces for Saved Payment Methods (from your PaymentController) ---
// GET /api/payment-methods returns ISavedPaymentMethod[]
// POST /api/payment-methods uses CreateSavedPaymentMethodBody and returns ISavedPaymentMethod
// (Define ISavedPaymentMethod and CreateSavedPaymentMethodBody based on your backend)

export interface SavedCardDetails {
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
}

export interface SavedPaymentMethod {
  id: ObjectId; // The internal DB ID of the saved method
  userId: ObjectId;
  paymentMethodId: string; // The Stripe pm_... ID
  type: string; // e.g., 'card'
  card?: SavedCardDetails;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSavedPaymentMethodDTO {
  paymentMethodId: string; // Stripe's pm_...
  type: string; // e.g., 'card'
  cardDetails?: SavedCardDetails; // Optional, if you store these (ensure PCI compliance)
}