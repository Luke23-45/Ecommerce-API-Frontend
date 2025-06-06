import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";

import {
  createIndividualSellerProfile,
  getIndividualSellerProfile,
  updateIndividualSellerProfile,
  updateIndividualSellerProfileStatus,
} from "@/api/seller/sellerApi";

import { type IIndividualSellerProfile } from "@/types/seller";
import { type RootState } from "@/store";
import { type ApiResponse } from "@/types/auth";

export const sellerKeys = {
  all: ["seller"] as const,
  profile: () => [...sellerKeys.all, "profile"] as const,
};

export const useGetIndividualSellerProfile = (
  options?: UseQueryOptions<
    ApiResponse<IIndividualSellerProfile>,
    Error,
    IIndividualSellerProfile, 
    ReturnType<typeof sellerKeys.profile> 
  >
)=> {
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
      const response = await getIndividualSellerProfile();

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

/**
 * Custom hook to create a new individual seller profile.
 * @returns The mutation result object (mutate, isPending, isSuccess, isError, error, etc.).
 */
export const useCreateIndividualSellerProfile = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation<
    ApiResponse<IIndividualSellerProfile>,
    Error,
    IIndividualSellerProfile
  >({
    mutationFn: createIndividualSellerProfile,
    onSuccess: (response) => {
      console.log("Seller profile created successfully:", response.data);
      queryClient.invalidateQueries({ queryKey: sellerKeys.profile() });
    },
    onError: (error) => {
      console.error("Error creating seller profile:", error);
    },
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


export const useUpdateIndividualSellerProfileStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<IIndividualSellerProfile>,
    Error,
    {
      status:string
    }
  >({
    mutationFn: updateIndividualSellerProfileStatus,
    onSuccess: (response) => {
      console.log("Seller profile status updated successfully:", response.data);
      queryClient.invalidateQueries({ queryKey: sellerKeys.profile() });
    },
    onError: (error) => {
      console.error("Error updating seller profile:", error);
    },
  });
};