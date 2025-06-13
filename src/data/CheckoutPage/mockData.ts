// src/pages/CheckoutPage/mockData.ts

export const mockSavedAddresses = [
  { id: 'addr_1', name: 'Elara Vance', street: '123 Serenity Lane', city: 'Willow Creek', state: 'CA', zip: '90210', country: 'USA', isDefaultShipping: true, isDefaultBilling: true },
  { id: 'addr_2', name: 'Elara Vance', street: '456 Harmony Avenue', city: 'Willow Creek', state: 'CA', zip: '90210', country: 'USA' },
];

export const mockShippingOptions = [
  { id: 'ship_standard', name: 'Standard Shipping', description: '5-7 Business Days', cost: 0.00, estimatedDelivery: 'June 25 - June 28' },
  { id: 'ship_express', name: 'Express Shipping', description: '1-2 Business Days', cost: 15.99, estimatedDelivery: 'June 20 - June 21' },
];

export const mockSavedPaymentMethods = [
  { id: 'pm_visa_1234', type: 'Visa', last4: '1234', expiry: '12/2025', isDefault: true },
  { id: 'pm_mc_5678', type: 'Mastercard', last4: '5678', expiry: '08/2026' },
];

// Data for the BRIEF order summary on the main checkout page
export const mockBriefCartSummary = {
  itemCount: 3, // Total number of individual items
  subtotal: 264.99,
  currency: 'USD',
  itemsPreview: [ // Show 2-3 items with thumbnails
    { id: 'item_1', name: 'Élan Signature Linen Throw', image: 'https://picsum.photos/seed/summary1/60/60', quantity: 1 },
    { id: 'item_2', name: 'Artisan Hand-Poured Candle', image: 'https://picsum.photos/seed/summary2/60/60', quantity: 2 },
  ]
};