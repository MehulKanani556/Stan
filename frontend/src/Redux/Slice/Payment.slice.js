import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Utils/axiosInstance";
import { enqueueSnackbar } from "notistack";
import { setClearCart } from "./cart.slice";
import { addFanCoins } from '../Slice/user.slice';

const initialStatepayment = {
  payment: [],
  success: false,
  message: "",
  loading: false,
  clientSecret: "",
  orders: [],
  paymentStatus: null,
  error: null,
};

const handleErrors = (error, dispatch, rejectWithValue) => {
  const errorMessage = error.response?.data?.message || "An error occurred";
  return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getAllpayment = createAsyncThunk(
  "payment/getAllpayment",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/getpayment`);
      return response.data.data;
    } catch (error) {
      return handleErrors(error, dispatch, rejectWithValue);
    }
  }
);

export const getPaymentUser = createAsyncThunk(
  "payment/getPaymentUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/getPaymentUser`);
      return response.data.data;
    } catch (error) {
      return handleErrors(error, dispatch, rejectWithValue);
    }
  }
);

export const createpayment = createAsyncThunk(
  "payment/createpayment",
  async (data, { dispatch, rejectWithValue }) => {
    console.log("rest", data);

    try {
      const response = await axiosInstance.post(`/create-payment`, data);
      enqueueSnackbar(response.data.message || "Payment Successful !", {
        variant: "success",
      });
      console.log("response", response.data);
      return response.data;
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message ||
        error.message ||
        "payment not successful",
        { variant: "error" }
      );
      return handleErrors(error, dispatch, rejectWithValue);
    }
  }
);

// Create order (calls backend to create Stripe Payment Intent and DB order)
export const createOrder = createAsyncThunk(
  "payment/createOrder",
  async ({ items, amount ,fanCoinDiscount,fanCoinsUsed}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/order/create", {
        items,
        amount,
        fanCoinDiscount,
        fanCoinsUsed
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Order creation failed"
      );
    }
  }
);

export const createPaymentIntent = createAsyncThunk(
  "payment/createPaymentIntent",
  async ({ items, amount }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/payment/create-intent", {
        items,
        amount,
      });
      return response.data;
    } catch (error) {
      return handleErrors(error, dispatch, rejectWithValue);
    }
  }
);

// Verify payment (calls backend to confirm Stripe Payment Intent)
export const verifyPayment = createAsyncThunk(
  "payment/verifyPayment",
  async ({ paymentIntentId, orderId ,fanCoinDiscount,fanCoinsUsed}, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/order/verify", {
        paymentIntentId,
        orderId,
        fanCoinDiscount,
        fanCoinsUsed
      });
      // console.log(response.data);

      // Add fan coins after successful payment
      if (response.data.success) {
        const userId = localStorage.getItem('userId');
        const amount = response?.data?.order?.amount;

        // Dispatch add fan coins action
        await dispatch(addFanCoins({
          userId,
          amount
        }));
      }

      return response.data;
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const allorders = createAsyncThunk(
  "payment/allOrders",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/allorders");
      return response.data.orders;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Payment verification failed"
      );
    }
  }
);

// Retry payment for existing order
export const retryOrderPayment = createAsyncThunk(
  "payment/retryOrderPayment",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/order/retry-payment", {
        orderId,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to retry payment"
      );
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: initialStatepayment,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getPayment
      .addCase(getAllpayment.pending, (state) => {
        state.loading = true;
        state.message = "Fetching users...";
      })
      .addCase(getAllpayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "payment fetched successfully";
        state.payment = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getAllpayment.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to fetch users";
      })
      // getPaymentUser
      .addCase(getPaymentUser.pending, (state) => {
        state.loading = true;
        state.message = "Fetching users...";
      })
      .addCase(getPaymentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "payment fetched successfully";
        state.payment = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getPaymentUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to fetch users";
      })
      // create Payment
      .addCase(createpayment.pending, (state) => {
        state.loading = true;
        state.message = "Fetching users...";
      })
      .addCase(createpayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "payment created successfully";
        state.payment.push(action.payload.payment);
        state.clientSecret = action.payload.clientSecret;
      })
      .addCase(createpayment.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to fetch users";
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.order;
        // state.clientSecret = action.payload.clientSecret;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentStatus = action.payload.success ? "success" : "failed";
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.paymentStatus = "failed";
        state.error = action.payload;
      })
      .addCase(allorders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(allorders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(allorders.rejected, (state, action) => {
        state.loading = false;
        state.orders = [];
        state.error = action.payload;
      })
      .addCase(retryOrderPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(retryOrderPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.clientSecret = action.payload.clientSecret;
      })
      .addCase(retryOrderPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPaymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.clientSecret = action.payload.clientSecret;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default paymentSlice.reducer;
