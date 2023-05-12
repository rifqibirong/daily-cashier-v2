import API from "../constants/API";

const BASE_URL = "https://api.prod.daily.co.id/device-token/v2/daily-outlet";

export const postDeviceToken = async (data: object) => {
  const response = await API.HTTP.post(BASE_URL, data);
  return response.data;
};

export const deleteDeviceToken = async (token: any) => {
  const response = await API.HTTP.delete(BASE_URL, token);
  return response.data;
};
