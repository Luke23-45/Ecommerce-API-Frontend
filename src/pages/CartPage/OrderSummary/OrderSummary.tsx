
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa'; 


import {
  SummaryCardWrapper,
  Title,
  Row,
  Label,
  Value,
  DiscountCodeWrapper,
  DiscountMessage,
  CheckoutActionsWrapper,
  ExpressCheckoutOptions, 
  SecureInfo,
} from './OrderSummary.styles';


import { PrimaryCtaButton } from '@/pages/BecomeAPartnerPage/BecomeAPartnerPage.styles';

interface OrderSummaryData {
  subtotal: number;
  shippingCost: number;
  estimatedTaxes: number;
  totalDiscount: number;
  total: number;
  itemCount: number; 
}

interface OrderSummaryProps {
  summary: OrderSummaryData;
  onApplyDiscount: (code: string) => { success: boolean; message: string }; 
  onProceedToCheckout: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  summary, 
  onApplyDiscount, 
  onProceedToCheckout 
}) => {
  const [discountCodeInput, setDiscountCodeInput] = useState("");
  const [discountMessage, setDiscountMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  const handleApplyDiscountCode = () => {
    if (!discountCodeInput.trim()) {
      setDiscountMessage({type: 'error', text: "Please enter a discount code."});
      return;
    }
    const result = onApplyDiscount(discountCodeInput); 
    setDiscountMessage({ type: result.success ? 'success' : 'error', text: result.message });
    if (result.success) {
        
    }
  };

  return (
    <SummaryCardWrapper>
      <Title>Order Summary</Title>
      
      <Row>
        <Label>Subtotal ({summary.itemCount} item{summary.itemCount !== 1 ? 's':''})</Label>
        <Value>${summary.subtotal.toFixed(2)}</Value>
      </Row>

      <Row>
        <Label>Estimated Shipping</Label>
        <Value>{summary.shippingCost === 0 ? 'FREE' : `$${summary.shippingCost.toFixed(2)}`}</Value>
      </Row>

      <Row>
        <Label>Estimated Sales Tax</Label>
        <Value>${summary.estimatedTaxes.toFixed(2)}</Value>
      </Row>

      <DiscountCodeWrapper>
        <input
          type="text"
          placeholder="Enter Discount Code"
          value={discountCodeInput}
          onChange={(e) => { setDiscountCodeInput(e.target.value); setDiscountMessage(null); }}
          aria-label="Discount Code"
        />
        <button type="button" onClick={handleApplyDiscountCode}>Apply</button>
      </DiscountCodeWrapper>
      {discountMessage && (
        <DiscountMessage $type={discountMessage.type}>
            {discountMessage.text}
        </DiscountMessage>
      )}
      {summary.totalDiscount > 0 && (
        <Row style={{ color: 'var(--theme-colors-adminStatusSuccess, #388E3C)'}}> {/* Direct color usage for success */}
          <Label>Discount Applied</Label>
          <Value>-${summary.totalDiscount.toFixed(2)}</Value>
        </Row>
      )}

      <Row className="total-row">
        <Label>Order Total</Label>
        <Value>${summary.total.toFixed(2)}</Value>
      </Row>

      <CheckoutActionsWrapper>
        <PrimaryCtaButton onClick={onProceedToCheckout} $fullWidth >
          Proceed to Secure Checkout
        </PrimaryCtaButton>
        
        {/* Placeholder for Express Checkout Options */}
        {/* <ExpressCheckoutOptions>
          <img src="/paypal-button.png" alt="PayPal Express Checkout" />
          <img src="/apple-pay-button.png" alt="Apple Pay" />
        </ExpressCheckoutOptions> */}
      </CheckoutActionsWrapper>

      <SecureInfo>
        <FaLock /> <span>SSL Secure Transaction. Your information is protected.</span>
      </SecureInfo>
    </SummaryCardWrapper>
  );
};

export default OrderSummary;