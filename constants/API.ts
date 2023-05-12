import axios from "axios";

const AUTH = {
  LOGIN: `https://api.prod.daily.co.id/daily-outlet/auth/v2/login`,
};

const REEDEEM = {
  VERIFY:
    "https://j0vej9qfl6.execute-api.ap-southeast-1.amazonaws.com/prod/v2/redeem/",
  GETBYOUTLET:
    "https://j0vej9qfl6.execute-api.ap-southeast-1.amazonaws.com/prod/v2/redeems?outlet=",
  GETBYCODE:
    "https://j0vej9qfl6.execute-api.ap-southeast-1.amazonaws.com/prod/v2/redeems-code?code=",
};

const CODE = {
  CREATE: "https://api.prod.daily.co.id/daily-outlet/code/v3/code-generate",
  GETCODESBYOUTLET:
    "https://api.prod.daily.co.id/daily-outlet/code/v3/codes?outletId=",
};

const LISTPAYMENT = {
  GETBYOUTLET:
    "https://api.prod.daily.co.id/daily-outlet/dailycoin/v2/payment-transaction/me/?outletId=6305e7c3d08a650b18c68ac6&limit=1&skip=0&periode=monthly",
};

const HTTP = axios.create({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

const API = {
  HTTP,
  AUTH,
  REEDEEM,
  CODE,
  LISTPAYMENT,
};

export default API;
