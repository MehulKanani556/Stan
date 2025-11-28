import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Utils/axiosInstance";
import { enqueueSnackbar } from 'notistack';

const initialStateBlog = {
    blogs: [],
    success: false,
    message: '',
    loading: false,
};

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getAllBlogs = createAsyncThunk(
    "blog/getAllBlogs",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/getAllBlogs`);
            return response.data.data;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const createBlog = createAsyncThunk(
    "Blog/createBlog",
    async (formData, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/createBlog`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            enqueueSnackbar(response.data.message || "Blog Add successful", { variant: "success" });
            return response.data;
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || error.message || "Blog not successful", { variant: "error" });
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const updateBlog = createAsyncThunk(
    "Blog/updateBlog",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/updateBlog/${data._id}`, data.formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            enqueueSnackbar(response.data.message || "Blog Update successful", { variant: "success" });
            return response.data.data; // Return the updated Blog data
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || error.message || "Blog not Updated", { variant: "error" });
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const deleteBlog = createAsyncThunk(
    "Blog/deleteBlog",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/deleteBlog/${data._id}`);
            enqueueSnackbar(response.data.message || "Blog Delete successful", { variant: "success" });
            if (response.data.success) {
                return data._id;
            }
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || error.message || "Blog not Deleted", { variant: "error" });
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

const blogSlice = createSlice({
    name: 'blog',
    initialState: initialStateBlog,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllBlogs.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching users...';
            })
            .addCase(getAllBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Blog fetched successfully';
                state.blogs = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(getAllBlogs.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch users';
            })

            .addCase(createBlog.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching users...';
            })
            .addCase(createBlog.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Blog created successfully';
                state.blogs.push(action.payload.data);
            })
            .addCase(createBlog.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch users';
            })
            .addCase(updateBlog.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching users...';
            })
            .addCase(updateBlog.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Blog update successfully';
                state.blogs = state.blogs.map((v) => v._id === action.payload._id ? action.payload : v);
            })
            .addCase(updateBlog.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch users';
            })
            .addCase(deleteBlog.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching users...';
            })
            .addCase(deleteBlog.fulfilled, (state, action) => {
                // console.log("tyulo",action.payload);
                state.loading = false;
                state.success = true;
                state.message = 'Blog delete successfully';
                state.blogs = state.blogs.filter((v) => v._id !== action.payload);
            })
            .addCase(deleteBlog.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch users';
            })

    }
});

export default blogSlice.reducer;