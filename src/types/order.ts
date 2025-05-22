

export type PaymentStatus = "paid" | "pending" | "refunded" | "failed" | "canceled";
export type FulfillmentStatus = "processing" | "shipped" | "delivered" | "canceled" | "returned";

export interface OrderItem {
    productId: string;
    productName: string;
    productSku?: string;
    productMainImageUrl?: string; 
    quantity: number;
    priceAtTimeOfPurchase: number;
    variationAttributes?: { name: string; value: string; }[]; 
}

export interface ShippingAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface CustomerDetails {
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
}


export interface Order {
    _id: string; 
    customer: CustomerDetails;
    orderItems: OrderItem[];
    totalAmount: number;
    currency: string;
    paymentStatus: PaymentStatus;
    fulfillmentStatus: FulfillmentStatus;
    shippingAddress: ShippingAddress;
    billingAddress?: ShippingAddress;
    shippingMethod: string;
    trackingNumber?: string;
    carrier?: string;
    orderNotes?: string; 
    adminNotes?: string; 
    vendorId?: string; 
    sellerId?: string; 
    createdAt: string; 
    updatedAt: string; 
    
}