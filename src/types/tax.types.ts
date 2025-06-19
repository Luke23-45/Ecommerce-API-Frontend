// src/types/tax.types.ts

// Re-using or adapting backend enums for frontend consistency
// These should match the enums used in your backend ITaxRate interface and validator
export enum TaxCalculationTypeFrontend {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
}

export enum TaxApplicabilityFrontend {
  ALL_PRODUCTS = 'all_products', // Applies to the total cart value or all taxable items
  SPECIFIC_CATEGORIES = 'specific_categories', // Applies only to products in specified categories
  // Add more if your backend supports them (e.g., PER_ITEM, SHIPPING_ONLY)
}


// --- For Form State (ITaxRateFormState) ---
// This represents the data managed by your TaxRateForm.tsx
export interface ITaxRateFormState {
  id?: string; // Present if editing an existing tax rate

  name: string;
  description?: string;

  // Geographical Targeting
  country: string; // 2-letter country code (e.g., "US")
  state?: string;   // State/Province/Region (e.g., "CA")
  city?: string;
  zipCode?: string; // Can be a specific code or a pattern like "902*" if backend supports

  rate: string; // Keep as string for form input, parse to number on submit
  calculationType: TaxCalculationTypeFrontend;
  applicability: TaxApplicabilityFrontend;

  startDate: string; // Store as string from date picker (e.g., "YYYY-MM-DD")
  endDate?: string | null;  // Store as string from date picker or allow null

  // Conditional field: only relevant if applicability is SPECIFIC_CATEGORIES
  applicableCategoryIds: string[]; // Array of category IDs (strings)

  isActive: boolean; // Default to true for new rates

  // createdBy and updatedBy are typically not part of the form state
  // as they are set by the backend based on the authenticated user.
}


// --- API PAYLOAD DTOs ---
// What the frontend sends to the backend API.
// These should closely match your backend TaxRateCreationDto and TaxRateUpdateDto.

export interface ITaxRateCreatePayload {
  name: string;
  description?: string | null;
  country: string;        // e.g., "US"
  state?: string | null;
  city?: string | null;
  zipCode?: string | null;
  rate: number;           // Numeric for backend
  calculationType: TaxCalculationTypeFrontend;
  applicability: TaxApplicabilityFrontend;
  startDate: string | Date; // Backend validator handles new Date(val)
  endDate?: string | Date | null;
  applicableCategoryIds?: string[] | null; // Array of category IDs (strings)
  isActive?: boolean;      // Backend defaults to true if not sent
  // createdBy is added by the service on the backend
}

export interface ITaxRateUpdatePayload extends Partial<ITaxRateCreatePayload> {
  // All fields are optional for an update, except for the ID which is in the URL
  // updatedBy is added by the service on the backend
}


// --- API RESPONSE TYPE ---
// What the frontend receives from the backend API for a single tax rate.
// This should mirror your backend ITaxRateDocument after toJSON transformation.
export interface ITaxRateResponse {
  id: string; // Transformed from _id
  name: string;
  description?: string | null;
  country: string;
  state?: string | null;
  city?: string | null;
  zipCode?: string | null;
  rate: number;
  calculationType: TaxCalculationTypeFrontend;
  applicability: TaxApplicabilityFrontend;
  startDate: string; // Typically ISO date string from backend
  endDate?: string | null;   // Typically ISO date string or null
  applicableCategoryIds?: string[]; // Array of category ID strings
  isActive: boolean;
  createdBy?: string; // User ID string
  updatedBy?: string; // User ID string
  createdAt: string;   // ISO Date string
  updatedAt: string;   // ISO Date string
}


// --- Types for Cart/Order Tax Calculation (if you build this UI later) ---
// These would align with your backend CalculateTaxesDto, etc.

// Represents a product snapshot for tax calculation on the frontend
export interface IProductSnapshotForTaxFrontend {
  productId: string;
  sku?: string;
  quantity: number;
  unitPrice: number; // Price before any item-level discounts relevant to tax base
  isTaxable: boolean; // Usually true, but some products might be exempt
  taxCode?: string; // Optional: For external tax services or specific product tax classifications
  categoryIds?: string[]; // To determine if category-specific tax rates apply
}

// Represents a cart item for tax calculation on the frontend
export interface ICartItemForTaxCalculationFrontend {
  productSnapshot: IProductSnapshotForTaxFrontend;
  totalAmount: number; // Line item total (quantity * unitPrice) AFTER item-level discounts
                      // because some taxes are applied on the discounted price.
  discountAmount?: number; // Item-level discount already applied
}

// Shipping address snapshot for tax calculation on the frontend
export interface IShippingAddressSnapshotFrontend {
  street1: string;
  street2?: string;
  city: string;
  state: string;        // State/Province/Region code
  zipCode: string;
  country: string;      // 2-letter ISO country code
}

// Payload for requesting tax calculation from the frontend
export interface ICalculateTaxesPayloadFrontend {
  cartItems: ICartItemForTaxCalculationFrontend[];
  shippingAddress: IShippingAddressSnapshotFrontend;
  shippingAmount?: number; // If shipping is also taxed
  // customerId?: string; // If customer-specific exemptions apply
  // couponCodes?: string[]; // If discounts affect taxable amount
}

// Structure for an individual tax line item in the calculation result
export interface ITaxLineItemFrontend {
  taxRateId: string;
  name: string;         // Name of the tax (e.g., "State Sales Tax", "VAT")
  rate: number;         // The rate applied (e.g., 0.07 for 7%)
  amount: number;       // The calculated tax amount for this line item
  taxableAmount: number; // The portion of the cart/item total this tax was applied to
}

// Result of tax calculation received from the backend
export interface ITaxCalculationResultFrontend {
  lineItems: ITaxLineItemFrontend[]; // Breakdown of each tax applied
  totalTaxAmount: number;            // Sum of all tax amounts
  taxableSubtotal: number;           // Total amount on which taxes were calculated
  // Include other relevant info if backend provides it
  // effectiveAddress?: IShippingAddressSnapshotFrontend; // The address used for calculation
}


// --- Re-export or define generic API response types if not global ---
// Ensure these match the structure used by your `taxApi.ts` and backend.
// If these are already defined in a shared file (e.g., @/types/api.ts or from attribute/product types),
// you would import them instead of redefining.

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
  errors?: Record<string, string> | string[];
  pagination?: { /* ... */ };
}

export interface IPaginatedData<T> {
  data: T[];
  pagination: { /* ... */ };
  message?: string;
}