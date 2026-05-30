import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  sendOtpAPI,
  verifyOtpAPI,
  registerB2BAPI,
  getMeAPI,
  updateProfileAPI,
  requestAccountDeletionAPI,
} from "./authAPI";

// 🔹 SEND OTP
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async ({ mobile, role = "B2B" }, thunkAPI) => {
    try {
      const res = await sendOtpAPI({ mobile, role });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        // console.log(err.response.data.error) 
        err.response.data.error || "OTP send failed"
      );
    }
  }
);

// 🔹 VERIFY OTP
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ mobile, otp, role = "B2B" }, thunkAPI) => {
    try {
      const res = await verifyOtpAPI({ mobile, otp, role });

      const { token, user } = res.data;

      await AsyncStorage.setItem("token", token);

      return { token, user };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

// 🔹 REGISTER B2B
export const registerB2B = createAsyncThunk(
  "auth/registerB2B",
  async (data, thunkAPI) => {
    try {
      const res = await registerB2BAPI(data);

      const { token, user } = res.data;

      // ❌ REMOVE THIS
      // await AsyncStorage.setItem("token", token);

      return { token, user };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

// 🔹 LOAD USER (AUTO LOGIN)
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) throw new Error("No token");

      const res = await getMeAPI();

      return {
        token,
        user: res.data.user,
      };
    } catch (err) {
      console.log("LOAD USER ERROR:", err?.response?.data || err.message);

      if (err?.response?.status === 401) {
        await AsyncStorage.removeItem("token");
      }

      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Session expired"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData, thunkAPI) => {
    try {
      const res = await updateProfileAPI(formData);

      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Profile update failed"
      );
    }
  }
);

// 🔥 REQUEST ACCOUNT DELETE
export const requestAccountDeletion = createAsyncThunk(

  "auth/requestAccountDeletion",

  async (reason, thunkAPI) => {

    try {

      const res =
        await requestAccountDeletionAPI({
          reason
        });

      return res.data;

    } catch (err) {

      return thunkAPI.rejectWithValue(

        err?.response?.data?.message ||

        "Delete request failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    mobile: null,
    user: null,
    token: null,
    appLoading: true,   // 🔥 only for app start
    loading: false,
    error: null,
    isAuthenticated: false,
    isRegistered: false,
  },
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },

    logout: (state) => {
      state.mobile = null;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      AsyncStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder

      // SEND OTP
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.mobile = action.meta.arg.mobile;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // VERIFY OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        // state.isAuthenticated = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REGISTER B2B
      .addCase(registerB2B.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerB2B.fulfilled, (state, action) => {
        state.loading = false;

        state.token = action.payload.token;
        state.user = action.payload.user;

        // ❌ REMOVE THIS
        // state.isAuthenticated = true;

        state.isRegistered = true;
      })
      .addCase(registerB2B.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOAD USER
      .addCase(loadUser.pending, (state) => {
        state.appLoading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.appLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loadUser.rejected, (state) => {
        state.appLoading = false;
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      })
      // UPDATE PROFILE
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // REQUEST ACCOUNT DELETE
      .addCase(
        requestAccountDeletion.pending,
        (state) => {

          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        requestAccountDeletion.fulfilled,
        (state) => {

          state.loading = false;
        }
      )

      .addCase(
        requestAccountDeletion.rejected,
        (state, action) => {

          state.loading = false;
          state.error = action.payload;
        }
      )
  },
});

export const { logout, setAuthenticated } = authSlice.actions;
export default authSlice.reducer;