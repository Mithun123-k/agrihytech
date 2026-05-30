import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchAPI } from "./searchAPI";

// ===============================
// SEARCH API CALL
// ===============================
export const searchItems = createAsyncThunk(
  "search/searchItems",
  async (query, thunkAPI) => {
    try {
      const res = await searchAPI(query);
      return {
        query,
        data: res,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Search failed"
      );
    }
  }
);

const initialState = {
  loading: false,
  results: [],
  recentSearches: [],
  error: null,
};

const searchSlice = createSlice({
  name: "search",
  initialState,

  reducers: {
    // 🔹 Remove Single Recent Search
    removeRecentSearch: (state, action) => {
      state.recentSearches = state.recentSearches.filter(
        (item) => item !== action.payload
      );
    },

    // 🔹 Clear All Recent Searches
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
  },

  extraReducers: (builder) => {
    builder

      // ===============================
      // SEARCH PENDING
      // ===============================
      .addCase(searchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // ===============================
      // SEARCH SUCCESS
      // ===============================
      .addCase(searchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.data;

        const query = action.payload.query?.trim();

        if (query) {
          // Duplicate remove
          state.recentSearches = state.recentSearches.filter(
            (item) => item !== query
          );

          // Add latest on top
          state.recentSearches.unshift(query);

          // Keep only last 5
          state.recentSearches = state.recentSearches.slice(0, 5);
        }
      })

      // ===============================
      // SEARCH FAILED
      // ===============================
      .addCase(searchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  removeRecentSearch,
  clearRecentSearches,
} = searchSlice.actions;

export default searchSlice.reducer;