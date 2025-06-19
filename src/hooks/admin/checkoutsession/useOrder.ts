import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { orderApi } from "@/api/admin/checkoutsession/orderApi";
import {
  type PlaceOrderRequestDTO,
  type GetUserOrdersRequestParams,
  type OrderDocument,
  type PaginatedOrdersResult,
  type OrderListItem,
} from "@/types/order.types";
import { useNotification } from "@/contexts/NotificationContext";
import { v4 as uuidv4 } from "uuid";

export const orderKeys = {
  all: ["orders"] as const,

  list: (params: GetUserOrdersRequestParams = {}) =>
    [...orderKeys.all, "list", params] as const,

  detail: (orderId: string | undefined) =>
    [...orderKeys.all, "detail", orderId] as const,
};

/**
 * A hook for placing a new order.
 * It handles the API call and invalidates relevant queries on success.
 */
export const usePlaceOrder = (
  options?: UseMutationOptions<
    OrderDocument,
    Error,
    Omit<PlaceOrderRequestDTO, "idempotencyKey">
  >
) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation<
    OrderDocument,
    Error,
    Omit<PlaceOrderRequestDTO, "idempotencyKey">
  >({
    mutationFn: (payload) =>
      orderApi.placeOrder({ ...payload, idempotencyKey: uuidv4() }),
    onSuccess: (data) => {
      showNotification(
        `Order #${data.orderNumber} placed successfully! Your items are on their way.`,
        "success"
      );

      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["checkout"] });

      queryClient.invalidateQueries({ queryKey: orderKeys.list() });

      queryClient.setQueryData(orderKeys.detail(data._id), data);
    },
    onError: (error: any) => {
      showNotification(
        error.message ||
          "There was a problem placing your order. Please try again.",
        "error"
      );
    },
    ...options,
  });
};

/**
 * A hook for cancelling an order.
 */
export const useCancelOrder = (
  options?: UseMutationOptions<OrderDocument, Error, string>
) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation<OrderDocument, Error, string>({
    mutationFn: orderApi.cancelOrder,
    onSuccess: (data, orderId) => {
      showNotification(
        `Order #${data.orderNumber} has been cancelled.`,
        "info"
      );

      queryClient.invalidateQueries({ queryKey: orderKeys.list() });

      queryClient.setQueryData(orderKeys.detail(orderId), data);
    },
    onError: (error: any) => {
      showNotification(
        error.message ||
          "Failed to cancel the order. It may already be processed.",
        "error"
      );
    },
    ...options,
  });
};

/**
 * A hook for fetching a paginated list of the authenticated user's orders.
 * Supports filtering and sorting via parameters.
 */
export const useGetOrders = (
  params: GetUserOrdersRequestParams,
  options?: UseQueryOptions<PaginatedOrdersResult, Error>
) => {
  return useQuery<PaginatedOrdersResult, Error>({
    queryKey: orderKeys.list(params),
    queryFn: () => orderApi.getUserOrders(params),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * A hook for fetching the details of a single order by its ID.
 */
export const useGetOrderById = (
  orderId: string | undefined,
  options?: UseQueryOptions<OrderDocument, Error>
) => {
  return useQuery<OrderDocument, Error>({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => orderApi.getOrderById(orderId!),
    enabled: !!orderId,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};
