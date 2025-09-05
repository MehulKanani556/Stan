import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Utils/axiosInstance";
import { enqueueSnackbar } from "notistack";
import axios from "axios";

// GET ALL GAMES
// GET ALL GAMES - Optimized version
export const getAllGames = createAsyncThunk(
  "game/getAllGames",
  async ({ page = 1, limit = 20, sortBy = 'createdAt', order = 'desc', category, search } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        order
      });

      if (category) params.append('category', category);
      if (search) params.append('search', search);

      const res = await axiosInstance.get(`/getAllGames?${params}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
export const getAllActiveGames = createAsyncThunk(
  "game/getAllActiveGames",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/getAllActiveGames");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// GET POPULAR GAMES
export const getPopularGames = createAsyncThunk(
  "game/getPopularGames",
  async (
    { page = 1, limit = 10, sortBy = "views", order = "desc" } = {},
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.get("/getPopularGames", {
        params: { page, limit, sortBy, order },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// CREATE GAME
export const createGame = createAsyncThunk(
  "game/createGame",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/createGame", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      enqueueSnackbar("Game Add successful", { variant: "success" });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// UPDATE GAME
export const updateGame = createAsyncThunk(
  "game/updateGame",
  async ({ _id, formData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/updateGame/${_id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      enqueueSnackbar("Game Update successful", { variant: "success" });
      return res.data.data; // controller returns { message, data }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// DELETE GAME
export const deleteGame = createAsyncThunk(
  "game/deleteGame",
  async ({ _id }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/deleteGame/${_id}`);
      enqueueSnackbar("Game Delete successful", { variant: "success" });
      return { _id };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// get by Id
export const getGameById = createAsyncThunk(
  "game/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/getGameById/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ********* Category ******
export const getAllCategories = createAsyncThunk(
  "game/getAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/getAllCategories");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ********* Game Trailer ******
export const getHomeTrailer = createAsyncThunk(
  "game/getHomeTrailer",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/public/hometrailer");
      return res.data?.homeTrailer || [];
    } catch (err) {
      console.error("getHomeTrailer API error:", err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getTopGames = createAsyncThunk(
  "game/getTopGames",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Calling getTopGames API...");
      const res = await axiosInstance.get("/getTopGames");
      console.log("getTopGames API response:", res.data);
      return res.data;
    } catch (err) {
      console.error("getTopGames API error:", err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ********* WishList ******
export const getWishlist = createAsyncThunk(
  "game/getWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/wishlist");
      return res.data || [];
    } catch (err) {
      console.error("getWishlist API error:", err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createWishlist = createAsyncThunk(
  "game/createWishlist",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axiosInstance.post(
        `/wishlist/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Create Wishlist Response:", response);
      return response?.data;
    } catch (error) {
      console.error("Create Wishlist Error:", error.message);
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

// ********** Review Data ***********
export const getReviewData = createAsyncThunk(
  "game/getReviewData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/admin/ratings");
      return res.data || [];
    } catch (err) {
      console.error("getReviewData API error:", err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


// ********** Single Game Review Data ***********
export const getGameRating = createAsyncThunk(
  "game/getGameRating",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/gamerating/${id}`);
      return res.data || [];
    } catch (err) {
      console.error("getGameRating API error:", err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);




const gameSlice = createSlice({
  name: "game",
  initialState: {
    games: [],
    popularGames: [],
    topGames: [],
    singleGame: null,
    loading: false,
    topGamesLoading: false,
    popularGamesLoading: false,
    topGamesInitialLoading: false, // New loading state for initial load
    error: null,
    success: null,
    pagination: null,
    sorting: null,
    filters: null,
    category: [],
    trailer: [],
    wishData: [],
    myToggle:true,
    reviewData:[],
    singleGameReview:{}
  },
  reducers: {
    clearGameError: (state) => {
      state.error = null;
    },
    clearGameSuccess: (state) => {
      state.success = null;
    },
    handleMyToggle: (state, action) => {
      if (typeof action.payload === "boolean") {
        state.myToggle = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // GET ALL
      .addCase(getAllGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllGames.fulfilled, (state, action) => {
        state.loading = false;
        state.games = action.payload.data || [];
        state.pagination = action.payload.pagination || null;
        state.sorting = action.payload.sorting || null;
        state.filters = action.payload.filters || null;
      })
      .addCase(getAllGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // GET ALL ACTIVE
      .addCase(getAllActiveGames.pending, (state) => {
        state.loading = true;
        state.topGamesInitialLoading = true;
        state.error = null;
      })
      .addCase(getAllActiveGames.fulfilled, (state, action) => {
        state.loading = false;
        state.topGamesInitialLoading = false;
        state.games = action.payload;
      })
      .addCase(getAllActiveGames.rejected, (state, action) => {
        state.loading = false;
        state.topGamesInitialLoading = false;
        state.error = action.payload;
      })
      // GET POPULAR
      .addCase(getPopularGames.pending, (state) => {
        state.popularGamesLoading = true;
        state.error = null;
      })
      .addCase(getPopularGames.fulfilled, (state, action) => {
        state.popularGamesLoading = false;
        state.popularGames = action.payload?.data || [];
        state.pagination = action.payload?.pagination || null;
      })
      .addCase(getPopularGames.rejected, (state, action) => {
        state.popularGamesLoading = false;
        state.error = action.payload;
      })
      // CREATE
      .addCase(createGame.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createGame.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Game created successfully";
        state.games.unshift(action.payload); // add new game to top
      })
      .addCase(createGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // UPDATE
      .addCase(updateGame.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateGame.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Game updated successfully";
        const idx = state.games.findIndex((g) => g._id === action.payload._id);
        if (idx !== -1) state.games[idx] = action.payload;
      })
      .addCase(updateGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // DELETE
      .addCase(deleteGame.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteGame.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Game deleted successfully";
        state.games = state.games.filter((g) => g._id !== action.payload._id);
      })
      .addCase(deleteGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getTopGames.pending, (state) => {
        state.topGamesLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getTopGames.fulfilled, (state, action) => {
        state.topGamesLoading = false;
        state.topGames = action.payload?.data || [];
      })
      .addCase(getTopGames.rejected, (state, action) => {
        state.topGamesLoading = false;
        state.error = action.payload;
      })
      // Get by ID
      .addCase(getGameById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGameById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleGame = action.payload.data || null;
      })
      .addCase(getGameById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ******* Category *******
      .addCase(getAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ********* Game Trailer ******
      .addCase(getHomeTrailer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHomeTrailer.fulfilled, (state, action) => {
        state.loading = false;
        state.trailer = action.payload;
      })
      .addCase(getHomeTrailer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ********* WishList ******
      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishData = action.payload;
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ********* Review Data ******
      .addCase(getReviewData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReviewData.fulfilled, (state, action) => {
        state.loading = false;
        state.reviewData = action.payload;
      })
      .addCase(getReviewData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ********* Review Data ******
      .addCase(getGameRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGameRating.fulfilled, (state, action) => {
        state.loading = false;
        state.singleGameReview = action.payload;
      })
      .addCase(getGameRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearGameError, clearGameSuccess , handleMyToggle } = gameSlice.actions;
export default gameSlice.reducer;
