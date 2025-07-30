import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the Product/Stock interface
export interface StockItem {
  id: number;
  quantity: number;
  expiry_date: string;
  min_threshold: number;
  product: {
    id: number;
    name: string;
    category: string;
    retail_price: number;
    imageUrl: string;
    description?: string;
  };
}

// Define the state interface
interface StockState {
  items: StockItem[];
  loading: boolean;
  error: string | null;
  categories: string[];
  selectedCategory: string | null;
}

// Initial state
const initialState: StockState = {
  items: [],
  loading: false,
  error: null,
  categories: [],
  selectedCategory: null,
};

// Async thunk for fetching retailer's stock
export const fetchRetailerStock = createAsyncThunk(
  'stock/fetchRetailerStock',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        'http://localhost:3000/retailer/stocks/get-stock-username',
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch stock');
    }
  }
);

// Async thunk for fetching products by category (for restock page)
export const fetchStockByCategory = createAsyncThunk(
  'stock/fetchStockByCategory',
  async (category: string, { rejectWithValue }) => {
    try {
      // This endpoint is used for the restock page to show available products
      const response = await axios.post(
        'http://localhost:3000/retailer/product/view-products',
        null,
        {
          params: { category },
          withCredentials: true
        }
      );
      return { data: response.data, category };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch products');
    }
  }
);

// Async thunk for updating stock
export const updateStockItem = createAsyncThunk(
  'stock/updateStockItem',
  async (
    {
      id,
      updatedData
    }: {
      id: number;
      updatedData: {
        quantity?: number;
        min_threshold?: number;
        name?: string;
        category?: string;
      }
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/retailer/stocks/update-stock/${id}`,
        updatedData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update stock');
    }
  }
);

// Create the stock slice
const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setSelectedCategory(state, action: PayloadAction<string | null>) {
      state.selectedCategory = action.payload;
    },
    clearStockData(state) {
      state.items = [];
      state.error = null;
    },
    updateCategories(state, action: PayloadAction<string[]>) {
      state.categories = action.payload;
    },
    filterStock(state, action: PayloadAction<{ category: string; showExpired: boolean; showLowStock: boolean }>) {
      // This reducer doesn't modify the items directly, but sets filters that components can use
      const { category } = action.payload;
      state.selectedCategory = category === 'All' ? null : category;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchRetailerStock
      .addCase(fetchRetailerStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRetailerStock.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;

        // Extract unique categories from the stock items
        const categories = [...new Set(state.items.map(item => item.product.category))];
        if (categories.length > 0 && !state.categories.includes(categories[0])) {
          state.categories = [...state.categories, ...categories];
        }
      })
      .addCase(fetchRetailerStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle fetchStockByCategory (for the restock page)
      .addCase(fetchStockByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockByCategory.fulfilled, (state, action) => {
        // This doesn't replace the stock items, as it's used for the restock page
        // We could store this in a separate state if needed
        state.loading = false;
        state.selectedCategory = action.payload.category;
      })
      .addCase(fetchStockByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle updateStockItem
      .addCase(updateStockItem.fulfilled, (state, action) => {
        const updatedItem = action.payload;
        const index = state.items.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...updatedItem };
        }
      });
  },
});

export const { setSelectedCategory, clearStockData, updateCategories, filterStock } = stockSlice.actions;
export default stockSlice.reducer;
