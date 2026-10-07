import axios from 'axios';
import {refreshSessionRequest} from './apiClient';
import {AuthUser} from '../store/authStore';

export const AUTH_ENDPOINTS = {
  refresh: '/public/auth/refresh',
} as const;

export type RefreshSessionData = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
};

export async function refreshSession(refreshToken: string) {
  const {data} = await refreshSessionRequest(refreshToken);
  return data;
}

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError<{message?: string}>(error)) {
    return (
      error.response?.data?.message ??
      (error.code === 'ECONNABORTED'
        ? 'The request timed out. Please try again.'
        : 'Unable to connect to the server. Please try again.')
    );
  }

  return error instanceof Error ? error.message : 'Something went wrong.';
}
