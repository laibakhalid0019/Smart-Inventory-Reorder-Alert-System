// src/hooks/useAuthRestore.ts
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '@/Redux/Store/authSlice';

export const useAuthRestore = () => {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:3000/retailer/stocks/me', {
                    withCredentials: true
                });

                const { username, role } = response.data;
                dispatch(setUser({ username, role: role.toLowerCase() }));
            } catch (error) {
                console.warn("No active session found or token invalid.");
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [dispatch]);

    return loading;
};
