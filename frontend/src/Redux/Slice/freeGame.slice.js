import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Utils/axiosInstance";
import { enqueueSnackbar } from "notistack";

const initialState = {
  games: [],
  loading: false,
  topGamesInitialLoading: false, // New loading state for initial load
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

// Async thunk for creating a new free game
export const createFreeGame = createAsyncThunk(
  "freeGame/createFreeGame",
  async (gameData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/free-games', gameData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.success) {
        enqueueSnackbar(response.data.message, { variant: "success" });
        return response.data.result;
      } else {
        return rejectWithValue({ message: response.data.message });
      }
    } catch (error) {
      console.error('Error creating free game:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create game';
      enqueueSnackbar(errorMessage, { variant: "error" });
      return rejectWithValue({ message: errorMessage });
    }
  }
);

// Async thunk for updating a free game
export const updateFreeGame = createAsyncThunk(
  "freeGame/updateFreeGame",
  async ({ id, gameData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/free-games/${id}`, gameData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.success) {
        enqueueSnackbar(response.data.message, { variant: "success" });
        return response.data.result;
      } else {
        return rejectWithValue({ message: response.data.message });
      }
    } catch (error) {
      console.error('Error updating free game:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update game';
      enqueueSnackbar(errorMessage, { variant: "error" });
      return rejectWithValue({ message: errorMessage });
    }
  }
);

// Async thunk for deleting a free game
export const deleteFreeGame = createAsyncThunk(
  "freeGame/deleteFreeGame",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/free-games/${id}`);
      if (response.data.success) {
        enqueueSnackbar(response.data.message, { variant: "success" });
        return id;
      } else {
        return rejectWithValue({ message: response.data.message });
      }
    } catch (error) {
      console.error('Error deleting free game:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete game';
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
        state.topGamesInitialLoading = true;
        state.error = null;
      })
      .addCase(getFreeGames.fulfilled, (state, action) => {
        state.loading = false;
        state.topGamesInitialLoading = false;
        state.games = Array.isArray(action.payload) ? action.payload : [];
        state.totalGames = Array.isArray(action.payload) ? action.payload.length : 0;
        state.error = null;
      })
      .addCase(getFreeGames.rejected, (state, action) => {
        state.loading = false;
        state.topGamesInitialLoading = false;
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
      })
      // Create free game
      .addCase(createFreeGame.pending, (state) => {
        state.loading = true;
      })
      .addCase(createFreeGame.fulfilled, (state, action) => {
        state.loading = false;
        state.games.unshift(action.payload);
        state.totalGames += 1;
      })
      .addCase(createFreeGame.rejected, (state) => {
        state.loading = false;
      })
      // Update free game
      .addCase(updateFreeGame.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateFreeGame.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.games.findIndex(g => g._id === action.payload._id);
        if (index !== -1) {
          state.games[index] = action.payload;
        }
      })
      .addCase(updateFreeGame.rejected, (state) => {
        state.loading = false;
      })
      // Delete free game
      .addCase(deleteFreeGame.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteFreeGame.fulfilled, (state, action) => {
        state.loading = false;
        state.games = state.games.filter(g => g._id !== action.payload);
        state.totalGames -= 1;
      })
      .addCase(deleteFreeGame.rejected, (state) => {
        state.loading = false;
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
