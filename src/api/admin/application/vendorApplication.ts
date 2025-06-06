import api from "@/api";
import {
  type IIndividualSellerProfile,
  type IIndividualSellerProfileUpdate,
  type IPaginatedIndividualSellerApplicationsResult,
  type ISellerStatus,
} from "@/types/seller";
import { type ApiResponse } from "@/types/auth";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type {
  IPaginatedVendorApplicationsResult,
  IVendorProfile,
} from "@/types/vendor";

const applicationApiEndpoints = {
  DELETE_APPLICATION: (id: string) => `/admin/deletevendorstatus/${id}`,
  UPDATE_APPLICATION: (id: string) => `admin/updatevendorstatus/${id}`,
  GET_APPLICATION: (id: string) => `/admin/getVendorById/${id}`,
  FILTER_APPLICATION: `/admin/filtervendorapplication`,
  UPDATE_SELLER_APPLICATION_STATUS: (id: string) =>
    `/admin/updatevendorstatus/${id}`,
};

export async function getVendorApplication(
  id: string
): Promise<ApiResponse<IVendorProfile>> {
  try {
    const response = await api.get<ApiResponse<IVendorProfile>>(
      applicationApiEndpoints.GET_APPLICATION(id)
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching individual seller Application:",
      error.response?.data || error.message
    );
    throw error;
  }
}
export async function filterVendorApplication(
  allParams: Record<string, string | number | boolean | undefined>
): Promise<ApiResponse<IPaginatedVendorApplicationsResult>> {
  try {
    const definedParams: Record<string, string | number | boolean> = {};
    for (const key in allParams) {
      if (
        Object.prototype.hasOwnProperty.call(allParams, key) &&
        allParams[key] !== undefined
      ) {
        definedParams[key] = allParams[key] as string | number | boolean;
      }
    }

    console.log(
      "API Call: filterVendorApplication with params:",
      definedParams
    );

    const response = await api.get<
      ApiResponse<IPaginatedVendorApplicationsResult>
    >(applicationApiEndpoints.FILTER_APPLICATION, {
      params: definedParams,
    });
    console.log("API Call: Raw response from server:", response);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching vendor applications:",
      error.response?.data || error.message
    );

    throw (
      error.response?.data || new Error(error.message || "API request failed")
    );
  }
}

interface UpdateStatusPayload {
  status: ISellerStatus;
  rejectionReason?: string;
}

export async function updateVendorApplicationStatusById(
  applicationId: string,
  payload: UpdateStatusPayload
): Promise<ApiResponse<IVendorProfile>> {
  try {
    console.log(
      `API Call: Updating status for application ${applicationId} with payload:`,
      payload
    );
    const response = await api.put<ApiResponse<IVendorProfile>>(
      applicationApiEndpoints.UPDATE_SELLER_APPLICATION_STATUS(applicationId),
      payload
    );
    console.log("API Call: Status update response from server:", response);
    return response.data;
  } catch (error: any) {
    console.error(
      `Error updating status for application ${applicationId}:`,
      error.response?.data || error.message
    );
    throw (
      error.response?.data ||
      new Error(error.message || "API request to update status failed")
    );
  }
}
