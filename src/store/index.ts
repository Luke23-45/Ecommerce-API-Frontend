// src/store/index.ts
import {
  configureStore,
  combineReducers,
  type ThunkAction,
  type Action,
} from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice"


const rootReducer = combineReducers({
  auth: authReducer,
  cart:cartReducer
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

let appDispatch: AppDispatch;

export const setAppDispatch = (dispatch: AppDispatch) => {
  appDispatch = dispatch;
};

export const getAppDispatch = (): AppDispatch => appDispatch;

setAppDispatch(store.dispatch);
