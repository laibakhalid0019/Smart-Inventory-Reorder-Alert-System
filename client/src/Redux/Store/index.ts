import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import ordersReducer from './ordersSlice';
import requestsReducer from './requestsSlice';
import stockReducer from './stockSlice';
import distributorRequestsReducer from './distributorRequestsSlice';
import productsReducer from './productsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        orders: ordersReducer,
        requests: requestsReducer,
        stock: stockReducer,
        distributorRequests: distributorRequestsReducer,
        products: productsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
