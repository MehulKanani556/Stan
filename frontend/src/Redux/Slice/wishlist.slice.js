import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Utils/axiosInstance";
import { enqueueSnackbar } from "notistack";

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/wishlist");
      return res.data.wishlist || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async ({ gameId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/wishlist/add", { gameId });
      enqueueSnackbar("Added to wishlist", { variant: "success" });
      return res.data.wishlist || [];
    } catch (err) {
      if (err.response?.status === 400) {
        enqueueSnackbar(err.response?.data?.message || "Game already in wishlist", { variant: "warning" });
      } else if (err.response?.status === 401) {
        enqueueSnackbar("Please login first to add items to wishlist", { variant: "error" });
      } else {
        enqueueSnackbar(err.response?.data?.message || "Failed to add to wishlist", { variant: "error" });
      }
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async ({ gameId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/wishlist/remove", { gameId });
      enqueueSnackbar("Removed from wishlist", { variant: "success" });
      return res.data.wishlist || [];
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || "Failed to remove from wishlist", { variant: "error" });
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const checkWishlistStatus = createAsyncThunk(
  "wishlist/checkStatus",
  async (gameId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/wishlist/check/${gameId}`);
      return { gameId, isInWishlist: res.data.isInWishlist };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { 
    items: [], 
    loading: false, 
    error: null,
    wishlistStatus: {} // Store wishlist status for each game
  },
  reducers: {
    clearWishlistStatus: (state) => {
      state.wishlistStatus = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        // Update wishlist status for all games
        const statusMap = {};
        action.payload.forEach(item => {
          statusMap[item?.game?._id] = true;
        });
        state.wishlistStatus = statusMap;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
        // Update wishlist status
        const statusMap = {};
        action.payload.forEach(item => {
          statusMap[item.game._id] = true;
        });
        state.wishlistStatus = statusMap;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        // Use the original arg to identify which game was removed, because
        // the API returns an unpopulated wishlist array on removal.
        const removedGameId = String(action.meta?.arg?.gameId);

        // Keep existing populated items, filter out the removed one
        state.items = (state.items || []).filter((item) => {
          const currentId = String(item?.game?._id || item?.game);
          return currentId !== removedGameId;
        });

        // Rebuild wishlist status map
        const statusMap = {};
        (state.items || []).forEach((item) => {
          const id = String(item?.game?._id || item?.game);
          statusMap[id] = true;
        });
        state.wishlistStatus = statusMap;
      })
      .addCase(checkWishlistStatus.fulfilled, (state, action) => {
        const { gameId, isInWishlist } = action.payload;
        state.wishlistStatus[gameId] = isInWishlist;
      });
  },
});

export const { clearWishlistStatus } = wishlistSlice.actions;
export default wishlistSlice.reducer;
