// src/types/shipping.ts

// --- Re-export or define generic API response types if not global ---
// Assuming ApiResponse and IPaginatedData are defined globally or in a shared types/api.ts
// export interface ApiResponse<T> {
//   statusCode: number;
//   data: T;
//   message: string;
//   success: boolean;
//   pagination?: { /* ... */ };
// }
// export interface IPaginatedData<T> {
//   data: T[];
//   pagination: { /* ... */ };
//   message?: string;
// }

// --- Shipping Zone Types ---

/**
 * Base structure for a Shipping Zone for frontend forms/payloads.
 * All IDs will be strings.
 */
export interface IShippingZoneBaseForm {
  name: string;
  description?: string;
  countries: string[]; // Array of ISO 3166-1 alpha-2 country codes
  states?: string[];    // Array of state/province codes/names
  isActive: boolean;
}

/**
 * Payload for creating a new Shipping Zone.
 * createdBy will be handled by the backend service.
 */
export interface IShippingZoneCreatePayload extends IShippingZoneBaseForm {}

/**
 * Payload for updating an existing Shipping Zone.
 * All fields are optional.
 * updatedBy will be handled by the backend service.
 */
export interface IShippingZoneUpdatePayload extends Partial<IShippingZoneBaseForm> {}

/**
 * Represents a Shipping Zone object as received from the API.
 */
export interface IShippingZoneResponse extends IShippingZoneBaseForm {
  id: string; // Was _id in backend, transformed
  createdBy?: string; // User ID string
  updatedBy?: string; // User ID string
  createdAt: string;   // ISO Date string
  updatedAt: string;   // ISO Date string
  // You might add denormalized counts or other useful info here if backend provides it
  // e.g., rateCount?: number;
}

// --- Shipping Rate Rule Types (for tiered rates) ---

/**
 * Structure for a rule within a Shipping Rate for frontend forms/payloads.
 * Numeric fields allow string for form input flexibility.
 */
export interface IShippingRateRuleForm {
  tempId?: string; // For frontend list management if rules are dynamically added/removed
  min?: string | number;
  max?: string | number;
  value: string | number; // Cost for this tier/rule
}

/**
 * Structure for a rule within a Shipping Rate for API payloads (numbers enforced).
 */
export interface IShippingRateRulePayload {
  min?: number;
  max?: number;
  value: number;
}

/**
 * Structure for a rule within a Shipping Rate as received from the API.
 */
export interface IShippingRateRuleResponse {
  min?: number;
  max?: number;
  value: number;
}


// --- Shipping Rate Types ---

export type ShippingRateType =
  | "flat"
  | "per_item"
  | "by_weight"
  | "by_price"
  | "by_quantity"
  | "tiered";

/**
 * Base structure for a Shipping Rate for frontend forms/payloads.
 */
export interface IShippingRateBaseForm {
  name: string;
  description?: string;
  zoneId: string; // ID of the parent ShippingZone
  cost: string | number; // Allow string for form input
  type: ShippingRateType;
  rules?: IShippingRateRuleForm[]; // Array of rules for tiered types
  minOrderTotal?: string | number;
  maxOrderTotal?: string | number;
  minWeight?: string | number;
  maxWeight?: string | number;
  minQuantity?: string | number;
  maxQuantity?: string | number;
  estimatedDeliveryTime?: string;
  isActive: boolean;
}

/**
 * Payload for creating a new Shipping Rate.
 * createdBy handled by backend service.
 */
export interface IShippingRateCreatePayload extends Omit<IShippingRateBaseForm, 'rules' | 'cost' | 'minOrderTotal' | 'maxOrderTotal' | 'minWeight' | 'maxWeight' | 'minQuantity' | 'maxQuantity'> {
    cost: number; // Enforce number for payload
    rules?: IShippingRateRulePayload[]; // Use numeric rules payload
    minOrderTotal?: number;
    maxOrderTotal?: number;
    minWeight?: number;
    maxWeight?: number;
    minQuantity?: number;
    maxQuantity?: number;
}

/**
 * Payload for updating an existing Shipping Rate.
 * All fields optional.
 * updatedBy handled by backend service.
 */
export interface IShippingRateUpdatePayload extends Partial<IShippingRateCreatePayload> {}


/**
 * Represents a Shipping Rate object as received from the API.
 */
export interface IShippingRateResponse extends Omit<IShippingRateBaseForm, 'rules' | 'cost' | 'minOrderTotal' | 'maxOrderTotal' | 'minWeight' | 'maxWeight' | 'minQuantity' | 'maxQuantity'> {
  id: string; // Was _id in backend
  cost: number; // Numeric from API
  rules?: IShippingRateRuleResponse[];
  minOrderTotal?: number;
  maxOrderTotal?: number;
  minWeight?: number;
  maxWeight?: number;
  minQuantity?: number;
  maxQuantity?: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string

  // Optionally include populated zone info if backend supports it and it's requested
  zone?: Pick<IShippingZoneResponse, 'id' | 'name'>; // Example of partial zone info
}


// --- Shipping Option Calculation (Frontend/User-facing) ---

/**
 * Payload sent to the backend to calculate available shipping rates.
 * Aligns with backend CalculateShippingRatesDto.
 */
export interface ICalculateShippingRatesPayload {
  cartId?: string;
  shippingAddressId?: string;
  // Corresponds to IShippingAddressSnapshot on backend, all strings for form simplicity initially
  shippingAddress?: {
    fullName?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    stateProvinceRegion: string; // State/Province code or name
    postalZipCode: string;
    country: string; // ISO 3166-1 alpha-2 country code
    phoneNumber?: string;
  };
  // items?: { productId: string; quantity: number; weight?: number; price?: number /* other relevant item details */ }[];
}

/**
 * Represents a calculated shipping option presented to the user.
 * Aligns with backend IShippingOption.
 */
export interface IShippingOptionFE {
  id: string; // ID of the IShippingRateDocument
  name: string;
  description?: string;
  estimatedDeliveryTime?: string;
  cost: number; // Final calculated cost
  // Potentially other fields from IShippingMethod if backend calculates them (carrier, precise date)
  // carrier?: string;
  // expectedDeliveryDate?: string;
}

// --- Select Options for UI ---
// If using react-select or similar, you might need a type for country/state options
export interface ICountrySelectOption {
    value: string; // ISO Alpha-2 Country Code
    label: string; // Country Name
}

export interface IStateSelectOption {
    value: string; // State Code/Name
    label: string; // State Name
    countryCode: string; // Parent country code
}

// Params for API list calls if they become complex
export type ShippingZoneListParams = {
    page?: number;
    limit?: number;
    filter?: string; // JSON string for complex filters
    sort?: string;   // JSON string or simple field string
    isActive?: boolean; // Specific filter example
};

export type ShippingRateListParams = {
    page?: number;
    limit?: number;
    filter?: string; // JSON string
    sort?: string;   // JSON string or simple field
    zoneId?: string; // Specific filter
    isActive?: boolean;
};