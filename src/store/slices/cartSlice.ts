import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/**
 * Interface for the cart slice state, containing only the total quantity count.
 * No 'status' or 'error' as we're not managing async state directly within this slice.
 */
interface ICartSlice {
  count: number;
}

const initialState: ICartSlice = {
  count: 0,
};

const cartSlice = createSlice({
  name: "cartslice",
  initialState,

  reducers: {
    /**
     * Sets the total count of items in the cart to a specific number.
     * This is the primary action you'll dispatch.
     */
    setCartCount: (state, action: PayloadAction<number>) => {
      state.count = Math.max(
        0,
        Number.isFinite(action.payload) ? action.payload : 0
      );
    },
    /**
     * Increments the total cart count by a specified amount (default 1).
     */
    incrementCartCount: (state, action: PayloadAction<number | undefined>) => {
      state.count = Math.max(0, state.count + (action.payload ?? 1));
    },
    /**
     * Decrements the total cart count by a specified amount (default 1).
     */
    decrementCartCount: (state, action: PayloadAction<number | undefined>) => {
      state.count = Math.max(0, state.count - (action.payload ?? 1));
    },
  },
});

export const { setCartCount, incrementCartCount, decrementCartCount } =
  cartSlice.actions;

export default cartSlice.reducer;
