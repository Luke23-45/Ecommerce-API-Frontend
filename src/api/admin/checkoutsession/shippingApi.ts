import api from "@/api";
import {
  type IShippingZoneCreatePayload,
  type IShippingZoneUpdatePayload,
  type IShippingZoneResponse,
  type IShippingRateCreatePayload,
  type IShippingRateUpdatePayload,
  type IShippingRateResponse,
  type ICalculateShippingRatesPayload,
  type IShippingOptionFE,
} from "@/types/shipping.types"; 
import {type ApiResponse } from "@/types/tax.types";

const shippingApiEndpoints = {
  // Public/Checkout
  CALCULATE_RATES: "/shipping/calculaterates", // POST

  // Admin Shipping Zones
  CREATE_ZONE: "/shipping/admin/zones",        // POST
  GET_ALL_ZONES: "/shipping/admin/zones",        // GET
  GET_ZONE_BY_ID: (zoneId: string) => `/shipping/admin/zones/${zoneId}`, // GET
  UPDATE_ZONE: (zoneId: string) => `/shipping/admin/zones/${zoneId}`, // PUT
  DELETE_ZONE: (zoneId: string) => `/shipping/admin/zones/${zoneId}`, // DELETE

  // Admin Shipping Rates
  CREATE_RATE: "/shipping/admin/rates",        // POST
  GET_ALL_RATES: "/shipping/admin/rates",        // GET
  GET_RATE_BY_ID: (rateId: string) => `/shipping/admin/rates/${rateId}`, // GET
  UPDATE_RATE: (rateId: string) => `/shipping/admin/rates/${rateId}`, // PUT
  DELETE_RATE: (rateId: string) => `/shipping/admin/rates/${rateId}`, // DELETE
  GET_RATES_FOR_ZONE: (zoneId: string) => `/shipping/admin/getzonesrates/${zoneId}`, // GET
};
///api/shipping/admin/getzonesrates

// === Public/Checkout API Functions ===

/**
 * Calculates available shipping rates for a given cart/address.
 */
export async function calculateShippingRates(
  payload: ICalculateShippingRatesPayload
): Promise<ApiResponse<IShippingOptionFE[]>> { // Backend returns array of IShippingOption
  try {
    console.log("API CALL: calculateShippingRates with payload:", payload);
    const response = await api.post<ApiResponse<IShippingOptionFE[]>>(
      shippingApiEndpoints.CALCULATE_RATES,
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error("Error calculating shipping rates:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
}


// === Admin Shipping Zone API Functions ===

/**
 * Creates a new shipping zone.
 */
export async function createShippingZone(
  payload: IShippingZoneCreatePayload
): Promise<ApiResponse<IShippingZoneResponse>> {
  try {
    console.log("API CALL: createShippingZone with payload:", payload);
    const response = await api.post<ApiResponse<IShippingZoneResponse>>(
      shippingApiEndpoints.CREATE_ZONE,
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error("Error creating shipping zone:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
}

/**
 * Fetches all shipping zones.
 * Add params for pagination/filtering if backend supports it for this endpoint.
 */
export async function getAllShippingZones(
  // params?: { isActive?: boolean; sort?: string; /* ...other filters */ }
): Promise<ApiResponse<IShippingZoneResponse[]>> {
  try {
    console.log("API CALL: getAllShippingZones"); // Add params to log if used
    const response = await api.get<ApiResponse<IShippingZoneResponse[]>>(
      shippingApiEndpoints.GET_ALL_ZONES
      // { params } // Uncomment if passing params
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching all shipping zones:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
}

/**
 * Fetches a specific shipping zone by its ID.
 */
export async function getShippingZoneById(
  zoneId: string
): Promise<ApiResponse<IShippingZoneResponse>> {
  try {
    console.log(`API CALL: getShippingZoneById for ID: ${zoneId}`);
    const response = await api.get<ApiResponse<IShippingZoneResponse>>(
      shippingApiEndpoints.GET_ZONE_BY_ID(zoneId)
    );
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching shipping zone ID ${zoneId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
}

/**
 * Updates an existing shipping zone.
 */
export async function updateShippingZone(
  zoneId: string,
  payload: IShippingZoneUpdatePayload
): Promise<ApiResponse<IShippingZoneResponse>> {
  try {
    console.log(`API CALL: updateShippingZone for ID ${zoneId} with payload:`, payload);
    const response = await api.put<ApiResponse<IShippingZoneResponse>>(
      shippingApiEndpoints.UPDATE_ZONE(zoneId),
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error(`Error updating shipping zone ${zoneId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
}

/**
 * Deletes a shipping zone by its ID.
 */
export async function deleteShippingZone(
  zoneId: string
): Promise<ApiResponse<null>> { 
  try {
    console.log(`API CALL: deleteShippingZone for ID: ${zoneId}`);
    const response = await api.delete<ApiResponse<null>>(
      shippingApiEndpoints.DELETE_ZONE(zoneId)
    );
    return response.data;
  } catch (error: any) {
    console.error(`Error deleting shipping zone ${zoneId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
}



/**
 * Creates a new shipping rate.
 */
export async function createShippingRate(
  payload: IShippingRateCreatePayload
): Promise<ApiResponse<IShippingRateResponse>> {
  try {
    console.log("API CALL: createShippingRate with payload:", payload);
    const response = await api.post<ApiResponse<IShippingRateResponse>>(
      shippingApiEndpoints.CREATE_RATE,
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error("Error creating shipping rate:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
}

/**
 * Fetches all shipping rates.
 * Backend controller getAllRates accepts 'populateZone' query param.
 */
export async function getAllShippingRates(
  params?: { populateZone?: boolean; /* ...other filters/sort... */ }
): Promise<ApiResponse<IShippingRateResponse[]>> {
  try {
    console.log("API CALL: getAllShippingRates with params:", params);
    const response = await api.get<ApiResponse<IShippingRateResponse[]>>(
      shippingApiEndpoints.GET_ALL_RATES,
      { params }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching all shipping rates:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
}

/**
 * Fetches a specific shipping rate by its ID.
 * Backend controller getRateById accepts 'populateZone' query param.
 */
export async function getShippingRateById(
  rateId: string,
  params?: { populateZone?: boolean }
): Promise<ApiResponse<IShippingRateResponse>> {
  try {
    console.log(`API CALL: getShippingRateById for ID: ${rateId} with params:`, params);
    const response = await api.get<ApiResponse<IShippingRateResponse>>(
      shippingApiEndpoints.GET_RATE_BY_ID(rateId),
      { params }
    );
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching shipping rate ID ${rateId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
}

/**
 * Fetches all shipping rates for a specific zone ID.
 */
export async function getShippingRatesByZoneId(
  zoneId: string,
  // params?: { /* any other filtering/sorting for rates within a zone */ }
): Promise<ApiResponse<IShippingRateResponse[]>> {
  try {
    console.log(`API CALL: getShippingRatesByZoneId for Zone ID: ${zoneId}`);
    const response = await api.get<ApiResponse<IShippingRateResponse[]>>(
      shippingApiEndpoints.GET_RATES_FOR_ZONE(zoneId)
      // { params } 
    );
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching rates for zone ID ${zoneId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
}


/**
 * Updates an existing shipping rate.
 */
export async function updateShippingRate(
  rateId: string,
  payload: IShippingRateUpdatePayload
): Promise<ApiResponse<IShippingRateResponse>> {
  try {
    console.log(`API CALL: updateShippingRate for ID ${rateId} with payload:`, payload);
    const response = await api.put<ApiResponse<IShippingRateResponse>>(
      shippingApiEndpoints.UPDATE_RATE(rateId),
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error(`Error updating shipping rate ${rateId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
}

/**
 * Deletes a shipping rate by its ID.
 */


export async function deleteShippingRate(
  rateId: string
): Promise<ApiResponse<null>> {
  try {
    console.log(`API CALL: deleteShippingRate for ID: ${rateId}`);
    const response = await api.delete<ApiResponse<null>>(
      shippingApiEndpoints.DELETE_RATE(rateId)
    );
    return response.data;
  } catch (error: any) {
    console.error(`Error deleting shipping rate ${rateId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
}