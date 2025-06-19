export type ObjectId = string;

export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  CANCELLED = "cancelled",
}
export enum PaymentStatus {
  PAID = "paid",
  PENDING = "pending",
}
export enum FulfillmentStatus {
  PENDING = "pending",
  SHIPPED = "shipped",
}

export interface PlaceOrderRequestDTO {
  checkoutSessionId: ObjectId;
  idempotencyKey: string;
  notes?: string;
}

export interface GetUserOrdersRequestParams {
  page?: number;
  limit?: number;
  status?: string;
  sort?: string;
}

export interface OrderItem {
  _id?: ObjectId;
  productId: ObjectId;
  variationId: ObjectId;
  name: string;
  sku?: string;
  quantity: number;
  price: number;
  subtotal: number;
  imageUrl?: string;
  attributes: { attributeName: string; optionValue: string }[];
  fulfillmentStatus?: FulfillmentStatus | string;
}

export interface OrderDocument {
  _id: ObjectId;
  orderNumber: string;
  userId: ObjectId;
  items: OrderItem[];
  shippingAddress: any;
  billingAddress: any;
  shippingDetails: {
    methodId: ObjectId;
    name: string;
    cost: number;
    deliveryEstimate?: string;
    trackingNumber?: string;
    carrier?: string;
  };
  paymentDetails: {
    method: string;
    transactionId: string;
    amount: number;
    currency: string;
    status: string;
    cardLast4?: string;
    cardBrand?: string;
  };
  totals: {
    itemsTotal: number;
    discountTotal: number;
    shippingTotal: number;
    taxTotal: number;
    grandTotal: number;
    currency: string;
  };
  status: OrderStatus | string;
  paymentStatus: PaymentStatus | string;
  fulfillmentStatus: FulfillmentStatus | string;
  customerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderListItem {
  _id: ObjectId;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus | string;
  paymentStatus?: PaymentStatus | string;
  fulfillmentStatus?: FulfillmentStatus | string;
  grandTotal: number;
  currency: string;
  itemCount: number;
  firstItemImage?: string;
  firstItemName?: string;
}

export interface IPaginatedResult<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export type PaginatedOrdersResult = IPaginatedResult<OrderListItem>;
