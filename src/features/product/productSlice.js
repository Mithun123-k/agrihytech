import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createProductAPI, getProductByIdAPI, updateProductAPI } from "./productAPI";


// 🔥 GET PRODUCT BY ID
export const getProductById = createAsyncThunk(
  "product/getById",

  async (
    {
      productId,
      lat,
      lng,
      role,
    },
    thunkAPI
  ) => {

    try {

      const res =
        await getProductByIdAPI({
          productId,
          lat,
          lng,
          role,
        });

      return res?.data || res;

    } catch (err) {

      return thunkAPI.rejectWithValue(
        err.response?.data?.error ||
        "Failed to fetch product"
      );
    }
  }
);

// 🔥 CREATE PRODUCT
export const createProduct = createAsyncThunk(
    'product/create',
    async (productData, thunkAPI) => {
        try {
            const res = await createProductAPI(productData);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// UPDATE PRODUCT
export const updateProduct = createAsyncThunk(
    "product/update",
    async ({ id, productData }, thunkAPI) => {
        try {
            const res = await updateProductAPI(id, productData);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);



const productSlice = createSlice({
    name: "product",
    initialState: {
        products: [],
        productDetails: null,   // 🔥 add this
        loading: false,
        error: null,
        success: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(getProductById.pending, (state) => {
                state.loading = true;
            })

            .addCase(getProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.productDetails = action.payload;
            })

            .addCase(getProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(createProduct.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
             // UPDATE PRODUCT
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProduct.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    },
});

export default productSlice.reducer;