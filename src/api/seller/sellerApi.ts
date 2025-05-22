import api from "..";
import { type IIndividualSellerProfile, type IIndividualSellerProfileUpdate } from "@/types/seller";
import { type ApiResponse } from "@/types/auth";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

const individualSellerApiEndpoints = {
  CREATE_PROFILE: "/seller/create",
  GET_PROFILE: "/seller/profile",
  UPDATE_PROFILE: "/seller/update",
};

export async function createIndividualSellerProfile(
  payload: IIndividualSellerProfile
): Promise<ApiResponse<IIndividualSellerProfile>> {
  try {
    const response = await api.post<ApiResponse<IIndividualSellerProfile>>(
      individualSellerApiEndpoints.CREATE_PROFILE,
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error creating individual seller profile:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function getIndividualSellerProfile(): Promise<
  ApiResponse<IIndividualSellerProfile>
> {
  try {
    const response = await api.get<ApiResponse<IIndividualSellerProfile>>(
      individualSellerApiEndpoints.GET_PROFILE
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching individual seller profile:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function updateIndividualSellerProfile(
  payload: Partial<IIndividualSellerProfile>
): Promise<ApiResponse<IIndividualSellerProfile>> {
  try {
    const response = await api.put<ApiResponse<IIndividualSellerProfile>>(
      individualSellerApiEndpoints.UPDATE_PROFILE,
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating individual seller profile:",
      error.response?.data || error.message
    );
    throw error;
  }
}


export function useEditableSellerProfile(): UseQueryResult<
  IIndividualSellerProfileUpdate,
  Error
> {
  return useQuery<
    ApiResponse<IIndividualSellerProfile>,   // ← matches getIndividualSellerProfile()
    Error,
    IIndividualSellerProfileUpdate          // ← what we expose downstream
  >({
    queryKey: ["sellerProfile", "editable"],
    queryFn: getIndividualSellerProfile,    // no more overload errors!
    staleTime: 5 * 60 * 1000,
    select: (res) => {
      const d = res.data;
      return {
        sellerName: d.sellerName,
        phoneNumber: d.phoneNumber,
        address: {
          street: d.address.street,
          city: d.address.city,
          state: d.address.state,
          zip: d.address.zip,
          country: d.address.country,
        },
        briefDescription: d.briefDescription,
        payoutMethodPreference: d.payoutMethodPreference,
        bankAccountHolderName: d.bankAccountHolderName,
        bankAccountNumber: d.bankAccountNumber,
        bankRoutingNumber: d.bankRoutingNumber,
        primaryProductCategories: d.primaryProductCategories,
        estimatedMonthlySales: d.estimatedMonthlySales,
        yearsOfSellingExperience: d.yearsOfSellingExperience,
        otherPlatformsSoldOn: d.otherPlatformsSoldOn,
      };
    }
  });
}