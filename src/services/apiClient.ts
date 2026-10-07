import axios, {AxiosError, InternalAxiosRequestConfig} from 'axios';
import {useAuthStore} from '../store/authStore';
import {resetToLogin} from '../navigation/navigationService';
import {getRefreshToken} from './tokenStorage';

export const API_BASE_URL =
  'https://neyfuel.wise-hustlers.com/backend/api/v1';

  // export const API_BASE_URL =
  // 'https://qkwbdl37-5121.inc1.devtunnels.ms/api/v1';

  
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {'Content-Type': 'application/json'},
  timeout: 15000,
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {'Content-Type': 'application/json'},
  timeout: 15000,
});

type RefreshResponse = {
  success: boolean;
  message: string;
  data: {
    user: import('../store/authStore').AuthUser;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
  };
  requestId: string;
};

type RetryableRequestConfig = InternalAxiosRequestConfig & {_retry?: boolean};

let refreshPromise: Promise<string> | null = null;

async function requestNewAccessToken() {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    throw new AxiosError(
      'No refresh token is available',
      'ERR_NO_REFRESH_TOKEN',
    );
  }

  const response = await refreshClient.post<RefreshResponse>(
    '/public/auth/refresh',
    {refreshToken},
  );
  const session = response.data.data;

  await useAuthStore.getState().setAuth({
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    user: session.user,
  });

  return session.accessToken;
}

export const refreshSessionRequest = (refreshToken: string) =>
  refreshClient.post<RefreshResponse>('/public/auth/refresh', {refreshToken});

apiClient.interceptors.request.use(config => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const hasSession = Boolean(useAuthStore.getState().accessToken);

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      !hasSession
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = requestNewAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    try {
      const accessToken = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      if (
        axios.isAxiosError(refreshError) &&
        (refreshError.code === 'ERR_NO_REFRESH_TOKEN' ||
          [400, 401, 403].includes(refreshError.response?.status ?? 0))
      ) {
        await useAuthStore.getState().clearAuth();
        resetToLogin();
      }

      return Promise.reject(refreshError);
    }
  },
);

export default apiClient;
