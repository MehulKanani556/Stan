import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { syncCart } from '../Redux/Slice/cart.slice';

const CartInitializer = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const lastSynced = useSelector((state) => state.cart.lastSynced);

    useEffect(() => {
        // Only sync cart if user is authenticated and cart hasn't been synced recently
        if (isAuthenticated && !lastSynced) {
            dispatch(syncCart());
        }
    }, [dispatch, isAuthenticated, lastSynced]);

    // This component doesn't render anything
    return null;
};

export default CartInitializer;

