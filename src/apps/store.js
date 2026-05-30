import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import homeReducer from '../features/home/homeSlice';
import categoryReducer from '../features/category/categorySlice';
import brandReducer from '../features/brands/brandSlice'
import productReducer from "../features/product/productSlice"
import searchReducer from '../features/search/searchSlice';
import subscriptionReducer from '../features/subscription/subscriptionSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    home: homeReducer,
    category: categoryReducer,
    brand: brandReducer,
    product: productReducer,
    search: searchReducer,
    subscription: subscriptionReducer

  },
});