// src/hooks/useAuthRestore.ts
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuthStatus } from '@/Redux/Store/authSlice';
import { AppDispatch } from '@/Redux/Store';

export const useAuthRestore = () => {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const restoreAuth = async () => {
            try {
                await dispatch(checkAuthStatus()).unwrap();
            } catch (error) {
                console.warn("No active session found or token invalid.");
            } finally {
                setLoading(false);
            }
        };

        restoreAuth();
    }, [dispatch]);

    return loading;
};
