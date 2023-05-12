// HELPER OVERRIDE
export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

// PAYLOAD RESPONSE
export type PayloadResponse = {
  code: number;
  data: any;
  message: string;
};

// TOKEN STATE
export type RefreshToken = string;
export type Token = string;
export type TokenStoreState = {
  token: Token;
  refreshToken: RefreshToken;
  tokenIssueDate: string;
};
export type RefreshTokenPayload = {
  refreshToken: RefreshToken;
};

export type MiddlemanEntity = {
  __v: number;
  _id: string;
  birthDate: string;
  code: string | null;
  createdAt: string;
  dateCode: string;
  email: string;
  emailVerified: boolean;
  gender: "male" | "female";
  lastLogin: string;
  outlet: any;
  phoneNumber: string;
  phoneNumberVerified: string;
  reveral: null;
  suspend: boolean;
  tenant: string;
  uid: string;
  updatedAt: string;
  userType: string;
  username: string;
};

export type MenuEntity = {
  __v: number;
  _id: string;
  createdAt: string;
  dailyPrice: number;
  dailyboxPrice: number;
  dailymealsPrice: number;
  flagActive: boolean;
  flagDailyApp: boolean;
  image: string;
  name: string;
  price: number;
  updatedAt: string;
};

export type RedeemEntity = {
  __v: number;
  _id: string;
  createdAt: string;
  creator: any;
  menu: MenuEntity;
  middleman: MiddlemanEntity;
  outlet: string;
  redeemNumber: string;
  redeemStatus: string;
  snapshotPrice: number;
  transaction: any;
  updatedAt: string;
};

export type TCodeEntity = {
  __v: number;
  _id: string;
  code: string;
  createdAt: string;
  creatorId: string;
  employeeId: string;
  expiredInDate: string;
  metadata: any | null;
  notes: string;
  onCreator: string;
  onUser: string;
  orderAmount: number;
  orderDate: string;
  orderNumber: string;
  outlet: string;
  status: string;
  updatedAt: string;
  used: boolean;
  userCode: number;
  userId: string | null;
};
