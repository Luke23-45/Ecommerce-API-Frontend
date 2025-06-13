
import api from "@/api";
import {
  type DetailedCart,
  type AddToCartInputDTO,
  type UpdateCartItemQuantityDTO,
} from "@/types/cart.types"; 



type CartApiResponse = {
  data: DetailedCart | null; 
  
};

export const cartApi = {

  getCart: async (): Promise<DetailedCart | null> => {
    try {
      const response = await api.get<CartApiResponse>("/cart");
      return response.data.data;
    } catch (error) {
      console.error("API Error: getCart", error);
      throw error;
    }
  },


  addItem: async (itemData: AddToCartInputDTO): Promise<DetailedCart> => {
    try {
      const response = await api.post<CartApiResponse>("/cart/items", itemData);
      
      if (!response.data.data) {
        throw new Error("API did not return an updated cart after adding an item.");
      }
      return response.data.data;
    } catch (error) {
      console.error("API Error: addItemToCart", error);
      throw error;
    }
  },


  updateItemQuantity: async (
    cartItemId: string,
    quantityData: UpdateCartItemQuantityDTO
  ): Promise<DetailedCart> => {
    try {
      const response = await api.put<CartApiResponse>(
        `/cart/items/${cartItemId}`,
        quantityData
      );
      if (!response.data.data) {
        throw new Error("API did not return an updated cart after updating quantity.");
      }
      return response.data.data;
    } catch (error) {
      console.error("API Error: updateItemQuantity", error);
      throw error;
    }
  },

  removeItem: async (cartItemId: string): Promise<DetailedCart> => {
    try {
      const response = await api.delete<CartApiResponse>(
        `/cart/items/${cartItemId}`
      );
      if (!response.data.data) {
        throw new Error("API did not return an updated cart after removing an item.");
      }
      return response.data.data;
    } catch (error) {
      console.error("API Error: removeItemFromCart", error);
      throw error;
    }
  },


  clearCart: async (): Promise<DetailedCart> => {
    try {
      const response = await api.delete<CartApiResponse>("/cart");
      if (!response.data.data) {
        throw new Error("API did not return a cart after clearing.");
      }
      return response.data.data;
    } catch (error) {
      console.error("API Error: clearCart", error);
      throw error;
    }
  },
};