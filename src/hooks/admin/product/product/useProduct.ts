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
  type ListProductsParams,
  type SearchProductsParams,
  type UpdateInventoryData,
} from "@/api/admin/product/product/productApi";

import type { IProductResponse, IProductListItemData, IProductVariationFormState } from "@/types/product.types";
import type{ ApiResponse } from "@/types/attribute";
import type{ IPaginatedData } from "@/types/attribute";

import {
  type CreateProductDTO,
  type IProductDocument,
  type IProductVariation,
  type UpdateProductDTO,

} from "@/types/product"; 
import { type IPaginatedProductsResult } from "@/types/product.types";
import { productApi } from "@/api/admin/product/product/productApi";
export const productKeys = {
  // Key for all product-related queries
  all: ["products"] as const,

  // Key for paginated lists of products. Unique per set of parameters.
  paginated: (params: ListProductsParams = {}) =>
    [...productKeys.all, "list", params] as const,

  // Key for paginated storefront lists.
  paginatedStorefront: (params: ListProductsParams = {}) =>
    [...productKeys.all, "list-storefront", params] as const,

  // Key for a single product's details fetched by its ID.
  detailById: (id: string | undefined) =>
    [...productKeys.all, "detail", id] as const,
  search: (params: SearchProductsParams = {}) => [...productKeys.all, "search", params] as const, // <-- ** NEW SEARCH KEY **

  // Key for a single product's details fetched by its slug.
  detailBySlug: (slug: string | undefined) =>
    [...productKeys.all, "detail-slug", slug] as const,
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


/**
 * Fetches a paginated list of full product documents.
 * Ideal for admin panels or seller dashboards.
 */
export const useGetPaginatedProducts = (
  params: ListProductsParams,
  options?: UseQueryOptions<IPaginatedProductsResult>
) => {
  return useQuery<IPaginatedProductsResult>({
    queryKey: productKeys.paginated(params),
    queryFn: () => productApi.listPaginated(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};

/**
 * Fetches a paginated list of lightweight product items for the storefront.
 */
export const useGetPaginatedStorefrontProducts = (
  params: ListProductsParams,
  options?: UseQueryOptions<IPaginatedProductListItemsResult>
) => {

  return useQuery<IPaginatedProductListItemsResult>({
    queryKey: productKeys.paginatedStorefront(params),
    queryFn: () => productApi.listForStorefront(params),
    staleTime: 2 * 60 * 1000, // 2 minutes, storefront data might change more often
    ...options,
  });
};

/**
 * Fetches a single product document by its MongoDB ObjectId.
 */
export const useGetProductById = (
  productId: string | undefined,
  options?: UseQueryOptions<IProductDocument>
) => {

  console.log("-----------------------")
  return useQuery<IProductDocument>({

    
    queryKey: productKeys.detailById(productId),
    queryFn: () => productApi.getById(productId!),
  //  enabled: !!productId, // Only run the query if productId is not undefined
    ...options,
  });
};

/**
 * Fetches a single product document by its URL-friendly slug.
 */
export const useGetProductBySlug = (
  slug: string | undefined,
  options?: UseQueryOptions<IProductDocument>
) => {
  return useQuery<IProductDocument>({
    queryKey: productKeys.detailBySlug(slug),
    queryFn: () => productApi.getBySlug(slug!),
    enabled: !!slug, // Only run the query if slug is not undefined
    ...options,
  });
};

// =================================================================
// ==                    PRODUCT MUTATION HOOKS                   ==
// =================================================================



/**
 * A mutation hook for updating a product's text-based data.
 */
export const useUpdateProduct = (
  options?: UseMutationOptions<IProductDocument, Error, { productId: string; updateData: UpdateProductDTO }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation<IProductDocument, Error, { productId: string; updateData: UpdateProductDTO }>({
    mutationFn: ({ productId, updateData }) => (productApi.update(productId, updateData)),
    onSuccess: (updatedProduct, variables) => {
      // Invalidate all lists as product info might have changed (e.g., name, price).
      queryClient.invalidateQueries({ queryKey: productKeys.paginated() });
      queryClient.invalidateQueries({ queryKey: productKeys.paginatedStorefront() });
      // Invalidate the specific detail views for this product.
      queryClient.invalidateQueries({ queryKey: productKeys.detailById(variables.productId) });
      if (updatedProduct.slug) {
        queryClient.invalidateQueries({ queryKey: productKeys.detailBySlug(updatedProduct.slug) });
      }
    },
    ...options,
  });
};
export const useSearchProducts = (
  params: SearchProductsParams,
  options?: UseQueryOptions<IPaginatedProductsResult>
) => {

  console.log(params,";;;;;;;")

  return useQuery<IPaginatedProductsResult>({
    queryKey: productKeys.search(params),
    queryFn: () => productApi.search(params),
    // Only enable the query if there's a search term or a category
  //  enabled: !!(params.q || params.category),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};
/**
 * A mutation hook for deleting a product.
 */
export const useDeleteProduct = (
  options?: UseMutationOptions<{ deleted: boolean }, Error, string>
) => {
  const queryClient = useQueryClient();
  return useMutation<{ deleted: boolean }, Error, string>({
    mutationFn: productApi.delete,
    onSuccess: (_, productId) => {
      // Invalidate all product queries.
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      // Remove the cached data for the deleted product.
      queryClient.removeQueries({ queryKey: productKeys.detailById(productId) });
    },
    ...options,
  });
};

// --- Variation Mutation Hooks ---

/**
 * A mutation hook for adding a new variation to a product.
 */
export const useAddVariation = (
  options?: UseMutationOptions<IProductDocument, Error, { productId: string; variationData: IProductVariationFormState }>
) => {
  const queryClient = useQueryClient();
  return useMutation<IProductDocument, Error, { productId: string; variationData: IProductVariationFormState }>({
    // The mutation function now directly calls the updated productApi.addVariation
    mutationFn: ({ productId, variationData }) => productApi.addVariation(productId, variationData),
    onSuccess: (_, variables) => {
      // Invalidate the entire product detail query to get the fresh data
      queryClient.invalidateQueries({ queryKey: productKeys.detailById(variables.productId) });
    },
    ...options,
  });
};

/**
 * A mutation hook for updating a variation's text-based data.
 */
export const useUpdateVariation = (
  options?: UseMutationOptions<IProductDocument, Error, { productId: string; variationId: string; updateData: Partial<IProductVariation> }>
) => {
  const queryClient = useQueryClient();
  return useMutation<IProductDocument, Error, { productId: string; variationId: string; updateData: Partial<IProductVariation> }>({
    mutationFn: ({ productId, variationId, updateData }) => productApi.updateVariation(productId, variationId, updateData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detailById(variables.productId) });
      queryClient.invalidateQueries({ queryKey: productKeys.paginatedStorefront() });
    },
    ...options,
  });
};

/**
 * A mutation hook for removing a variation from a product.
 */
export const useRemoveVariation = (
  options?: UseMutationOptions<IProductDocument, Error, { productId: string; variationId: string }>
) => {
  const queryClient = useQueryClient();
  return useMutation<IProductDocument, Error, { productId: string; variationId: string }>({
    mutationFn: ({ productId, variationId }) => productApi.removeVariation(productId, variationId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detailById(variables.productId) });
      queryClient.invalidateQueries({ queryKey: productKeys.paginatedStorefront() });
    },
    ...options,
  });
};

/**
 * A mutation hook for the high-frequency operation of updating inventory.
 */
export const useUpdateVariationInventory = (
  options?: UseMutationOptions<IProductVariation, Error, { productId: string; variationId: string; data: UpdateInventoryData }>
) => {
  const queryClient = useQueryClient();
  return useMutation<IProductVariation, Error, { productId: string; variationId: string; data: UpdateInventoryData }>({
    mutationFn: ({ productId, variationId, data }) => productApi.updateVariationInventory(productId, variationId, data),
    onSuccess: (_, variables) => {
      // This is a more granular update; we can be more optimistic here if needed,
      // but invalidating the product detail is a safe and robust approach.
      queryClient.invalidateQueries({ queryKey: productKeys.detailById(variables.productId) });
    },
    ...options,
  });
};

// --- Image Mutation Hooks ---

/**
 * A mutation hook for adding images to the main product gallery.
 */
export const useAddProductImages = (
  options?: UseMutationOptions<IProductDocument, Error, { productId: string; images: File[] }>
) => {
  const queryClient = useQueryClient();
  return useMutation<IProductDocument, Error, { productId: string; images: File[] }>({
    mutationFn: ({ productId, images }) => productApi.addImages(productId, images),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detailById(variables.productId) });
    },
    ...options,
  });
};

/**
 * A mutation hook for removing an image from the main product gallery.
 */
export const useRemoveProductImage = (
  options?: UseMutationOptions<IProductDocument, Error, { productId: string; imageUrl: string }>
) => {
  const queryClient = useQueryClient();
  return useMutation<IProductDocument, Error, { productId: string; imageUrl: string }>({
    mutationFn: ({ productId, imageUrl }) => productApi.removeImage(productId, imageUrl),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detailById(variables.productId) });
    },
    ...options,
  });
};

/**
 * A mutation hook for adding images to a specific variation.
 */
export const useAddVariationImages = (
  options?: UseMutationOptions<IProductDocument, Error, { productId: string; variationId: string; images: File[] }>
) => {
  const queryClient = useQueryClient();
  return useMutation<IProductDocument, Error, { productId: string; variationId: string; images: File[] }>({
    mutationFn: ({ productId, variationId, images }) => productApi.addVariationImages(productId, variationId, images),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detailById(variables.productId) });
    },
    ...options,
  });
};

/**
 * A mutation hook for removing an image from a specific variation.
 */
export const useRemoveVariationImage = (
  options?: UseMutationOptions<IProductDocument, Error, { productId: string; variationId: string; imageUrl: string }>
) => {
  const queryClient = useQueryClient();
  return useMutation<IProductDocument, Error, { productId: string; variationId: string; imageUrl: string }>({
    mutationFn: ({ productId, variationId, imageUrl }) => productApi.removeVariationImage(productId, variationId, imageUrl),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detailById(variables.productId) });
    },
    ...options,
  });
};