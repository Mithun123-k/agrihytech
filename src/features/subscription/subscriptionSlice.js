import {
  createSlice,
  createAsyncThunk
} from "@reduxjs/toolkit";

import {

  getPlansAPI,

  createOrderAPI,

  verifyPaymentAPI,

  activateTrialAPI

} from "./subscriptionAPI";

export const getPlans = createAsyncThunk(
  "subscription/getPlans",

  async (_, thunkAPI) => {

    try {

      const res = await getPlansAPI();

      return res.data;

    } catch (err) {

      return thunkAPI.rejectWithValue(
        err.response?.data?.error ||
        "Failed to fetch plans"
      );

    }
  }
);


export const createOrder = createAsyncThunk(
  "subscription/createOrder",

  async (planId, thunkAPI) => {

    try {

      const res =
        await createOrderAPI({
          planId
        });

      return res.data;

    } catch (err) {

      return thunkAPI.rejectWithValue(
        err.response?.data?.error ||
        "Order creation failed"
      );

    }
  }
);


export const verifyPayment = createAsyncThunk(
  "subscription/verifyPayment",

  async (paymentData, thunkAPI) => {

    try {

      const res =
        await verifyPaymentAPI(
          paymentData
        );

      return res.data;

    } catch (err) {

      return thunkAPI.rejectWithValue(
        err.response?.data?.error ||
        "Payment verification failed"
      );

    }
  }
);


export const activateTrial = createAsyncThunk(
  "subscription/activateTrial",

  async (_, thunkAPI) => {

    try {

      const res =
        await activateTrialAPI();

      return res.data;

    } catch (err) {

      return thunkAPI.rejectWithValue(
        err.response?.data?.error ||
        "Trial activation failed"
      );

    }
  }
);



const initialState = {

  plans: [],

  loading: false,

  error: null,

  orderData: null,

  paymentVerified: false
};

const subscriptionSlice = createSlice({

  name: "subscription",

  initialState,

  reducers: {},

  extraReducers: (builder) => {

    builder

      // GET PLANS

      .addCase(getPlans.pending, (state) => {

        state.loading = true;

      })

      .addCase(
        getPlans.fulfilled,
        (state, action) => {

          state.loading = false;

          state.plans = action.payload;

        }
      )

      .addCase(
        getPlans.rejected,
        (state, action) => {

          state.loading = false;

          state.error = action.payload;

        }
      )

      // CREATE ORDER

      .addCase(
        createOrder.pending,
        (state) => {

          state.loading = true;

        }
      )

      .addCase(
        createOrder.fulfilled,
        (state, action) => {

          state.loading = false;

          state.orderData = action.payload;

        }
      )

      .addCase(
        createOrder.rejected,
        (state, action) => {

          state.loading = false;

          state.error = action.payload;

        }
      )

      // VERIFY PAYMENT

      .addCase(
        verifyPayment.pending,
        (state) => {

          state.loading = true;

        }
      )

      .addCase(
        verifyPayment.fulfilled,
        (state) => {

          state.loading = false;

          state.paymentVerified = true;

        }
      )

      .addCase(
        verifyPayment.rejected,
        (state, action) => {

          state.loading = false;

          state.error = action.payload;

        }
      )

      // ACTIVATE TRIAL

      .addCase(
        activateTrial.pending,
        (state) => {

          state.loading = true;

        }
      )

      .addCase(
        activateTrial.fulfilled,
        (state) => {

          state.loading = false;

        }
      )

      .addCase(
        activateTrial.rejected,
        (state, action) => {

          state.loading = false;

          state.error = action.payload;

        }
      );
  }
});

export default subscriptionSlice.reducer;