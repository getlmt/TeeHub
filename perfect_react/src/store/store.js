import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import cartSlice from './slices/cartSlice';
import productSlice from './slices/productSlice';
import aiTryOnSlice from './slices/aiTryOnSlice';
import designSlice from './slices/designSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
    products: productSlice,
    aiTryOn: aiTryOnSlice,
    design: designSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});




