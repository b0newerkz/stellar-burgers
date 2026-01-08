import { combineReducers } from '@reduxjs/toolkit';

import { ingredientsReducer } from './slices/ingredients/ingredientsSlice';
import { constructorReducer } from './slices/constructor/constructorSlice';
import { orderReducer } from './slices/order/orderSlice';
import { authReducer } from './slices/auth/authSlice';
import { feedReducer } from './slices/feed/feedSlice';
import { profileOrdersReducer } from './slices/profile-orders/profileOrdersSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  auth: authReducer,
  feed: feedReducer,
  profileOrders: profileOrdersReducer
});
