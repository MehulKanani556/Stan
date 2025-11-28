import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import sessionStorage from "redux-persist/es/storage/session";
import axios from "axios";
import { BASE_URL } from "../../Utils/baseUrl";
import { enqueueSnackbar } from "notistack";
// import { setAlert } from './alert.slice';

// import { SocketContext } from '../../context/SocketContext';
// Remove direct usage of SocketContext()
// const { socket } = SocketContext();

const handleErrors = (error, dispatch, rejectWithValue) => {
  const errorMessage = error.response?.data?.message || "An error occurred";
  // dispatch(setAlert({ text: errorMessage, color: 'error' }));
  return rejectWithValue(error.response?.data || { message: errorMessage });
};

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  loggedIn: false,
  isLoggedOut: false,
  message: null,
  hasRedirected: false,
  loginLoadin: false,
};

export const login = createAsyncThunk(
  "auth/login",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/userLogin`, data, {
        withCredentials: true,
      });
      console.log(response.data);
      localStorage.setItem("token", response.data.result.token);
      localStorage.setItem("userId", response.data.result.id);
      localStorage.setItem("refreshToken", response.data.result?.refreshToken);
      localStorage.setItem("role", response.data.result?.role || "user");
      localStorage.setItem("userReferralCode", response.data.result?.referralCode || "");
      enqueueSnackbar(response.data.message || "Login successful", { variant: "success" });

      return response.data.result;
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Login failed", {
        variant: "error",
      });
      return handleErrors(error, dispatch, rejectWithValue);
    }
  }
);

// Verify credentials only; DO NOT store tokens or mark authenticated
export const preLogin = createAsyncThunk(
  "auth/preLogin",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/userLogin`, data, {
        withCredentials: true,
      });
      // Return same structure but do not persist tokens here
      return response.data.result;
    } catch (error) {
      return handleErrors(error, dispatch, rejectWithValue);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      // Get referral code from URL parameter
      const searchParams = new URLSearchParams(window.location.search);
      const referralCode = searchParams.get('ref');
      
      // Add referral code to userData if present
      const registrationData = {
        ...userData,
        ...(referralCode && { referralCode })
      };

      const response = await axios.post(`${BASE_URL}/register`, registrationData, {
        withCredentials: true,
      });
      console.log("response", response.data);
      localStorage.setItem('token', response.data.result.token)
      localStorage.setItem('userId', response.data.result.id);
      localStorage.setItem('refreshToken', response.data.result?.refreshToken)
      localStorage.setItem('role', response.data.result?.role || 'user');
      localStorage.setItem('userReferralCode', response.data.result?.referralCode || '');
      enqueueSnackbar(response.data.message || "Register successful", { variant: "success" });

      return response.data;
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Registration failed", {
        variant: "error",
      });
      return rejectWithValue(
        error.message || "An unknown error occurred during registration."
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/forgotPassword`, payload);
      if (response.status === 200) {
        // dispatch(setAlert({ text: response.data.message, color: 'success' }));
        enqueueSnackbar(response.data.message || "Forgot Password successful", { variant: "success" });
        return response.data;
      }
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Forgot Password failed", {
        variant: "error",
      });
      return handleErrors(error, dispatch, rejectWithValue);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/VerifyEmail`, {
        email,
        otp
      });
      if (response.data.success) {
        enqueueSnackbar(response.data.message || "OTP verified successfully", { variant: "success" });
        return response.data;
      }
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "OTP verification failed", {
        variant: "error",
      });
      return handleErrors(error, dispatch, rejectWithValue);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, newPassword }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/resetPassword`, {
        email,
        newPassword,
      });
      if (response.status === 200) {
        enqueueSnackbar(response.data.message || "Password reset successful", { variant: "success" });
        return response.data;
      }
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Password reset failed", {
        variant: "error",
      });
      // return handleErrors(error, dispatch, rejectWithValue);
    }
  }
);


export const googleLogin = createAsyncThunk(
  "auth/google-login",
  async ({ uid, name, email, picture }, { dispatch, rejectWithValue }) => {
    try {
      
      const response = await axios.post(`${BASE_URL}/google-login`, { uid, name, email, picture }, { withCredentials: true });
      localStorage.setItem("token", response.data.result.token);
      localStorage.setItem("userId", response.data.result.id);
      localStorage.setItem("refreshToken", response.data.result?.refreshToken);
      localStorage.setItem("role", response.data.result?.role || "user");
      localStorage.setItem("userReferralCode", response.data.result?.referralCode || "");
      enqueueSnackbar(response.data.message || "Login successful", { variant: "success" });

      return response.data.result;
    } catch (error) {
      // Optionally handle errors here
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/logout/${id}`);
      if (response.data.success) {
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("refreshToken");
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        if (window.persistor) {
          window.persistor.purge();
        }
        // dispatch(setAlert({ text: response.data.message, color: 'success' }));
        enqueueSnackbar(response.data.message || "Logged out successfully", { variant: "success" });
        return response.data;
      }
    } catch (error) {
      // return handleErrors(error, dispatch, rejectWithValue);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // logout: (state, action) => {
    //     state.user = null;
    //     state.isAuthenticated = false;
    //     state.loggedIn = false;
    //     state.isLoggedOut = true;
    //     state.message = action.payload?.message || "Logged out successfully";
    //     window.localStorage.clear();
    //     window.sessionStorage.clear();
    // },
    setauth: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setHasRedirected: (state, action) => {
      state.hasRedirected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        if (action.payload && action.payload.user) {
          // Ensure user has a role property
          if (!action.payload.user.role) {
            action.payload.user.role = "user";
          }
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.loading = false;
          state.error = null;
          state.loginLoadin = false;
          state.message = action.payload?.message || "Login successfully";
        }
      })

      .addCase(login.pending, (state) => {
        state.loginLoadin = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loginLoadin = false;
        
        state.error = action.payload.message;
        state.message = action.payload?.message
      })
      // preLogin does not mutate auth state (no side effects)
      .addCase(preLogin.pending, (state) => {
        state.error = null;
      })
      .addCase(preLogin.rejected, (state, action) => {
        state.error = action.payload.message;
      })
      .addCase(register.fulfilled, (state, action) => {
        if (action.payload && action.payload.user) {
          // Ensure user has a role property
          if (!action.payload.user.role) {
            action.payload.user.role = "user";
          }
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.loading = false;
          state.error = null;
          state.message = action.payload?.message || "Register successfully";
        }
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message = action.payload?.message || "User Already Exist";
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload; // Assuming the API returns a success message
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message = action.payload?.message || "Forgot Password Failed";
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        if (action.payload && action.payload.user) {
          // Ensure user has a role property
          if (!action.payload.user.role) {
            action.payload.user.role = "user";
          }
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
        state.loading = false;
        state.error = null;
        state.message = action.payload.message; // Assuming the API returns a success message
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message = action.payload.data?.message || "Verify OTP Failed";
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload; // Assuming the API returns a success message
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message = action.payload?.message || "Reset Password Failed";
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loggedIn = false;
        state.isLoggedOut = true;
        window.sessionStorage.clear();
        state.message = action.payload?.message || "Logged out successfully";
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload.message;
        state.message = action.payload?.message || "Logout Failed";
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
       console.log(action.payload);
          if (!action.payload.role) {
            action.payload.role = "user";
          }
          state.user = action.payload;
          state.isAuthenticated = true;
          state.loading = false;
          state.error = null;
          state.message = action.payload?.message || "Google Login successful";
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message = action.payload?.message || "Google Login Failed";
      });
  },
});

export const { setauth, setHasRedirected } = authSlice.actions;
export default authSlice.reducer;
