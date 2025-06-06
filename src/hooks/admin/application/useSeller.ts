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

export const sellerKeys = {
  all: ["sellerapplication"] as const,
  profile: () => [...sellerKeys.all, "sellerapplication"] as const,
};
export const sellerApplicationKeys = {
  all: ["sellerApplications"] as const,
  filters: (filters?: object) =>
    [...sellerApplicationKeys.all, "list", filters || {}] as const,
};

type IndividualSellerApplicationListQueryKey = ReturnType<
  typeof sellerApplicationKeys.filters
>;
type IndividualSellerProfileQueryKey =
  ReturnType<typeof sellerKeys.profile> extends (infer T)[]
    ? [...T[], object]
    : readonly [string, string, object];

export const useGetIndividualSellerApplication = (
  id:string,
  options?: UseQueryOptions<
    ApiResponse<IIndividualSellerProfile>,
    Error,
    IIndividualSellerProfile,
    ReturnType<typeof sellerKeys.profile>
  >
) => {
  const { isAuthenticated, loading: isAuthLoading } = useSelector(
    (state: RootState) => state.auth
  );
  return useQuery<
    ApiResponse<IIndividualSellerProfile>,
    Error,
    IIndividualSellerProfile,
    ReturnType<typeof sellerKeys.profile>
  >({
    queryKey: sellerKeys.profile(),
    enabled: isAuthenticated && !isAuthLoading,
    queryFn: async () => {
      const response = await getIndividualSellerApplication(id);
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

export const useFilterIndividualSellerApplication = (
  apiParams?: Record<string, string | number | boolean>,
  options?: UseQueryOptions<
    PaginatedSellerApplicationsResponse,
    Error,
    PaginatedSellerApplicationsResponse,
    IndividualSellerApplicationListQueryKey
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
    IndividualSellerApplicationListQueryKey
  >({
    queryKey: sellerApplicationKeys.filters(effectiveApiParams),
    queryFn: async () => {
      const response =
        await filterIndividualSellerApplication(effectiveApiParams);

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

/**
 * Custom hook to update an existing individual seller profile.
 * @returns The mutation result object (mutate, isPending, isSuccess, isError, error, etc.).
 */
export const useUpdateIndividualSellerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<IIndividualSellerProfile>,
    Error,
    Partial<IIndividualSellerProfile>
  >({
    mutationFn: updateIndividualSellerProfile,
    onSuccess: (response) => {
      console.log("Seller profile updated successfully:", response.data);
      queryClient.invalidateQueries({ queryKey: sellerKeys.profile() });
    },
    onError: (error) => {
      console.error("Error updating seller profile:", error);
    },
  });
};

export const useUpdateIndividualSellerApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<IIndividualSellerProfile>,
    Error,
    {
      status: string;
    }
  >({
    mutationFn: updateIndividualSellerApplicationStatusById('',{}),
    onSuccess: (response) => {
      console.log("Seller profile status updated successfully:", response.data);
      queryClient.invalidateQueries({ queryKey: sellerKeys.profile() });
    },
    onError: (error) => {
      console.error("Error updating seller profile:", error);
    },
  });
};


interface UpdateStatusMutationVariables {
  applicationId: string;
  status: ISellerStatus;
  rejectionReason?: string; 
}


export const useUpdateIndividualSellerProfileStatusById = (
  options?: UseMutationOptions<
    ApiResponse<IIndividualSellerProfile>, 
    Error,                                 
    UpdateStatusMutationVariables          
  >
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<IIndividualSellerProfile>,
    Error,
    UpdateStatusMutationVariables
  >({
    mutationFn: ({ applicationId, status, rejectionReason }) =>
      updateIndividualSellerApplicationStatusById(applicationId, { status, rejectionReason }),
    onSuccess: (data, variables) => {
      console.log("Seller application status updated successfully via hook:", data.data);
      queryClient.invalidateQueries({ queryKey: sellerKeys.profile() });
    },
    onError: (error) => {
      console.error("Error updating seller application status via hook:", error);
    },
    ...options,
  });
};