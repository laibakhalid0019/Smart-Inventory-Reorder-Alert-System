import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
    username: string | null;
    role: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

// Create async thunk to check authentication status from the backend
export const checkAuthStatus = createAsyncThunk(
    'auth/checkStatus',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('http://localhost:3000/auth/me', {
                withCredentials: true // Important for sending cookies to the backend
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Authentication failed');
        }
    }
);

const initialState: AuthState = {
    username: null,
    role: null,
    isAuthenticated: false,
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.username = action.payload.username;
            state.role = action.payload.role;
            state.isAuthenticated = true;
            state.error = null;
        },
        logout: (state) => {
            state.username = null;
            state.role = null;
            state.isAuthenticated = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuthStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkAuthStatus.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload && action.payload.username && action.payload.role) {
                    state.username = action.payload.username;
                    state.role = action.payload.role;
                    state.isAuthenticated = true;
                }
            })
            .addCase(checkAuthStatus.rejected, (state, action) => {
                state.loading = false;
                state.username = null;
                state.role = null;
                state.isAuthenticated = false;
                state.error = action.payload as string;
            });
    }
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
