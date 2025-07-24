import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
    username: string | null;
    role: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    username: null,
    role: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.username = action.payload.username;
            state.role = action.payload.role;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.username = null;
            state.role = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
