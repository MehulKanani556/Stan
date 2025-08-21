import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Utils/axiosInstance";
import { enqueueSnackbar } from "notistack";

const initialState = {
  games: [],
  loading: false,
  error: null,
  selectedGame: null,
  totalGames: 0,
};

// Async thunk for fetching all free games
export const getFreeGames = createAsyncThunk(
  "freeGame/getFreeGames",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/free-games');
      if (response.data.success) {
        return response.data.result;
      } else {
        return rejectWithValue({ message: 'Failed to fetch games' });
      }
    } catch (error) {
      console.error('Error fetching free games:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch games';
      enqueueSnackbar(errorMessage, { variant: "error" });
      return rejectWithValue({ message: errorMessage });
    }
  }
);

// Async thunk for fetching a single game by slug
export const fetchGameBySlug = createAsyncThunk(
  "freeGame/fetchGameBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/free-games/${slug}`);
      if (response.data.success) {
        return response.data.result;
      } else {
        return rejectWithValue({ message: 'Game not found' });
      }
    } catch (error) {
      console.error('Error fetching game by slug:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch game';
      enqueueSnackbar(errorMessage, { variant: "error" });
      return rejectWithValue({ message: errorMessage });
    }
  }
);

const freeGameSlice = createSlice({
  name: "freeGame",
  initialState,
  reducers: {
    clearGames: (state) => {
      state.games = [];
      state.loading = false;
      state.error = null;
    },
    clearSelectedGame: (state) => {
      state.selectedGame = null;
    },
    setSelectedGame: (state, action) => {
      state.selectedGame = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all games
      .addCase(getFreeGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFreeGames.fulfilled, (state, action) => {
        state.loading = false;
        state.games = Array.isArray(action.payload) ? action.payload : [];
        state.totalGames = Array.isArray(action.payload) ? action.payload.length : 0;
        state.error = null;
      })
      .addCase(getFreeGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch games';
        state.games = [];
        state.totalGames = 0;
      })
      // Fetch game by slug
      .addCase(fetchGameBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGameBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedGame = action.payload;
        state.error = null;
      })
      .addCase(fetchGameBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch game';
        state.selectedGame = null;
      });
  },
});

export const { 
  clearGames, 
  clearSelectedGame, 
  setSelectedGame, 
  clearError 
} = freeGameSlice.actions;

export default freeGameSlice.reducer;
