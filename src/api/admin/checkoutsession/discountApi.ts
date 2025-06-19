import api from "@/api";
import {
  type IDiscountCreatePayload,
  type IDiscountUpdatePayload,
  type IDiscountResponse,
  type IDiscountCalculationResult,
  type IDiscountListApiParams,
} from "@/types/discount.interfaces";
import { type ApiResponse } from "@/types/attribute";
import { type IPaginatedData } from "@/types/attribute";

const discountApiEndpoints = {
  BASE: "/discounts",
  APPLY_DISCOUNT: "/discount/applydiscount",

  CREATE_DISCOUNT: "/discount",
  GET_PAGINATED_DISCOUNTS: "/discount",
  GET_DISCOUNT_BY_ID: (discountId: string) => `/discount/${discountId}`,

  UPDATE_DISCOUNT: (discountId: string) => `/discount/${discountId}`,
  DELETE_DISCOUNT: (discountId: string) => `/discount/${discountId}`,
};

/**
 * Creates a new discount.
 */
export async function createDiscountApi(
  payload: IDiscountCreatePayload
): Promise<ApiResponse<IDiscountResponse>> {
  try {
    console.log("API CALL: createDiscountApi with payload:", payload);
    const response = await api.post<ApiResponse<IDiscountResponse>>(
      discountApiEndpoints.CREATE_DISCOUNT,
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error creating discount (API Layer):",
      error.response?.data || error.message
    );
    throw (
      error.response?.data ||
      new Error(error.message || "Discount creation failed.")
    );
  }
}

/**
 * Fetches paginated/filtered/sorted discounts.
 * `params.filter` and `params.sort` are expected to be JSON strings if complex.
 */
export async function getPaginatedDiscountsApi(
  params?: IDiscountListApiParams
): Promise<IPaginatedData<IDiscountResponse>> {
  try {
    console.log("API CALL: getPaginatedDiscountsApi with params:", params);
    const response = await api.get<IPaginatedData<IDiscountResponse>>(
      discountApiEndpoints.GET_PAGINATED_DISCOUNTS,
      { params }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching paginated discounts (API Layer):",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

/**
 * Fetches a single discount by its ID.
 */
export async function getDiscountByIdApi(
  discountId: string,
  projection?: string,
  lean?: boolean
): Promise<ApiResponse<IDiscountResponse>> {
  try {
    const queryParams: { fields?: string; lean?: boolean } = {};
    if (projection) queryParams.fields = projection;
    if (lean !== undefined) queryParams.lean = lean;

    console.log(
      `API CALL: getDiscountByIdApi for ID ${discountId} with params:`,
      queryParams
    );
    const response = await api.get<ApiResponse<IDiscountResponse>>(
      discountApiEndpoints.GET_DISCOUNT_BY_ID(discountId),
      { params: Object.keys(queryParams).length > 0 ? queryParams : undefined }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Error fetching discount by ID ${discountId} (API Layer):`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

/**
 * Fetches a single discount by its CODE (if you add this admin endpoint).
 * The applyDiscount endpoint is different as it performs validation and calculation.
 * This would be for an admin to look up a discount definition by code.
 */
export async function getDiscountByCodeAdminApi(
  code: string,
  projection?: string,
  lean?: boolean
): Promise<ApiResponse<IDiscountResponse>> {
  try {
    const endpoint = `/discounts/code/${code}`;
    const queryParams: { fields?: string; lean?: boolean } = {};
    if (projection) queryParams.fields = projection;
    if (lean !== undefined) queryParams.lean = lean;

    console.log(
      `API CALL: getDiscountByCodeAdminApi for code ${code} with params:`,
      queryParams
    );
    const response = await api.get<ApiResponse<IDiscountResponse>>(endpoint, {
      params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
    });
    return response.data;
  } catch (error: any) {
    console.error(
      `Error fetching discount by code ${code} (API Layer):`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

/**
 * Updates an existing discount.
 */
export async function updateDiscountApi(
  discountId: string,
  payload: IDiscountUpdatePayload
): Promise<ApiResponse<IDiscountResponse>> {
  try {
    console.log(
      `API CALL: updateDiscountApi for ID ${discountId} with payload:`,
      payload
    );
    const response = await api.put<ApiResponse<IDiscountResponse>>(
      discountApiEndpoints.UPDATE_DISCOUNT(discountId),
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Error updating discount ${discountId} (API Layer):`,
      error.response?.data || error.message
    );
    throw (
      error.response?.data ||
      new Error(error.message || "Discount update failed.")
    );
  }
}

/**
 * Deletes a discount.
 */
export async function deleteDiscountApi(
  discountId: string
): Promise<ApiResponse<null>> {
  try {
    console.log(`API CALL: deleteDiscountApi for ID ${discountId}`);
    const response = await api.delete<ApiResponse<null>>(
      discountApiEndpoints.DELETE_DISCOUNT(discountId)
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Error deleting discount ${discountId} (API Layer):`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

interface ApplyDiscountPayload {
  discountCode: string;
  cartId?: string;
}

export async function applyDiscountCodeApi(
  payload: ApplyDiscountPayload
): Promise<ApiResponse<IDiscountCalculationResult>> {
  try {
    console.log("API CALL: applyDiscountCodeApi with payload:", payload);
    const response = await api.post<ApiResponse<IDiscountCalculationResult>>(
      discountApiEndpoints.APPLY_DISCOUNT,
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error applying discount code (API Layer):",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}
