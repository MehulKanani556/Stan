import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Utils/axiosInstance";
import { enqueueSnackbar } from "notistack";

// Async thunks for API calls
export const fetchCart = createAsyncThunk(
    "cart/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/cart");
            return res.data.cart || [];
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const addToCart = createAsyncThunk(
    "cart/add",
    /**
     * Payload:
     * - gameId: string
     * - platform?: string
     * - qty: number
     * - showSuccessToast?: boolean (default: true)
     *
     * The optional `showSuccessToast` flag lets callers suppress the built-in
     * "Added to cart" toast when performing batched operations (e.g. multiple
     * platforms at once) so they can show a single combined message instead.
     */
    async ({ gameId, platform, qty, showSuccessToast = true }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/cart/add", { gameId, platform, qty });
         
            if (res.data.success && showSuccessToast) {                
                enqueueSnackbar("Added to cart", { variant: "success" });
            }
            return res.data.cart || [];
        } catch (err) {
            // Show specific warning for duplicate items
            if (err.response?.status === 400) {
                enqueueSnackbar(err.response?.data?.message || "Game already in cart for this platform", { variant: "warning" });
            } else if (err.response?.status === 401) {
                enqueueSnackbar("Please login first to add items to cart", { variant: "error" });
            } else {
                enqueueSnackbar(err.response?.data?.message || "Failed to add to cart", { variant: "error" });
            }
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const updateCartItem = createAsyncThunk(
    "cart/updateItem",
    async ({ gameId, platform, qty }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.put("/cart/update", { gameId, platform, qty });
            return res.data.cart || [];
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const removeFromCart = createAsyncThunk(
    "cart/remove",
    /**
     * Payload:
     * - gameId: string
     * - platform: string
     * - showSuccessToast?: boolean (default: true)
     *
     * Use `showSuccessToast: false` when you want a silent removal (e.g. removing a single platform pill
     * inside the cart UI without showing a toast).
     */
    async ({ gameId, platform, showSuccessToast = true }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/cart/remove", { gameId, platform });
            if (res.data.success && showSuccessToast) {
                enqueueSnackbar("Removed from cart", { variant: "success" });
            }
            return res.data.cart || [];
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || "Failed to remove from cart", { variant: "error" });
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const clearCart = createAsyncThunk(
    "cart/clear",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/cart/clear");
            return res.data.cart || [];
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState: { cart: [], loading: false, error: null },
    reducers: {
        setClearCart(state) {
            state.cart = [];
        },
        addToCartLocal(state, action) {
            const { game } = action.payload || {};
            if (!game) {
                return;
            }
            const alreadyInCart = state.cart.some((item) => item.id === game.id);
            if (alreadyInCart) {
                enqueueSnackbar("Game already in cart", { variant: "warning" });
                return;
            }
            state.cart.push(game);
            enqueueSnackbar("Added to cart", { variant: "success" });
        },
        removeFromCartLocal(state, action) {
            const { gameId } = action.payload || {};
            state.cart = state.cart.filter((item) => item.id !== gameId);
            enqueueSnackbar("Removed from cart", { variant: "success" });
        },
        clearCartLocal(state) {
            state.cart = [];
            enqueueSnackbar("Cart cleared", { variant: "info" });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateCartItem.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(clearCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(clearCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setClearCart, addToCartLocal, removeFromCartLocal, clearCartLocal } = cartSlice.actions;


export default cartSlice.reducer;
