// src/types/discount.ts

// --- Re-export or mirror backend enums for frontend use ---
export enum DiscountType {
    PERCENTAGE = 'percentage',
    FIXED_AMOUNT = 'fixed_amount',
    BUY_X_GET_Y = 'buy_x_get_y',
    FREE_SHIPPING = 'free_shipping',
}

export enum DiscountApplicability {
    ALL_PRODUCTS = 'all_products',
    SPECIFIC_PRODUCTS = 'specific_products',
    SPECIFIC_CATEGORIES = 'specific_categories',
}

// --- Rule structure for frontend form state and API payload ---
// (Mirrors backend IDiscountRule but with string IDs)
export interface IDiscountRuleForm {
    // type is implicitly 'buy_x_get_y' when this structure is used
    buyQuantity: string | number; // string for form input
    getQuantity: string | number; // string for form input
    
    // For selecting what the "Y" (get items) applies to
    getProductIds?: string[];    // Array of product IDs (strings)
    getCategoryIds?: string[];   // Array of category IDs (strings)

    // Discount for the "Y" items if not free
    discountAmount?: string | number; // string for form input
    discountPercentage?: string | number; // string for form input
}
export interface IDiscountRulePayload extends Omit<IDiscountRuleForm, 'buyQuantity' | 'getQuantity' | 'discountAmount' | 'discountPercentage' > {
    buyQuantity: number;
    getQuantity: number;
    discountAmount?: number;
    discountPercentage?: number;
}


// --- Discount Form State (for creating and editing discounts) ---
export interface IDiscountFormState {
    id?: string; // Present if editing

    code: string;
    name: string;
    description: string; // Use empty string for undefined
    
    type: DiscountType;
    value: string | number; // string for form input, parse to number on submit

    applicability: DiscountApplicability;
    // These will hold selected entities (e.g., { id: '...', name: '...' }) for display in multi-select tags,
    // but only IDs are sent to backend.
    applicableProducts: { id: string, name: string }[]; // For UI selection
    applicableCategories: { id: string, name: string }[]; // For UI selection
    
    minimumOrderAmount?: string | number;
    maximumDiscountAmount?: string | number; // Especially for percentage type

    usageLimit?: string | number;
    // usageCount is read-only, comes from backend
    usageLimitPerCustomer?: string | number;

    startDate: string; // ISO string or formatted for date picker
    endDate?: string | null; // Allow null for no end date

    isActive: boolean;
    // usersFor will hold selected user entities for UI, send only IDs
    targetUsers: { id: string, nameOrEmail: string }[]; // For UI selection

    // For "Buy X Get Y" or other complex rules
    rules: IDiscountRuleForm[]; // Manage array of rules
}

// --- API Payload DTOs (What gets sent to the backend) ---

// For creation (aligns with backend DiscountCreationDto but uses string IDs)
export interface IDiscountCreatePayload extends Omit<IDiscountFormState, 'id' | 'applicableProducts' | 'applicableCategories' | 'targetUsers' | 'rules' | 'value' | 'minimumOrderAmount' | 'maximumDiscountAmount' | 'usageLimit' | 'usageLimitPerCustomer'> {
    value: number; // Converted from form state string
    applicableProductIds?: string[]; // Derived from applicableProducts
    applicableCategoryIds?: string[]; // Derived from applicableCategories
    minimumOrderAmount?: number;
    maximumDiscountAmount?: number;
    usageLimit?: number;
    usageLimitPerCustomer?: number;
    usersFor?: string[]; // Derived from targetUsers
    rules?: IDiscountRulePayload[]; // Processed rules
    // createdBy is set by backend service
}

// For update (Partial of create payload)
export interface IDiscountUpdatePayload extends Partial<IDiscountCreatePayload> {
    // updatedBy is set by backend service
}


// --- API Response Type (What we get back from the backend) ---
// This should mirror IDiscountDocument from backend, with IDs as strings and dates as strings.

export interface IDiscountRuleResponse extends Omit<IDiscountRulePayload, 'getProductIds' | 'getCategoryIds'> {
    // If backend populates product/category names for rules, add them here
    getProductIds?: string[]; // Or IProductResponse[] if populated
    getCategoryIds?: string[]; // Or ICategoryResponse[] if populated
}

export interface IDiscountResponse {
    id: string; // Transformed from _id
    code: string;
    name: string;
    description?: string;
    type: DiscountType;
    value: number;
    applicability: DiscountApplicability;
    applicableProductIds?: string[]; // Array of product IDs
    // To display names, you'd fetch product details separately based on these IDs
    applicableCategoryIds?: string[]; // Array of category IDs
    minimumOrderAmount?: number;
    maximumDiscountAmount?: number;
    usageLimit?: number;
    usageCount: number; // Comes from backend
    usageLimitPerCustomer?: number;
    startDate: string; // ISO date string
    endDate?: string | null; // ISO date string or null
    isActive: boolean;
    usersFor?: string[]; // Array of user IDs
    rules?: IDiscountRuleResponse[]; // Array of rule objects
    createdBy?: string; // User ID string
    updatedBy?: string; // User ID string
    createdAt: string;   // ISO Date string
    updatedAt: string;   // ISO Date string

    // Optional: Frontend might want to display names of applicable items/users
    // These would require additional fetching or more complex backend population.
    // applicableProductNames?: string[];
    // applicableCategoryNames?: string[];
    // targetUserNames?: string[];
}


// --- For paginated lists from API ---
// Assuming generic IPaginatedData and ApiResponse types are defined elsewhere
// If not, they would be:
// export interface ApiResponse<T> { ... }
// export interface IPaginatedData<T> { data: T[]; pagination: { ... }; ... }

// --- Query Params for API list calls ---
// (If not already defined generically or in a repository interface file for frontend use)
export interface IDiscountListApiParams {
  page?: number;
  limit?: number;
  filter?: string; // JSON string for complex filters (e.g., by type, isActive, date range)
  sort?: string;   // JSON string for complex sort or simple field string (e.g., "code" or "-createdAt")
  projection?: string;
  lean?: boolean;
  code?: string; // Specific filter for searching by code
  isActive?: boolean; // Specific filter
}