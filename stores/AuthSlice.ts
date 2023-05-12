import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI, TLoginPayload } from "./AuthAPI";
import { deleteDeviceToken } from "./TokenAPI";

export const authLoginRequest = createAsyncThunk(
  "auth/authLoginRequest",
  async (payload: TLoginPayload) => {
    const response = await loginAPI(payload);
    return response;
  }
);

export const deleteDeviceTokenRequest = createAsyncThunk(
  "auth/deleteDeviceTokenRequest",
  async (token: any) => {
    const response = await deleteDeviceToken(token);
    return response;
  }
);

export type TAccessToken = {
  token: string;
  refreshToken: string;
};

export type TAuthStoreState = {
  loginState: boolean;
  loginData: TLoginDataState;
  loginMessage: string;
  status: string;
  isPageLoading: boolean;
  accessToken: TAccessToken;
  notificationKey: string;
  deviceToken: string;
  statusCode: number;
};
export type TLocation = {
  coordinates: number[];
  type: string;
};
export type TOutlet = {
  __v: 0;
  _id: string;
  address: string;
  brands: any[];
  code: string;
  createdAt: string;
  deliveryIsoWeek: string | null;
  flagActive: true;
  kitchen: string;
  lat: string;
  location: TLocation;
  long: string;
  name: string;
  number: string;
  region: string;
  supervisor: string;
  updatedAt: string;
  usedAt: string[];
};

export type TLoginDataState = {
  __v: number;
  _id: string;
  createdAt: string;
  email: string;
  flagActive: true;
  name: string;
  outlet: TOutlet;
  password: string;
  updatedAt: string;
};

const initialState: TAuthStoreState = {
  loginState: false,
  notificationKey: "no data",
  loginData: {} as TLoginDataState,
  loginMessage: "",
  status: "idle",
  deviceToken: "",
  isPageLoading: false,
  statusCode: 0,
  accessToken: {
    token: "",
    refreshToken: "",
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    getDeviceToken: (state, action) => {
      return (state.deviceToken = action.payload);
    },
    resetCodeStatus: (state) => {
      state.statusCode = 0;
    },
    updateNotificationKey: (state, action) => ({
      ...state,
      notificationKey: Math.random().toString(36).substring(2, 9),
    }),
    updateAccessToken: (state, action) => {
      if (action.payload) {
        state.accessToken.token = action.payload.token;
      } else {
        state = initialState;
      }
    },
    loggedOut: () => {
      return {
        ...initialState,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(authLoginRequest.pending, (state) => {
      state.isPageLoading = true;
    });
    builder.addCase(authLoginRequest.fulfilled, (state, action) => {
      if (action.payload.code === 1000) {
        state.loginData = action.payload.data.login;
        state.loginState = true;
        state.accessToken = {
          token: action.payload.data.token,
          refreshToken: action.payload.data.tokenRefresh,
        };
      }
      state.statusCode = action.payload.code;
      state.isPageLoading = false;
    });
    builder.addCase(authLoginRequest.rejected, (state) => {
      state.isPageLoading = false;
      state.loginData = {} as TLoginDataState;
      state.loginState = false;
    });
    builder.addCase(deleteDeviceTokenRequest.pending, (state) => {
      state.isPageLoading = true;
    });
    builder.addCase(deleteDeviceTokenRequest.fulfilled, (state) => {
      state.isPageLoading = false;
    });
    builder.addCase(deleteDeviceTokenRequest.rejected, (state) => {
      state.isPageLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
export const {
  loggedOut,
  updateAccessToken,
  updateNotificationKey,
  getDeviceToken,
  resetCodeStatus,
} = authSlice.actions;

export default authSlice.reducer;
