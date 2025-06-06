import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
  // type QueryKey, // Not explicitly needed due to ReturnType
} from "@tanstack/react-query";
// import { useSelector } from "react-redux"; // Uncomment if using Redux for auth state

import {
  // Product API functions
  createProductApi,
  getPaginatedProducts,
  getProductById,
  getProductBySlug,
  updateProductApi,
  deleteProductApi,
  type ProductApiListParams,
} from "@/api/admin/product/product/productApi"; 

// import {
//   // Main product types for payloads and responses
//   // type IProductCreateFormState, // Mutation variable will be FormData
//   // type IProductUpdateFormState, // Mutation variable will be FormData
//   type IProductResponse,
//   // Generic API types (assuming they are in product types or a shared api types file)
//   type ApiResponse,
//   type IPaginatedData,
// } from "@/types/product"; // Adjust path
// // import { type RootState } from "@/store"; // Uncomment if using Redux


import type{ IProductResponse } from "@/types/product.types";
import {type ApiResponse,type IPaginatedData } from "@/types/attribute";
// --- Query Keys ---

export const productKeys = {
  all: ["products"] as const,
  paginated: (params?: object) => [...productKeys.all, "paginated", params || {}] as const,
  detailById: (id?: string) => [...productKeys.all, "detail", "id", id || "undefinedProductId"] as const,
  detailBySlug: (slug?: string) => [...productKeys.all, "detail", "slug", slug || "undefinedProductSlug"] as const,
  // Add more specific keys if needed, e.g., for variations, related products etc.
};

// --- Type Definitions for Hook Options and Query Keys ---

type PaginatedProductsQueryKey = ReturnType<typeof productKeys.paginated>;
type ProductByIdQueryKey = ReturnType<typeof productKeys.detailById>;
type ProductBySlugQueryKey = ReturnType<typeof productKeys.detailBySlug>;


// --- Product React Query Hooks ---

/**
 * Hook to create a new product.
 * Mutation function expects FormData.
 */
export const useCreateProduct = (
  options?: UseMutationOptions<ApiResponse<IProductResponse>, Error, FormData>
) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<IProductResponse>, Error, FormData>({ // Variable is FormData
    mutationFn: createProductApi,
    onSuccess: (response) => {
      console.log("Product created successfully via hook:", response.data);
      // Invalidate queries that display lists of products
      queryClient.invalidateQueries({ queryKey: productKeys.paginated() });
      queryClient.invalidateQueries({ queryKey: productKeys.all }); // Broader invalidation

      // Optionally, pre-populate the cache for the newly created product
      if (response.data?.id) {
        queryClient.setQueryData(productKeys.detailById(response.data.id), response);
      }
      if (response.data?.slug) {
        queryClient.setQueryData(productKeys.detailBySlug(response.data.slug), response);
      }
    },
    onError: (error) => {
      console.error("Error creating product via hook:", error);
      // Notification or further error handling can be done by the component using the hook
    },
    ...options,
  });
};

/**
 * Hook to fetch paginated products.
 */
export const useGetPaginatedProducts = (
  params?: ProductApiListParams, // Uses the specific params type from productApi.ts
  options?: UseQueryOptions<IPaginatedData<IProductResponse>, Error, IPaginatedData<IProductResponse>, PaginatedProductsQueryKey>
) => {
  // const { isAuthenticated, loading: isAuthLoading } = useSelector((state: RootState) => state.auth); // Optional
  return useQuery<IPaginatedData<IProductResponse>, Error, IPaginatedData<IProductResponse>, PaginatedProductsQueryKey>({
    queryKey: productKeys.paginated(params),
    queryFn: () => getPaginatedProducts(params),
    // enabled: isAuthenticated && !isAuthLoading, // Example: enable only if authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false, // Consider your app's needs
    keepPreviousData: true, // Good for pagination UX
    ...options,
  });
};

/**
 * Hook to fetch a single product by its ID.
 */
export const useGetProductById = (
  productId: string | undefined, // Allow undefined for conditional fetching
  projection?: string,
  lean?: boolean,
  options?: UseQueryOptions<ApiResponse<IProductResponse>, Error, IProductResponse, ProductByIdQueryKey>
) => {
  // const { isAuthenticated, loading: isAuthLoading } = useSelector((state: RootState) => state.auth); // Optional
  return useQuery<ApiResponse<IProductResponse>, Error, IProductResponse, ProductByIdQueryKey>({
    queryKey: productKeys.detailById(productId),
    queryFn: async () => {
        if (!productId) throw new Error("Product ID is required to fetch by ID."); // Guard, though 'enabled' handles this
        const response = await getProductById(productId, projection, lean);
        // API function already throws if error, so React Query handles it.
        // If response.data could be null for a found item (e.g. soft delete not filtered by API), handle here.
        // if (!response.success || !response.data) {
        //   throw new Error(response.message || "Failed to fetch product.");
        // }
        return response;
    },
    enabled: !!productId && (options?.enabled !== false), // Only run if productId is present and not explicitly disabled
    select: (response) => response.data, // Extract the IProductResponse from ApiResponse
    staleTime: 10 * 60 * 1000, // 10 minutes for individual item details
    ...options,
  });
};

/**
 * Hook to fetch a single product by its slug.
 */
export const useGetProductBySlug = (
  slug: string | undefined,
  projection?: string,
  lean?: boolean,
  options?: UseQueryOptions<ApiResponse<IProductResponse>, Error, IProductResponse, ProductBySlugQueryKey>
) => {
  return useQuery<ApiResponse<IProductResponse>, Error, IProductResponse, ProductBySlugQueryKey>({
    queryKey: productKeys.detailBySlug(slug),
    queryFn: async () => {
        if (!slug) throw new Error("Slug is required to fetch product by slug.");
        return getProductBySlug(slug, projection, lean);
    },
    enabled: !!slug && (options?.enabled !== false),
    select: (response) => response.data,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to update an existing product.
 * Mutation function expects FormData.
 */
export const useUpdateProduct = (
  options?: UseMutationOptions<ApiResponse<IProductResponse>, Error, { productId: string; formData: FormData }>
) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<IProductResponse>, Error, { productId: string; formData: FormData }>({
    mutationFn: ({ productId, formData }) => updateProductApi(productId, formData),
    onSuccess: (response, variables) => {
      const updatedProduct = response.data;
      console.log(`Product ${variables.productId} updated successfully via hook:`, updatedProduct);
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: productKeys.paginated() });
      queryClient.invalidateQueries({ queryKey: productKeys.detailById(variables.productId) });
      if (updatedProduct?.slug) {
        queryClient.invalidateQueries({ queryKey: productKeys.detailBySlug(updatedProduct.slug) });
      }
      // More aggressive: queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: (error, variables) => {
      console.error(`Error updating product ${variables.productId} via hook:`, error);
    },
    ...options,
  });
};

/**
 * Hook to delete a product.
 */
export const useDeleteProduct = (
  options?: UseMutationOptions<ApiResponse<null>, Error, { productId: string; hardDelete?: boolean }>
) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<null>, Error, { productId: string; hardDelete?: boolean }>({
    mutationFn: ({ productId, hardDelete }) => deleteProductApi(productId, hardDelete),
    onSuccess: (_data, variables) => {
      console.log(`Product ${variables.productId} deleted successfully via hook.`);
      queryClient.invalidateQueries({ queryKey: productKeys.all }); // Invalidate all product queries
      // Optionally, remove the specific product from cache
      queryClient.removeQueries({ queryKey: productKeys.detailById(variables.productId) });
      // If slugs were also cached and you can derive it or it's passed in variables:
      // queryClient.removeQueries({ queryKey: productKeys.detailBySlug(slug_of_deleted_product) });
    },
    onError: (error, variables) => {
      console.error(`Error deleting product ${variables.productId} via hook:`, error);
    },
    ...options,
  });
};

// TODO: Implement hooks for more granular product operations if needed:
// - useAddProductVariation, useUpdateProductVariation, useRemoveProductVariation
// - useUpdateProductVariationInventory
// - useAddProductImage, useRemoveProductImage (for main product)
// - useAddVariationImage, useRemoveVariationImage (for specific variations)
// These would follow a similar pattern to useCreateProduct/useUpdateProduct/useDeleteProduct,
// calling their respective functions from productApi.ts and handling cache invalidation.