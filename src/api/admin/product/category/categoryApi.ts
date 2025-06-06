import api from "@/api"; // Assuming your Axios instance at src/api/index.ts or src/api.ts
import {
  type ICategoryCreatePayload,
  type ICategoryUpdatePayload,
  type ICategoryResponse,
  type ICategoryAncestorFrontend,

} from "@/types/category"; 

import { type IPaginatedData } from "@/types/attribute";
import { type ApiResponse } from "@/types/attribute";

const categoryApiEndpoints = {
  CREATE_CATEGORY: "/category/create",
  GET_PAGINATED_CATEGORIES: "/category/filter", // GET  /categories/filter (for paginated list)
  GET_TOP_LEVEL_CATEGORIES: "/category/toplevel", // GET  /categories/toplevel
  RECALCULATE_CHILDREN_COUNTS: "/category/admin/recalculate-children-counts", // POST /categories/admin/recalculate-children-counts
  GET_CATEGORY_BY_ID: (id: string) => `/category/get/${id}`, // GET  /categories/get/:id
  GET_CATEGORY_BY_SLUG: (slug: string) => `/category/slug/${slug}`, // GET  /categories/slug/:slug
  // Path for fullPathSlug: /path/electronics/laptops - Express captures 'electronics/laptops' in param
  GET_CATEGORY_BY_FULL_PATH_SLUG: (fullPath: string) => `/category/path/${fullPath}`,
  UPDATE_CATEGORY: (id: string) => `/category/update/${id}`, // PUT  /categories/update/:id
  DELETE_CATEGORY: (id: string) => `/category/delete/${id}`, // DELETE /categories/delete/:id
  GET_DIRECT_CHILDREN: (parentId: string) => `/category/children/${parentId}`, // GET /categories/children/:parentId (Note: your route had /:parentId/children)
  GET_ALL_DESCENDANTS: (parentId: string) => `/category/descendants/${parentId}`, // GET /categories/descendants/:parentId
  GET_ANCESTORS: (id: string) => `/category/ancestors/${id}`, // GET /categories/ancestors/:id
};

// --- Category API Functions ---

export async function createCategory(
  payload: ICategoryCreatePayload
): Promise<ApiResponse<ICategoryResponse>> {
  try {
    const response = await api.post<ApiResponse<ICategoryResponse>>(
      categoryApiEndpoints.CREATE_CATEGORY,
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error creating category:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

// Params for paginated categories (filter & sort are stringified JSON)
export type CategoryApiListParams = {
  page?: number;
  limit?: number;
  filter?: string; // JSON string
  sort?: string; // JSON string or simple field string like "name" or "-createdAt"
  projection?: string;
  lean?: boolean;
};

export async function getPaginatedCategories(
  params?: CategoryApiListParams
): Promise<IPaginatedData<ICategoryResponse>> {
  try {
    console.log("API CALL: getPaginatedCategories with params:", params);
    const response = await api.get<IPaginatedData<ICategoryResponse>>(
      categoryApiEndpoints.GET_PAGINATED_CATEGORIES,
      { params:params }
    );
    return response.data; // Assuming backend directly returns IPaginatedData structure
  } catch (error: any) {
    console.error(
      "Error fetching paginated categories:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

export async function getTopLevelCategories(
  params?: { sort?: string; projection?: string; lean?: boolean } // Sort can be stringified JSON
): Promise<ApiResponse<ICategoryResponse[]>> {
  try {
    const response = await api.get<ApiResponse<ICategoryResponse[]>>(
      categoryApiEndpoints.GET_TOP_LEVEL_CATEGORIES,
      { params }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching top-level categories:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

export async function recalculateAllChildrenCounts(): Promise<
  ApiResponse<{ updatedCount: number; errors: any[] }>
> {
  try {
    const response = await api.post<
      ApiResponse<{ updatedCount: number; errors: any[] }>
    >(
      categoryApiEndpoints.RECALCULATE_CHILDREN_COUNTS
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error recalculating children counts:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

export async function getCategoryById(
  id: string,
  projection?: string,
  lean?: boolean
): Promise<ApiResponse<ICategoryResponse>> {
  try {
    const params: { fields?: string; lean?: boolean } = {};
    if (projection) params.fields = projection;
    if (lean !== undefined) params.lean = lean;

    const response = await api.get<ApiResponse<ICategoryResponse>>(
      categoryApiEndpoints.GET_CATEGORY_BY_ID(id),
      { params: Object.keys(params).length ? params : undefined }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Error fetching category by ID ${id}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

export async function getCategoryBySlug(
  slug: string,
  projection?: string,
  lean?: boolean
): Promise<ApiResponse<ICategoryResponse>> {
  try {
    const params: { fields?: string; lean?: boolean } = {};
    if (projection) params.fields = projection;
    if (lean !== undefined) params.lean = lean;

    const response = await api.get<ApiResponse<ICategoryResponse>>(
      categoryApiEndpoints.GET_CATEGORY_BY_SLUG(slug),
      { params: Object.keys(params).length ? params : undefined }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Error fetching category by slug ${slug}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

export async function getCategoryByFullPathSlug(
  fullPathSlug: string, // e.g., "electronics/laptops"
  projection?: string,
  lean?: boolean
): Promise<ApiResponse<ICategoryResponse>> {
  try {
    // The fullPathSlug itself forms part of the URL path segment.
    // Query parameters are for additional options like projection/lean.
    const params: { fields?: string; lean?: boolean } = {};
    if (projection) params.fields = projection;
    if (lean !== undefined) params.lean = lean;

    const response = await api.get<ApiResponse<ICategoryResponse>>(
      categoryApiEndpoints.GET_CATEGORY_BY_FULL_PATH_SLUG(fullPathSlug),
      { params: Object.keys(params).length ? params : undefined }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Error fetching category by full path slug "${fullPathSlug}":`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

export async function updateCategory(
  id: string,
  payload: ICategoryUpdatePayload
): Promise<ApiResponse<ICategoryResponse>> {
  try {
    const response = await api.put<ApiResponse<ICategoryResponse>>(
      categoryApiEndpoints.UPDATE_CATEGORY(id),
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Error updating category ${id}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

export async function deleteCategory(id: string): Promise<ApiResponse<null>> {
  // Backend returns null data on successful delete
  try {
    const response = await api.delete<ApiResponse<null>>(
      categoryApiEndpoints.DELETE_CATEGORY(id)
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Error deleting category ${id}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

export async function getDirectChildrenOfCategory(
  parentId: string,
  params?: { sort?: string; projection?: string; lean?: boolean } // Sort can be stringified JSON
): Promise<ApiResponse<ICategoryResponse[]>> {
  try {
    const response = await api.get<ApiResponse<ICategoryResponse[]>>(
      // Your route was /children/:parentId, ensure this matches
      // If endpoint structure needs fixing in categoryApiEndpoints, do it there
      categoryApiEndpoints.GET_DIRECT_CHILDREN(parentId),
      { params }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Error fetching direct children for category ${parentId}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

export async function getAllDescendantsOfCategory(
  parentId: string,
  params?: { sort?: string; projection?: string; lean?: boolean } // Sort can be stringified JSON
): Promise<ApiResponse<ICategoryResponse[]>> {
  try {
    const response = await api.get<ApiResponse<ICategoryResponse[]>>(
      categoryApiEndpoints.GET_ALL_DESCENDANTS(parentId),
      { params }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Error fetching descendants for category ${parentId}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

export async function getCategoryAncestors(
  id: string,
  projection?: string, // Projection for the ancestor objects themselves
  lean?: boolean
): Promise<ApiResponse<ICategoryAncestorFrontend[]>> {
  // Returns array of ancestors
  try {
    const params: { fields?: string; lean?: boolean } = {};
    if (projection) params.fields = projection;
    if (lean !== undefined) params.lean = lean;

    const response = await api.get<ApiResponse<ICategoryAncestorFrontend[]>>(
      categoryApiEndpoints.GET_ANCESTORS(id),
      { params: Object.keys(params).length ? params : undefined }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Error fetching ancestors for category ${id}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}
