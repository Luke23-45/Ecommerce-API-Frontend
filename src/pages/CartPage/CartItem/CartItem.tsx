

import React, { useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { useTheme } from "styled-components";


import {
  CartItemWrapper,
  ItemImageLink,
  ItemInfoAndControls,
  ItemTextDetails,
  ItemName,
  ItemVariant,
  ItemUnitPrice,
  ItemPricingActions,
  ItemLineTotal,
  RemoveItemButton,
  MutationOverlay, 
} from "./CartItem.styles";
import QuantityInput from "@/components/ProductDetail/QuantityInput";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { type DisplayCartItem } from "@/types/cart.types"; 


interface CartItemProps {
  item: DisplayCartItem; 
  onQuantityChange: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  isMutating: boolean; 
  animationDelay?: string;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onQuantityChange,
  onRemoveItem,
  isMutating, 
  animationDelay,
}) => {
  const theme = useTheme();

  const lineItemTotal = useMemo(() => {
    return item.price * item.quantity;
  }, [item.price, item.quantity]);

  const handleQuantityUpdate = (newQuantity: number) => {
    
    onQuantityChange(item._id, newQuantity);
  };

  return (
    <CartItemWrapper $animationDelay={animationDelay}>
    
      {isMutating && (
        <MutationOverlay>
          <LoadingSpinner size="2rem" />
        </MutationOverlay>
      )}

      <ItemImageLink
        as={RouterLink}
        to={`/product/${item.slug}`} 
        aria-label={`View product ${item.name}`}
      >
        <img src={item.image} alt={item.name} loading="lazy" />
      </ItemImageLink>

      <ItemInfoAndControls>
        <ItemTextDetails>
          <ItemName as={RouterLink} to={`/product/${item.slug}`}>
            {item.name}
          </ItemName>
          {/* Render attributes if they exist */}
          {item.attributes && item.attributes.length > 0 && (
            <ItemVariant>
              {item.attributes.map(attr => `${attr.name}: ${attr.value}`).join(' / ')}
            </ItemVariant>
          )}
          <ItemUnitPrice>${item.price.toFixed(2)}</ItemUnitPrice>
        </ItemTextDetails>

        <div style={{ marginTop: "auto", paddingTop: theme.spacing(2), maxWidth: "140px" }}>
          <QuantityInput
            currentQuantity={item.quantity}
            onQuantityChange={handleQuantityUpdate}
            minQuantity={1}
            maxQuantity={item.stock} 
            ariaLabel={`Quantity for ${item.name}`}
            disabled={isMutating} 
          />
        </div>
      </ItemInfoAndControls>

      <ItemPricingActions>
        <ItemLineTotal>${lineItemTotal.toFixed(2)}</ItemLineTotal>
        <RemoveItemButton
          onClick={() => onRemoveItem(item._id)} 
          aria-label={`Remove ${item.name} from cart`}
          disabled={isMutating} 
        >
          <FaTrashAlt /> Remove
        </RemoveItemButton>
      </ItemPricingActions>
    </CartItemWrapper>
  );
};

export default CartItem;