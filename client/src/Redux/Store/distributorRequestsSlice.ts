import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define request interfaces
export interface DistributorRequest {
  requestId: number;
  retailer: {
    id: number;
    username: string;
    email: string;
    address: string;
    phone: string;
    role: string;
  };
  product: {
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
  };
  quantity: number;
  price: number;
  createdAt: string;
  status: string;
}

// Define delivery agent interface
export interface DeliveryAgent {
  id: number;
  username: string;
  email: string;
  address: string;
  phone: string;
  role: string;
}

interface DistributorRequestsState {
  items: DistributorRequest[];
  deliveryAgents: DeliveryAgent[];
  loading: boolean;
  error: string | null;
}

const initialState: DistributorRequestsState = {
  items: [],
  deliveryAgents: [],
  loading: false,
  error: null,
};

// Async thunk for fetching distributor's requests
export const fetchDistributorRequests = createAsyncThunk(
  'distributorRequests/fetchDistributorRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        'http://localhost:3000/distributor/request/view-requests',
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch requests');
    }
  }
);

// Async thunk for updating request status
export const updateRequestStatus = createAsyncThunk(
  'distributorRequests/updateRequestStatus',
  async ({ requestId, status }: { requestId: number; status: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/distributor/request/change-status/${requestId}?status=${status}`,
        {},  // Empty body since we're using query parameters
        { withCredentials: true }
      );
      return { requestId, status, response: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update request status');
    }
  }
);

// Async thunk for generating an order from a request
export const generateOrder = createAsyncThunk(
  'distributorRequests/generateOrder',
  async ({ requestId, deliveryAgent }: { requestId: number; deliveryAgent: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/distributor/order/generate-order/${requestId}`,
        { deliveryAgent },
        { withCredentials: true }
      );
      return { requestId, order: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to generate order');
    }
  }
);

// Async thunk for fetching delivery agents
export const fetchDeliveryAgents = createAsyncThunk(
  'distributorRequests/fetchDeliveryAgents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        'http://localhost:3000/distributor/order/get-agents',
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch delivery agents');
    }
  }
);

// Create the slice
const distributorRequestsSlice = createSlice({
  name: 'distributorRequests',
  initialState,
  reducers: {
    setRequests: (state, action: PayloadAction<DistributorRequest[]>) => {
      state.items = action.payload;
    },
    clearRequests: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDistributorRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDistributorRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDistributorRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        const { requestId, status } = action.payload;
        const index = state.items.findIndex(request => request.requestId === requestId);
        if (index !== -1) {
          state.items[index].status = status;
        }
      })
      .addCase(fetchDeliveryAgents.fulfilled, (state, action) => {
        state.deliveryAgents = action.payload;
      });
  },
});

export const { setRequests, clearRequests } = distributorRequestsSlice.actions;
export default distributorRequestsSlice.reducer;
