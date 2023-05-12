import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IDetailTransaction } from "../types/Payment";
import { getTransactionAPI } from "./ListPaymentAPI";

export const getTransactionRequest = createAsyncThunk(
  "payment/getTransactionRequest",
  async (payload: object) => {
    const response = await getTransactionAPI(payload);
    return response;
  }
);

export const getTransactionSecRequest = createAsyncThunk(
  "payment/getTransactionSecRequest",
  async (payload: object) => {
    const response = await getTransactionAPI(payload);
    return response;
  }
);

interface IPaymentStore {
  listPayment: IDetailTransaction[] | [];
  isLoading: boolean;
}

const initialState: IPaymentStore = {
  listPayment: [],
  isLoading: false,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTransactionRequest.pending, (state) => {
      state.isLoading = true;
      // state.listPayment = [];
    });
    builder.addCase(getTransactionRequest.fulfilled, (state, action) => {
      state.listPayment = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getTransactionRequest.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(getTransactionSecRequest.pending, (state) => {});
    builder.addCase(getTransactionSecRequest.fulfilled, (state, action) => {
      state.listPayment = [...state.listPayment, ...action.payload.data];
    });
    builder.addCase(getTransactionSecRequest.rejected, (state) => {});
  },
});

export default paymentSlice.reducer;
