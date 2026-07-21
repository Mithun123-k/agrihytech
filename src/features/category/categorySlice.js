import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCategoriesAPI, getBrandsByCategoryAPI, getmyCategoriesAPI, getMyBrandsByCategoryAPI, getProductsByBrandAPI, getPublicCategoriesAPI, getCategoriesByRoleAPI } from "./categoryAPI";


export const getPublicCategories = createAsyncThunk(
  "category/getPublicCategories",
  async (_, thunkAPI) => {
    try {
      const res = await getPublicCategoriesAPI();

      return res.data.categories || res.data;
      // backend safe handling (array or wrapped object)
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch public categories"
      );
    }
  }
);

// 🔥 GET CATEGORIES
export const getCategories = createAsyncThunk(
  "category/getCategories",
  async (_, thunkAPI) => {
    try {
      const res = await getCategoriesAPI();
      return res.data.categories; // 👈 important
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

// 🔥 GET MY CATEGORIES
export const getMyCategories = createAsyncThunk(
  "category/getMyCategories",
  async (_, thunkAPI) => {
    try {
      const res = await getmyCategoriesAPI();
      return res.data.categories;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch my categories"
      );
    }
  }
);

// 🔥 GET CATEGORIES BY ROLE
export const getCategoriesByRole = createAsyncThunk(
  "category/getCategoriesByRole",
  async (_, thunkAPI) => {
    try {
      const res = await getCategoriesByRoleAPI();

      return res.data.categories;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message ||
        "Failed to fetch categories"
      );
    }
  }
);

// brands by Product

export const getBrandsByProduct = createAsyncThunk(
  "category/getBrandsByProduct",
  async (productId, thunkAPI) => {
    try {
      const res = await getProductsByBrandAPI(productId);

      return {
        brands: res.data.brands,
        total: res.data.totalBrands
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch brands"
      );
    }
  }
);



export const getBrandsByCategory = createAsyncThunk(
  "category/getBrandsByCategory",
  async ({ categoryId, page = 1, isAdmin = false }, thunkAPI) => {
    try {
      const res = await getBrandsByCategoryAPI(
        categoryId,
        page,
        isAdmin
      );

      return {
        brands: res.data.brands,
        total: res.data.total
      };

    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to fetch brands"
      );
    }
  }
);

export const getMyBrandsByCategory = createAsyncThunk(
  "category/getMyBrandsByCategory",
  async ({ categoryId, page = 1 }, thunkAPI) => {
    try {
      const res = await getMyBrandsByCategoryAPI(categoryId, page);

      return {
        brands: res.data.brands,
        total: res.data.total
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch my brands"
      );
    }
  }
);

const categorySlice = createSlice({
  name: "category",

  initialState: {

    categories: [],
    brands: [],        // 🔥 add this
    loading: false,
    error: null,
    totalBrands: 0,
    publicCategories: [],
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // 🔄 LOADING
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // ✅ SUCCESS
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload || [];
      })

      // ❌ ERROR
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // MY CATEGORIES
      .addCase(getMyCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getMyCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload || [];
      })

      .addCase(getMyCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔥 BRANDS BY CATEGORY

      .addCase(getBrandsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getBrandsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload.brands;
        state.totalBrands = action.payload.total;
      })

      .addCase(getBrandsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 🔥 MY BRANDS BY CATEGORY
      .addCase(getMyBrandsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getMyBrandsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload.brands || [];
        state.totalBrands = action.payload.total || 0;
      })

      .addCase(getMyBrandsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getBrandsByProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getBrandsByProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload.brands || [];
        state.totalBrands = action.payload.total || 0;
      })

      .addCase(getBrandsByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPublicCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getPublicCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.publicCategories = action.payload || [];
      })

      .addCase(getPublicCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCategoriesByRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getCategoriesByRole.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload || [];
      })

      .addCase(getCategoriesByRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default categorySlice.reducer;