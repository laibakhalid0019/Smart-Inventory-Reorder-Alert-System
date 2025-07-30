import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the Order interface
export interface OrderItem {
  orderId: number;
  orderNumber: string;
  request: {
    requestId: number;
    retailer: {
      id: number;
      username: string;
    };
    distributor: {
      id: number;
      username: string;
    };
    product: {
      id: number;
      name: string;
      category: string;
      retail_price: number;
    };
    quantity: number;
    price: number;
    status: string;
  };
  retailer: {
    id: number;
    username: string;
  };
  distributor: {
    id: number;
    username: string;
  };
  product: {
    id: number;
    name: string;
    category: string;
  };
  quantity: number;
  status: string;
  price: number;
  deliveryAgent?: {
    id: number;
    username: string;
  };
  dispatchedAt?: string;
  deliveredAt?: string;
  paymentTimestamp?: string;
}

// Define the state interface
interface OrdersState {
  items: OrderItem[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: OrdersState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunk for fetching orders
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:3000/retailer/order/view-orders', {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch orders');
    }
  }
);

// Async thunk for processing payment
export const processPayment = createAsyncThunk(
  'orders/processPayment',
  async ({ orderId, amount }: { orderId: number; amount: number }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/retailer/order/payment/${orderId}`,
        { amount, currency: 'usd' },
        { withCredentials: true }
      );
      return {
        clientSecret: response.data.client_secret,
        orderId
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to process payment');
    }
  }
);

// Create the orders slice
const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    updateOrderStatus(state, action: PayloadAction<{ orderId: number; status: string }>) {
      const { orderId, status } = action.payload;
      const orderIndex = state.items.findIndex(order => order.orderId === orderId);
      if (orderIndex !== -1) {
        state.items[orderIndex].status = status;
      }
    },
    clearOrders(state) {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchOrders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateOrderStatus, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
