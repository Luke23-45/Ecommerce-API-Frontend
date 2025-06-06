import api from "@/api"; // Your configured Axios instance
import {
  // Assuming these are the primary types needed for create and response
  type IProductCreateFormState, // This is the state of your Product Form
  type IProductResponse,
  type IProductUpdateFormState, // For update later
  type IProductVariationForm, // Helper for constructing variations in FormData
} from "@/types/product.types"; // Adjust path
// If CreateProductDTO and RawFile were defined for frontend to match backend more closely for FormData:
// import { CreateProductDTO, RawFile } from "@/types/product";
import { type ApiResponse, type IPaginatedData } from "@/types/attribute";

// --- Endpoint Definitions (Matching your productRoutes.ts) ---
// Assuming productRoutes are mounted at e.g., /api/admin/products
const productApiEndpoints = {
  CREATE_PRODUCT: "/", // POST to the base of the product router, e.g., /api/admin/products/
  GET_PAGINATED_PRODUCTS: "/", // GET /
  GET_PRODUCT_BY_ID: (productId: string) => `/${productId}`,
  GET_PRODUCT_BY_SLUG: (slug: string) => `/slug/${slug}`, // Assuming /slug/:slug
  UPDATE_PRODUCT: (productId: string) => `/${productId}`,
  DELETE_PRODUCT: (productId: string) => `/${productId}`,

  // Variation specific (examples, might be part of main update or separate)
  ADD_VARIATION: (productId: string) => `/${productId}/variations`,
  UPDATE_VARIATION: (productId: string, variationId: string) =>
    `/${productId}/variations/${variationId}`,
  DELETE_VARIATION: (productId: string, variationId: string) =>
    `/${productId}/variations/${variationId}`,

  // Image specific (examples)
  ADD_PRODUCT_IMAGE: (productId: string) => `/${productId}/images`, // For main product images
  DELETE_PRODUCT_IMAGE: (productId: string, imageIdentifier: string) =>
    `/${productId}/images/${imageIdentifier}`, // Or pass in body
};

export async function createProductApi(
  formData: FormData // The payload is now FormData directly
): Promise<ApiResponse<IProductResponse>> {
  try {
    console.log("API CALL: createProductApi with FormData");
    // Log FormData entries for debugging ( FormData is not easily loggable directly)
    // for (let [key, value] of formData.entries()) {
    //   console.log(`FormData Entry: ${key}`, value instanceof File ? value.name : value);
    // }

    const response = await api.post<ApiResponse<IProductResponse>>(
      productApiEndpoints.CREATE_PRODUCT,
      formData,
      {
        headers: {
          // Axios might set this automatically for FormData, but can be explicit
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error creating product:",
      error.response?.data || error.message,
      error.response?.status // Log status for 4xx/5xx errors
    );
    // Re-throw the structured error from backend if available, or a generic error
    throw (
      error.response?.data ||
      new Error(
        error.message || "Product creation failed due to an unknown error."
      )
    );
  }
}

// --- Helper function to construct FormData from your form state ---
// This would typically reside in your ProductForm.tsx or a utility file,
// but placing it here to show the structure expected by createProductApi.
export const buildProductFormData = (
  formState: IProductCreateFormState
): FormData => {
  const formData = new FormData();

  // Append simple string/number/boolean fields
  // Backend controller will parse these strings back to appropriate types if needed
  formData.append("name", formState.name);
  if (formState.description)
    formData.append("description", formState.description);
  if (formState.shortDescription)
    formData.append("shortDescription", formState.shortDescription);
  if (formState.basePrice !== undefined)
    formData.append("basePrice", String(formState.basePrice));
  if (formState.baseSalePrice !== undefined)
    formData.append("baseSalePrice", String(formState.baseSalePrice));
  formData.append("currency", formState.currency);
  formData.append("categoryId", formState.categoryId);
  if (formState.brandId) formData.append("brandId", formState.brandId);
  formData.append("sellerType", formState.sellerType);
  formData.append("sellerId", formState.sellerId);
  formData.append("status", formState.status);
  formData.append("visibility", formState.visibility);

  if (formState.tags && formState.tags.length > 0) {
    // Send tags as multiple fields with same name or stringified JSON array
    // Option A: Multiple fields (some backends parse this into an array)
    // formState.tags.forEach(tag => formData.append('tags[]', tag));
    // Option B: Stringified JSON (Backend needs to JSON.parse this field)
    formData.append("tags", JSON.stringify(formState.tags));
  }

  // SEO Fields
  if (formState.metaTitle) formData.append("metaTitle", formState.metaTitle);
  if (formState.metaDescription)
    formData.append("metaDescription", formState.metaDescription);
  if (formState.metaKeywords && formState.metaKeywords.length > 0) {
    formData.append("metaKeywords", JSON.stringify(formState.metaKeywords));
  }

  // Shipping Fields
  if (formState.defaultWeight !== undefined)
    formData.append("defaultWeight", String(formState.defaultWeight));
  if (formState.defaultWeightUnit)
    formData.append("defaultWeightUnit", formState.defaultWeightUnit);
  if (formState.defaultDimensions)
    formData.append(
      "defaultDimensions",
      JSON.stringify(formState.defaultDimensions)
    );
  if (formState.isShippingRequired !== undefined)
    formData.append("isShippingRequired", String(formState.isShippingRequired));

  // Compliance Fields
  if (formState.isHazardousMaterial !== undefined)
    formData.append(
      "isHazardousMaterial",
      String(formState.isHazardousMaterial)
    );
  if (formState.isAgeRestricted !== undefined)
    formData.append("isAgeRestricted", String(formState.isAgeRestricted));
  if (formState.ageRestrictionMinimum !== undefined)
    formData.append(
      "ageRestrictionMinimum",
      String(formState.ageRestrictionMinimum)
    );
  if (formState.allowReviews !== undefined)
    formData.append("allowReviews", String(formState.allowReviews));

  // Main Product Image Files
  if (formState.mainImageFiles && formState.mainImageFiles.length > 0) {
    formState.mainImageFiles.forEach((file) => {
      // The field name 'mainImageFiles' must match what Multer expects on the backend
      formData.append("mainImageFiles", file, file.name);
    });
  }

  // Variations - This is the trickiest part with FormData
  // You typically stringify the array of variation objects (without files)
  // And append variation files separately with indexed names.
  const variationsWithoutFiles = formState.variations.map((v) => {
    const { imageFiles, ...restOfVariation } = v; // Separate files from other data
    return restOfVariation;
  });
  formData.append("variations", JSON.stringify(variationsWithoutFiles));

  // Append variation image files with indexed field names
  // Backend Multer config and controller need to expect these field names.
  formState.variations.forEach((variation, index) => {
    if (variation.imageFiles && variation.imageFiles.length > 0) {
      variation.imageFiles.forEach((file, fileIndex) => {
        // Example field name: "variationImageFiles_0_0", "variationImageFiles_0_1", "variationImageFiles_1_0"
        // This tells Multer these are files and your controller can map them back.
        // The field name convention needs to be agreed upon.
        // A simpler Multer setup might use `upload.any()` and then you parse `file.fieldname`.
        // For `upload.fields([...])`, field names must be known.
        // Let's assume a convention like `variationImages[${index}]` for Multer.
        // This will send multiple files with the same field name, which Multer handles as an array for that field.
        formData.append(`variationFiles_${index}`, file, file.name);
      });
    }
  });

  return formData;
};

// --- Placeholder for other Product API functions (to be implemented similarly) ---

export type ProductApiListParams = {
  page?: number;
  limit?: number;
  filter?: string; // JSON string
  sort?: string; // JSON string or simple field string
  projection?: string;
  lean?: boolean;
};

export async function getPaginatedProducts(
  params?: ProductApiListParams
): Promise<IPaginatedData<IProductResponse>> {
  try {
    console.log("API CALL: getPaginatedProducts with params:", params);
    const response = await api.get<IPaginatedData<IProductResponse>>(
      productApiEndpoints.GET_PAGINATED_PRODUCTS,
      { params }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching paginated products:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

export async function getProductById(
  productId: string,
  projection?: string,
  lean?: boolean
): Promise<ApiResponse<IProductResponse>> {
  try {
    const params: { fields?: string; lean?: boolean } = {};
    if (projection) params.fields = projection;
    if (lean !== undefined) params.lean = lean;
    const response = await api.get<ApiResponse<IProductResponse>>(
      productApiEndpoints.GET_PRODUCT_BY_ID(productId),
      { params: Object.keys(params).length ? params : undefined }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Error fetching product by ID ${productId}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

export async function getProductBySlug(
  slug: string,
  projection?: string,
  lean?: boolean
): Promise<ApiResponse<IProductResponse>> {
  try {
    const params: { fields?: string; lean?: boolean } = {};
    if (projection) params.fields = projection;
    if (lean !== undefined) params.lean = lean;
    const response = await api.get<ApiResponse<IProductResponse>>(
      productApiEndpoints.GET_PRODUCT_BY_SLUG(slug),
      { params: Object.keys(params).length ? params : undefined }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Error fetching product by slug ${slug}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

export async function updateProductApi(
  productId: string,
  formData: FormData // Similar to create, updates might involve files
): Promise<ApiResponse<IProductResponse>> {
  try {
    console.log(`API CALL: updateProductApi for ID ${productId} with FormData`);
    const response = await api.put<ApiResponse<IProductResponse>>(
      productApiEndpoints.UPDATE_PRODUCT(productId),
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Error updating product ${productId}:`,
      error.response?.data || error.message
    );
    throw (
      error.response?.data ||
      new Error(error.message || "Product update failed.")
    );
  }
}

export async function deleteProductApi(
  productId: string,
  hardDelete?: boolean
): Promise<ApiResponse<null>> {
  try {
    const params: { hard?: string } = {};
    if (hardDelete) params.hard = "true";

    const response = await api.delete<ApiResponse<null>>(
      productApiEndpoints.DELETE_PRODUCT(productId),
      { params: Object.keys(params).length ? params : undefined }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Error deleting product ${productId}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

// TODO: Implement API functions for:
// - Adding/Updating/Removing individual variations (if using separate endpoints)
// - Adding/Removing product images (main and for variations, if separate endpoints)
// - Updating variation inventory
