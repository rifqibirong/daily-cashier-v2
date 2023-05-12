import API from "../constants/API";
import axios from "axios";

export type TVerifyRedeemPayload = {
  isApproved: number;
  redeemNumber: string;
  outlet: string;
  token: string;
};

export const verifyRedeem = async ({
  isApproved,
  redeemNumber,
  outlet,
  token,
}: TVerifyRedeemPayload) => {
  const response = await axios.put(
    API.REEDEEM.VERIFY,
    {
      isApproved: isApproved,
      outlet: outlet,
      redeemNumber: redeemNumber,
    },
    {
      headers: {
        headerToken: `${token}`,
      },
    }
  );
  return { ...response.data };
};

export const getRedeems = async ({
  outletId,
  token,
  limit,
  skip,
}: {
  outletId: string;
  token: string;
  limit: number;
  skip: number;
}) => {
  const response = await API.HTTP.get(
    `https://api.prod.daily.co.id/daily-outlet/redeem/v3/outlet-redeems/?outletId=${outletId}&limit=${limit}&skip=${skip}`
  );
  return { ...response.data };
};

export const getRedeem = async (payload: any) => {
  const response = await API.HTTP.get(API.REEDEEM.GETBYCODE + payload.code);
  return { ...response.data };
};
