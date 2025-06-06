import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
  type QueryKey,
} from "@tanstack/react-query";
import { useSelector } from "react-redux"; 

import {
  createAttribute,
  getPaginatedAttributes,
  getAttributeById,
  getAttributeBySlug,
  updateAttribute,
  deleteAttribute,
  createAttributeOption,
  getOptionsForAttribute,
  getPaginatedAttributeOptions,
  getAttributeOptionById,
  updateAttributeOption,
  deleteAttributeOption,
} from "@/api/admin/product/attribute/attributeApi"; 

import {
  type IAttributeCreatePayload,
  type IAttributeUpdatePayload,
  type IAttributeResponse,
  type IAttributeOptionCreatePayload,
  type IAttributeOptionUpdatePayload,
  type IAttributeOptionResponse,
  type ApiResponse,
  type IPaginatedData,
} from "@/types/attribute"; 
import { type RootState } from "@/store";

export const attributeKeys = {
  all: ["attributes"] as const,
  paginated: (params?: object) => [...attributeKeys.all, "paginated", params || {}] as const,
  detailById: (id?: string) => [...attributeKeys.all, "detail", "id", id || "undefinedId"] as const,
  detailBySlug: (slug?: string) => [...attributeKeys.all, "detail", "slug", slug || "undefinedSlug"] as const,
};

export const attributeOptionKeys = {
  all: ["attributeOptions"] as const,
  paginated: (params?: object) => [...attributeOptionKeys.all, "paginated", params || {}] as const,
  forAttribute: (attributeId?: string, params?: object) => [...attributeOptionKeys.all, "forAttribute", attributeId || "undefinedAttrId", params || {}] as const,
  detailById: (id?: string) => [...attributeOptionKeys.all, "detail", "id", id || "undefinedOptId"] as const,
};

type PaginatedAttributesQueryKey = ReturnType<typeof attributeKeys.paginated>;
type AttributeByIdQueryKey = ReturnType<typeof attributeKeys.detailById>;
type AttributeBySlugQueryKey = ReturnType<typeof attributeKeys.detailBySlug>;

type PaginatedAttributeOptionsQueryKey = ReturnType<typeof attributeOptionKeys.paginated>;
type OptionsForAttributeQueryKey = ReturnType<typeof attributeOptionKeys.forAttribute>;
type AttributeOptionByIdQueryKey = ReturnType<typeof attributeOptionKeys.detailById>;



export const useGetPaginatedAttributes = (
  params?: { page?: number; limit?: number; filter?: Record<string, any>; sort?: Record<string, 1 | -1> | string; projection?: string; lean?: boolean },
  options?: UseQueryOptions<IPaginatedData<IAttributeResponse>, Error, IPaginatedData<IAttributeResponse>, PaginatedAttributesQueryKey>
) => {
  const { isAuthenticated, loading: isAuthLoading } = useSelector((state: RootState) => state.auth);

  return useQuery<IPaginatedData<IAttributeResponse>, Error, IPaginatedData<IAttributeResponse>, PaginatedAttributesQueryKey>({
    queryKey: attributeKeys.paginated(params),
    queryFn: () => getPaginatedAttributes(params),
    enabled: isAuthenticated && !isAuthLoading && !!params, 
    staleTime: 5 * 60 * 1000, 
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useGetAttributeById = (
  attributeId: string | undefined,
  projection?: string,
  options?: UseQueryOptions<ApiResponse<IAttributeResponse>, Error, IAttributeResponse, AttributeByIdQueryKey>
) => {
    const { isAuthenticated, loading: isAuthLoading } = useSelector(
    (state: RootState) => state.auth
  );

  console.log("this is from 111111111111111")
  return useQuery<ApiResponse<IAttributeResponse>, Error, IAttributeResponse, AttributeByIdQueryKey>({
    queryKey: attributeKeys.detailById(attributeId),
      enabled: isAuthenticated && !isAuthLoading,
        queryFn: async () => {
          const response = await getAttributeById(attributeId!, projection);
          if (!response.success || !response.data) {
            throw new Error(response.message || "Failed to fetch attribute.");
          }
          return response;
        },
    select: (response) => response.data,
    staleTime: 10 * 60 * 1000, 
        refetchOnWindowFocus: false,
            retry: 1,
    ...options,
  });
};

export const useGetAttributeBySlug = (
  slug: string | undefined,
  projection?: string,
  options?: UseQueryOptions<ApiResponse<IAttributeResponse>, Error, IAttributeResponse, AttributeBySlugQueryKey>
) => {
  return useQuery<ApiResponse<IAttributeResponse>, Error, IAttributeResponse, AttributeBySlugQueryKey>({
    queryKey: attributeKeys.detailBySlug(slug),
    queryFn: () => getAttributeBySlug(slug!, projection),
    enabled: !!slug && (options?.enabled !== false),
    select: (response) => response.data,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

export const useCreateAttribute = (
  options?: UseMutationOptions<ApiResponse<IAttributeResponse>, Error, IAttributeCreatePayload>
) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<IAttributeResponse>, Error, IAttributeCreatePayload>({
    mutationFn: createAttribute,
    onSuccess: (data) => {
      console.log("Attribute created successfully via hook:", data.data);
      queryClient.invalidateQueries({ queryKey: attributeKeys.paginated() }); 
      if (data.data?.id) {
        queryClient.setQueryData(attributeKeys.detailById(data.data.id), data);
      }
    },
    onError: (error) => {
      console.error("Error creating attribute via hook:", error);
    },
    ...options,
  });
};

export const useUpdateAttribute = (
  options?: UseMutationOptions<ApiResponse<IAttributeResponse>, Error, { attributeId: string; payload: IAttributeUpdatePayload }>
) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<IAttributeResponse>, Error, { attributeId: string; payload: IAttributeUpdatePayload }>({
    mutationFn: ({ attributeId, payload }) => updateAttribute(attributeId, payload),
    onSuccess: (data, variables) => {
      console.log(`Attribute ${variables.attributeId} updated successfully via hook:`, data.data);
      queryClient.invalidateQueries({ queryKey: attributeKeys.paginated() });
      queryClient.invalidateQueries({ queryKey: attributeKeys.detailById(variables.attributeId) });
      queryClient.invalidateQueries({ queryKey: attributeKeys.detailBySlug(data.data?.slug) }); 
    },
    onError: (error, variables) => {
      console.error(`Error updating attribute ${variables.attributeId} via hook:`, error);
    },
    ...options,
  });
};

export const useDeleteAttribute = (
  options?: UseMutationOptions<ApiResponse<null>, Error, string> 
) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<null>, Error, string>({
    mutationFn: deleteAttribute,
    onSuccess: (data, attributeId) => {
      console.log(`Attribute ${attributeId} deleted successfully via hook.`);
      queryClient.invalidateQueries({ queryKey: attributeKeys.all }); 
      queryClient.removeQueries({ queryKey: attributeKeys.detailById(attributeId) });
    },
    onError: (error, attributeId) => {
      console.error(`Error deleting attribute ${attributeId} via hook:`, error);
    },
    ...options,
  });
};


// Attribute Option Hooks 

export const useCreateAttributeOption = (
  options?: UseMutationOptions<ApiResponse<IAttributeOptionResponse>, Error, IAttributeOptionCreatePayload>
) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<IAttributeOptionResponse>, Error, IAttributeOptionCreatePayload>({
    mutationFn: createAttributeOption,
    onSuccess: (data, variables) => {
      console.log("Attribute option created successfully via hook:", data.data);
      queryClient.invalidateQueries({ queryKey: attributeOptionKeys.paginated() }); 
      if (variables.attributeId) {
        queryClient.invalidateQueries({ queryKey: attributeOptionKeys.forAttribute(variables.attributeId) });
      }

      if (data.data?.id) {
          queryClient.setQueryData(attributeOptionKeys.detailById(data.data.id), data);
      }
    },
    onError: (error) => {
      console.error("Error creating attribute option via hook:", error);
    },
    ...options,
  });
};

export const useGetOptionsForAttribute = (
  attributeId: string | undefined,
  params?: { sort?: Record<string, 1 | -1> | string; projection?: string; lean?: boolean },
  options?: UseQueryOptions<ApiResponse<IAttributeOptionResponse[]>, Error, IAttributeOptionResponse[], OptionsForAttributeQueryKey>
) => {
  return useQuery<ApiResponse<IAttributeOptionResponse[]>, Error, IAttributeOptionResponse[], OptionsForAttributeQueryKey>({
    queryKey: attributeOptionKeys.forAttribute(attributeId, params),
    queryFn: () => getOptionsForAttribute(attributeId!, params),
    enabled: !!attributeId && (options?.enabled !== false),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useGetPaginatedAttributeOptions = (
  params?: { page?: number; limit?: number; filter?: Record<string, any>; sort?: Record<string, 1 | -1> | string; projection?: string; lean?: boolean, attributeId?: string },
  options?: UseQueryOptions<IPaginatedData<IAttributeOptionResponse>, Error, IPaginatedData<IAttributeOptionResponse>, PaginatedAttributeOptionsQueryKey>
) => {
  return useQuery<IPaginatedData<IAttributeOptionResponse>, Error, IPaginatedData<IAttributeOptionResponse>, PaginatedAttributeOptionsQueryKey>({
    queryKey: attributeOptionKeys.paginated(params),
    queryFn: () => getPaginatedAttributeOptions(params),
    enabled: !!params, 
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useGetAttributeOptionById = (
  optionId: string | undefined,
  projection?: string,
  options?: UseQueryOptions<ApiResponse<IAttributeOptionResponse>, Error, IAttributeOptionResponse, AttributeOptionByIdQueryKey>
) => {
  return useQuery<ApiResponse<IAttributeOptionResponse>, Error, IAttributeOptionResponse, AttributeOptionByIdQueryKey>({
    queryKey: attributeOptionKeys.detailById(optionId),
    queryFn: () => getAttributeOptionById(optionId!, projection),
    enabled: !!optionId && (options?.enabled !== false),
    select: (response) => response.data,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

export const useUpdateAttributeOption = (
  options?: UseMutationOptions<ApiResponse<IAttributeOptionResponse>, Error, { optionId: string; payload: IAttributeOptionUpdatePayload }>
) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<IAttributeOptionResponse>, Error, { optionId: string; payload: IAttributeOptionUpdatePayload }>({
    mutationFn: ({ optionId, payload }) => updateAttributeOption(optionId, payload),
    onSuccess: (data, variables) => {
      console.log(`Attribute option ${variables.optionId} updated successfully via hook:`, data.data);
      queryClient.invalidateQueries({ queryKey: attributeOptionKeys.paginated() });
      queryClient.invalidateQueries({ queryKey: attributeOptionKeys.detailById(variables.optionId) });
      if (data.data?.attributeId) {
        queryClient.invalidateQueries({ queryKey: attributeOptionKeys.forAttribute(data.data.attributeId) });
      }
    },
    onError: (error, variables) => {
      console.error(`Error updating attribute option ${variables.optionId} via hook:`, error);
    },
    ...options,
  });
};


export const useDeleteAttributeOption = (
  options?: UseMutationOptions<
    ApiResponse<null>, // Data returned
    Error,             // Error type
    string,            // Variable passed to mutationFn (optionId)
    {                 
      previousOptionsForAttribute?: IAttributeOptionResponse[];
      attributeId?: string;
    }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<null>,
    Error,
    string,
    { previousOptionsForAttribute?: IAttributeOptionResponse[]; attributeId?: string }
  >({
    mutationFn: deleteAttributeOption,
    


    onSuccess: (data, deletedOptionId, context) => {
      console.log(`Attribute option ${deletedOptionId} deleted successfully via hook.`);
      queryClient.invalidateQueries({ queryKey: attributeOptionKeys.all });
      queryClient.removeQueries({ queryKey: attributeOptionKeys.detailById(deletedOptionId) });
      if (context?.attributeId) {
        queryClient.invalidateQueries({ queryKey: attributeOptionKeys.forAttribute(context.attributeId) });
      }
    },

    onError: (error, deletedOptionId) => {
      console.error(`Error deleting attribute option ${deletedOptionId} via hook:`, error);
    },
    ...options,
  });
};