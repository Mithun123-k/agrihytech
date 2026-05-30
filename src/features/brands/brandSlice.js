import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProductsByBrandAPI,
  getMyBrandsAPI,
  createBrandAPI,
  updateBrandAPI,
  getAllBrandsAPI,
  getMyProductsByBrandAPI,
  getProductsByCategoryAPI,
  deleteProductAPI
} from "./brandAPI";

export const getProductsByBrand = createAsyncThunk(
  "product/getByBrand",
  async ({ brandId, page = 1 }, thunkAPI) => {
    try {
      const res = await getProductsByBrandAPI(brandId, page);

      console.log("redux called", res.data.products)

      return {
        products: res.data.products,
        total: res.data.total,
        brand: res.data.brand
      };

    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to fetch products"
      );
    }
  }
);

export const getProductsByCategory = createAsyncThunk(
  "product/getProductsByCategory",
  async ({ categoryId, page = 1 }, thunkAPI) => {
    try {
      const res = await getProductsByCategoryAPI(categoryId, page);

      return {
        products: res.data.products,
        total: res.data.total
      };

    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch category products"
      );
    }
  }
);

// ================= My Brands =================
export const getMyBrands = createAsyncThunk(
  "brand/getMyBrands",
  async ({ page = 1, search = "" }, thunkAPI) => {
    try {
      const res = await getMyBrandsAPI(page, search);

      return {
        brands: res.data.brands,
        totalBrands: res.data.total
      };

    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to fetch brands"
      );
    }
  }
);

export const createBrand = createAsyncThunk(
  "brand/create",
  async (brandData, thunkAPI) => {
    try {
      const formData = new FormData();

      formData.append("name", brandData.name);
      formData.append("category", brandData.category);

      formData.append("image", {
        uri: brandData.image.uri,
        type: brandData.image.type || "image/jpeg",
        name: brandData.image.fileName || "brand.jpg",
      });

      const res = await createBrandAPI(formData);

      return res.data.brand;

    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Create brand failed"
      );
    }
  }
);

export const updateBrand = createAsyncThunk(
  "brand/update",
  async ({ id, brandData }, thunkAPI) => {
    try {
      const formData = new FormData();

      if (brandData.name) {
        formData.append("name", brandData.name);
      }

      if (brandData.category) {
        formData.append("category", brandData.category);
      }

      if (brandData.image?.uri) {
        formData.append("image", {
          uri: brandData.image.uri,
          type: brandData.image.type || "image/jpeg",
          name: brandData.image.fileName || "brand.jpg",
        });
      }

      const res = await updateBrandAPI(id, formData);

      return res.data.brand;

    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Update brand failed"
      );
    }
  }
);

export const getAllBrands = createAsyncThunk(
  "brand/getAllBrands",
  async ({ page = 1, search = "" }, thunkAPI) => {
    try {
      const res = await getAllBrandsAPI(page, search);

      console.log("API response:", res.data);

      return {
        brands: res.data.brands,
        totalBrands: res.data.total
      };

    } catch (err) {
      console.log("API ERROR", err.response?.data);

      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to fetch brands"
      );
    }
  }
);

export const getMyProductsByBrand = createAsyncThunk(
  "product/getMyProductsByBrand",
  async ({ brandId, page = 1 }, thunkAPI) => {
    try {
      const res = await getMyProductsByBrandAPI(brandId, page);

      return {
        products: res.data.products,
        total: res.data.total,
        brand: res.data.brand
      };

    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch my products"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (productId, thunkAPI) => {
    try {
      await deleteProductAPI(productId);

      return productId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

const brandSlice = createSlice({
  name: "brand",

  initialState: {
    products: [],
    brands: [],
    loading: false,
    error: null,
    total: 0,
    totalBrands: 0,
    brand: null
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getProductsByBrand.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductsByBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.total = action.payload.total;
        state.brand = action.payload.brand;
      })
      .addCase(getProductsByBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // My Brands
      .addCase(getMyBrands.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload.brands;
        state.totalBrands = action.payload.totalBrands;
      })
      .addCase(getMyBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createBrand.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBrand.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateBrand.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBrand.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get All Brands
      .addCase(getAllBrands.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload.brands;
        state.totalBrands = action.payload.totalBrands;
      })
      .addCase(getAllBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get My Products By Brand
      .addCase(getMyProductsByBrand.pending, (state) => {
        state.loading = true;
      })

      .addCase(getMyProductsByBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.total = action.payload.total;
        state.brand = action.payload.brand;
      })

      .addCase(getMyProductsByBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Products By Category (B2C)
      .addCase(getProductsByCategory.pending, (state) => {
        state.loading = true;
      })

      .addCase(getProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.total = action.payload.total;
      })

      .addCase(getProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          product => product._id !== action.payload
        );
        state.total -= 1;
      })

      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default brandSlice.reducer;