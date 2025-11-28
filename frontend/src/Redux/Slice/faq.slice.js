import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Utils/axiosInstance";
import { enqueueSnackbar } from 'notistack';


export const allFaqs = createAsyncThunk(
    "faq/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/getAllFaqs");
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const createFaq = createAsyncThunk(
    "faq/createFaq",
    async (data, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/createFaq", data);
            enqueueSnackbar(res.data.message || "Faq Add successful", { variant: "success" });
            return res.data.data;
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || err.message || "Faq not successful", { variant: "error" });
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const updateFaq = createAsyncThunk(
    "faq/updateFaq",
    async (data, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.put(`/updateFaq/${data._id}`, data);
            // console.log(res);
            enqueueSnackbar(res.data.message || "Faq Add successful", { variant: "success" });
            return res.data.data;
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || err.message || "Faq not Upadate", { variant: "error" });
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const deleteFaq = createAsyncThunk(
    "faq/deleteFaq",
    async (data, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.delete(`/deleteFaq/${data._id}`);
            enqueueSnackbar(res.data.message || "Faq Delete successful", { variant: "success" });

            if (res.data.success) {
                return data._id;
            }
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || err.message || "Faq not Delete", { variant: "error" });
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

const faqSlice = createSlice({
    name: "faq",
    initialState: {
        faqs: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(allFaqs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(allFaqs.fulfilled, (state, action) => {
                state.loading = false;
                state.faqs = action.payload.data || [];
            })
            .addCase(allFaqs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch FAQs";
            })

            .addCase(createFaq.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createFaq.fulfilled, (state, action) => {
                // console.log(action.payload);
                state.loading = false;
                state.faqs.push(action.payload);
            })
            .addCase(createFaq.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch FAQs";
            })

            .addCase(updateFaq.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateFaq.fulfilled, (state, action) => {
                state.loading = false;
                state.faqs = state.faqs.map(faq => faq._id === action.payload._id ? action.payload : faq);
            })
            .addCase(updateFaq.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch FAQs";
            })

            .addCase(deleteFaq.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching users...';
            })
            .addCase(deleteFaq.fulfilled, (state, action) => {
                state.loading = false;
                state.message = 'Faq delete successfully';
                state.faqs = state.faqs.filter((v) => v._id !== action.payload);
            })
            .addCase(deleteFaq.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message || 'Failed to fetch users';
            })

    },
});

export default faqSlice.reducer;