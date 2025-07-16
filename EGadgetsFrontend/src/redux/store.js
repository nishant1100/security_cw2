import { configureStore } from '@reduxjs/toolkit';
import  productsApi  from './features/products/productApi';
import cartReducer from './features/cart/cartSlice';
import ordersApi from './orders/ordersApi';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware,ordersApi.middleware),
});
