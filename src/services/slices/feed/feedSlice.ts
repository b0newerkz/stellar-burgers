import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../../store';
import type { TOrdersData, TOrder } from '../../../utils/types';
import { getFeedsApi } from '../../../utils/burger-api';

export type FeedState = {
  orders: TOrder[];
  feed: TOrdersData | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: FeedState = {
  orders: [],
  feed: null,
  isLoading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk('feed/fetchFeeds', async () => {
  const data = await getFeedsApi();
  return data;
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.feed = {
          orders: action.payload.orders,
          total: action.payload.total,
          totalToday: action.payload.totalToday
        };
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message ?? 'Не удалось загрузить ленту заказов';
      });
  }
});

export const feedReducer = feedSlice.reducer;

export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectFeedData = (state: RootState) => state.feed.feed;
export const selectFeedLoading = (state: RootState) => state.feed.isLoading;
export const selectFeedError = (state: RootState) => state.feed.error;
