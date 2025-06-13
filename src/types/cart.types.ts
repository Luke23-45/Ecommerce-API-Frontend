import { Types, Document } from "mongoose";

export type ObjectId = string;

/**
 * Represents the structured details of a single item within the fully populated cart.
 * This is the data shape used for rendering a line item in the cart UI.
 */
export interface DisplayCartItem {
  _id: ObjectId;
  productId: ObjectId;
  variationId: ObjectId;
  quantity: number;

  name: string;
  price: number;
  image: string;
  sku?: string;
  slug?: string;
  stock: number;

  attributes: {
    name: string;
    value: string;
  }[];
}

/**
 * Represents the fully detailed cart object returned from the `GET /api/cart` endpoint.
 * This is the main data structure for rendering the entire cart.
 */
export interface DetailedCart {
  _id: ObjectId;
  userId: ObjectId;
  items: DisplayCartItem[];

  subtotal: number;
  totalQuantity: number;
  totalUniqueItems: number;
}

/**
 * The payload required to add an item to the cart.
 * Used for the `POST /api/cart/items` request.
 */
export interface AddToCartInputDTO {
  productId: string;
  variationId: string;
  quantity: number;
}

/**
 * The payload required to update the quantity of an existing item in the cart.
 * Used for the `PUT /api/cart/items/:cartItemId` request.
 */
export interface UpdateCartItemQuantityDTO {
  newQuantity: number;
}




export interface ICartItem {
  _id?: Types.ObjectId; 
  productId: Types.ObjectId;
  variationId: Types.ObjectId;
  quantity: number;

  
  
  
  name?: string;
  price?: number; 
  image?: string;
  attributes?: {
      attributeName: string;
      optionValue: string;
  }[];
}









export interface AddToCartInputDTO {
  productId: string; 
  variationId: string; 
  quantity: number;
}


export interface CreateCartDTO {
  userId?: Types.ObjectId | string;
  items: AddToCartInputDTO[];
  isAnonymous: boolean;
}


export interface InventoryUpdateResult {
  success: boolean;
  errors?: any;
}