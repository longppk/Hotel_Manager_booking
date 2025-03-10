import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CartDetail, CartInfo } from "../types/types";

const initialState = {
  loading: false,
  cartNumber: 0,
  listCartPay: [{}],
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
    },
    fetchEnd: (state) => {
      state.loading = false;
    },
    updateCartNumber: (state, action: PayloadAction<number>) => {
      state.cartNumber = action.payload;
    },
    addListCartPay: (state, action: PayloadAction<CartDetail[]>) => {
      state.listCartPay = action.payload;
    },
  },
});

export const { fetchStart, fetchEnd, updateCartNumber, addListCartPay } =
  appSlice.actions;

export default appSlice.reducer;
