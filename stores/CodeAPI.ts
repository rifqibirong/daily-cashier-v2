import API from "../constants/API";

import axios from "axios";

const BASE_URL =
  "https://api.prod.daily.co.id/daily-outlet/code/v3/codes?outletId=";

export type TCreateCodeParams = {
  cashierId: string;
  orderNumber: string;
  orderAmount: string;
  orderDate: string;
  outletId: string;
  employeeId: string;
  deliveryType: string;
};

export const createCodeAPI = async (data: object, token: string) => {
  const response = await API.HTTP.post(API.CODE.CREATE, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createCode = async ({
  cashierId,
  orderNumber,
  orderAmount,
  orderDate,
  outletId,
  employeeId,
  deliveryType,
}: TCreateCodeParams) => {
  const response = await API.HTTP.post(API.CODE.CREATE, {
    user: cashierId,
    orderNumber: orderNumber,
    employeeId: employeeId,
    orderAmount: parseInt(orderAmount),
    orderDate: orderDate,
    outlet: outletId,
    deliveryType: parseInt(deliveryType),
  });
  return { ...response.data };
};

export const getCodes = async ({
  outletId,
  token,
  limit,
  skip,
}: {
  outletId: string;
  token: string;
  limit?: number;
  skip?: number;
}) => {
  console.log("SKIP", skip);
  console.log("LIMIT", limit);
  const response = await API.HTTP.get(
    `${API.CODE.GETCODESBYOUTLET}${outletId}&limit=${limit}&skip=${skip}`
    // {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // }
  );
  // console.log("response code", response.data);
  return { ...response.data };
};
