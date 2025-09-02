import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Utils/axiosInstance";

// Thunk to fetch profile by userId
export const fetchProfile = createAsyncThunk(
    "profile/fetchProfile",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/getUserById/${userId}`);
            return response.data; // { success, result, message }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to load profile";
            return rejectWithValue(error.response?.data || { message: errorMessage });
        }
    }
);

const initialState = {
    data: null,
    loading: false,
    error: null,
    message: null,
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        clearProfile: (state) => {
            state.data = null;
            state.loading = false;
            state.error = null;
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.result || null;
                state.message = action.payload.message || null;
                state.error = null;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to load profile";
                state.data = null;
            });
    },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;



