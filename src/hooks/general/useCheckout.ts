import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { checkoutApi } from "@/api/general/checkoutsessionApi";
import {
  type CheckoutSession,
  type ShippingOption,
  type OrderSummaryResult,
  type OrderDocument,
  type StartCheckoutRequestDTO,
  type SetAddressDTO,
  type SetShippingMethodDTO,
  type ApplyDiscountDTO,
  type SetPaymentDetailsRequestDTO,
  type PlaceOrderRequestDTO,
  type AppliedDiscountResult,
  type IAddress,
  type AddressCreationDto,
  type AddressUpdateDto,
  type SavedPaymentMethod,
  type CreateSavedPaymentMethodDTO,
} from "@/types/checkout.types";
import { useNotification } from "@/contexts/NotificationContext";
import { v4 as uuidv4 } from "uuid";

export const checkoutKeys = {
  all: ["checkout"] as const,
  session: (sessionId: string | null | undefined) =>
    [...checkoutKeys.all, "session", sessionId || "guest"] as const,
  shippingMethods: (sessionId: string | null | undefined) =>
    [...checkoutKeys.session(sessionId), "shippingMethods"] as const,
  summary: (sessionId: string | null | undefined) =>
    [...checkoutKeys.session(sessionId), "summary"] as const,
};

export const addressKeys = {
  all: ["userAddresses"] as const,
  list: () => [...addressKeys.all, "list"] as const,
};

export const paymentMethodKeys = {
  all: ["userPaymentMethods"] as const,
  list: () => [...paymentMethodKeys.all, "list"] as const,
};

export const useStartCheckout = () => {
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();
  return useMutation<CheckoutSession, Error, StartCheckoutRequestDTO>({
    mutationFn: checkoutApi.startCheckout,
    onSuccess: (data) => {
      queryClient.setQueryData(checkoutKeys.session(data._id), data);
      showNotification("Checkout session started.", "success");
    },
    onError: (error: any) => {
      showNotification(error.message || "Failed to start checkout.", "error");
    },
  });
};

export const useSetShippingAddress = () => {
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();
  return useMutation<CheckoutSession, Error, SetAddressDTO>({
    mutationFn: checkoutApi.setShippingAddress,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(checkoutKeys.session(variables.sessionId), data);

      queryClient.invalidateQueries({
        queryKey: checkoutKeys.shippingMethods(variables.sessionId),
      });
      queryClient.invalidateQueries({
        queryKey: checkoutKeys.summary(variables.sessionId),
      });
      showNotification("Shipping address updated.", "success");
    },
    onError: (error: any) => {
      showNotification(
        error.message || "Failed to save shipping address.",
        "error"
      );
    },
  });
};

export const useSetBillingAddress = () => {
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();
  return useMutation<CheckoutSession, Error, SetAddressDTO>({
    mutationFn: checkoutApi.setBillingAddress,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(checkoutKeys.session(variables.sessionId), data);
      queryClient.invalidateQueries({
        queryKey: checkoutKeys.summary(variables.sessionId),
      });
      showNotification("Billing address updated.", "success");
    },
    onError: (error: any) => {
      showNotification(
        error.message || "Failed to save billing address.",
        "error"
      );
    },
  });
};

export const useSetShippingMethod = () => {
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();
  return useMutation<CheckoutSession, Error, SetShippingMethodDTO>({
    mutationFn: checkoutApi.setShippingMethod,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(checkoutKeys.session(variables.sessionId), data);
      queryClient.invalidateQueries({
        queryKey: checkoutKeys.summary(variables.sessionId),
      });
      showNotification("Shipping method selected.", "success");
    },
    onError: (error: any) => {
      showNotification(
        error.message || "Failed to set shipping method.",
        "error"
      );
    },
  });
};

export const useApplyDiscount = () => {
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();
  return useMutation<AppliedDiscountResult, Error, ApplyDiscountDTO>({
    mutationFn: checkoutApi.applyDiscount,
    onSuccess: (data, variables) => {
      showNotification(
        `Discount "${variables.discountCode}" applied!`,
        "success"
      );

      queryClient.invalidateQueries({
        queryKey: checkoutKeys.summary(variables.sessionId),
      });
    },
    onError: (error: any) => {
      showNotification(error.message || "Invalid discount code.", "error");
    },
  });
};

export const useSetPaymentDetails = () => {
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();
  return useMutation<CheckoutSession, Error, SetPaymentDetailsRequestDTO>({
    mutationFn: checkoutApi.setPaymentDetails,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(checkoutKeys.session(variables.sessionId), data);
      queryClient.invalidateQueries({
        queryKey: checkoutKeys.summary(variables.sessionId),
      });
      showNotification("Payment details updated.", "success");
    },
    onError: (error: any) => {
      showNotification(
        error.message || "Failed to set payment details.",
        "error"
      );
    },
  });
};

export const usePlaceOrder = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  return useMutation<
    OrderDocument,
    Error,
    Omit<PlaceOrderRequestDTO, "idempotencyKey">
  >({
    mutationFn: (payload) =>
      checkoutApi.placeOrder({ ...payload, idempotencyKey: uuidv4() }),
    onSuccess: (data) => {
      showNotification(
        `Order #${data.order.orderNumber} placed successfully!`,
        "success"
      );

      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: checkoutKeys.all });
    },
    onError: (error: any) => {
      showNotification(
        error.message || "There was a problem placing your order.",
        "error"
      );
    },
  });
};

export const useGetShippingMethods = (sessionId: string | null | undefined) => {
  return useQuery<ShippingOption[], Error>({
    queryKey: checkoutKeys.shippingMethods(sessionId),
    queryFn: () => checkoutApi.getShippingMethods(sessionId!),
    enabled: !!sessionId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetOrderSummary = (sessionId: string | null | undefined) => {
  return useQuery<OrderSummaryResult, Error>({
    queryKey: checkoutKeys.summary(sessionId),
    queryFn: () => checkoutApi.getOrderSummary(sessionId!),
    enabled: !!sessionId,
  });
};

export const useGetAddresses = () => {
  return useQuery<IAddress[], Error>({
    queryKey: addressKeys.list(),
    queryFn: checkoutApi.getUserAddresses,
    staleTime: 15 * 60 * 1000,
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  return useMutation<IAddress, Error, AddressCreationDto>({
    mutationFn: checkoutApi.createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.list() });
      showNotification("Address saved successfully.", "success");
    },
    onError: (error: any) => {
      showNotification(error.message || "Failed to save address.", "error");
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  return useMutation<
    IAddress,
    Error,
    { addressId: string; updateData: AddressUpdateDto }
  >({
    mutationFn: ({ addressId, updateData }) =>
      checkoutApi.updateAddress(addressId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.list() });
      showNotification("Address updated successfully.", "success");
    },
    onError: (error: any) => {
      showNotification(error.message || "Failed to update address.", "error");
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  return useMutation<null, Error, string>({
    mutationFn: checkoutApi.deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.list() });
      showNotification("Address deleted.", "info");
    },
    onError: (error: any) => {
      showNotification(error.message || "Failed to delete address.", "error");
    },
  });
};

export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  return useMutation<null, Error, string>({
    mutationFn: checkoutApi.setDefaultAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.list() });
      showNotification("Default address updated.", "success");
    },
    onError: (error: any) => {
      showNotification(
        error.message || "Failed to set default address.",
        "error"
      );
    },
  });
};

export const useGetSavedPaymentMethods = () => {
  return useQuery<SavedPaymentMethod[], Error>({
    queryKey: paymentMethodKeys.list(),
    queryFn: checkoutApi.getSavedPaymentMethods,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateSavedPaymentMethod = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  return useMutation<SavedPaymentMethod, Error, CreateSavedPaymentMethodDTO>({
    mutationFn: checkoutApi.createSavedPaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.list() });
      showNotification("Payment method saved.", "success");
    },
    onError: (error: any) => {
      showNotification(
        error.message || "Failed to save payment method.",
        "error"
      );
    },
  });
};

export const useDeleteSavedPaymentMethod = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  return useMutation<null, Error, string>({
    mutationFn: checkoutApi.deleteSavedPaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.list() });
      showNotification("Payment method deleted.", "info");
    },
    onError: (error: any) => {
      showNotification(
        error.message || "Failed to delete payment method.",
        "error"
      );
    },
  });
};

export const useSetDefaultPaymentMethod = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  return useMutation<null, Error, string>({
    mutationFn: checkoutApi.setDefaultPaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.list() });
      showNotification("Default payment method updated.", "success");
    },
    onError: (error: any) => {
      showNotification(
        error.message || "Failed to set default payment method.",
        "error"
      );
    },
  });
};
