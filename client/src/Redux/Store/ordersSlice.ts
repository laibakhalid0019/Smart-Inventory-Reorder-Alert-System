import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define user type
interface User {
  id: number;
  username: string;
  email: string;
  address: string;
  phone: string;
  role: string;
}

// Define product type
interface Product {
  id: number;
  name: string;
  category: string;
  sku: string;
  barcode: string;
  retail_price: number;
  cost_price: number;
  mst: number;
  quantity: number;
  expiry_date: string;
  imageUrl: string;
  distributor: User;
  createdAt: string;
}

// Define request type
interface Request {
  requestId: number;
  retailer: User;
  distributor: User;
  product: Product;
  quantity: number;
  price: number;
  createdAt: string;
  status: string;
}

// Define distributor order type (from the new API)
interface DistributorOrder {
  orderId: number;
  request: Request;
  orderNumber: string;
  retailer: User;
  distributor: User;
  product: Product;
  quantity: number;
  status: string;
  paymentTimestamp: string | null;
  price: number;
  deliveryAgent: User | null;
  dispatchedAt: string | null;
  deliveredAt: string | null;
}

// Define retailer order type (should match the API response structure)
interface RetailerOrder {
  orderId: number;
  orderNumber: string;
  request: {
    requestId: number;
    retailer: User;
    distributor: User;
    product: Product;
    quantity: number;
    price: number;
    status: string;
  };
  retailer: User;
  distributor: User;
  product: Product;
  quantity: number;
  status: string;
  price: number;
  deliveryAgent?: User;
  dispatchedAt?: string;
  deliveredAt?: string;
  paymentTimestamp?: string;
}

// Define the state interface
interface OrdersState {
  items: RetailerOrder[]; // Original retailer orders
  loading: boolean; // Original loading state
  distributorOrders: DistributorOrder[]; // New distributor orders
  distributorOrdersStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: OrdersState = {
  items: [],
  loading: false,
  distributorOrders: [],
  distributorOrdersStatus: 'idle',
  error: null,
};

// Original thunk for fetching retailer orders
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      // This should be the retailer orders endpoint
      const response = await axios.get('http://localhost:3000/retailer/order/view-orders', {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch retailer orders');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Thunk for retailer payment processing
export const processPayment = createAsyncThunk(
  'orders/processPayment',
  async ({ orderId, amount }: { orderId: number; amount: number }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/retailer/order/payment/${orderId}`,
        { amount, currency: 'usd' },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to process payment');
      }
      return rejectWithValue('Payment processing failed');
    }
  }
);

// New thunk for fetching distributor orders
export const fetchDistributorOrders = createAsyncThunk(
  'orders/fetchDistributorOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:3000/distributor/order/view-orders', {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch distributor orders');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);



const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Original reducers for retailer orders
    updateOrderStatus: (state, action: PayloadAction<{ orderId: number; status: string }>) => {
      const order = state.items.find(order => order.orderId === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
      }
    },
    clearOrders: (state) => {
      state.items = [];
      state.distributorOrders = [];
      state.error = null;
    },
    // New reducer for distributor orders
    updateDistributorOrderStatus: (state, action: PayloadAction<{ orderId: number; status: string }>) => {
      const order = state.distributorOrders.find(order => order.orderId === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchOrders (retailer orders)
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<RetailerOrder[]>) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle fetchDistributorOrders
      .addCase(fetchDistributorOrders.pending, (state) => {
        state.distributorOrdersStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchDistributorOrders.fulfilled, (state, action: PayloadAction<DistributorOrder[]>) => {
        state.distributorOrdersStatus = 'succeeded';
        state.distributorOrders = action.payload;
        state.error = null;
      })
      .addCase(fetchDistributorOrders.rejected, (state, action) => {
        state.distributorOrdersStatus = 'failed';
        state.error = action.payload as string;
      })
      // Handle processPayment (retailer)
      .addCase(processPayment.pending, (state) => {
        state.error = null;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        // The action.payload should contain the payment response (clientSecret, etc.)
        // We don't need to update orders here, just handle the payment initiation
        state.error = null;
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.error = action.payload as string;
      })
  },
});

export const { updateOrderStatus, clearOrders, updateDistributorOrderStatus } = ordersSlice.actions;
export default ordersSlice.reducer;
