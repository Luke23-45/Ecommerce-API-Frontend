export type ProductStatusFrontend =
  | "draft"
  | "active"
  | "archived"
  | "out_of_stock"
  | "pending_review"
  | "rejected"
  | "inactive";

export type StockStatusFrontend = "in_stock" | "out_of_stock" | "backorder";

export interface ProductDimensions {
  length?: number;
  width?: number;
  height?: number;
  unit?: string;
}

export interface ProductVariation {
  _id?: string;
  sku: string;
  price: number;
  salePrice?: number;
  inventory: number;

  attributes: {
    name: string;
    value: string;
  }[];

  color?: string;
  size?: string;
  material?: string;

  imageUrls: string[];
  weight?: number;
  dimensions?: ProductDimensions;

  stockStatus: StockStatusFrontend;
}

export interface ProductDetail {
  _id?: string;
  name: string;
  sku: string;
  description?: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  currency: string;
  categoryId: string;
  categoryName?: string;
  brand?: string;
  manufacturer?: string;

  inventory: number;
  weight?: number;
  dimensions?: ProductDimensions;
  stockStatus: StockStatusFrontend;

  imageUrls: string[];
  

  sellerType: "individual_seller" | "vendor";
  individualSellerId?: string;
  vendorId?: string;

  sellerName?: string;
  vendorName?: string;

  status: ProductStatusFrontend;
  visibility: "public" | "hidden";

  variations: ProductVariation[];

  material?: string;
  color?: string;
  size?: string;
  tags?: string[];

  hazardousMaterial?: boolean;
  ageRestricted?: boolean;
  ageRestrictionMinimum?: number;

  createdAt?: string;
  updatedAt?: string;
}


export interface Product extends ProductDetail{}