// src/utils/productFormUtils.ts

import type{ IProductFormState, IProductResponse, IProductVariationFormState } from "@/types/product.types";

/**
 * Generates a unique temporary ID for UI elements before they are saved to the database.
 * Useful for React `key` props and tracking new items in a list, like variations.
 *
 * The ID is composed of a "temp-" prefix, the current timestamp in milliseconds,
 * and a short random alphanumeric string. This combination makes collisions
 * in a user session virtually impossible.
 *
 * @example
 * // Returns something like: 'temp-1678886400000-b7q2z8x'
 *
 * @returns {string} A temporary unique string identifier.
 */
export const generateTemporaryId = (): string => {
  // Get the current time in milliseconds since the epoch.
  // This provides a highly unique base that is always increasing.
  const timestamp = Date.now();

  // Generate a random number, convert it to a base-36 string (0-9, a-z),
  // and take a slice to get a short random part.
  const randomPart = Math.random().toString(36).substring(2, 9);

  return `temp-${timestamp}-${randomPart}`;
};

/**
 * Safely parses a string or number input into a floating-point number.
 * It correctly handles both period and comma as decimal separators.
 * Returns null if the input is empty, null, undefined, or cannot be converted to a valid number.
 * This is essential for converting string inputs from the form (e.g., price, weight) to numbers for the API payload.
 *
 * @param value The input value to parse (string, number, null, or undefined).
 * @returns {number | null} The parsed number, or null if the value is invalid or empty.
 */
export const safeParseFloat = (value: string | number | null | undefined): number | null => {
  if (value === null || value === undefined || String(value).trim() === '') {
    return null;
  }

  // Replace comma with a period for international compatibility before parsing.
  const numericString = String(value).replace(',', '.');
  const number = parseFloat(numericString);

  return isNaN(number) ? null : number;
};

/**
 * Safely parses a string or number input into an integer.
 * Useful for fields like inventory, which must be whole numbers.
 * Returns null if the input is empty, null, undefined, or cannot be converted to a valid integer.
 *
 * @param value The input value to parse (string, number, null, or undefined).
 * @returns {number | null} The parsed integer, or null if the value is invalid or empty.
 */
export const safeParseInt = (value: string | number | null | undefined): number | null => {
  if (value === null || value === undefined || String(value).trim() === '') {
    return null;
  }

  // `parseInt` handles floating-point strings by truncating, which is acceptable for this use case.
  const number = parseInt(String(value), 10);

  return isNaN(number) ? null : number;
};

/**
 * Converts a Product Response object from the API (`IProductResponse`) into a form state object (`IProductFormState`).
 * This is crucial for populating the form when a user is editing an existing product. It handles:
 * - Converting numbers and other data types to strings for form inputs.
 * - Setting sensible defaults for optional or missing fields.
 * - Correctly structuring nested objects and arrays for the form's state.
 *
 * By centralizing this logic, we keep the main form component cleaner.
 *
 * @param product The IProductResponse object received from the backend.
 * @returns {IProductFormState} The state object ready to be used by the React form.
 */
export const mapProductResponseToFormState = (product: IProductResponse): IProductFormState => {
  return {
    _id: product._id,
    name: product.name || '',
    description: product.description || '',
    shortDescription: product.shortDescription || '',

    basePrice: product.basePrice?.toString() || '',
    baseSalePrice: product.baseSalePrice?.toString() || '',
    currency: product.currency || 'USD', // Default currency if not provided

    categoryId: product.categoryId || '',
    brandId: product.brandId || '',
    tags: product.tags || [],

    mainImageFiles: [], // Edit mode always starts with no *new* files selected
    existingMainImageUrls: product.imageUrls || [],
    mainImagesToDeletePublicIds: [], // User populates this by interacting with the UI
    mainProductImageIndex: product.mainProductImageIndex?.toString() || '0',

    sellerType: product.sellerType, // In edit mode, we know the seller type
    sellerId: product.sellerId,     // and the seller ID

    status: product.status,
    visibility: product.visibility,

    variations: (product.variations || []).map(
      (v): IProductVariationFormState => ({
        tempId: v._id, // In edit mode, the backend _id serves as the key/temporary ID for UI tracking
        sku: v.sku || '',
        price: v.price.toString(),
        salePrice: v.salePrice?.toString() || '',
        inventory: v.inventory.toString(),
        stockStatus: v.stockStatus,
        attributeOptions: v.attributeOptions || [],

        imageFiles: [],
        existingImageUrls: v.imageUrls || [],
        imagesToDeletePublicIds: [],
        mainVariationImageIndex: v.mainVariationImageIndex?.toString() || '0',

        weight: v.weight?.toString() || '',
        weightUnit: v.weightUnit,
        dimensions: {
          length: v.dimensions?.length?.toString() || '',
          width: v.dimensions?.width?.toString() || '',
          height: v.dimensions?.height?.toString() || '',
          unit: v.dimensions?.unit,
        },
        barcode: v.barcode || '',
        costPrice: v.costPrice?.toString() || '',
        lowStockThreshold: v.lowStockThreshold?.toString() || '',
        isActive: v.isActive !== undefined ? v.isActive : true,
      })
    ),

    // SEO
    metaTitle: product.metaTitle || '',
    metaDescription: product.metaDescription || '',
    metaKeywords: product.metaKeywords || [],

    // Shipping
    defaultWeight: product.defaultWeight?.toString() || '',
    defaultWeightUnit: product.defaultWeightUnit,
    defaultDimensions: {
      length: product.defaultDimensions?.length?.toString() || '',
      width: product.defaultDimensions?.width?.toString() || '',
      height: product.defaultDimensions?.height?.toString() || '',
      unit: product.defaultDimensions?.unit,
    },
    isShippingRequired: product.isShippingRequired !== undefined ? product.isShippingRequired : true,

    // Compliance
    isHazardousMaterial: product.isHazardousMaterial || false,
    isAgeRestricted: product.isAgeRestricted || false,
    ageRestrictionMinimum: product.ageRestrictionMinimum?.toString() || '',

    // Settings
    allowReviews: product.allowReviews !== undefined ? product.allowReviews : true,
  };
};