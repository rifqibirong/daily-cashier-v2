import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Overwrite, PayloadResponse, RedeemEntity } from "../types/global";
import {
  getRedeem,
  getRedeems,
  TVerifyRedeemPayload,
  verifyRedeem,
} from "./RedeemAPI";

type PayloadVerifyRedeem = Overwrite<
  PayloadResponse,
  {
    data: RedeemEntity;
  }
>;

export const verifyRedeemRequest = createAsyncThunk(
  "redeem/verifyRedeemRequest",
  async (payload: TVerifyRedeemPayload, thunkAPI) => {
    const response: PayloadVerifyRedeem = await verifyRedeem(payload);
    return response;
  }
);

export type TGetRedeemsRequestPayload = {
  outletId: string;
  token: string;
  limit: number;
  skip: number;
};
type PayloadRedeems = Overwrite<
  PayloadResponse,
  {
    data: RedeemEntity[];
  }
>;

export const getRedeemsRequest = createAsyncThunk(
  "redeem/getRedeemsRequest",
  async (payload: TGetRedeemsRequestPayload) => {
    const response: PayloadRedeems = await getRedeems(payload);
    return response;
  }
);

export const getRedeemsInScrollRequest = createAsyncThunk(
  "redeem/getRedeemsInScrollRequest",
  async (payload: TGetRedeemsRequestPayload) => {
    const response = await getRedeems(payload);
    return response;
  }
);

type PayloadRedeem = Overwrite<
  PayloadResponse,
  {
    data: RedeemEntity[];
  }
>;
export const getRedeemRequest = createAsyncThunk(
  "redeem/getRedeemRequest",
  async (payload: any) => {
    const response: PayloadRedeem = await getRedeem(payload);
    return response;
  }
);

export type TRedeemStoreState = {
  lastData: RedeemEntity;
  isPageLoading: boolean;
  redeems: RedeemEntity[];
};

const initialState: TRedeemStoreState = {
  lastData: {} as RedeemEntity,
  isPageLoading: false,
  redeems: [],
};

export const redeemSlice = createSlice({
  name: "redeem",
  initialState: initialState,
  reducers: {
    resetRedeem: (state) => {
      state.lastData = {} as RedeemEntity;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(verifyRedeemRequest.pending, (state) => {
      state.isPageLoading = true;
    });
    builder.addCase(verifyRedeemRequest.fulfilled, (state, action) => {
      action.payload.code === 1000
        ? alert("Berhasil verifikasi kode penukaran")
        : alert(action.payload.message);
      state.isPageLoading = false;
      state.lastData = {} as RedeemEntity;
    });
    builder.addCase(verifyRedeemRequest.rejected, (state) => {
      state.isPageLoading = false;
    });

    builder.addCase(getRedeemsRequest.pending, (state) => {
      state.isPageLoading = true;
      state.redeems = [];
    });
    builder.addCase(getRedeemsRequest.fulfilled, (state, action) => {
      state.isPageLoading = false;
      if (action.payload.code === 1000) {
        state.redeems = action.payload.data;
      }
    });
    builder.addCase(getRedeemsRequest.rejected, (state) => {
      state.isPageLoading = false;
    });

    builder.addCase(getRedeemRequest.pending, (state) => {
      state.isPageLoading = true;
      state.redeems = [];
    });
    builder.addCase(getRedeemRequest.fulfilled, (state, action) => {
      state.isPageLoading = false;
      if (action.payload.code === 1000 && action.payload.data.length > 0) {
        state.lastData = action.payload.data[0];
      }
    });
    builder.addCase(getRedeemRequest.rejected, (state) => {
      state.isPageLoading = false;
      state.lastData = {} as RedeemEntity;
    });
    // getRedeemsInScrollRequest
    builder.addCase(getRedeemsInScrollRequest.pending, (state) => {});
    builder.addCase(getRedeemsInScrollRequest.fulfilled, (state, action) => {
      if (action.payload.code === 1000) {
        state.redeems = [...state.redeems, ...action.payload.data];
      }
    });
    builder.addCase(getRedeemsInScrollRequest.rejected, (state) => {});
  },
});

export const { resetRedeem } = redeemSlice.actions;

export default redeemSlice.reducer;
