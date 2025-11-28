import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Utils/axiosInstance";

const initialStatedashboard = {
    DashboardStats: {},
    CategoryByGame: [],
    topGames: [],
    recentTransactions: [],
    topCategories: [],
    topPlatform: [],
    success: false,
    message: '',
    loading: false,
};

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getDashboardStats = createAsyncThunk(
    "BasicCounts/getDashboardStats",
    async (period = 'all', { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/getDashboardStats?period=${period}`);
            return response.data.data;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const getCategoryByGame = createAsyncThunk(
    "CategoryByGame/getCategoryByGame",
    async (period = 'all', { dispatch, rejectWithValue }) => {
        try {
            // const response = await axiosInstance.get(`/getCategoryByGame?period=${period}`);
            const response = await axiosInstance.get(`/getCategoryByGame`);
            return response.data.data;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const getTopGames = createAsyncThunk(
    "TotalRevenue/getTopGames",
    async (period = 'all', { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/getTopGames?period=${period}`);
            return response.data.data;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const getRecentTransactions = createAsyncThunk(
    "recentTransactions/getRecentTransactions",
    async (period = 'all', { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/getRecentTransactions?period=${period}`);
            return response.data.data;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const getTopCategories = createAsyncThunk(
    "topCategories/getTopCategories",
    async (period = 'all', { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/getTopCategories?period=${period}`);
            return response.data.data;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const getTopPlatform = createAsyncThunk(
    "topPlatform/getTopPlatform",
    async (period = 'all', { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/getPlatformWiseOrders?period=${period}`);
            return response.data.data;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: initialStatedashboard,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getDashboardStats.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching Basic Counts...';
            })
            .addCase(getDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Basic Counts fetched successfully';
                state.DashboardStats = action.payload || {};
            })
            .addCase(getDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch Basic Counts';
            })
            .addCase(getCategoryByGame.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching Top Category...';
            })
            .addCase(getCategoryByGame.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Top Category fetched successfully';
                state.CategoryByGame = action.payload || {};
            })
            .addCase(getCategoryByGame.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch Top Category';
            })
            .addCase(getTopGames.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching Total Revenue...';
            })
            .addCase(getTopGames.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Total Revenue fetched successfully';
                state.topGames = action.payload || {};
            })
            .addCase(getTopGames.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch Total Revenue';
            })
            .addCase(getRecentTransactions.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching New Plan...';
            })
            .addCase(getRecentTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'New Plan fetched successfully';
                state.recentTransactions = action.payload || {};
            })
            .addCase(getRecentTransactions.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch New Plan';
            })
            .addCase(getTopCategories.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching New Plan...';
            })
            .addCase(getTopCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'New Plan fetched successfully';
                state.topCategories = action.payload || {};
            })
            .addCase(getTopCategories.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch New Plan';
            })
            .addCase(getTopPlatform.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching New Plan...';
            })
            .addCase(getTopPlatform.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'New Plan fetched successfully';
                state.topPlatform = action.payload || {};
            })
            .addCase(getTopPlatform.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch New Plan';
            })
    }
});

export default dashboardSlice.reducer;