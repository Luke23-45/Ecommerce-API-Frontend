// src/hooks/admin/product/useProduct.ts

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";

import {
  // Product API functions
  createProductApi,
} from "@/api/admin/product/product/productApi";

import type { IProductResponse, IProductListItemData } from "@/types/product.types";
import type{ ApiResponse } from "@/types/attribute";
import type{ IPaginatedData } from "@/types/attribute";
// --- Query Keys ---

export const productKeys = {
  all: ["products"] as const,
  // A function for paginated lists with params, ensuring query keys are unique per filter/sort/page
  paginated: (params: ProductListParams = {}) => [...productKeys.all, "list", params] as const,
  // A function for individual product details by ID
  detailById: (id: string | undefined) => [...productKeys.all, "detail", id] as const,
  // A function for individual product details by slug
  detailBySlug: (slug: string | undefined) => [...productKeys.all, "detail-slug", slug] as const,
};

// --- Type Definitions for Hook Options ---
// These make the hook signatures cleaner and more readable.
type PaginatedProductsQueryKey = ReturnType<typeof productKeys.paginated>;

// --- Product React Query Hooks ---


export const useCreateProduct = (
  options?: UseMutationOptions<ApiResponse<IProductResponse>, Error, FormData>
) => {

  const queryClient = useQueryClient();
return useMutation<ApiResponse<IProductResponse>, Error, FormData>({
    mutationFn: createProductApi,
    onSuccess: (response, _variables, _context) => {
      queryClient.invalidateQueries({ queryKey: productKeys.paginated() });
      console.log("Product created successfully via hook.", response.data);
    },
    ...options,
  });
};
