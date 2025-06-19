import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";

import {
  createTaxRateApi,
  getAllTaxRatesApi,
  getTaxRateByIdApi,
  updateTaxRateApi,
  deleteTaxRateApi,
  calculateTaxesApi,
  type TaxRateApiListParams,
} from "@/api/admin/checkoutsession/taxApi";

import {
  type ITaxRateCreatePayload,
  type ITaxRateUpdatePayload,
  type ITaxRateResponse,
  type ICalculateTaxesPayloadFrontend,
  type ITaxCalculationResultFrontend,
  type ApiResponse,
  type IPaginatedData,
} from "@/types/tax.types";

import { useNotification } from "@/contexts/NotificationContext";

export const taxRateKeys = {
  all: ["taxRates"] as const,
  lists: (params?: object) =>
    [...taxRateKeys.all, "list", params || {}] as const,
  detailById: (id?: string) =>
    [...taxRateKeys.all, "detail", "id", id || "undefinedTaxRateId"] as const,
};

type AllTaxRatesQueryKey = ReturnType<typeof taxRateKeys.lists>;
type TaxRateByIdQueryKey = ReturnType<typeof taxRateKeys.detailById>;

/**
 * Hook to create a new tax rate.
 */
export const useCreateTaxRate = (
  options?: UseMutationOptions<
    ApiResponse<ITaxRateResponse>,
    Error,
    ITaxRateCreatePayload
  >
) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation<
    ApiResponse<ITaxRateResponse>,
    Error,
    ITaxRateCreatePayload
  >({
    mutationFn: createTaxRateApi,
    onSuccess: (response) => {
      console.log("Tax rate created successfully via hook:", response.data);
      showNotification(
        response.message || "Tax rate created successfully!",
        "success"
      );

      queryClient.invalidateQueries({ queryKey: taxRateKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taxRateKeys.all });

      if (response.data?.id) {
        queryClient.setQueryData(
          taxRateKeys.detailById(response.data.id),
          response
        );
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Failed to create tax rate.";
      console.error("Error creating tax rate via hook:", error);
      showNotification(errorMessage, "error");
    },
    ...options,
  });
};

/**
 * Hook to fetch all tax rates.
 * If you implement pagination in getAllTaxRatesApi, change return type to IPaginatedData<ITaxRateResponse>.
 */
export const useGetAllTaxRates = (
  params?: TaxRateApiListParams,
  options?: UseQueryOptions<
    ApiResponse<ITaxRateResponse[]>,
    Error,
    ITaxRateResponse[],
    AllTaxRatesQueryKey
  >
) => {
  return useQuery<
    ApiResponse<ITaxRateResponse[]>,
    Error,
    ITaxRateResponse[],
    AllTaxRatesQueryKey
  >({
    queryKey: taxRateKeys.lists(params),
    queryFn: () => getAllTaxRatesApi(params),

    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    select: (response) => response.data,

    ...options,
  });
};

/**
 * Hook to fetch a single tax rate by its ID.
 */
export const useGetTaxRateById = (
  taxRateId: string | undefined,
  projection?: string,
  lean?: boolean,
  options?: UseQueryOptions<
    ApiResponse<ITaxRateResponse>,
    Error,
    ITaxRateResponse,
    TaxRateByIdQueryKey
  >
) => {
  return useQuery<
    ApiResponse<ITaxRateResponse>,
    Error,
    ITaxRateResponse,
    TaxRateByIdQueryKey
  >({
    queryKey: taxRateKeys.detailById(taxRateId),
    queryFn: async () => {
      if (!taxRateId)
        throw new Error("Tax Rate ID is required to fetch by ID.");
      return getTaxRateByIdApi(taxRateId, projection, lean);
    },
    enabled: !!taxRateId && options?.enabled !== false,
    select: (response) => response.data,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to update an existing tax rate.
 */
export const useUpdateTaxRate = (
  options?: UseMutationOptions<
    ApiResponse<ITaxRateResponse>,
    Error,
    { taxRateId: string; payload: ITaxRateUpdatePayload }
  >
) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation<
    ApiResponse<ITaxRateResponse>,
    Error,
    { taxRateId: string; payload: ITaxRateUpdatePayload }
  >({
    mutationFn: ({ taxRateId, payload }) =>
      updateTaxRateApi(taxRateId, payload),
    onSuccess: (response, variables) => {
      console.log(
        `Tax rate ${variables.taxRateId} updated successfully via hook:`,
        response.data
      );
      showNotification(
        response.message || "Tax rate updated successfully!",
        "success"
      );

      queryClient.invalidateQueries({ queryKey: taxRateKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: taxRateKeys.detailById(variables.taxRateId),
      });
    },
    onError: (error: any, variables) => {
      const errorMessage = error.message || "Failed to update tax rate.";
      console.error(
        `Error updating tax rate ${variables.taxRateId} via hook:`,
        error
      );
      showNotification(errorMessage, "error");
    },
    ...options,
  });
};

/**
 * Hook to delete a tax rate.
 */
export const useDeleteTaxRate = (
  options?: UseMutationOptions<ApiResponse<null>, Error, string>
) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation<ApiResponse<null>, Error, string>({
    mutationFn: deleteTaxRateApi,
    onSuccess: (_data, taxRateId) => {
      console.log(`Tax rate ${taxRateId} deleted successfully via hook.`);
      showNotification("Tax rate deleted successfully.", "success");
      queryClient.invalidateQueries({ queryKey: taxRateKeys.all });
      queryClient.removeQueries({
        queryKey: taxRateKeys.detailById(taxRateId),
      });
    },
    onError: (error: any, taxRateId) => {
      const errorMessage = error.message || "Failed to delete tax rate.";
      console.error(`Error deleting tax rate ${taxRateId} via hook:`, error);
      showNotification(errorMessage, "error");
    },
    ...options,
  });
};

/**
 * Hook for calculating taxes (e.g., in cart or checkout).
 */
export const useCalculateTaxes = (
  options?: UseMutationOptions<
    ApiResponse<ITaxCalculationResultFrontend>,
    Error,
    ICalculateTaxesPayloadFrontend
  >
) => {
  const { showNotification } = useNotification();

  return useMutation<
    ApiResponse<ITaxCalculationResultFrontend>,
    Error,
    ICalculateTaxesPayloadFrontend
  >({
    mutationFn: calculateTaxesApi,
    onSuccess: (response) => {
      console.log("Taxes calculated successfully via hook:", response.data);
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Failed to calculate taxes.";
      console.error("Error calculating taxes via hook:", error);
      showNotification(errorMessage, "error");
    },
    ...options,
  });
};
