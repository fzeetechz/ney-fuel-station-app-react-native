import apiClient from './apiClient';

export const DASHBOARD_ENDPOINT = '/user/dashboard';

export type DashboardFuel = {
  _id: string;
  code: string;
  name: string;
  priceMinor: number;
  unit: string;
  active: boolean;
};

export type DashboardOrder = {
  _id: string;
  number: string;
  fuelName: string;
  quantityMl: number;
  currency: string;
  scheduledAt: string;
  createdAt: string;
  status: string;
};

export type DashboardData = {
  user: { name: string };
  wallet: { balanceMinor: number; currency: string };
  fuels: DashboardFuel[];
  recentOrders: DashboardOrder[];
  unreadNotifications: number;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  requestId?: string;
};

export async function getDashboard() {
  const {data} = await apiClient.get<ApiResponse<DashboardData>>(DASHBOARD_ENDPOINT);
  return data;
}
