// src/utils/productFormUtils.ts

import {
  type IProductDocument,
  type IProductVariation,
} from "@/types/product";
import {
  type IProductFormState,
  type IProductVariationFormState,
} from "@/types/product.types"; // Or your correct path

export const generateTemporaryId = (): string => {
  return `temp_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
};

export const safeParseInt = (
  value: string | number | null | undefined
): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isInteger(num) ? num : null;
};

export const safeParseFloat = (
  value: string | number | null | undefined
): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
};

// =================================================================
// ==              ** FINAL, CORRECTED MAPPING FUNCTION **         ==
// =================================================================
export const mapProductResponseToFormState = (
  product: IProductDocument
): IProductFormState => {
  const formVariations: IProductVariationFormState[] = product.variations.map(
    (variation: IProductVariation) => ({
      // --- THE DEFINITIVE FIX ---
      _id: variation._id, // <<<<----- THIS IS THE CRITICAL LINE THAT WAS MISSING.
      tempId: generateTemporaryId(),
      // --- END OF FIX ---

      sku: variation.sku || "",
      price: String(variation.price),
      salePrice:
        variation.salePrice !== undefined ? String(variation.salePrice) : "",
      inventory: String(variation.inventory),
      stockStatus: variation.stockStatus,
      attributeOptions: variation.attributeOptions,
      imageFiles: [],
      existingImageUrls: variation.imageUrls || [],
      imagesToDeletePublicIds: [],
      mainVariationImageIndex: String(variation.mainVariationImageIndex || 0),
      weight: variation.weight !== undefined ? String(variation.weight) : "",
      weightUnit: variation.weightUnit || "kg",
      dimensions: {
        length:
          variation.dimensions?.length !== undefined
            ? String(variation.dimensions.length)
            : "",
        width:
          variation.dimensions?.width !== undefined
            ? String(variation.dimensions.width)
            : "",
        height:
          variation.dimensions?.height !== undefined
            ? String(variation.dimensions.height)
            : "",
        unit: variation.dimensions?.unit || "cm",
      },
      barcode: variation.barcode || "",
      costPrice:
        variation.costPrice !== undefined ? String(variation.costPrice) : "",
      lowStockThreshold:
        variation.lowStockThreshold !== undefined
          ? String(variation.lowStockThreshold)
          : "",
      isActive: variation.isActive !== undefined ? variation.isActive : true,
    })
  );

  const formState: IProductFormState = {
    _id: product._id,
    name: product.name,
    description: product.description || "",
    shortDescription: product.shortDescription || "",
    currency: product.currency,
    categoryId: product.categoryId,
    brandId: product.brandId || "",
    tags: product.tags || [],
    mainImageFiles: [],
    existingMainImageUrls: product.imageUrls || [],
    mainImagesToDeletePublicIds: [],
    mainProductImageIndex: String(product.mainProductImageIndex || 0),
    status: product.status,
    visibility: product.visibility,
    variations: formVariations, // Use the correctly mapped variations
    metaTitle: product.metaTitle || "",
    metaDescription: product.metaDescription || "",
    metaKeywords: product.metaKeywords || [],
    basePrice: product.basePrice !== undefined ? String(product.basePrice) : "",
    baseSalePrice:
      product.baseSalePrice !== undefined
        ? String(product.baseSalePrice)
        : "",
    defaultWeight:
      product.defaultWeight !== undefined ? String(product.defaultWeight) : "",
    defaultWeightUnit: product.defaultWeightUnit || "kg",
    defaultDimensions: {
      length:
        product.defaultDimensions?.length !== undefined
          ? String(product.defaultDimensions.length)
          : "",
      width:
        product.defaultDimensions?.width !== undefined
          ? String(product.defaultDimensions.width)
          : "",
      height:
        product.defaultDimensions?.height !== undefined
          ? String(product.defaultDimensions.height)
          : "",
      unit: product.defaultDimensions?.unit || "cm",
    },
    isShippingRequired: product.isShippingRequired ?? true,
    isHazardousMaterial: product.isHazardousMaterial ?? false,
    isAgeRestricted: product.isAgeRestricted ?? false,
    ageRestrictionMinimum:
      product.ageRestrictionMinimum !== undefined
        ? String(product.ageRestrictionMinimum)
        : "",
    allowReviews: product.allowReviews ?? true,
  };

  return formState;
};