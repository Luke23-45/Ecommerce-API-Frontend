// src/api/checkoutApi.ts

import { apiClient } from './apiClient'; // Your configured axios instance
import {
  // Checkout Session related DTOs and Types
  type CheckoutSession,
  type StartCheckoutRequestDTO,
  type SetAddressDTO, // Used for both shipping and billing address ID
  type SetShippingMethodDTO,
  type ApplyDiscountDTO,
  type SetPaymentDetailsRequestDTO, // Combined for billing address & payment method ID
  type PlaceOrderRequestDTO,
  // API Response Types
  type ShippingOption,
  type OrderSummaryResult,
  type OrderDocument,
  type AppliedDiscountResult,
  // User Address related DTOs and Types
  type IAddress, // Assuming this is your primary address interface
  type AddressCreationDto,
  type AddressUpdateDto,
  // Saved Payment Method related DTOs and Types
  type SavedPaymentMethod,
  type CreateSavedPaymentMethodDTO,
} from '@/types/checkout.types'; // Adjust path as needed

// Generic API response type, assuming your backend wraps data like this
type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  statusCode: number;
};

export const checkoutApi = {
  // === CHECKOUT SESSION FLOW ===

  /**
   * Starts a new checkout session or resumes an existing one.
   * POST /api/checkout/start
   */
  startCheckout: async (payload: StartCheckoutRequestDTO): Promise<CheckoutSession> => {
    const response = await apiClient.post<ApiResponse<CheckoutSession>>('/checkout/start', payload);
    return response.data.data;
  },
  
  /**
   * Updates the selected shipping address for the checkout session.
   * PUT /api/checkout/:sessionId/shipping/address
   */
  setShippingAddress: async ({ sessionId, addressId }: SetAddressDTO): Promise<CheckoutSession> => {
    const response = await apiClient.put<ApiResponse<CheckoutSession>>(
      `/checkout/${sessionId}/shipping/address`, { addressId }
    );
    return response.data.data;
  },

  /**
   * Updates the selected billing address for the checkout session.
   * PUT /api/checkout/:sessionId/billing/paymentaddress
   */
  setBillingAddress: async ({ sessionId, addressId }: SetAddressDTO): Promise<CheckoutSession> => {
    const response = await apiClient.put<ApiResponse<CheckoutSession>>(
      // Ensure this endpoint matches your backend: /billing/paymentaddress
      `/checkout/${sessionId}/billing/paymentaddress`, { billingAddressId: addressId }
    );
    return response.data.data;
  },
  
  /**
   * Fetches available shipping methods for the current session.
   * GET /api/checkout/:sessionId/shipping-methods
   */
  getShippingMethods: async (sessionId: string): Promise<ShippingOption[]> => {
    const response = await apiClient.get<ApiResponse<ShippingOption[]>>(`/checkout/${sessionId}/shipping-methods`);
    return response.data.data;
  },

  /**
   * Updates the selected shipping method for the checkout session.
   * PUT /api/checkout/:sessionId/shipping/method
   */
  setShippingMethod: async ({ sessionId, shippingMethodId }: SetShippingMethodDTO): Promise<CheckoutSession> => {
    const response = await apiClient.put<ApiResponse<CheckoutSession>>(
      `/checkout/${sessionId}/shipping/method`, { shippingMethodId }
    );
    return response.data.data;
  },

  /**
   * Applies a discount code to the checkout session.
   * POST /api/checkout/:sessionId/discount
   */
  applyDiscount: async ({ sessionId, discountCode }: ApplyDiscountDTO): Promise<AppliedDiscountResult> => {
    const response = await apiClient.post<ApiResponse<AppliedDiscountResult>>(
      `/checkout/${sessionId}/discount`, { discountCode }
    );
    return response.data.data;
  },

  /**
   * Updates the selected payment method (and potentially billing address again) for the checkout session.
   * PUT /api/checkout/:sessionId/billing/payment
   */
  setPaymentDetails: async ({ sessionId, billingAddressId, paymentMethodId }: SetPaymentDetailsRequestDTO): Promise<CheckoutSession> => {
    const payload: Record<string, string> = { paymentMethodId };
    if (billingAddressId) {
      payload.billingAddressId = billingAddressId;
    }
    const response = await apiClient.put<ApiResponse<CheckoutSession>>(
      `/checkout/${sessionId}/billing/payment`, payload
    );
    return response.data.data;
  },

  /**
   * Gets the calculated order summary for the checkout session.
   * GET /api/checkout/:sessionId/summary
   */
  getOrderSummary: async (sessionId: string): Promise<OrderSummaryResult> => {
    const response = await apiClient.get<ApiResponse<OrderSummaryResult>>(`/checkout/${sessionId}/summary`);
    return response.data.data;
  },

  // === ORDER PLACEMENT ===

  /**
   * Places the final order.
   * POST /api/orders
   */
  placeOrder: async (payload: PlaceOrderRequestDTO): Promise<OrderDocument> => {
    const response = await apiClient.post<ApiResponse<OrderDocument>>('/orders', payload);
    return response.data.data;
  },

  // === USER ADDRESS MANAGEMENT ===
  // These correspond to your /api/addresses routes

  /**
   * Fetches all addresses for the authenticated user.
   * GET /api/addresses/getaddress
   */
  getUserAddresses: async (): Promise<IAddress[]> => {
    const response = await apiClient.get<ApiResponse<IAddress[]>>('/addresses/getaddress');
    return response.data.data;
  },

  /**
   * Creates a new address for the authenticated user.
   * POST /api/addresses/create
   */
  createAddress: async (addressData: AddressCreationDto): Promise<IAddress> => {
    const response = await apiClient.post<ApiResponse<IAddress>>('/addresses/create', addressData);
    return response.data.data;
  },

  /**
   * Updates an existing address for the authenticated user.
   * PUT /api/addresses/updateaddress/:addressId
   */
  updateAddress: async (addressId: string, updateData: AddressUpdateDto): Promise<IAddress> => {
    const response = await apiClient.put<ApiResponse<IAddress>>(
      `/addresses/updateaddress/${addressId}`, updateData
    );
    return response.data.data;
  },

  /**
   * Deletes an address for the authenticated user.
   * DELETE /api/addresses/deletedelete/:addressId
   */
  deleteAddress: async (addressId: string): Promise<null> => {
    const response = await apiClient.delete<ApiResponse<null>>(
      `/addresses/deletedelete/${addressId}`
    );
    return response.data.data; // Backend returns null on successful delete
  },

  /**
   * Sets an address as the default for the authenticated user.
   * PUT /api/addresses/:addressId/default
   */
  setDefaultAddress: async (addressId: string): Promise<null> => {
    const response = await apiClient.put<ApiResponse<null>>(
      `/addresses/${addressId}/default`
    );
    return response.data.data;
  },


  // === SAVED PAYMENT METHOD MANAGEMENT ===
  // These correspond to your /api/payment-methods routes

  /**
   * Fetches the authenticated user's saved payment methods.
   * GET /api/payment-methods
   */
  getSavedPaymentMethods: async (): Promise<SavedPaymentMethod[]> => {
    const response = await apiClient.get<ApiResponse<SavedPaymentMethod[]>>('/payment-methods');
    return response.data.data;
  },

  /**
   * Creates/saves a new payment method for the authenticated user.
   * POST /api/payment-methods
   */
  createSavedPaymentMethod: async (payload: CreateSavedPaymentMethodDTO): Promise<SavedPaymentMethod> => {
    const response = await apiClient.post<ApiResponse<SavedPaymentMethod>>('/payment-methods', payload);
    return response.data.data;
  },

  /**
   * Deletes a saved payment method for the authenticated user.
   * DELETE /api/payment-methods/:savedMethodId
   */
  deleteSavedPaymentMethod: async (savedMethodId: string): Promise<null> => {
    const response = await apiClient.delete<ApiResponse<null>>(
      `/payment-methods/${savedMethodId}`
    );
    return response.data.data;
  },

  /**
   * Sets a saved payment method as the default for the authenticated user.
   * PUT /api/payment-methods/:savedMethodId/default
   */
  setDefaultPaymentMethod: async (savedMethodId: string): Promise<null> => {
    const response = await apiClient.put<ApiResponse<null>>(
      `/payment-methods/${savedMethodId}/default`
    );
    return response.data.data;
  },
};