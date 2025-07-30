import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import ordersReducer from './ordersSlice';
import requestsReducer from './requestsSlice';
import stockReducer from './stockSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        orders: ordersReducer,
        requests: requestsReducer,
        stock: stockReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
