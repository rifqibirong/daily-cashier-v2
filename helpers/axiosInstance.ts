import axios from "axios";
import { Store } from "redux";
import API from "../constants/API";
import { updateAccessToken, loggedOut } from "../stores/AuthSlice";
import { RootState } from "../stores/store";

let store;

export const setupAxios = (_store: Store<RootState>) => {
  store = _store;
  const { dispatch, getState } = store;
  // Request interceptor for API calls
  API.HTTP.interceptors.request.use(
    async (config) => {
      const { secure } = getState();

      config.headers = {
        headerToken: `${secure.auth.accessToken.token}`,
        Authorization: `Bearer ${secure.auth.accessToken.token}`,
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      };
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  // Response interceptor for API calls
  API.HTTP.interceptors.response.use(
    (response) => {
      return response;
    },
    async function (error) {
      // console.log("====================================");
      // console.log("ERROR :: ", error.config);
      // console.log("STATUS :: ", error.response.status);
      // console.log("====================================");
      const { secure } = getState();
      const originalRequest = error.config;
      if (error.response.status === 403 && !originalRequest._retry) {
        // console.log("====================================");
        // console.log("TOKEN EXPIRED");
        // console.log("====================================");
        originalRequest._retry = true;
        const new_access_token = await refreshAccessToken(
          secure.auth.accessToken.refreshToken
        );
        // console.log("====================================");
        // console.log("CODE RESPONSE", new_access_token);
        // console.log("====================================");
        // if (new_access_token.code === 2004) {
        //   console.log("Logout by System");
        //   dispatch(loggedOut());
        // }
        // console.log("====================================");
        // console.log("TOKEN TER-UPDATE");
        // console.log("====================================");
        dispatch(updateAccessToken(new_access_token.data.data.token));
        const new_request = {
          ...originalRequest,
          headers: {
            headerToken: new_access_token.data.data.token,
            Authorization: `Bearer ${new_access_token.data.data.token}`,
          },
        };
        return axios(new_request);
      } else if (error.response.status === 403 && originalRequest._retry) {
        dispatch(loggedOut());
      } else if (error.response.status === 401) {
        // console.log("====================================");
        // console.log("401", error.response);
        // console.log("TOKEN 401", secure.auth.accessToken.token);
        // console.log("====================================");
        dispatch(loggedOut());
      }
      // console.log("IS RETRY :: ", error.config._retry);
      return Promise.reject(error);
    }
  );
};

const refreshAccessToken = async (refresh: string) => {
  const res = await axios.post(
    "https://api.prod.daily.co.id/daily-outlet/auth/v2/refresh-token",
    {
      refreshToken: refresh,
    }
  );

  return res;
};
