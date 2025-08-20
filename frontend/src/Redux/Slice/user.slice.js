import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Utils/axiosInstance";
import { enqueueSnackbar } from "notistack";

const initialState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  message: null,
};

// Get all users (admin only)
export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/getAllUsers");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch users";
      enqueueSnackbar(errorMessage, { variant: "error" });
      return rejectWithValue(error.response?.data || { message: errorMessage });
    }
  }
);

// Get user by ID
export const getUserById = createAsyncThunk(
  "user/getUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/getUserById/${userId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch user";
      enqueueSnackbar(errorMessage, { variant: "error" });
      return rejectWithValue(error.response?.data || { message: errorMessage });
    }
  }
);

// Edit user profile
export const editUserProfile = createAsyncThunk(
  "user/editUserProfile",
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.keys(userData).forEach(key => {
        if (userData[key] !== undefined && userData[key] !== null) {
          formData.append(key, userData[key]);
        }
      });

      // Use self-edit endpoint for regular users
      const response = await axiosInstance.put(`/editProfile/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      enqueueSnackbar("Profile updated successfully", { variant: "success" });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update profile";
      enqueueSnackbar(errorMessage, { variant: "error" });
      return rejectWithValue(error.response?.data || { message: errorMessage });
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.users = [];
      state.error = null;
      state.message = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
      state.error = null;
      state.message = null;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // GetAllUsers cases
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.result || [];
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch users";
        state.users = [];
      })
      
      // GetUserById cases
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.result;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch user";
        state.currentUser = null;
      })
      
      // EditUserProfile cases
      .addCase(editUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentUser && state.currentUser._id === action.payload.result._id) {
          state.currentUser = action.payload.result;
        }
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(editUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update profile";
      });
  },
});

export const { clearUsers, clearCurrentUser, setCurrentUser } = userSlice.actions;
export default userSlice.reducer;
