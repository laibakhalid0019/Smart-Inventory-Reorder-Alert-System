import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define product type based on the API response
interface Product {
  id: number;
  name: string;
  category: string;
  sku: string | null;
  barcode: string;
  retail_price: number;
  cost_price: number;
  mst: number;
  quantity: number;
  expiry_date: string;
  imageUrl: string;
  distributor: {
    id: number;
    username: string;
    email: string;
    address: string;
    phone: string;
    role: string;
  };
  createdAt: string;
}

interface ProductsState {
  products: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  status: 'idle',
  error: null
};

// Thunk for fetching products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/distributor/product/view-products', {
          withCredentials:true
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Thunk for adding a product
export const addProduct = createAsyncThunk(
  'products/addProduct',
  async ({ imageFile, ...productData }: any, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Convert product data to JSON string for the API
      const productJson = JSON.stringify(productData);
      formData.append('product', productJson);
      formData.append('file', imageFile);

      console.log('Adding product with image:', formData);
      const response = await axios.post(
        'http://localhost:3000/distributor/product/add-product',
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 415) {
          return rejectWithValue('Invalid image format. Only image files are allowed.');
        }
        return rejectWithValue(error.response?.data?.message || 'Failed to add product');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Thunk for updating a product with image
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData, imageFile }: {
    id: number,
    productData: Partial<Product>,
    imageFile?: File
  }, { rejectWithValue }) => {
    try {
      // If we have an image file, use the multipart endpoint
      if (imageFile) {
        const formData = new FormData();

        // Convert product data to JSON string for the API
        const productJson = JSON.stringify(productData);
        formData.append('product', productJson);
        formData.append('file', imageFile);
        console.log('Updating product with image:', formData);
        const response = await axios.put(
          `http://localhost:3000/distributor/product/update-product-with-image/${id}`,
          formData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        return response.data;
      }
      // If no image, use a regular JSON update
      else {
        console.log('Updating product without image:', productData);
        const response = await axios.put(
          `http://localhost:3000/distributor/product/update-product/${id}`,
          productData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        return response.data;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 415) {
          return rejectWithValue('Invalid image format. Only image files are allowed.');
        }
        return rejectWithValue(error.response?.data || 'Failed to update product');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Thunk for deleting a product
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`http://localhost:3000/distributor/product/delete-product/${id}`, {
        withCredentials: true
      });
      return id;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle conflict status (409) when product is referenced by other entities
        if (error.response?.status === 409) {
          return rejectWithValue('This product cannot be deleted because it is associated with other records.');
        }
        return rejectWithValue(error.response?.data || 'Failed to delete product');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded';
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Handle addProduct
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.products.push(action.payload);
        state.error = null;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Handle updateProduct
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const index = state.products.findIndex(product => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Handle deleteProduct
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
        state.products = state.products.filter(product => product.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  }
});

export default productsSlice.reducer;
