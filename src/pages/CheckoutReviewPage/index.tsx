// src/pages/CheckoutReviewPage/index.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShippingFast, FaCreditCard, FaShoppingCart, FaLock, FaUndo, FaReceipt } from 'react-icons/fa';

// --- Import Beautiful New Styles ---
import {
  ReviewPageWrapper,
  ReviewContentLimiter,
  ReviewHeader,
  BackButton,
  ReviewLayout,
  MainContent,
  Sidebar,
  ReviewCard,
  CardHeader,
  SectionTitle,
  EditLink,
  CardBody,
  ItemList,
  Item,
  ItemThumbnail,
  ItemDetails,
  ItemName,
  ItemVariant,
  ItemQuantityPrice,
  SummaryCard,
  TotalRow,
  InfoLabel,
  InfoValue,
  DiscountRow,
  GrandTotalRow,
  PlaceOrderButton,
  SecurityNotice,
} from './CheckoutReviewPage.styles';

// --- Mock Data ---
const mockFullOrderSummary = {
  // ... (mock data remains the same)
  sessionId: 'sess_mock_123',
  items: [
    { _id: 'item_1', name: 'Élan Signature Linen Throw', quantity: 1, price: 129.99, image: 'https://picsum.photos/seed/summary1/80/80', attributes: [{name: 'Color', value: 'Natural Beige'}, {name: 'Size', value: 'Standard'}] },
    { _id: 'item_2', name: 'Artisan Hand-Poured Candle', quantity: 2, price: 45.00, image: 'https://picsum.photos/seed/summary2/80/80', attributes: [{name: 'Scent', value: 'Lavender & Cedarwood'}] },
    { _id: 'item_3', name: 'Minimalist Sculptural Vase', quantity: 1, price: 85.00, image: 'https://picsum.photos/seed/summary3/80/80', attributes: [] },
  ],
  shippingAddress: { name: 'Elara Vance', street: '123 Serenity Lane', city: 'Willow Creek', state: 'CA', zip: '90210', country: 'USA' },
  billingAddress: { name: 'Elara Vance', street: '123 Serenity Lane', city: 'Willow Creek', state: 'CA', zip: '90210', country: 'USA' },
  shippingDetails: { id: 'ship_standard', name: 'Standard Shipping', description: '5-7 Business Days', cost: 0.00 },
  paymentMethod: { type: 'Visa', last4: '1234', expiry: '12/2025' },
  discountDetails: [{ code: 'ELAN15', amount: 44.25, description: '15% Off Your Order' }],
  taxDetails: { totalTaxAmount: 19.87 },
  totals: {
    itemsTotal: 299.99,
    shippingTotal: 0.00,
    discountTotal: 44.25,
    taxTotal: 19.87,
    grandTotal: 275.61,
    currency: 'USD',
  },
};

const CheckoutReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const orderSummary = mockFullOrderSummary;

  const handleEdit = (section: string) => {
    navigate(`/checkout#${section}`);
  };

  const handlePlaceOrder = () => {
    console.log("Placing order with summary:", orderSummary);
    alert("Order Placed! (Static Demo)");
    // navigate('/order-confirmation/mock_order_id');
  };

  if (!orderSummary) {
    return <div>Loading order summary...</div>;
  }

  return (
    <ReviewPageWrapper>
      <ReviewContentLimiter>
        <ReviewHeader>
          <h1>Review & Confirm</h1>
          <BackButton onClick={() => navigate('/checkout')}>
            <FaUndo /> Back to Edit
          </BackButton>
        </ReviewHeader>

        <ReviewLayout>
          <MainContent>
            {/* --- SHIPPING, BILLING, AND PAYMENT DETAILS --- */}
            <ReviewCard>
              <CardHeader>
                <SectionTitle><FaShippingFast /> Shipping</SectionTitle>
                <EditLink onClick={() => handleEdit('shipping')}>Change</EditLink>
              </CardHeader>
              <CardBody>
                <strong>Ship To:</strong><br />
                {orderSummary.shippingAddress.name}<br />
                {orderSummary.shippingAddress.street}<br />
                {orderSummary.shippingAddress.city}, {orderSummary.shippingAddress.state} {orderSummary.shippingAddress.zip}
              </CardBody>
              <CardBody style={{borderTop: '1px solid #EAECEF'}}>
                <strong>Method:</strong><br />
                {orderSummary.shippingDetails.name} ({orderSummary.shippingDetails.description})
              </CardBody>
            </ReviewCard>
            
            <ReviewCard>
              <CardHeader>
                <SectionTitle><FaCreditCard /> Payment</SectionTitle>
                <EditLink onClick={() => handleEdit('payment')}>Change</EditLink>
              </CardHeader>
              <CardBody>
                <strong>Payment Method:</strong><br />
                {orderSummary.paymentMethod.type} ending in •••• {orderSummary.paymentMethod.last4}
              </CardBody>
              <CardBody style={{borderTop: '1px solid #EAECEF'}}>
                <strong>Billing Address:</strong><br />
                {orderSummary.billingAddress.street}, {orderSummary.billingAddress.city}, {orderSummary.billingAddress.state}
              </CardBody>
            </ReviewCard>

            {/* --- ITEMS IN ORDER --- */}
            <ReviewCard>
              <CardHeader>
                <SectionTitle><FaShoppingCart /> Items in Order ({orderSummary.items.length})</SectionTitle>
              </CardHeader>
              <CardBody style={{padding: '0 1.75rem'}}>
                <ItemList>
                  {orderSummary.items.map(item => (
                    <Item key={item._id}>
                      <ItemThumbnail>
                        <img src={item.image} alt={item.name} />
                      </ItemThumbnail>
                      <ItemDetails>
                        <ItemName>{item.name}</ItemName>
                        {item.attributes.length > 0 && (
                          <ItemVariant>
                            {item.attributes.map(attr => `${attr.name}: ${attr.value}`).join(' / ')}
                          </ItemVariant>
                        )}
                      </ItemDetails>
                      <ItemQuantityPrice>
                        <span>Qty: {item.quantity}</span>
                        <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                      </ItemQuantityPrice>
                    </Item>
                  ))}
                </ItemList>
              </CardBody>
            </ReviewCard>
          </MainContent>

          <Sidebar>
            <SummaryCard>
              <SectionTitle style={{paddingBottom: '1rem', borderBottom: '1px solid #EAECEF'}}><FaReceipt /> Order Summary</SectionTitle>
              <TotalRow>
                <InfoLabel>Subtotal</InfoLabel>
                <InfoValue>${orderSummary.totals.itemsTotal.toFixed(2)}</InfoValue>
              </TotalRow>
              <TotalRow>
                <InfoLabel>Shipping</InfoLabel>
                <InfoValue>{orderSummary.totals.shippingTotal === 0 ? 'FREE' : `$${orderSummary.totals.shippingTotal.toFixed(2)}`}</InfoValue>
              </TotalRow>
              {orderSummary.discountDetails.map(discount => (
                <DiscountRow key={discount.code}>
                  <InfoLabel>Discount ({discount.code})</InfoLabel>
                  <InfoValue>-${discount.amount.toFixed(2)}</InfoValue>
                </DiscountRow>
              ))}
              <TotalRow>
                <InfoLabel>Estimated Tax</InfoLabel>
                <InfoValue>${orderSummary.totals.taxTotal.toFixed(2)}</InfoValue>
              </TotalRow>
              <GrandTotalRow>
                <InfoLabel>Order Total</InfoLabel>
                <InfoValue>${orderSummary.totals.grandTotal.toFixed(2)}</InfoValue>
              </GrandTotalRow>
            </SummaryCard>
            <PlaceOrderButton onClick={handlePlaceOrder}>
              Place Your Order
            </PlaceOrderButton>
            <SecurityNotice>
              <FaLock /> Your payment is secure and your information is protected.
            </SecurityNotice>
          </Sidebar>
        </ReviewLayout>
      </ReviewContentLimiter>
    </ReviewPageWrapper>
  );
};

export default CheckoutReviewPage;