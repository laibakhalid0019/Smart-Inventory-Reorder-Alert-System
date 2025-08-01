import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchDeliveryOrders = createAsyncThunk(
  'deliveryOrders/fetchDeliveryOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:3000/delivery/order/view-orders',
          {
              withCredentials:true
          }
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to fetch delivery orders');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'deliveryOrders/updateOrderStatus',
  async ({ id, status }: { id: number | string, status: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`http://localhost:3000/delivery/order/change-order-status/${id}?status=${status}`);
      return { id, status, message: response.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to update order status');
    }
  }
);

const deliveryOrdersSlice = createSlice({
  name: 'deliveryOrders',
  initialState: {
    orders: [],
    loading: false,
    error: null as string | null,
    statusUpdateLoading: false,
    statusUpdateError: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeliveryOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeliveryOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchDeliveryOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.statusUpdateLoading = true;
        state.statusUpdateError = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.statusUpdateLoading = false;
        // Update the order in the state
        const { id, status } = action.payload;
        const orderIndex = state.orders.findIndex((order: any) =>
          order.orderId === id || order.id === id
        );
        if (orderIndex !== -1) {
          state.orders[orderIndex].status = status;
          if (status === 'DISPATCHED') {
            state.orders[orderIndex].dispatchedAt = new Date().toISOString();
          } else if (status === 'DELIVERED') {
            state.orders[orderIndex].deliveredAt = new Date().toISOString();
          }
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.statusUpdateLoading = false;
        state.statusUpdateError = action.payload as string;
      });
  },
});

export default deliveryOrdersSlice.reducer;
