export interface IDetailTransaction {
  _id: string;
  type: string;
  userId: string;
  onUser: string;
  reasonId: IReasonId;
  onReason: string;
  delivery: string | null;
  isDelivery: boolean;
  paymentMethod: string;
  paymentMethodStatus: string | null;
  paymentStatus: string;
  paymentMetaData: {
    merchant_code: string;
    tax: any;
    outletId?: string | any;
    serviceFee: number;
    subTotalProduct: number;
    productDiscount: number;
    subTotalDelivery: number;
    deliveryDiscount: number;
    grandTotal: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

export interface IReasonId {
  _id: string;
  userId: string;
  posCode: string;
  idrAmount: number;
  pointAmount: number;
  pointCashback: number;
  outletId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
