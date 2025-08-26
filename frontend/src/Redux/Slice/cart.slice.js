import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Utils/axiosInstance";

// Async thunks for API calls
export const getCart = createAsyncThunk(
    "cart/getCart",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/cart");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch cart");
        }
    }
);

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ gameId, platform, qty = 1 }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/cart", {
                gameId,
                platform,
                qty,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to add to cart");
        }
    }
);

export const updateCartItem = createAsyncThunk(
    "cart/updateCartItem",
    async ({ gameId, platform, qty }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put("/cart", {
                gameId,
                platform,
                qty,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update cart item");
        }
    }
);

export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async ({ gameId, platform }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete("/cart", {
                data: { gameId, platform },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to remove from cart");
        }
    }
);

export const clearCart = createAsyncThunk(
    "cart/clearCart",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete("/cart/clear");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to clear cart");
        }
    }
);

const initialState = {
    cart: [],
    loading: false,
    error: null,
    success: false,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
        },
        resetCart: (state) => {
            state.cart = [];
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        // Get Cart
        builder
            .addCase(getCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload.cart || [];
                state.success = true;
            })
            .addCase(getCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })

            // Add to Cart
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload.cart || [];
                state.success = true;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })

            // Update Cart Item
            .addCase(updateCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload.cart || [];
                state.success = true;
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })

            // Remove from Cart
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload.cart || [];
                state.success = true;
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })

            // Clear Cart
            .addCase(clearCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(clearCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = [];
                state.success = true;
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    },
});

// Export actions
export const { clearError, clearSuccess, resetCart } = cartSlice.actions;

// Export selectors
export const selectCart = (state) => state.cart.cart;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectCartSuccess = (state) => state.cart.success;
export const selectCartItemCount = (state) => state.cart.cart.length;
export const selectCartTotal = (state) => {
    return state.cart.cart.reduce((total, item) => {
        const price = item.price || 0;
        const qty = item.qty || 1;
        return total + (price * qty);
    }, 0);
};

export default cartSlice.reducer;
