import apiClient from './apiClient';

export const ORDERS_ENDPOINT = '/user/orders';

export type UserOrder = {
  _id: string;
  number: string;
  fuelName: string;
  quantityMl: number;
  totalMinor: number;
  currency: string;
  scheduledAt: string;
  windowEnd: string;
  status: string;
  createdAt: string;
};

type OrdersResponse = {
  success: boolean;
  message: string;
  data: UserOrder[];
  meta?: {page: number; limit: number; total: number; pages: number};
  requestId?: string;
};

export async function getOrders() {
  const {data} = await apiClient.get<OrdersResponse>(ORDERS_ENDPOINT);
  return data;
}
