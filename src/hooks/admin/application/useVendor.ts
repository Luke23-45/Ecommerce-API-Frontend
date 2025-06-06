import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";

import {
  createIndividualSellerProfile,
  getIndividualSellerProfile,
  updateIndividualSellerProfile,
  updateIndividualSellerProfileStatus,
} from "@/api/seller/sellerApi";

import {
  type IIndividualSellerProfile,
  type IPaginatedIndividualSellerApplicationsResult as PaginatedSellerApplicationsResponse,
  type IIndividualSellerApplicationQueryOptions,
  type ISellerStatus,
} from "@/types/seller";
import { type RootState } from "@/store";
import { type ApiResponse } from "@/types/auth";
import {
  filterIndividualSellerApplication,
  getIndividualSellerApplication,
  updateIndividualSellerApplicationStatusById,
} from "@/api/admin/application/sellerApplication";
import type {
  IPaginatedVendorApplicationsResult,
  IVendorProfile,
} from "@/types/vendor";
import {
  filterVendorApplication,
  getVendorApplication,
  updateVendorApplicationStatusById,
} from "@/api/admin/application/vendorApplication";
import { updateVendorProfileStatus } from "@/api/vendor/vendorApi";

export const vendorKey = {
  all: ["vendorapplication"] as const,
  profile: () => [...vendorKey.all, "vendorapplication"] as const,
};

export const vendorApplicationKeys = {
  all: ["vendorapplication"] as const,
  filters: (filters?: object) =>
    [...vendorApplicationKeys.all, "list", filters || {}] as const,
};

type VendorApplicationListQueryKey = ReturnType<
  typeof vendorApplicationKeys.filters
>;

export const useGetVendorApplication = (
  id: string,
  options?: UseQueryOptions<
    ApiResponse<IVendorProfile>,
    Error,
    IVendorProfile,
    ReturnType<typeof vendorKey.profile>
  >
) => {
  const { isAuthenticated, loading: isAuthLoading } = useSelector(
    (state: RootState) => state.auth
  );
  return useQuery<
    ApiResponse<IVendorProfile>,
    Error,
    IVendorProfile,
    ReturnType<typeof vendorKey.profile>
  >({
    queryKey: vendorKey.profile(),
    enabled: isAuthenticated && !isAuthLoading,
    queryFn: async () => {
      const response = await getVendorApplication(id);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch seller profile.");
      }
      return response;
    },
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });
};

export const useFilterVendorApplication = (
  apiParams?: Record<string, string | number | boolean>,
  options?: UseQueryOptions<
    IPaginatedVendorApplicationsResult,
    Error,
    IPaginatedVendorApplicationsResult,
    VendorApplicationListQueryKey
  >
) => {
  const { isAuthenticated, loading: isAuthLoading } = useSelector(
    (state: RootState) => state.auth
  );

  const effectiveApiParams = apiParams || {};

  return useQuery<
    ApiResponse<PaginatedSellerApplicationsResponse>,
    Error,
    PaginatedSellerApplicationsResponse,
    VendorApplicationListQueryKey
  >({
    queryKey: vendorApplicationKeys.filters(effectiveApiParams),
    queryFn: async () => {
      const response = await filterVendorApplication(effectiveApiParams);
      if (!response.success) {
        console.error("queryFn: API response indicates failure:", response);
        throw new Error(
          response.message || "Failed to fetch seller applications."
        );
      }
      return response;
    },
    select: (responseWrapper) => {
      if (!responseWrapper.data) {
        console.warn(
          "select: `responseWrapper.data` is missing in select function input.",
          responseWrapper
        );
        throw new Error("API returned success but data payload is missing.");
      }
      return responseWrapper.data;
    },
    enabled: isAuthenticated && !isAuthLoading && !!apiParams,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });
};

interface UpdateStatusMutationVariables {
  applicationId: string;
  status: ISellerStatus;
  rejectionReason?: string;
}

export const useUpdateVendorProfileStatusById = (
  options?: UseMutationOptions<
    ApiResponse<IVendorProfile>,
    Error,
    UpdateStatusMutationVariables
  >
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<IVendorProfile>,
    Error,
    UpdateStatusMutationVariables
  >({
    mutationFn: ({ applicationId, status, rejectionReason }) =>
      updateVendorApplicationStatusById(applicationId, {
        status,
        rejectionReason,
      }),
    onSuccess: (data, variables) => {
      console.log(
        "Vendor application status updated successfully via hook:",
        data.data
      );
      queryClient.invalidateQueries({ queryKey: vendorKey.profile() });
    },
    onError: (error) => {
      console.error(
        "Error updating seller application status via hook:",
        error
      );
    },
    ...options,
  });
};
