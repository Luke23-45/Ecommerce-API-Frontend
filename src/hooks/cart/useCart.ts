import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/api/admin/product/cart/cartApi";
import {
  type DetailedCart,
  type AddToCartInputDTO,
  type UpdateCartItemQuantityDTO,
} from "@/types/cart.types";
import { useNotification } from "@/contexts/NotificationContext";

export const cartKeys = {
  all: ["cart"] as const,
  details: () => [...cartKeys.all, "details"] as const,
};

export const useGetCart = () => {
  return useQuery<DetailedCart | null>({
    queryKey: cartKeys.details(),
    queryFn: cartApi.getCart,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};


export const useAddItemToCart = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: (itemData: AddToCartInputDTO) => cartApi.addItem(itemData),

    onSuccess: (updatedCart) => {
      queryClient.setQueryData(cartKeys.details(), updatedCart);
      showNotification("Item added to cart!", "success");
    },
    onError: (error: any) => {
      showNotification(error.message || "Failed to add item.", "error");
    },
  });
};


export const useUpdateItemQuantity = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: ({
      cartItemId,
      quantityData,
    }: {
      cartItemId: string;
      quantityData: UpdateCartItemQuantityDTO;
    }) => cartApi.updateItemQuantity(cartItemId, quantityData),

    onSuccess: (updatedCart) => {
      queryClient.setQueryData(cartKeys.details(), updatedCart);
    },
    onError: (error: any) => {
      showNotification(error.message || "Failed to update quantity.", "error");
    },
  });
};


export const useRemoveItemFromCart = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: (cartItemId: string) => cartApi.removeItem(cartItemId),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(cartKeys.details(), updatedCart);
      showNotification("Item removed from cart.", "info");
    },
    onError: (error: any) => {
      showNotification(error.message || "Failed to remove item.", "error");
    },
  });
};

/**
 * A hook for clearing all items from the cart.
 */
export const useClearCart = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: (clearedCart) => {
      queryClient.setQueryData(cartKeys.details(), clearedCart);
      showNotification("Cart has been cleared.", "success");
    },
    onError: (error: any) => {
      showNotification(error.message || "Failed to clear cart.", "error");
    },
  });
};
