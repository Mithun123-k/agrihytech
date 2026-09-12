import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getHomeAPI, getUserHomeAPI } from "./homeAPI";
import { getmyCategoriesAPI } from "../category/categoryAPI";

// 🔹 FETCH B2B / ADMIN HOME DATA
export const getHomeData = createAsyncThunk(
  "home/getHomeData",
  async (_, thunkAPI) => {
    try {
      const role = thunkAPI.getState()?.auth?.user?.role;
      if (role === "B2B" || role === "COMPANY") {
        const [homeResponse, categoryResponse] = await Promise.all([
          getHomeAPI(),
          getmyCategoriesAPI(),
        ]);
        return {
          ...homeResponse.data,
          categories: categoryResponse.data.categories || [],
        };
      }
      const response = await getHomeAPI();
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to load home"
      );
    }
  }
);

// 🔹 FETCH B2C USER HOME DATA
export const getUserHomeData = createAsyncThunk(
  "home/getUserHomeData",
  async (_, thunkAPI) => {
    try {
      const res = await getUserHomeAPI();
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to load user home"
      );
    }
  }
);

const homeSlice = createSlice({
  name: "home",
  initialState: {
    banners: [],
    categories: [],
    brands: [],
    userName: "",
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
    };

    const handleFulfilled = (state, action) => {
      state.loading = false;
      state.banners = action.payload.banners || [];
      state.categories = action.payload.categories || [];
      state.brands = action.payload.brands || [];
      state.userName = action.payload.userName || "";
    };

    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder

      // B2B / ADMIN
      .addCase(getHomeData.pending, handlePending)
      .addCase(getHomeData.fulfilled, handleFulfilled)
      .addCase(getHomeData.rejected, handleRejected)

      // B2C
      .addCase(getUserHomeData.pending, handlePending)
      .addCase(getUserHomeData.fulfilled, handleFulfilled)
      .addCase(getUserHomeData.rejected, handleRejected);
  },
});

export default homeSlice.reducer;
