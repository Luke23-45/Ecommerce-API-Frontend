// src/components/checkout/BriefOrderSummary/BriefOrderSummary.tsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { FaShoppingCart, FaGift, FaSpinner } from 'react-icons/fa'; // Added FaSpinner for loading

// Import local styles (updated)
import {
  SummaryCardWrapper,
  SummaryTitle,
  ItemPreviewList,
  ItemPreview,
  ItemPreviewThumbnail,
  ItemPreviewDetails,
  ViewAllItemsLink,
  DiscountInputWrapper,
  DiscountMessage,
  SubtotalRow,         // For the first subtotal
  CostLineItemRow,     // For shipping, discount, tax
  GrandTotalRow,       // For the final total
  SubtotalLabel,       // Reusable label
  SubtotalValue,       // Reusable value
  ProceedButtonWrapper,
} from './BriefOrderSummary.styles';

// Assuming PrimaryCtaButton is beautifully styled and imported
// Ensure it supports an isLoading prop for the spinner

import { PrimaryCtaButton } from '@/pages/BecomeAPartnerPage/BecomeAPartnerPage.styles';
// Type definitions
// Ensure these types are consistent or imported from a shared location
export interface BriefCartItemPreview {
  id: string;
  name: string;
  quantity: number;
  image: string;
  price?: number; // Optional individual price if shown in preview
  // variantInfo?: string; // e.g., "Color: Ivory, Size: M"
}

export interface AppliedDiscountInfo {
  code: string;
  amount: number;
  description?: string;
}

export interface OrderSummaryData {
  itemCount: number;
  currency: string; // e.g., "USD"
  itemsPreview: BriefCartItemPreview[];
  
  // These will be calculated and passed down from CheckoutPage or a global cart/checkout state
  subtotal: number; // Subtotal before discount, shipping, tax
  shippingCost?: number | null; // Null if not yet calculated/selected
  appliedDiscount?: AppliedDiscountInfo | null;
  estimatedTaxes?: number | null; // Null if not yet calculated
  grandTotal: number; // Final total after all additions/subtractions
}

interface BriefOrderSummaryProps {
  summary: OrderSummaryData;
  // Renamed for clarity as its function changes
  onPrimaryAction: () => void; 
  primaryActionText: string; // e.g., "Proceed to Review", "Place Your Order"
  isPrimaryActionDisabled: boolean;
  isPrimaryActionLoading?: boolean; // For showing spinner on the button

  onApplyDiscount: (discountCode: string) => Promise<boolean>; // Returns true on success, false on failure
  discountFeedback: { type: 'success' | 'error'; text: string } | null;
  isApplyingDiscount: boolean; // True while onApplyDiscount is in progress
  onClearDiscountFeedback?: () => void; // Optional: to clear feedback message
}

const MAX_ITEMS_TO_DISPLAY = 3;

const BriefOrderSummary: React.FC<BriefOrderSummaryProps> = ({
  summary,
  onPrimaryAction,
  primaryActionText,
  isPrimaryActionDisabled,
  isPrimaryActionLoading,
  onApplyDiscount,
  discountFeedback,
  isApplyingDiscount,
  onClearDiscountFeedback,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [discountCodeInput, setDiscountCodeInput] = useState('');

  const handleApplyDiscountClick = async () => {
    if (discountCodeInput.trim() && !isApplyingDiscount) {
      const success = await onApplyDiscount(discountCodeInput.trim());
      if (success) {
        // Optionally clear input on successful application, or keep it if codes can stack (unlikely)
        // setDiscountCodeInput(''); 
      }
    }
  };
  
  const handleDiscountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiscountCodeInput(e.target.value);
    if (discountFeedback && onClearDiscountFeedback) {
      onClearDiscountFeedback(); // Clear previous feedback when user types
    }
  }

  const itemsToShow = summary.itemsPreview.slice(0, MAX_ITEMS_TO_DISPLAY);
  const hasMoreItems = summary.itemsPreview.length > MAX_ITEMS_TO_DISPLAY;

  // No longer need to calculate displaySubtotal here, parent passes comprehensive summary.grandTotal

  return (
    <SummaryCardWrapper>
      <SummaryTitle>
        <FaShoppingCart /> Your Order Summary
      </SummaryTitle>

      <ItemPreviewList>
        {itemsToShow.map(item => (
          <ItemPreview key={item.id}>
            <ItemPreviewThumbnail>
              <img src={item.image || `https://via.placeholder.com/64x64/${theme.colors.primaryNeutral.slice(1)}/${theme.colors.accent1.slice(1)}?text=${item.name.substring(0,1)}`} alt={item.name} />
            </ItemPreviewThumbnail>
            <ItemPreviewDetails>
              <span className="name">{item.name}</span>
              <span className="quantity">Qty: {item.quantity}</span>
              {/* Optional: Display individual item price if available */}
              {/* {item.price && <span className="price">{summary.currencySymbol || '$'}{item.price.toFixed(2)}</span>} */}
            </ItemPreviewDetails>
          </ItemPreview>
        ))}
      </ItemPreviewList>

      {hasMoreItems && (
        <ViewAllItemsLink onClick={() => navigate('/cart')} aria-label={`View all ${summary.itemCount} items in your cart and make edits.`}>
          View all {summary.itemCount} items & edit cart
        </ViewAllItemsLink>
      )}

      {/* --- DISCOUNT CODE SECTION --- */}
      <DiscountInputWrapper>
        <FaGift />
        <input
          type="text"
          placeholder="Gift card or discount code"
          value={discountCodeInput}
          onChange={handleDiscountInputChange}
          aria-label="Gift card or discount code"
          disabled={isApplyingDiscount}
        />
        <button 
          type="button" 
          onClick={handleApplyDiscountClick} 
          disabled={isApplyingDiscount || !discountCodeInput.trim()}
          aria-live="polite" // Announces changes for screen readers
        >
          {isApplyingDiscount ? (
            <FaSpinner aria-hidden="true" style={{ animation: 'spin 1s linear infinite' }} /> 
          ) : (
            'Apply'
          )}
        </button>
      </DiscountInputWrapper>

      {discountFeedback && (
        <DiscountMessage $type={discountFeedback.type} role="alert">
          {discountFeedback.text}
        </DiscountMessage>
      )}
      
      {/* --- DETAILED COST BREAKDOWN --- */}
      <SubtotalRow> {/* Initial Subtotal (before discount) */}
        <SubtotalLabel>Subtotal</SubtotalLabel>
        <SubtotalValue>{summary.currency === 'USD' ? '$':''}{summary.subtotal.toFixed(2)}</SubtotalValue>
      </SubtotalRow>

      {summary.appliedDiscount && (
        <CostLineItemRow $isDiscount={true}>
          <SubtotalLabel>
            Discount ({summary.appliedDiscount.code})
            {summary.appliedDiscount.description && `: ${summary.appliedDiscount.description}`}
          </SubtotalLabel>
          <SubtotalValue>- {summary.currency === 'USD' ? '$':''}{summary.appliedDiscount.amount.toFixed(2)}</SubtotalValue>
        </CostLineItemRow>
      )}

      {/* Shipping Cost - show only if defined and not free (or always show if free) */}
      {(summary.shippingCost !== undefined && summary.shippingCost !== null) && (
        <CostLineItemRow>
          <SubtotalLabel>Shipping</SubtotalLabel>
          <SubtotalValue>
            {summary.shippingCost === 0 ? 'FREE' : `${summary.currency === 'USD' ? '$':''}${summary.shippingCost.toFixed(2)}`}
          </SubtotalValue>
        </CostLineItemRow>
      )}
      
      {/* Estimated Taxes - show only if defined */}
      {(summary.estimatedTaxes !== undefined && summary.estimatedTaxes !== null && summary.estimatedTaxes > 0) && (
        <CostLineItemRow>
          <SubtotalLabel>Estimated Taxes</SubtotalLabel>
          <SubtotalValue>{summary.currency === 'USD' ? '$':''}{summary.estimatedTaxes.toFixed(2)}</SubtotalValue>
        </CostLineItemRow>
      )}

      <GrandTotalRow>
        <SubtotalLabel>Grand Total</SubtotalLabel>
        <SubtotalValue>{summary.currency === 'USD' ? '$':''}{summary.grandTotal.toFixed(2)}</SubtotalValue>
      </GrandTotalRow>
      {/* --- END DETAILED COST BREAKDOWN --- */}

      <ProceedButtonWrapper>
        <PrimaryCtaButton
          $fullWidth // Assuming your button supports this or is styled to be full-width via wrapper
          onClick={onPrimaryAction}
          disabled={isPrimaryActionDisabled || isApplyingDiscount} // Also disable if applying discount
          isLoading={isPrimaryActionLoading} // For spinner on the button
          aria-live="polite"
        >
          {isPrimaryActionLoading ? (
            <>
              <FaSpinner aria-hidden="true" style={{ animation: 'spin 1s linear infinite', marginRight: theme.spacing(2) }} /> 
              Processing...
            </>
          ) : (
            primaryActionText
          )}
        </PrimaryCtaButton>
      </ProceedButtonWrapper>
    </SummaryCardWrapper>
  );
};

export default BriefOrderSummary;