import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
  // type QueryKey, // Not explicitly needed if using ReturnType
} from "@tanstack/react-query";
// import { useSelector } from "react-redux"; // Uncomment if using Redux for auth state

import {
  // Discount API functions
  createDiscountApi,
  getPaginatedDiscountsApi,
  getDiscountByIdApi,
  getDiscountByCodeAdminApi, // Assuming you'll add route & use this
  updateDiscountApi,
  deleteDiscountApi,
  applyDiscountCodeApi,
  // Types for API function parameters
  type IDiscountListApiParams,
} from "@/api/admin/checkoutsession/discountApi"; // Adjust path to your discountApi.ts

import {
  // Discount specific types
  type IDiscountCreatePayload,
  type IDiscountUpdatePayload,
  type IDiscountResponse,
  type IDiscountCalculationResult,
  // Generic API types (assuming they are in discount.types.ts or a shared types/api.ts)
  type ApiResponse,
  type IPaginatedData,
} from "@/types/discount.interfaces"; // Adjust path
// import { type RootState } from "@/store"; // Uncomment if using Redux
import { useNotification } from "@/contexts/NotificationContext"; // Adjust path

// --- Query Keys ---

export const discountKeys = {
  all: ["discounts"] as const,
  paginated: (params?: object) => [...discountKeys.all, "paginated", params || {}] as const,
  detailById: (id?: string) => [...discountKeys.all, "detail", "id", id || "undefinedDiscountId"] as const,
  detailByCode: (code?: string) => [...discountKeys.all, "detail", "code", code || "undefinedDiscountCode"] as const,
  // Applied discount result for a specific code/context (e.g., cartId if used)
  applied: (code?: string, contextId?: string) => [...discountKeys.all, "applied", code || "undefinedCode", contextId || "noContext"] as const,
};

// --- Type Definitions for Hook Options and Query Keys ---

type PaginatedDiscountsQueryKey = ReturnType<typeof discountKeys.paginated>;
type DiscountByIdQueryKey = ReturnType<typeof discountKeys.detailById>;
type DiscountByCodeQueryKey = ReturnType<typeof discountKeys.detailByCode>;
type AppliedDiscountQueryKey = ReturnType<typeof discountKeys.applied>;


// --- Discount React Query Hooks (Admin Focused) ---

/**
 * Hook to create a new discount.
 */
export const useCreateDiscount = (
  options?: UseMutationOptions<ApiResponse<IDiscountResponse>, Error, IDiscountCreatePayload>
) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation<ApiResponse<IDiscountResponse>, Error, IDiscountCreatePayload>({
    mutationFn: createDiscountApi,
    onSuccess: (response) => {
      const discountName = response.data?.name || response.data?.code || 'Discount';
      console.log("Discount created successfully via hook:", response.data);
      showNotification(`Discount "${discountName}" created successfully!`, "success");
      queryClient.invalidateQueries({ queryKey: discountKeys.paginated() });
      queryClient.invalidateQueries({ queryKey: discountKeys.all }); // Broader invalidation
      if (response.data?.id) {
        queryClient.setQueryData(discountKeys.detailById(response.data.id), response);
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Failed to create discount.";
      console.error("Error creating discount via hook:", error);
      showNotification(errorMessage, "error");
    },
    ...options,
  });
};

/**
 * Hook to fetch paginated discounts for admin.
 */
export const useGetPaginatedDiscounts = (
  params?: IDiscountListApiParams,
  options?: UseQueryOptions<IPaginatedData<IDiscountResponse>, Error, IPaginatedData<IDiscountResponse>, PaginatedDiscountsQueryKey>
) => {
  // const { isAuthenticated, loading: isAuthLoading } = useSelector((state: RootState) => state.auth);
  return useQuery<IPaginatedData<IDiscountResponse>, Error, IPaginatedData<IDiscountResponse>, PaginatedDiscountsQueryKey>({
    queryKey: discountKeys.paginated(params),
    queryFn: () => getPaginatedDiscountsApi(params),
    // enabled: isAuthenticated && !isAuthLoading, // Example: if admin only
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    keepPreviousData: true, // Good for pagination
    ...options,
  });
};

/**
 * Hook to fetch a single discount by its ID for admin.
 */
export const useGetDiscountById = (
  discountId: string | undefined,
  projection?: string,
  lean?: boolean,
  options?: UseQueryOptions<ApiResponse<IDiscountResponse>, Error, IDiscountResponse, DiscountByIdQueryKey>
) => {
  return useQuery<ApiResponse<IDiscountResponse>, Error, IDiscountResponse, DiscountByIdQueryKey>({
    queryKey: discountKeys.detailById(discountId),
    queryFn: async () => {
      if (!discountId) throw new Error("Discount ID is required to fetch by ID.");
      return getDiscountByIdApi(discountId, projection, lean);
    },
    enabled: !!discountId && (options?.enabled !== false),
    select: (response) => response.data,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch a single discount by its CODE for admin.
 * (Requires backend route and API function for this)
 */
export const useGetDiscountByCodeAdmin = (
  code: string | undefined,
  projection?: string,
  lean?: boolean,
  options?: UseQueryOptions<ApiResponse<IDiscountResponse>, Error, IDiscountResponse, DiscountByCodeQueryKey>
) => {
  return useQuery<ApiResponse<IDiscountResponse>, Error, IDiscountResponse, DiscountByCodeQueryKey>({
    queryKey: discountKeys.detailByCode(code),
    queryFn: async () => {
      if (!code) throw new Error("Discount code is required to fetch.");
      return getDiscountByCodeAdminApi(code, projection, lean);
    },
    enabled: !!code && (options?.enabled !== false),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};


/**
 * Hook to update an existing discount.
 */
export const useUpdateDiscount = (
  options?: UseMutationOptions<ApiResponse<IDiscountResponse>, Error, { discountId: string; payload: IDiscountUpdatePayload }>
) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation<ApiResponse<IDiscountResponse>, Error, { discountId: string; payload: IDiscountUpdatePayload }>({
    mutationFn: ({ discountId, payload }) => updateDiscountApi(discountId, payload),
    onSuccess: (response, variables) => {
      const discountName = response.data?.name || response.data?.code || variables.discountId;
      console.log(`Discount ${discountName} updated successfully via hook:`, response.data);
      showNotification(`Discount "${discountName}" updated successfully!`, "success");
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: discountKeys.paginated() });
      queryClient.invalidateQueries({ queryKey: discountKeys.detailById(variables.discountId) });
      if (response.data?.code) {
        queryClient.invalidateQueries({ queryKey: discountKeys.detailByCode(response.data.code) });
      }
      // More aggressive: queryClient.invalidateQueries({ queryKey: discountKeys.all });
    },
    onError: (error: any, variables) => {
      const errorMessage = error.message || `Failed to update discount ${variables.discountId}.`;
      console.error(`Error updating discount ${variables.discountId} via hook:`, error);
      showNotification(errorMessage, "error");
    },
    ...options,
  });
};

/**
 * Hook to delete a discount.
 */
export const useDeleteDiscount = (
  options?: UseMutationOptions<ApiResponse<null>, Error, string> // Variable is discountId
) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation<ApiResponse<null>, Error, string>({
    mutationFn: deleteDiscountApi,
    onSuccess: (_data, discountId) => {
      // We might not have the name here if the item is removed from cache before notification
      // Could pass name in variables or context if needed for notification.
      console.log(`Discount ${discountId} deleted successfully via hook.`);
      showNotification(`Discount (ID: ${discountId}) deleted successfully.`, "success");
      queryClient.invalidateQueries({ queryKey: discountKeys.all });
      queryClient.removeQueries({ queryKey: discountKeys.detailById(discountId) });
      // Also remove by code if applicable, though code might not be available here
      // queryClient.removeQueries({ queryKey: discountKeys.detailByCode(someCode) });
    },
    onError: (error: any, discountId) => {
      const errorMessage = error.message || `Failed to delete discount ${discountId}.`;
      console.error(`Error deleting discount ${discountId} via hook:`, error);
      showNotification(errorMessage, "error");
    },
    ...options,
  });
};


// --- Hook for Applying a Discount Code (Customer/Cart Context) ---
interface ApplyDiscountVariables {
    discountCode: string;
    cartId?: string; // Or other context like order subtotal, items, etc.
}

export const useApplyDiscountCode = (
    options?: UseMutationOptions<ApiResponse<IDiscountCalculationResult>, Error, ApplyDiscountVariables>
) => {
    const queryClient = useQueryClient();
    const { showNotification } = useNotification();

    return useMutation<ApiResponse<IDiscountCalculationResult>, Error, ApplyDiscountVariables>({
        mutationFn: applyDiscountCodeApi,
        onSuccess: (response, variables) => {
            if (response.success && response.data) {
                console.log(`Discount code "${variables.discountCode}" applied successfully:`, response.data);
                showNotification(response.data.summaryDescription || `Discount "${variables.discountCode}" applied!`, "success");
                // Depending on your app, you might want to invalidate cart/order summary queries here
                // queryClient.invalidateQueries({ queryKey: ['cartSummary'] });
                // queryClient.invalidateQueries({ queryKey: discountKeys.applied(variables.discountCode, variables.cartId) }); // For specific applied discount data
                queryClient.setQueryData(discountKeys.applied(variables.discountCode, variables.cartId), response);
            } else {
                // This path taken if API function returns success=false from business logic, not network error
                const message = response.message || `Could not apply discount code "${variables.discountCode}".`;
                console.warn("Applying discount code - API indicated issue:", message);
                showNotification(message, "warning");
                // We throw an error here so useMutation's isError becomes true and onError is called
                throw new Error(message);
            }
        },
        onError: (error: any, variables) => {
            const errorMessage = error.message || `Failed to apply discount code "${variables.discountCode}".`;
            console.error(`Error applying discount code "${variables.discountCode}" via hook:`, error);
            showNotification(errorMessage, "error");
        },
        ...options,
    });
};