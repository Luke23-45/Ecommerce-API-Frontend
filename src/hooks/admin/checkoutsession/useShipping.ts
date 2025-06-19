import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";

import {
  calculateShippingRates,
  createShippingZone,
  getAllShippingZones,
  getShippingZoneById,
  updateShippingZone,
  deleteShippingZone,
  createShippingRate,
  getAllShippingRates,
  getShippingRateById,
  getShippingRatesByZoneId,
  updateShippingRate,
  deleteShippingRate,
} from "@/api/admin/checkoutsession/shippingApi";

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
import type { ApiResponse } from "@/types/tax.types";

export const shippingKeys = {
  all: ["shipping"] as const,
  zones: () => [...shippingKeys.all, "zones"] as const,
  zoneList: (params?: object) =>
    [...shippingKeys.zones(), "list", params || {}] as const,
  zoneDetail: (id?: string) =>
    [...shippingKeys.zones(), "detail", id || "undefinedZoneId"] as const,
  rates: () => [...shippingKeys.all, "rates"] as const,
  rateList: (params?: object) =>
    [...shippingKeys.rates(), "list", params || {}] as const,
  rateDetail: (id?: string) =>
    [...shippingKeys.rates(), "detail", id || "undefinedRateId"] as const,
  ratesByZone: (zoneId?: string, params?: object) =>
    [
      ...shippingKeys.rates(),
      "byZone",
      zoneId || "undefinedZoneId",
      params || {},
    ] as const,
  calculatedRates: (payload?: ICalculateShippingRatesPayload) =>
    [...shippingKeys.all, "calculated", payload || {}] as const,
};


type AllZonesQueryKey = ReturnType<typeof shippingKeys.zoneList>;
type ZoneByIdQueryKey = ReturnType<typeof shippingKeys.zoneDetail>;
type AllRatesQueryKey = ReturnType<typeof shippingKeys.rateList>;
type RateByIdQueryKey = ReturnType<typeof shippingKeys.rateDetail>;
type RatesByZoneQueryKey = ReturnType<typeof shippingKeys.ratesByZone>;
type CalculatedRatesQueryKey = ReturnType<typeof shippingKeys.calculatedRates>;



/**
 * Hook to calculate shipping rates. Often used as a query that can be enabled/disabled.
 * Could also be a mutation if it's a one-off action.
 * For now, treating as a query that depends on payload.
 */
export const useCalculateShippingRates = (
  payload: ICalculateShippingRatesPayload | undefined, // Payload can be undefined to disable query
  options?: UseQueryOptions<
    ApiResponse<IShippingOptionFE[]>,
    Error,
    IShippingOptionFE[],
    CalculatedRatesQueryKey
  >
) => {
  return useQuery<
    ApiResponse<IShippingOptionFE[]>,
    Error,
    IShippingOptionFE[],
    CalculatedRatesQueryKey
  >({
    queryKey: shippingKeys.calculatedRates(payload),
    queryFn: () => calculateShippingRates(payload!), 
    enabled: !!payload && options?.enabled !== false,
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000, 
    ...options,
  });
};


export const useCreateShippingZone = (
  options?: UseMutationOptions<
    ApiResponse<IShippingZoneResponse>,
    Error,
    IShippingZoneCreatePayload
  >
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<IShippingZoneResponse>,
    Error,
    IShippingZoneCreatePayload
  >({
    mutationFn: createShippingZone,
    onSuccess: (response) => {
      console.log(
        "Shipping zone created successfully via hook:",
        response.data
      );
      queryClient.invalidateQueries({ queryKey: shippingKeys.zoneList() }); // Invalidate list of zones
      if (response.data?.id) {
        queryClient.setQueryData(
          shippingKeys.zoneDetail(response.data.id),
          response
        );
      }
    },
    onError: (error) => {
      console.error("Error creating shipping zone via hook:", error);
    },
    ...options,
  });
};

export const useGetAllShippingZones = (
  // params?: { isActive?: boolean; sort?: string }, 
  options?: UseQueryOptions<
    ApiResponse<IShippingZoneResponse[]>,
    Error,
    IShippingZoneResponse[],
    AllZonesQueryKey
  >
) => {
  return useQuery<
    ApiResponse<IShippingZoneResponse[]>,
    Error,
    IShippingZoneResponse[],
    AllZonesQueryKey
  >({
    queryKey: shippingKeys.zoneList(/*params*/), 
    queryFn: () => getAllShippingZones(/*params*/),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useGetShippingZoneById = (
  zoneId: string | undefined,
  options?: UseQueryOptions<
    ApiResponse<IShippingZoneResponse>,
    Error,
    IShippingZoneResponse,
    ZoneByIdQueryKey
  >
) => {

  console.log("Gettin errors. ")
  return useQuery<
    ApiResponse<IShippingZoneResponse>,
    Error,
    IShippingZoneResponse,
    ZoneByIdQueryKey
  >({
    queryKey: shippingKeys.zoneDetail(zoneId),
    queryFn: () => getShippingZoneById(zoneId!),
    enabled: !!zoneId && options?.enabled !== false,
    select: (response) => response.data,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

export const useUpdateShippingZone = (
  options?: UseMutationOptions<
    ApiResponse<IShippingZoneResponse>,
    Error,
    { zoneId: string; payload: IShippingZoneUpdatePayload }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<IShippingZoneResponse>,
    Error,
    { zoneId: string; payload: IShippingZoneUpdatePayload }
  >({
    mutationFn: ({ zoneId, payload }) => updateShippingZone(zoneId, payload),
    onSuccess: (response, variables) => {
      console.log(
        `Shipping zone ${variables.zoneId} updated successfully via hook:`,
        response.data
      );
      queryClient.invalidateQueries({ queryKey: shippingKeys.zoneList() });
      queryClient.invalidateQueries({
        queryKey: shippingKeys.zoneDetail(variables.zoneId),
      });
    },
    onError: (error, variables) => {
      console.error(
        `Error updating shipping zone ${variables.zoneId} via hook:`,
        error
      );
    },
    ...options,
  });
};

export const useDeleteShippingZone = (
  options?: UseMutationOptions<ApiResponse<null>, Error, string> // Variable is zoneId
) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<null>, Error, string>({
    mutationFn: deleteShippingZone,
    onSuccess: (_data, zoneId) => {
      console.log(`Shipping zone ${zoneId} deleted successfully via hook.`);
      queryClient.invalidateQueries({ queryKey: shippingKeys.zones() }); // Invalidate all zone queries
      queryClient.removeQueries({ queryKey: shippingKeys.zoneDetail(zoneId) });
      // IMPORTANT: Also invalidate any rates associated with this zone if they are cached separately
      queryClient.invalidateQueries({
        queryKey: shippingKeys.ratesByZone(zoneId),
      });
      queryClient.invalidateQueries({ queryKey: shippingKeys.rateList() }); // And the general rate list
    },
    onError: (error, zoneId) => {
      console.error(`Error deleting shipping zone ${zoneId} via hook:`, error);
    },
    ...options,
  });
};


export const useCreateShippingRate = (
  options?: UseMutationOptions<
    ApiResponse<IShippingRateResponse>,
    Error,
    IShippingRateCreatePayload
  >
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<IShippingRateResponse>,
    Error,
    IShippingRateCreatePayload
  >({
    mutationFn: createShippingRate,
    onSuccess: (response) => {
      console.log(
        "Shipping rate created successfully via hook:",
        response.data
      );
      queryClient.invalidateQueries({ queryKey: shippingKeys.rateList() });
      if (response.data?.zoneId) {
        queryClient.invalidateQueries({
          queryKey: shippingKeys.ratesByZone(response.data.zoneId as string),
        }); 
      }
      if (response.data?.id) {
        queryClient.setQueryData(
          shippingKeys.rateDetail(response.data.id),
          response
        );
      }
    },
    onError: (error) => {
      console.error("Error creating shipping rate via hook:", error);
    },
    ...options,
  });
};

export const useGetAllShippingRates = (
  params?: { populateZone?: boolean },
  options?: UseQueryOptions<
    ApiResponse<IShippingRateResponse[]>,
    Error,
    IShippingRateResponse[],
    AllRatesQueryKey
  >
) => {
  return useQuery<
    ApiResponse<IShippingRateResponse[]>,
    Error,
    IShippingRateResponse[],
    AllRatesQueryKey
  >({
    queryKey: shippingKeys.rateList(params),
    queryFn: () => getAllShippingRates(params),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useGetShippingRateById = (
  rateId: string | undefined,
  params?: { populateZone?: boolean },
  options?: UseQueryOptions<
    ApiResponse<IShippingRateResponse>,
    Error,
    IShippingRateResponse,
    RateByIdQueryKey
  >
) => {
  return useQuery<
    ApiResponse<IShippingRateResponse>,
    Error,
    IShippingRateResponse,
    RateByIdQueryKey
  >({
    queryKey: shippingKeys.rateDetail(rateId),
    queryFn: () => getShippingRateById(rateId!, params),
    enabled: !!rateId && options?.enabled !== false,
    select: (response) => response.data,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

export const useGetShippingRatesByZoneId = (
  zoneId: string | undefined,
  // params?: { /* other filters for rates within a zone */ },
  options?: UseQueryOptions<
    ApiResponse<IShippingRateResponse[]>,
    Error,
    IShippingRateResponse[],
    RatesByZoneQueryKey
  >
) => {
  return useQuery<
    ApiResponse<IShippingRateResponse[]>,
    Error,
    IShippingRateResponse[],
    RatesByZoneQueryKey
  >({
    queryKey: shippingKeys.ratesByZone(zoneId /*, params*/),
    queryFn: () => getShippingRatesByZoneId(zoneId! /*, params*/),
    enabled: !!zoneId && options?.enabled !== false,
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useUpdateShippingRate = (
  options?: UseMutationOptions<
    ApiResponse<IShippingRateResponse>,
    Error,
    { rateId: string; payload: IShippingRateUpdatePayload }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<IShippingRateResponse>,
    Error,
    { rateId: string; payload: IShippingRateUpdatePayload }
  >({
    mutationFn: ({ rateId, payload }) => updateShippingRate(rateId, payload),
    onSuccess: (response, variables) => {
      const updatedRate = response.data;
      console.log(
        `Shipping rate ${variables.rateId} updated successfully via hook:`,
        updatedRate
      );
      queryClient.invalidateQueries({ queryKey: shippingKeys.rateList() });
      queryClient.invalidateQueries({
        queryKey: shippingKeys.rateDetail(variables.rateId),
      });
      if (updatedRate?.zoneId) {
        queryClient.invalidateQueries({
          queryKey: shippingKeys.ratesByZone(updatedRate.zoneId as string),
        });
      }
    },
    onError: (error, variables) => {
      console.error(
        `Error updating shipping rate ${variables.rateId} via hook:`,
        error
      );
    },
    ...options,
  });
};

export const useDeleteShippingRate = (
  options?: UseMutationOptions<ApiResponse<null>, Error, string> // Variable is rateId
) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<null>, Error, string>({
    mutationFn: deleteShippingRate,
    onSuccess: (_data, rateId) => {
      console.log(`Shipping rate ${rateId} deleted successfully via hook.`);
      queryClient.invalidateQueries({ queryKey: shippingKeys.rates() }); // Invalidate all rate queries
      queryClient.removeQueries({ queryKey: shippingKeys.rateDetail(rateId) });
      // Potentially find the zoneId of the deleted rate (if passed in context or fetched before delete)
      // and invalidate queryClient.invalidateQueries({ queryKey: shippingKeys.ratesByZone(zoneId) });
    },
    onError: (error, rateId) => {
      console.error(`Error deleting shipping rate ${rateId} via hook:`, error);
    },
    ...options,
  });
};
