import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Utils/axiosInstance";
import { enqueueSnackbar } from 'notistack';

const initialStateSubscribe = {
    Subscribe: [],
    success: false,
    message: '',
    loading: false,
};

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getAllSubscribe = createAsyncThunk(
    "Subscribe/getAllSubscribe",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/getAllsubscribe`);
            return response.data.data;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const createSubscribe = createAsyncThunk(
    "Subscribe/createSubscribe",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/createsubscribe`, data);
            enqueueSnackbar(response.data.message || "Subscribe Add successful", { variant: "success" });
            return response.data;
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || error.message || "Subscribe not successful", { variant: "error" });
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const updateSubscribe = createAsyncThunk(
    "Subscribe/updateSubscribe",
    async (data, { dispatch, rejectWithValue }) => {
        // console.log("data", data);
        try {
            const response = await axiosInstance.put(`/updatesubscribe`, data);
            enqueueSnackbar(response.data.message || "Subscribe Update successful", { variant: "success" });
            return response.data.data; // Return the updated starring data
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || error.message || "Subscribe not Update", { variant: "error" });
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const deleteSubscribe = createAsyncThunk(
    "Subscribe/deleteSubscribe",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/deletesubscribe/${data._id}`);
            enqueueSnackbar(response.data.message || "Subscribe Delete successful", { variant: "success" });
            // console.log(response.data);
            if (response.data.success) {
                return data._id;
            }
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || error.message || "Subscribe not Delete", { variant: "error" });
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

const SubscribeSlice = createSlice({
    name: 'Subscribe',
    initialState: initialStateSubscribe,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllSubscribe.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching users...';
            })
            .addCase(getAllSubscribe.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Subscribe fetched successfully';
                state.Subscribe = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(getAllSubscribe.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch users';
            })

            .addCase(createSubscribe.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching users...';
            })
            .addCase(createSubscribe.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Subscribe created successfully';
                state.Subscribe.push(action.payload.data);
            })
            .addCase(createSubscribe.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch users';
            })
            .addCase(updateSubscribe.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching users...';
            })
            .addCase(updateSubscribe.fulfilled, (state, action) => {
                // console.log(action.payload);
                state.loading = false;
                state.success = true;
                state.message = 'Subscribe update successfully';
                state.Subscribe = state.Subscribe.map((v) => v._id == action.payload._id ? action.payload : v);
            })
            .addCase(updateSubscribe.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch users';
            })
            .addCase(deleteSubscribe.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching users...';
            })
            .addCase(deleteSubscribe.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Subscribe delete successfully';
                state.Subscribe = state.Subscribe.filter((v) => v._id !== action.payload);
            })
            .addCase(deleteSubscribe.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch users';
            })

    }
});

export default SubscribeSlice.reducer;