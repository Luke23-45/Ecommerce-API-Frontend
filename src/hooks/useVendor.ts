import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { useSelector } from "react-redux";

import {
  createVendorProfile,
  updateVendorProfile,
  getVendorProfile,
} from "@/api/vendor/vendorApi";

import { type IVendorProfile } from "@/types/vendor";
import { type RootState } from "@/store";
import { type ApiResponse } from "@/types/auth";

export const vendorKeys = {
  all: ["seller"] as const,
  profile: () => [...vendorKeys.all, "profile"] as const,
};
export const useGetVendorProfile = (
  options?: UseQueryOptions<ApiResponse<IVendorProfile>, Error, IVendorProfile>
) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  return useQuery<ApiResponse<IVendorProfile>, Error, IVendorProfile>({
    queryKey: vendorKeys.profile(),
    queryFn: async () => {
      const response = await getVendorProfile();
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch seller profiles");
      }
      return response;
    },
    select: (data) => data.data,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 100,
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });
};

export const useCreateVendorProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<IVendorProfile>, Error, IVendorProfile>({
    mutationFn: createVendorProfile,
    onSuccess: (response) => {
      console.log("Vendor profile created successfully:", response.data);
      queryClient.invalidateQueries({ queryKey: vendorKeys.profile() });
    },
    onError: (error) => {
      console.log("Error in creating the venodr profile", error);
    },
  });
};

export const useUpdateVendorProfile = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<IVendorProfile>, Error, IVendorProfile>({
    mutationFn: updateVendorProfile,
    onSuccess: (response) => {
      console.log("Vendor profile updated successfully!", response.data);
      queryClient.invalidateQueries({ queryKey: vendorKeys.profile() });
    },
    onError: (error) => {
      console.error("Error updating seller profile:", error);
    },
  });
};
