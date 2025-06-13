// src/api/admin/product/productApi.ts

import api from "@/api"; // Your configured Axios instance
import {
  type IProductFormState,
  type IProductResponse,
  type IProductCreatePayload,
  type IProductVariationPayload,
  type IProductListItemData,
} from "@/types/product.types";
import type { ApiResponse } from "@/types/attribute";
import type { IPaginatedData } from "@/types/attribute";
import { safeParseFloat, safeParseInt } from "@/utils/productFormUtils";
import type { StockStatus } from "@/types/product";

// --- Endpoint Definitions (Matching backend productRoutes.ts) ---
const productApiEndpoints = {
  BASE: "/products", 
};


export interface ListProductsParams {
  page?: number;
  limit?: number;
  filter?: Record<string, any>;
  sort?: Record<string, 1 | -1>;
}

/**
 * Data for updating a single variation's inventory.
 */
export interface UpdateInventoryData {
  quantityChange: number; // e.g., -1 for a sale, 10 for restocking
  stockStatus?: StockStatus;
}


export const buildProductFormData = (formState: IProductFormState): FormData => {
  // This is the payload structure that mirrors your backend's CreateProductDTO.
  // It includes all fields, which will be flattened for FormData submission.
  const payload: IProductCreatePayload = {
    // === Basic Info ===
    name: formState.name.trim(),
    description: formState.description?.trim(),
    shortDescription: formState.shortDescription?.trim(),
    currency: formState.currency.trim().toUpperCase(),
    categoryId: formState.categoryId,
    brandId: formState.brandId || undefined,
    tags: formState.tags.map(tag => tag.trim().toLowerCase()).filter(Boolean),
    status: formState.status,
    visibility: formState.visibility,
    
    // === Main Product Images (Index Only) ===
    // We send files separately, but the index is part of the text data.
    mainProductImageIndex: safeParseInt(formState.mainProductImageIndex) ?? 0,

    // === Pricing (Optional Base Prices) ===
    basePrice: safeParseFloat(formState.basePrice) ?? undefined,
    baseSalePrice: safeParseFloat(formState.baseSalePrice) ?? undefined,

    // === Shipping & Compliance ===
    defaultWeight: safeParseFloat(formState.defaultWeight) ?? undefined,
    defaultWeightUnit: formState.defaultWeight ? formState.defaultWeightUnit : undefined,
    defaultDimensions: (formState.defaultDimensions && (formState.defaultDimensions.length || formState.defaultDimensions.width || formState.defaultDimensions.height)) ? {
      length: safeParseFloat(formState.defaultDimensions.length) ?? undefined,
      width: safeParseFloat(formState.defaultDimensions.width) ?? undefined,
      height: safeParseFloat(formState.defaultDimensions.height) ?? undefined,
      unit: formState.defaultDimensions.unit,
    } : undefined,
    isShippingRequired: formState.isShippingRequired,
    isHazardousMaterial: formState.isHazardousMaterial,
    isAgeRestricted: formState.isAgeRestricted,
    ageRestrictionMinimum: formState.isAgeRestricted ? safeParseInt(formState.ageRestrictionMinimum) ?? undefined : undefined,
    allowReviews: formState.allowReviews,

    // === SEO ===
    metaTitle: formState.metaTitle?.trim(),
    metaDescription: formState.metaDescription?.trim(),
    metaKeywords: formState.metaKeywords?.map(kw => kw.trim().toLowerCase()).filter(Boolean),

    // === Variations (Fully Mapped) ===
    // This is the most important part. We map every field from the form state to the payload.
    variations: formState.variations.map(v => ({
      sku: v.sku?.trim() || undefined,
      price: safeParseFloat(v.price)!, // Price is required on variation
      salePrice: safeParseFloat(v.salePrice) ,
      inventory: safeParseInt(v.inventory)!, // Inventory is required
      stockStatus: v.stockStatus,
      attributeOptions: v.attributeOptions,
      mainVariationImageIndex: safeParseInt(v.mainVariationImageIndex) ?? 0,
      weight: safeParseFloat(v.weight) ?? undefined,
      weightUnit: v.weight ? v.weightUnit : undefined,
      dimensions: (v.dimensions && (v.dimensions.length || v.dimensions.width || v.dimensions.height)) ? {
        length: safeParseFloat(v.dimensions.length) ?? undefined,
        width: safeParseFloat(v.dimensions.width) ?? undefined,
        height: safeParseFloat(v.dimensions.height) ?? undefined,
        unit: v.dimensions.unit,
      } : undefined,
      barcode: v.barcode?.trim() || undefined,
      costPrice: safeParseFloat(v.costPrice) ?? undefined,
      lowStockThreshold: safeParseInt(v.lowStockThreshold) ?? undefined,
      isActive: v.isActive,
    })),
  };

  const formData = new FormData();

  // --- Flatten the Payload for `multipart/form-data` ---
  // The backend validator will parse these strings back into their correct types.
  const flattenedPayload: Record<string, any> = {
    ...payload,
    // Explicitly stringify arrays and nested objects
    tags: JSON.stringify(payload.tags),
    metaKeywords: JSON.stringify(payload.metaKeywords),
    defaultDimensions: JSON.stringify(payload.defaultDimensions),
    variations: JSON.stringify(payload.variations),
  };

  // Append all text/stringified data.
  for (const key in flattenedPayload) {
    const value = flattenedPayload[key];
    // We append null/undefined as strings "null" or "undefined" to be parsed by backend,
    // or we can filter them out. Let's filter for a cleaner payload.
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  }

  // --- Append File Data (This logic is correct and remains unchanged) ---
  if (formState.mainImageFiles) {
    formState.mainImageFiles.forEach((file, index) => {
      // Naming convention mainImage_0, mainImage_1 must match backend controller
      formData.append(`mainImage_${index}`, file, file.name);
    });
  }

  if (formState.variations) {
    formState.variations.forEach((variation, varIndex) => {
      if (variation.imageFiles && variation.imageFiles.length > 0) {
        variation.imageFiles.forEach((file, imgIndex) => {
          // Naming convention variationImage_0_0, variationImage_0_1 must match backend controller
          formData.append(`variationImage_${varIndex}_${imgIndex}`, file, file.name);
        });
      }
    });
  }

  // Use this for final debugging if needed
  // console.log("--- FINAL FormData to be sent ---");
  // for (const [key, value] of formData.entries()) {
  //   console.log(`${key}:`, value);
  // }
  // console.log("---------------------------------");

  return formData;
};

export async function createProductApi(
  formData: FormData 
): Promise<ApiResponse<IProductResponse>> {
  try {

    console.log("888888888888888",formData,"From aiasfsfsd")
    const response = await api.post<ApiResponse<IProductResponse>>(
      productApiEndpoints.BASE,
      formData,
      {
        headers: {
          // Axios automatically sets the correct Content-Type for FormData
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("API Error: createProductApi", error.response?.data || error.message);
    // Re-throw the structured error from the backend if available, or create a new one.
    throw (
      error.response?.data || new Error(error.message || "Product creation failed due to an unknown error.")
    );
  }
}
