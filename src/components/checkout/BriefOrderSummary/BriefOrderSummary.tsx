// src/pages/CheckoutPage/components/BriefOrderSummary.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaGift } from 'react-icons/fa'; // Added FaGift

// Import local styles (including new ones)
import {
  SummaryCardWrapper,
  SummaryTitle,
  ItemPreviewList,
  ItemPreview,
  ItemPreviewThumbnail,
  ItemPreviewDetails,
  ViewAllItemsLink,
  DiscountInputWrapper, // <-- New Import
  DiscountMessage,      // <-- New Import
  SubtotalRow,
  SubtotalLabel,
  SubtotalValue,
  ProceedButtonWrapper,
} from './BriefOrderSummary.styles';

import { PrimaryCtaButton } from '@/pages/BecomeAPartnerPage/BecomeAPartnerPage.styles';
interface BriefCartItemPreview { /* ... */ }

interface BriefOrderSummaryProps {
  summary: {
    itemCount: number;
    subtotal: number;
    currency: string;
    itemsPreview: BriefCartItemPreview[];
    // We'll add discount details here later when integrating with the API
    appliedDiscount?: { code: string; amount: number; description?: string };
  };
  onProceedToReview: () => void;
  onApplyDiscount: (discountCode: string) => void; // Callback for applying discount
  discountFeedback: { type: 'success' | 'error'; text: string } | null; // Feedback from parent
  isApplyingDiscount: boolean; // Loading state for discount application
  canProceed: boolean;
}

const MAX_ITEMS_TO_DISPLAY = 3;

const BriefOrderSummary: React.FC<BriefOrderSummaryProps> = ({
  summary,
  onApplyDiscount,
  discountFeedback,
  isApplyingDiscount,
  canProceed,
}) => {
  const navigate = useNavigate();
  const [discountCodeInput, setDiscountCodeInput] = useState('');
  const onProceedToReview = () =>{
    navigate("/checkoutsummery");
  }
  
  const handleApplyClick = () => {
    if (discountCodeInput.trim()) {
      onApplyDiscount(discountCodeInput.trim());
    }
  };

  const itemsToShow = summary.itemsPreview.slice(0, MAX_ITEMS_TO_DISPLAY);
  const hasMoreItems = summary.itemsPreview.length > MAX_ITEMS_TO_DISPLAY;

  // Adjust subtotal if a discount is applied (this will be refined with real API data)
  const displaySubtotal = summary.appliedDiscount 
    ? summary.subtotal - summary.appliedDiscount.amount 
    : summary.subtotal;

  return (
    <SummaryCardWrapper>
      <SummaryTitle>
        <FaShoppingCart /> Your Order
      </SummaryTitle>

      <ItemPreviewList>
        {itemsToShow.map(item => (
          <ItemPreview key={item.id}>
            <ItemPreviewThumbnail><img src={item.image} alt={item.name} /></ItemPreviewThumbnail>
            <ItemPreviewDetails>
              <span className="name">{item.name}</span>
              <span className="quantity">Qty: {item.quantity}</span>
            </ItemPreviewDetails>
          </ItemPreview>
        ))}
      </ItemPreviewList>

      {hasMoreItems && (
        <ViewAllItemsLink onClick={() => navigate('/cart')}>
          View all {summary.itemCount} items & edit
        </ViewAllItemsLink>
      )}

      {/* --- DISCOUNT CODE SECTION --- */}
      <DiscountInputWrapper>
        <FaGift />
        <input
          type="text"
          placeholder="Gift card or discount code"
          value={discountCodeInput}
          onChange={(e) => setDiscountCodeInput(e.target.value)}
          aria-label="Discount Code"
          disabled={isApplyingDiscount}
        />
        <button type="button" onClick={handleApplyClick} disabled={isApplyingDiscount}>
          {isApplyingDiscount ? 'Applying...' : 'Apply'}
        </button>
      </DiscountInputWrapper>
      {discountFeedback && (
        <DiscountMessage $type={discountFeedback.type}>
          {discountFeedback.text}
        </DiscountMessage>
      )}
      {summary.appliedDiscount && (
        <SubtotalRow style={{color: 'green'}}> {/* Example styling */}
          <SubtotalLabel>{summary.appliedDiscount.description || `Discount (${summary.appliedDiscount.code})`}</SubtotalLabel>
          <SubtotalValue>-${summary.appliedDiscount.amount.toFixed(2)}</SubtotalValue>
        </SubtotalRow>
      )}
      {/* --- END DISCOUNT CODE SECTION --- */}

      <SubtotalRow>
        <SubtotalLabel>Subtotal</SubtotalLabel>
        <SubtotalValue>${displaySubtotal.toFixed(2)} {summary.currency}</SubtotalValue>
      </SubtotalRow>
      {/* Note: Shipping and Taxes are not shown in this brief summary */}

      <ProceedButtonWrapper>
        <PrimaryCtaButton
          $fullWidth
          onClick={onProceedToReview}
          disabled={!canProceed || isApplyingDiscount}
        >
          Proceed to Review Order
        </PrimaryCtaButton>
      </ProceedButtonWrapper>
    </SummaryCardWrapper>
  );
};

export default BriefOrderSummary;