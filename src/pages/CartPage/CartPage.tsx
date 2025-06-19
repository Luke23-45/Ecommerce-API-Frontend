import React, { useState, useMemo, useCallback } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useTheme } from "styled-components";
import { FaShoppingCart, FaArrowLeft, FaLock, FaGift } from "react-icons/fa";

import {
  CartPageWrapper,
  CartContentLimiter,
  CartHeader,
  HeaderActions,
  ItemCountDisplay,
  ContinueShoppingLink,
  MainCartLayout,
  CartItemsContainer,
  OrderSummaryWrapper,
  SummaryTitle,
  SummaryRow,
  SummaryLabel,
  SummaryValue,
  DiscountInputWrapper,
  CheckoutButtonWrapper,
  EmptyCartWrapper,
} from "./CartPage.styles";
import {
  SecureInfo,
  DiscountMessage,
} from "./OrderSummary/OrderSummary.styles";

import { PrimaryCtaButton } from "../BecomeAPartnerPage/BecomeAPartnerPage.styles";

import CartItem from "./CartItem/CartItem";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import {
  useGetCart,
  useUpdateItemQuantity,
  useRemoveItemFromCart,
} from "@/hooks/cart/useCart";
import { type DisplayCartItem } from "@/types/cart.types";
import { useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/types";
import { useDispatch } from "react-redux";
import { setCartCount } from "@/store/slices/cartSlice";

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const dispatch = useDispatch<AppDispatch>();

  const { data: cartData, isLoading, isError, error } = useGetCart();
  const { mutate: updateQuantity } = useUpdateItemQuantity();
  const { mutate: removeItem } = useRemoveItemFromCart();

  const [mutatingItemId, setMutatingItemId] = useState<string | null>(null);
  const [discountCodeInput, setDiscountCodeInput] = useState<string>("");
  const [discountFeedback, setDiscountFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const cartItemCount = useSelector((state: RootState) => state.cart.count);

  function getTotalQuantity(cart) {
    if (!cart?.items || !Array.isArray(cart.items)) {
      return 0;
    }

    return cart.items.reduce((total, item) => total + (item.quantity || 0), 0);
  }

  const handleQuantityChange = useCallback(
    (itemId: string, newQuantity: number, num) => {
      if (newQuantity < 1) return;
      setMutatingItemId(itemId);
      updateQuantity(
        { cartItemId: itemId, quantityData: { newQuantity } },
        {
          onSuccess: (data) => {
            const dat1 = parseInt(getTotalQuantity(data));
            if (dat1 > 0 && typeof dat1 === "number") {
              dispatch(setCartCount(dat1));
            }
          },
          onSettled: () => setMutatingItemId(null),
        }
      );
    },
    [updateQuantity]
  );

  const handleRemoveItem = useCallback(
    (itemId: string) => {
      setMutatingItemId(itemId);
      removeItem(itemId, {
        onSuccess: (data) => {
          const dat1 = parseInt(getTotalQuantity(data));
          if (dat1 > 0 && typeof dat1 === "number") {
            dispatch(setCartCount(dat1));
          }
        },
        onSettled: () => setMutatingItemId(null),
      });
    },
    [removeItem]
  );

  const handleApplyDiscount = useCallback(() => {
    alert("Discount code functionality is not yet implemented.");
  }, []);

  const handleProceedToCheckout = () => {
    navigate("/checkout");
  };

  if (isLoading) {
    return (
      <CartPageWrapper>
        <CartContentLimiter
          style={{ textAlign: "center", padding: "5rem 1rem" }}
        >
          <LoadingSpinner message="Loading Your Shopping Bag..." />
        </CartContentLimiter>
      </CartPageWrapper>
    );
  }

  if (isError) {
    return (
      <CartPageWrapper>
        <CartContentLimiter
          style={{ textAlign: "center", padding: "5rem 1rem" }}
        >
          <h2>Error Loading Cart</h2>
          <p>
            {(error as Error)?.message ||
              "We couldn't retrieve your cart. Please try again later."}
          </p>
        </CartContentLimiter>
      </CartPageWrapper>
    );
  }

  if (!cartData || cartData.items.length === 0) {
    return (
      <CartPageWrapper>
        <CartContentLimiter>
          <EmptyCartWrapper>
            <FaShoppingCart className="empty-cart-icon" />
            <h2>Your Élan Bag is Empty</h2>
            <p>
              Explore our curated collections to find items that inspire your
              space.
            </p>
            <PrimaryCtaButton onClick={() => navigate("/")}>
              Discover Collections
            </PrimaryCtaButton>
          </EmptyCartWrapper>
        </CartContentLimiter>
      </CartPageWrapper>
    );
  }

  const { items, totalUniqueItems, subtotal } = cartData;
  const totalQuantity = subtotal;

  const shippingCost = subtotal >= 100 ? 0 : 12.5;
  const estimatedTaxes = subtotal * 0.0825;
  const grandTotal = subtotal + shippingCost + estimatedTaxes;

  return (
    <CartPageWrapper>
      <CartContentLimiter>
        <CartHeader>
          <h1>Your Shopping Bag</h1>
          <HeaderActions>
            <ItemCountDisplay>
              {totalUniqueItems} Item{totalUniqueItems !== 1 ? "s" : ""}
              {` (${totalQuantity.toFixed(2)} Total)`}
            </ItemCountDisplay>
            <ContinueShoppingLink as={RouterLink} to="/collections">
              <FaArrowLeft style={{ marginRight: theme.spacing(1.5) }} />{" "}
              Continue Shopping
            </ContinueShoppingLink>
          </HeaderActions>
        </CartHeader>

        <MainCartLayout>
          <CartItemsContainer>
            {items.map((item: DisplayCartItem, index: number) => (
              <CartItem
                key={item._id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemoveItem={handleRemoveItem}
                isMutating={mutatingItemId === item._id}
                animationDelay={`${index * 0.06 + 0.1}s`}
              />
            ))}
          </CartItemsContainer>

          <OrderSummaryWrapper>
            <SummaryTitle>Order Summary</SummaryTitle>

            <SummaryRow>
              <SummaryLabel>Subtotal ({totalQuantity} items)</SummaryLabel>
              <SummaryValue>${subtotal.toFixed(2)}</SummaryValue>
            </SummaryRow>

            <SummaryRow>
              <SummaryLabel>Estimated Shipping</SummaryLabel>
              <SummaryValue>
                {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
              </SummaryValue>
            </SummaryRow>

            <SummaryRow>
              <SummaryLabel>Estimated Sales Tax</SummaryLabel>
              <SummaryValue>${estimatedTaxes.toFixed(2)}</SummaryValue>
            </SummaryRow>

            <DiscountInputWrapper>
              <FaGift />
              <input
                type="text"
                placeholder="Gift card or discount code"
                value={discountCodeInput}
                onChange={(e) => setDiscountCodeInput(e.target.value)}
              />
              <button type="button" onClick={handleApplyDiscount}>
                Apply
              </button>
            </DiscountInputWrapper>

            {discountFeedback && (
              <DiscountMessage $type={discountFeedback.type}>
                {discountFeedback.text}
              </DiscountMessage>
            )}

            <SummaryRow className="total-row">
              <SummaryLabel>Order Total</SummaryLabel>
              <SummaryValue>${grandTotal.toFixed(2)}</SummaryValue>
            </SummaryRow>

            <CheckoutButtonWrapper>
              <PrimaryCtaButton
                onClick={handleProceedToCheckout}
                $fullWidth
                disabled={!!mutatingItemId}
              >
                Proceed to Secure Checkout
              </PrimaryCtaButton>
            </CheckoutButtonWrapper>

            <SecureInfo>
              <FaLock /> <span>SSL Secure Transaction</span>
            </SecureInfo>
          </OrderSummaryWrapper>
        </MainCartLayout>
      </CartContentLimiter>
    </CartPageWrapper>
  );
};

export default CartPage;
