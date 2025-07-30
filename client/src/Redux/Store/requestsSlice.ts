import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the Request interface
export interface RequestItem {
  requestId: number;
  retailer: {
    id: number;
    username: string;
  };
  distributor: {
    id: number;
    username: string;
    email: string;
    address: string;
    phone: string;
  };
  product: {
    id: number;
    name: string;
    category: string;
  };
  quantity: number;
  price: number;
  createdAt: string;
  status: string;
}

// Define the state interface
interface RequestsState {
  items: RequestItem[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: RequestsState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunk for fetching requests
export const fetchRequests = createAsyncThunk(
  'requests/fetchRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:3000/retailer/request/view-request', {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch requests');
    }
  }
);

// Async thunk for deleting a request
export const deleteRequest = createAsyncThunk(
  'requests/deleteRequest',
  async (requestId: number, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:3000/retailer/request/delete-request/${requestId}`, {
        withCredentials: true,
      });
      return requestId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to delete request');
    }
  }
);

// Create the requests slice
const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    updateRequestStatus(state, action: PayloadAction<{ requestId: number; status: string }>) {
      const { requestId, status } = action.payload;
      const requestIndex = state.items.findIndex(request => request.requestId === requestId);
      if (requestIndex !== -1) {
        state.items[requestIndex].status = status;
      }
    },
    clearRequests(state) {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchRequests
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle deleteRequest
      .addCase(deleteRequest.fulfilled, (state, action) => {
        state.items = state.items.filter(request => request.requestId !== action.payload);
      });
  },
});

export const { updateRequestStatus, clearRequests } = requestsSlice.actions;
export default requestsSlice.reducer;
