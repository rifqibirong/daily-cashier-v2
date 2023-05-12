import API from "../constants/API";

export const getTransactionAPI = async (payload: any) => {
  const response = await API.HTTP.get(
    `https://api.prod.daily.co.id/daily-outlet/dailycoin/v2/payment-transaction/me/?outletId=${payload.id}&limit=${payload.limit}&skip=${payload.skip}&periode=${payload.period}`
  );

  return response.data;
};
