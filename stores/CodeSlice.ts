import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Overwrite, PayloadResponse, TCodeEntity } from "../types/global";
import { createCodeAPI, getCodes, TCreateCodeParams } from "./CodeAPI";

type PayloadCreateCode = Overwrite<
  PayloadResponse,
  {
    data: TCodeEntity[];
  }
>;

export const createCodeRequest = createAsyncThunk(
  "code/createCodeRequest",
  async ({ payload, token }: { payload: object; token: string }) => {
    const response: PayloadCreateCode = await createCodeAPI(payload, token);
    return response;
  }
);

type PayloadRedeem = Overwrite<
  PayloadResponse,
  {
    data: TCodeEntity[];
  }
>;

export const getCodesOnScroll = createAsyncThunk(
  "code/getCodesOnScroll",
  async (payload: {
    outletId: string;
    token: string;
    limit?: number;
    skip?: number;
  }) => {
    const response = await getCodes(payload);
    return response;
  }
);

export const getCodesRequest = createAsyncThunk(
  "code/getCodesRequest",
  async (payload: {
    outletId: string;
    token: string;
    limit?: number;
    skip?: number;
  }) => {
    const response = await getCodes(payload);
    return response;
  }
);

export type TRedeemStoreState = {
  lastData: TCodeEntity[];
  isPageLoading: boolean;
  codes: TCodeEntity[] | any | [];
};

const initialState: TRedeemStoreState = {
  lastData: [] as TCodeEntity[],
  isPageLoading: false,
  codes: [],
};

export const redeemSlice = createSlice({
  name: "code",
  initialState: initialState,
  reducers: {
    resetCode: (state) => {
      state.lastData = [] as TCodeEntity[];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createCodeRequest.pending, (state) => {
      state.isPageLoading = true;
      state.codes = [];
    });
    builder.addCase(createCodeRequest.fulfilled, (state, action) => {
      state.isPageLoading = false;
      state.lastData = action.payload.data as TCodeEntity[];
      state.lastData = action.payload.data;
    });
    builder.addCase(createCodeRequest.rejected, (state) => {
      state.isPageLoading = false;
    });

    builder.addCase(getCodesRequest.pending, (state) => {
      // state.isPageLoading = true;
    });
    builder.addCase(getCodesRequest.fulfilled, (state, action) => {
      const datas = action.payload.data;
      state.codes = datas;
    });
    builder.addCase(getCodesRequest.rejected, (state) => {});
    builder.addCase(getCodesOnScroll.pending, (state) => {});
    builder.addCase(getCodesOnScroll.fulfilled, (state, action) => {
      if (action.payload.code === 1000) {
        state.codes = [...state.codes, ...action.payload.data];
      }
    });
    builder.addCase(getCodesOnScroll.rejected, (state) => {});
  },
});

export const { resetCode } = redeemSlice.actions;

export default redeemSlice.reducer;
