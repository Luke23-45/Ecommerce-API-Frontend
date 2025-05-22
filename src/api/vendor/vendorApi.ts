import api from "..";
import {
  type IVendorProfile,
  type updateVendorProfileUpdateFields,
} from "@/types/vendor";
import { type ApiResponse } from "@/types/auth";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

const vendorApiEndpoints = {
  CREATE_PROFILE: "/vendor/create",
  GET_PROFILE: "/vendor/profile",
  UPDATE_PROFILE: "/vendor/update",
};

export async function createVendorProfile(
  payload: IVendorProfile
): Promise<ApiResponse<IVendorProfile>> {
  try {
    const response = await api.post<ApiResponse<IVendorProfile>>(
      vendorApiEndpoints.CREATE_PROFILE,
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

export async function getVendorProfile(): Promise<ApiResponse<IVendorProfile>> {
  try {
    const response = await api.get<ApiResponse<IVendorProfile>>(
      vendorApiEndpoints.GET_PROFILE
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error in getting the vendor profile:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function updateVendorProfile(
  payload: updateVendorProfileUpdateFields
): Promise<ApiResponse<IVendorProfile>> {
  try {
    const response = await api.put<ApiResponse<IVendorProfile>>(
      vendorApiEndpoints.UPDATE_PROFILE,
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
