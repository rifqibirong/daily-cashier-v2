import axios from "axios";
import API from "../constants/API";

export type TLoginPayload = {
  email: string;
  password: string;
};
export const loginAPI = async ({ email, password }: TLoginPayload) => {
  const response = await axios.post(`${API.AUTH.LOGIN}`, {
    email: email,
    password: password,
  });
  return response.data;
};
