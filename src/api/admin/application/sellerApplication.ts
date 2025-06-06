import api from "@/api";
import {
  type IIndividualSellerProfile,
  type IIndividualSellerProfileUpdate,
  type IPaginatedIndividualSellerApplicationsResult,
  type ISellerStatus,
} from "@/types/seller";
import { type ApiResponse } from "@/types/auth";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

const applicationApiEndpoints = {
  DELETE_APPLICATION: (id: string) =>
    `/admin/deleteindividualsellerstatus/${id}`,
  UPDATE_APPLICATION: (id: string) =>
    `admin/updateindividualsellerstatus/${id}`,
  GET_APPLICATION: (id: string) => `/admin/getindividualsellerById/${id}`,
  FILTER_APPLICATION: `/admin/filtersellerapplication`,
  UPDATE_SELLER_APPLICATION_STATUS: (id: string) =>
    `/admin/updateindividualsellerstatus/${id}`,
};

export async function getIndividualSellerApplication(
  id: string
): Promise<ApiResponse<IIndividualSellerProfile>> {
  try {
    const response = await api.get<ApiResponse<IIndividualSellerProfile>>(
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
export async function filterIndividualSellerApplication(
  allParams: Record<string, string | number | boolean | undefined>
): Promise<ApiResponse<IPaginatedIndividualSellerApplicationsResult>> {
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
      "API Call: filterIndividualSellerApplication with params:",
      definedParams
    );

    const response = await api.get<
      ApiResponse<IPaginatedIndividualSellerApplicationsResult>
    >(applicationApiEndpoints.FILTER_APPLICATION, {
      params: definedParams,
    });
    console.log("API Call: Raw response from server:", response);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching individual seller applications:",
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

// API function to update the status
export async function updateIndividualSellerApplicationStatusById(
  applicationId: string,
  payload: UpdateStatusPayload
): Promise<ApiResponse<IIndividualSellerProfile>> {
  try {
    console.log(
      `API Call: Updating status for application ${applicationId} with payload:`,
      payload
    );
    const response = await api.put<ApiResponse<IIndividualSellerProfile>>(
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
