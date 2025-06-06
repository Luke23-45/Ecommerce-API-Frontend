import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
  // type QueryKey, // Not explicitly needed if using ReturnType for query key types
} from "@tanstack/react-query";
import { useSelector } from "react-redux"; // Optional: if using Redux for auth state

import {
  // Category API functions
  createCategory,
  getPaginatedCategories,
  getTopLevelCategories,
  recalculateAllChildrenCounts,
  getCategoryById,
  getCategoryBySlug,
  getCategoryByFullPathSlug,
  updateCategory,
  deleteCategory,
  getDirectChildrenOfCategory,
  getAllDescendantsOfCategory,
  getCategoryAncestors,

  type CategoryApiListParams, 
} from "@/api/admin/product/category/categoryApi"; 

import {
  type ICategoryCreatePayload,
  type ICategoryUpdatePayload,
  type ICategoryResponse,
  type ICategoryAncestorFrontend,

} from "@/types/category"; 
import { type RootState } from "@/store"; 
import type { ApiResponse,IPaginatedData } from "@/types/attribute";
// --- Query Keys ---

export const categoryKeys = {
  all: ["categories"] as const,
  paginated: (params?: object) => [...categoryKeys.all, "paginated", params || {}] as const,
  topLevel: (params?: object) => [...categoryKeys.all, "topLevel", params || {}] as const,
  detailById: (id?: string) => [...categoryKeys.all, "detail", "id", id || "undefinedId"] as const,
  detailBySlug: (slug?: string) => [...categoryKeys.all, "detail", "slug", slug || "undefinedSlug"] as const,
  detailByFullPathSlug: (fullPath?: string) => [...categoryKeys.all, "detail", "fullPath", fullPath || "undefinedPath"] as const,
  childrenOf: (parentId?: string, params?: object) => [...categoryKeys.all, "children", parentId || "undefinedParentId", params || {}] as const,
  descendantsOf: (parentId?: string, params?: object) => [...categoryKeys.all, "descendants", parentId || "undefinedParentId", params || {}] as const,
  ancestorsOf: (id?: string) => [...categoryKeys.all, "ancestors", id || "undefinedId"] as const,
};



type PaginatedCategoriesQueryKey = ReturnType<typeof categoryKeys.paginated>;
type TopLevelCategoriesQueryKey = ReturnType<typeof categoryKeys.topLevel>;
type CategoryByIdQueryKey = ReturnType<typeof categoryKeys.detailById>;
type CategoryBySlugQueryKey = ReturnType<typeof categoryKeys.detailBySlug>;
type CategoryByFullPathSlugQueryKey = ReturnType<typeof categoryKeys.detailByFullPathSlug>;
type ChildrenOfCategoryQueryKey = ReturnType<typeof categoryKeys.childrenOf>;
type DescendantsOfCategoryQueryKey = ReturnType<typeof categoryKeys.descendantsOf>;
type AncestorsOfCategoryQueryKey = ReturnType<typeof categoryKeys.ancestorsOf>;




export const useCreateCategory = (
  options?: UseMutationOptions<ApiResponse<ICategoryResponse>, Error, ICategoryCreatePayload>
) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<ICategoryResponse>, Error, ICategoryCreatePayload>({
    mutationFn: createCategory,
    onSuccess: (response) => {
      console.log("Category created successfully via hook:", response.data);
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      if (response.data?.id) {
        queryClient.setQueryData(categoryKeys.detailById(response.data.id), response);
      }
    },
    onError: (error) => {
      console.error("Error creating category via hook:", error);
    },
    ...options,
  });
};

export const useGetPaginatedCategories = (
  params?: CategoryApiListParams, 
  options?: UseQueryOptions<IPaginatedData<ICategoryResponse>, Error, IPaginatedData<ICategoryResponse>, PaginatedCategoriesQueryKey>
) => {
  // Optional: Auth check
  // const { isAuthenticated, loading: isAuthLoading } = useSelector((state: RootState) => state.auth);
  return useQuery<IPaginatedData<ICategoryResponse>, Error, IPaginatedData<ICategoryResponse>, PaginatedCategoriesQueryKey>({
    queryKey: categoryKeys.paginated(params),
    queryFn: () => getPaginatedCategories(params),
    // enabled: isAuthenticated && !isAuthLoading, // Enable based on auth or if params are present etc.
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useGetTopLevelCategories = (
  params?: { sort?: string; projection?: string; lean?: boolean },
  options?: UseQueryOptions<ApiResponse<ICategoryResponse[]>, Error, ICategoryResponse[], TopLevelCategoriesQueryKey>
) => {
  return useQuery<ApiResponse<ICategoryResponse[]>, Error, ICategoryResponse[], TopLevelCategoriesQueryKey>({
    queryKey: categoryKeys.topLevel(params),
    queryFn: () => getTopLevelCategories(params),
    select: (response) => response.data,
    staleTime: 10 * 60 * 1000, // Longer stale time for less frequently changing data
    ...options,
  });
};

export const useRecalculateAllChildrenCounts = (
    options?: UseMutationOptions<ApiResponse<{ updatedCount: number; errors: any[] }>, Error, void>
) => {
    const queryClient = useQueryClient();
    return useMutation<ApiResponse<{ updatedCount: number; errors: any[] }>, Error, void>({
        mutationFn: recalculateAllChildrenCounts,
        onSuccess: (response) => {
            console.log("Children counts recalculated successfully via hook:", response.data);
            queryClient.invalidateQueries({ queryKey: categoryKeys.all }); // Invalidate all categories as counts might affect them
        },
        onError: (error) => {
            console.error("Error recalculating children counts via hook:", error);
        },
        ...options,
    });
};

export const useGetCategoryById = (
  id: string | undefined,
  projection?: string,
  lean?: boolean,
  options?: UseQueryOptions<ApiResponse<ICategoryResponse>, Error, ICategoryResponse, CategoryByIdQueryKey>
) => {
  return useQuery<ApiResponse<ICategoryResponse>, Error, ICategoryResponse, CategoryByIdQueryKey>({
    queryKey: categoryKeys.detailById(id),
    queryFn: () => getCategoryById(id!, projection, lean),
    enabled: !!id && (options?.enabled !== false),
    select: (response) => response.data,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

export const useGetCategoryBySlug = (
  slug: string | undefined,
  projection?: string,
  lean?: boolean,
  options?: UseQueryOptions<ApiResponse<ICategoryResponse>, Error, ICategoryResponse, CategoryBySlugQueryKey>
) => {
  return useQuery<ApiResponse<ICategoryResponse>, Error, ICategoryResponse, CategoryBySlugQueryKey>({
    queryKey: categoryKeys.detailBySlug(slug),
    queryFn: () => getCategoryBySlug(slug!, projection, lean),
    enabled: !!slug && (options?.enabled !== false),
    select: (response) => response.data,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

export const useGetCategoryByFullPathSlug = (
  fullPathSlug: string | undefined,
  projection?: string,
  lean?: boolean,
  options?: UseQueryOptions<ApiResponse<ICategoryResponse>, Error, ICategoryResponse, CategoryByFullPathSlugQueryKey>
) => {
  return useQuery<ApiResponse<ICategoryResponse>, Error, ICategoryResponse, CategoryByFullPathSlugQueryKey>({
    queryKey: categoryKeys.detailByFullPathSlug(fullPathSlug),
    queryFn: () => getCategoryByFullPathSlug(fullPathSlug!, projection, lean),
    enabled: !!fullPathSlug && (options?.enabled !== false),
    select: (response) => response.data,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

export const useUpdateCategory = (
  options?: UseMutationOptions<ApiResponse<ICategoryResponse>, Error, { id: string; payload: ICategoryUpdatePayload }>
) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<ICategoryResponse>, Error, { id: string; payload: ICategoryUpdatePayload }>({
    mutationFn: ({ id, payload }) => updateCategory(id, payload),
    onSuccess: (response, variables) => {
      const updatedCategory = response.data;
      console.log(`Category ${variables.id} updated successfully via hook:`, updatedCategory);
      queryClient.invalidateQueries({ queryKey: categoryKeys.all }); // Broad invalidation because hierarchy might change
      // More specific invalidations:
      // queryClient.invalidateQueries({ queryKey: categoryKeys.paginated() });
      // queryClient.invalidateQueries({ queryKey: categoryKeys.topLevel() });
      // queryClient.invalidateQueries({ queryKey: categoryKeys.detailById(variables.id) });
      // if (updatedCategory?.slug) {
      //   queryClient.invalidateQueries({ queryKey: categoryKeys.detailBySlug(updatedCategory.slug) });
      // }
      // if (updatedCategory?.fullPathSlug) { // If you have this field
      //   queryClient.invalidateQueries({ queryKey: categoryKeys.detailByFullPathSlug(updatedCategory.fullPathSlug) });
      // }
      // Invalidate children/descendants/ancestors of potentially affected categories if parentId changed
    },
    onError: (error, variables) => {
      console.error(`Error updating category ${variables.id} via hook:`, error);
    },
    ...options,
  });
};

export const useDeleteCategory = (
  options?: UseMutationOptions<ApiResponse<null>, Error, string> // Variable is id (string)
) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<null>, Error, string>({
    mutationFn: deleteCategory,
    onSuccess: (_data, id) => {
      console.log(`Category ${id} deleted successfully via hook.`);
      queryClient.invalidateQueries({ queryKey: categoryKeys.all }); // Invalidate all category related queries
      // Optionally remove from cache:
      // queryClient.removeQueries({ queryKey: categoryKeys.detailById(id) });
    },
    onError: (error, id) => {
      console.error(`Error deleting category ${id} via hook:`, error);
    },
    ...options,
  });
};

export const useGetDirectChildrenOfCategory = (
  parentId: string | undefined | null, // Allow null for top-level if API supports it differently from getTopLevelCategories
  params?: { sort?: string; projection?: string; lean?: boolean },
  options?: UseQueryOptions<ApiResponse<ICategoryResponse[]>, Error, ICategoryResponse[], ChildrenOfCategoryQueryKey>
) => {
  // If parentId can be null to signify top-level, ensure queryKey and enabled logic reflect this.
  // Your getTopLevelCategories hook already handles the 'parentId: null' case more directly.
  // This hook is more for when a specific parentId (not null) is provided.
  const queryKey = categoryKeys.childrenOf(parentId || undefined, params); // Handle null for query key
  return useQuery<ApiResponse<ICategoryResponse[]>, Error, ICategoryResponse[], typeof queryKey>({
    queryKey,
    queryFn: () => getDirectChildrenOfCategory(parentId!, params), // parentId! because enabled checks it
    enabled: !!parentId && (options?.enabled !== false), // Only enable if parentId is an actual ID string
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useGetAllDescendantsOfCategory = (
  parentId: string | undefined,
  params?: { sort?: string; projection?: string; lean?: boolean },
  options?: UseQueryOptions<ApiResponse<ICategoryResponse[]>, Error, ICategoryResponse[], DescendantsOfCategoryQueryKey>
) => {
  return useQuery<ApiResponse<ICategoryResponse[]>, Error, ICategoryResponse[], DescendantsOfCategoryQueryKey>({
    queryKey: categoryKeys.descendantsOf(parentId, params),
    queryFn: () => getAllDescendantsOfCategory(parentId!, params),
    enabled: !!parentId && (options?.enabled !== false),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useGetCategoryAncestors = (
  id: string | undefined,
  projection?: string,
  lean?: boolean,
  options?: UseQueryOptions<ApiResponse<ICategoryAncestorFrontend[]>, Error, ICategoryAncestorFrontend[], AncestorsOfCategoryQueryKey>
) => {
  return useQuery<ApiResponse<ICategoryAncestorFrontend[]>, Error, ICategoryAncestorFrontend[], AncestorsOfCategoryQueryKey>({
    queryKey: categoryKeys.ancestorsOf(id),
    queryFn: () => getCategoryAncestors(id!, projection, lean),
    enabled: !!id && (options?.enabled !== false),
    select: (response) => response.data,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};