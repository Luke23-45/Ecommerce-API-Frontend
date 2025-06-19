import api from "@/api";
import {
  // Tax Rate CRUD
  type ITaxRateCreatePayload,
  type ITaxRateUpdatePayload,
  type ITaxRateResponse,
  type ICalculateTaxesPayloadFrontend,
  type ITaxCalculationResultFrontend,
  type ApiResponse,
  type IPaginatedData,
} from "@/types/tax.types";

const taxApiEndpoints = {
  CREATE_TAX_RATE: "/tax",
  GET_ALL_TAX_RATES: "/tax",
  GET_TAX_RATE_BY_ID: (taxRateId: string) => `/tax/${taxRateId}`,
  UPDATE_TAX_RATE: (taxRateId: string) => `/tax/${taxRateId}`,
  DELETE_TAX_RATE: (taxRateId: string) => `/tax/${taxRateId}`,
  CALCULATE_TAXES: "/tax/calculate",
};

export async function calculateTaxesApi(
  payload: ICalculateTaxesPayloadFrontend
): Promise<ApiResponse<ITaxCalculationResultFrontend>> {
  try {
    console.log("API CALL: calculateTaxesApi with payload:", payload);
    const response = await api.post<ApiResponse<ITaxCalculationResultFrontend>>(
      taxApiEndpoints.CALCULATE_TAXES,
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error calculating taxes:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

// --- Admin Tax Rate CRUD API Functions ---

export async function createTaxRateApi(
  payload: ITaxRateCreatePayload
): Promise<ApiResponse<ITaxRateResponse>> {
  try {
    console.log("API CALL: createTaxRateApi with payload:", payload);
    const response = await api.post<ApiResponse<ITaxRateResponse>>(
      taxApiEndpoints.CREATE_TAX_RATE,
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error creating tax rate:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

// Params for fetching all/paginated tax rates
// Your current backend controller getAllTaxRates doesn't take query params,
// but this is structured for future pagination or filtering.
export type TaxRateApiListParams = {
  page?: number;
  limit?: number;
  filter?: string;
  sort?: string;
  projection?: string;
  lean?: boolean;
  // Add specific filter fields if your API supports them, e.g.:
  // country?: string;
  // isActive?: boolean;
};

export async function getAllTaxRatesApi(
  params?: TaxRateApiListParams // Optional params for future pagination/filtering
): Promise<ApiResponse<ITaxRateResponse[]>> {
  // Currently returns array directly
  try {
    console.log("API CALL: getAllTaxRatesApi with params:", params);
    // If backend adds pagination, change expected response type to IPaginatedData<ITaxRateResponse>
    const response = await api.get<ApiResponse<ITaxRateResponse[]>>(
      taxApiEndpoints.GET_ALL_TAX_RATES,
      { params }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching all tax rates:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}
// If you implement pagination for tax rates on the backend:
/*
export async function getPaginatedTaxRatesApi(
  params: TaxRateApiListParams // params would be required for pagination
): Promise<IPaginatedData<ITaxRateResponse>> {
  try {
    const response = await api.get<IPaginatedData<ITaxRateResponse>>(
      taxApiEndpoints.GET_ALL_TAX_RATES, // Or a different endpoint like /taxrates/paginated
      { params }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching paginated tax rates:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
}
*/

export async function getTaxRateByIdApi(
  taxRateId: string,
  projection?: string,
  lean?: boolean
): Promise<ApiResponse<ITaxRateResponse>> {
  try {
    const queryParams: { fields?: string; lean?: boolean } = {};
    if (projection) queryParams.fields = projection;
    if (lean !== undefined) queryParams.lean = lean;

    console.log(
      `API CALL: getTaxRateByIdApi for ID ${taxRateId} with params:`,
      queryParams
    );
    const response = await api.get<ApiResponse<ITaxRateResponse>>(
      taxApiEndpoints.GET_TAX_RATE_BY_ID(taxRateId),
      { params: Object.keys(queryParams).length > 0 ? queryParams : undefined }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Error fetching tax rate by ID ${taxRateId}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

export async function updateTaxRateApi(
  taxRateId: string,
  payload: ITaxRateUpdatePayload
): Promise<ApiResponse<ITaxRateResponse>> {
  try {
    console.log(
      `API CALL: updateTaxRateApi for ID ${taxRateId} with payload:`,
      payload
    );
    const response = await api.put<ApiResponse<ITaxRateResponse>>(
      taxApiEndpoints.UPDATE_TAX_RATE(taxRateId),
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Error updating tax rate ${taxRateId}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

export async function deleteTaxRateApi(
  taxRateId: string
): Promise<ApiResponse<null>> {
  try {
    console.log(`API CALL: deleteTaxRateApi for ID ${taxRateId}`);
    const response = await api.delete<ApiResponse<null>>(
      taxApiEndpoints.DELETE_TAX_RATE(taxRateId)
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Error deleting tax rate ${taxRateId}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}
