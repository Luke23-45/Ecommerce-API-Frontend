


import { Types } from "mongoose"; 



export type ProductStatus =
  | "draft"
  | "pending_review"
  | "active"
  | "archived"
  | "rejected";

export type ProductVisibility = "public" | "hidden" | "private";

export type StockStatus =
  | "in_stock"
  | "out_of_stock"
  | "backorder"
  | "pre_order";

export type DimensionUnit = "cm" | "in" | "mm" | "m" | "ft" | "yd";
export type WeightUnit = "kg" | "g" | "lb" | "oz";


export interface IDimensionsForm {
  
  length?: string | number; 
  width?: string | number;
  height?: string | number;
  unit?: DimensionUnit;
}

export interface IDimensionsPayload {
  
  length?: number;
  width?: number;
  height?: number;
  unit?: DimensionUnit; 
}


export interface IProductAttributeOptionForm {
  attributeId: string; 
  attributeName: string; 
  optionId: string; 
  optionValue: string; 
  optionSwatchValue?: string; 
}


export interface IProductVariationFormState {
  tempId: string; 
  
  sku: string;
  price: string; 
  salePrice?: string;
  inventory: string;
  stockStatus: StockStatus;
  attributeOptions: IProductAttributeOptionForm[];

  imageFiles: File[]; 
  existingImageUrls?: string[]; 
  
  imagesToDeletePublicIds?: string[];

  mainVariationImageIndex?: string; 

  weight?: string;
  weightUnit?: WeightUnit;
  dimensions?: IDimensionsForm;
  barcode?: string;
  costPrice?: string; 
  lowStockThreshold?: string;
  isActive: boolean; 
}


export interface IProductFormState {
  _id?: string; 

  name: string;
  description: string;
  shortDescription: string;

  
  
  basePrice?: string;
  baseSalePrice?: string;
  currency: string; 

  categoryId: string; 
  brandId?: string; 
  tags: string[]; 

  
  mainImageFiles: File[]; 
  existingMainImageUrls?: string[]; 
  mainImagesToDeletePublicIds?: string[]; 
  mainProductImageIndex?: string; 

  
  
  
  
  sellerType?: "individual_seller" | "vendor"; 
  sellerId?: string; 

  status: ProductStatus;
  visibility: ProductVisibility;

  variations: IProductVariationFormState[];

  
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];

  
  defaultWeight?: string;
  defaultWeightUnit?: WeightUnit;
  defaultDimensions?: IDimensionsForm;
  isShippingRequired: boolean;

  
  isHazardousMaterial: boolean;
  isAgeRestricted: boolean;
  ageRestrictionMinimum?: string;

  
  allowReviews: boolean;
}



/**
 * Payload for a single variation within CreateProductDTO.
 * Mirrors backend's `CreateProductVariationDTO` (JSON part).
 * `imageFiles` are sent separately in FormData, not in this JSON.
 */
export interface IProductVariationPayload
  extends Omit<
    IProductVariationFormState,
    | "tempId"
    | "imageFiles"
    | "existingImageUrls"
    | "imagesToDeletePublicIds"
    | "price" 
    | "salePrice"
    | "inventory"
    | "weight"
    | "costPrice"
    | "lowStockThreshold"
    | "dimensions" 
    | "mainVariationImageIndex" 
  > {
  
  price: number;
  salePrice?: number;
  inventory: number;
  mainVariationImageIndex?: number;
  weight?: number;
  costPrice?: number;
  lowStockThreshold?: number;
  dimensions?: IDimensionsPayload;
  
}

/**
 * Payload for creating a new product.
 * Mirrors backend's `CreateProductDTO` (JSON part).
 * `mainImageFiles` are sent separately in FormData.
 * `sellerId` is not part of backend CreateProductDTO (service uses actorUserId).
 * `sellerType` IS part of what the backend service expects on its DTO.
 */
export interface IProductCreatePayload
  extends Omit<
    IProductFormState,
    | "_id" 
    | "mainImageFiles"
    | "existingMainImageUrls"
    | "mainImagesToDeletePublicIds"
    | "variations" 
    | "basePrice" 
    | "baseSalePrice"
    | "defaultWeight"
    | "ageRestrictionMinimum"
    | "defaultDimensions" 
    | "mainProductImageIndex" 
    | "sellerId" 
  > {
  
  basePrice?: number;
  baseSalePrice?: number;
  defaultWeight?: number;
  ageRestrictionMinimum?: number;
  mainProductImageIndex?: number;

  variations: IProductVariationPayload[];
  defaultDimensions?: IDimensionsPayload;
}




export interface IProductUpdatePayload
  extends Partial<Omit<IProductCreatePayload, "sellerType">> {
  _id: string; 
  name?: string;
  
  
  
  
  
  

  
  variations?: (Partial<IProductVariationPayload> & { _id?: string })[]; 
}





export interface IProductAttributeOptionResponse {
  attributeId: string;
  attributeName: string;
  optionId: string;
  optionValue: string;
  optionSwatchValue?: string;
}

export interface IProductVariationResponse {
  _id: string; 
  sku?: string;
  price: number;
  salePrice?: number;
  inventory: number;
  stockStatus: StockStatus;
  attributeOptions: IProductAttributeOptionResponse[];
  imageUrls?: string[];
  mainVariationImageIndex?: number;
  weight?: number;
  weightUnit?: WeightUnit;
  dimensions?: IDimensionsPayload; 
  barcode?: string;
  costPrice?: number; 
  lowStockThreshold?: number;
  isActive: boolean; 
}


export interface IProductResponse {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  basePrice?: number;
  baseSalePrice?: number;
  currency: string;
  categoryId: string; 
  
  brandId?: string; 
  
  tags?: string[];
  imageUrls: string[];
  mainProductImageIndex?: number;
  sellerType: "individual_seller" | "vendor";
  sellerId: string; 
  status: ProductStatus;
  visibility: ProductVisibility;
  variations: IProductVariationResponse[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  defaultWeight?: number;
  defaultWeightUnit?: WeightUnit;
  defaultDimensions?: IDimensionsPayload;
  isShippingRequired?: boolean;
  isHazardousMaterial?: boolean;
  isAgeRestricted?: boolean;
  ageRestrictionMinimum?: number;
  allowReviews?: boolean;
  averageRating?: number;
  reviewCount?: number;
  createdBy: string; 
  updatedBy?: string; 
  reviewedBy?: string; 
  reviewComment?: string;
  reviewedAt?: string; 
  publishedAt?: string; 
  createdAt: string; 
  updatedAt: string; 
}



export interface IProductListItemData {
  _id: string;
  name: string;
  slug?: string;
  currency: string;
  imageUrls: string[]; 
  status: ProductStatus;
  visibility: ProductVisibility;
  tags?: string[];
  sellerType: "individual_seller" | "vendor";
  sellerId: string;

  
  mainImageUrl: string;
  displayPrice: number;
  displaySalePrice?: number;
  isOnSale: boolean;
  stockStatus: StockStatus;
  categoryName?: string; 
  brandName?: string; 
  averageRating?: number;
  viewLink: string; 
}
















export interface IProductDocument extends IProduct {
  _id: Types.ObjectId; 
}

export interface IPaginatedResult<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export type IPaginatedProductsResult = IPaginatedResult<IProductDocument>;

export interface IPaginatedProductListItemsResult
  extends IPaginatedResult<IProductListItemData> {}

  export interface IProductVariationFormState {
  _id?: string; 
  tempId: string; 
  sku: string;
  price: string;
  salePrice: string;
  inventory: string;
  stockStatus: StockStatus;
  attributeOptions: IProductAttributeOptionForm[];
  imageFiles: File[];
  existingImageUrls: string[];
  imagesToDeletePublicIds: string[]; 
  mainVariationImageIndex: string;
  weight: string;
  weightUnit: WeightUnit;
  dimensions: {
    length: string;
    width: string;
    height: string;
    unit: DimensionUnit;
  };
  barcode: string;
  costPrice: string;
  lowStockThreshold: string;
  isActive: boolean;
}

export interface IProductVariationFormState {
  /**
   * The real database ID (`_id`) of the variation. This is `undefined` for a
   * new variation that hasn't been saved yet. It's essential for distinguishing
   * between "create" and "update" operations.
   */
  _id?: string;

  /**
   * A temporary, client-side-only ID used for React's `key` prop and for
   * tracking changes in the UI before a variation has a real `_id`.
   */
  tempId: string;

  /** The Stock Keeping Unit for this specific variation. */
  sku: string;

  /** The selling price of the variation. Stored as a string for the input field. */
  price: string;

  /** The optional discounted price. Stored as a string. */
  salePrice: string;

  /** The current inventory count. Stored as a string. */
  inventory: string;

  /** The stock status of this variation (e.g., in_stock, out_of_stock). */
  stockStatus: StockStatus;

  /** The combination of attribute options defining this variation (e.g., Color: Red, Size: Large). */
  attributeOptions: IProductAttributeOption[];

  /** An array of new `File` objects that the user has selected for upload for this variation. */
  imageFiles: File[];

  /** An array of URLs for images that already exist on the server for this variation. */
  existingImageUrls: string[];

  /**
   * An array of public IDs or URLs for existing images that the user has marked for deletion.
   * This array is populated by the ImageUploader component.
   */
  imagesToDeletePublicIds: string[];

  /**
   * The index (as a string) of the primary image within the combined list of
   * existing and new images for this variation.
   */
  mainVariationImageIndex: string;

  /** The weight of this specific variation. Stored as a string. */
  weight: string;

  /** The unit of measurement for the weight (e.g., kg, lb). */
  weightUnit: WeightUnit;

  /** The physical dimensions of this variation. Stored as strings. */
  dimensions: {
    length: string;
    width: string;
    height: string;
    unit: DimensionUnit;
  };

  /** The barcode for this variation (e.g., UPC, EAN). */
  barcode: string;

  /** The internal cost of this variation, for profit calculation. Stored as a string. */
  costPrice: string;

  /** The inventory level at which to trigger a "low stock" warning. Stored as a string. */
  lowStockThreshold: string;

  /** A boolean flag to determine if this specific variation can be purchased. */
  isActive: boolean;
}