import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {removeRefreshToken, saveRefreshToken} from '../services/tokenStorage';

export type AuthUser = {
  _id: string;
  name: string;
  phone: string;
  role: string;
  active: boolean;
  language: string;
  phoneVerified: boolean;
  tokenVersion: number;
  allowanceMl: number;
  usedMl: number;
  reservedMl: number;
  createdAt: string;
  updatedAt: string;
  unitId: string;
};

type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  setAuth: (auth: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  }) => Promise<void>;
  clearAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      accessToken: null,
      user: null,
      setAuth: async auth => {
        await saveRefreshToken(auth.refreshToken);
        set({accessToken: auth.accessToken, user: auth.user});
      },
      clearAuth: async () => {
        set({accessToken: null, user: null});
        await removeRefreshToken().catch(() => undefined);
      },
    }),
    {
      name: '@neyfuel/auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
      version: 1,
      migrate: async persistedState => {
        const legacyState = persistedState as {
          accessToken?: string | null;
          refreshToken?: string | null;
          user?: AuthUser | null;
        };

        if (legacyState.refreshToken) {
          try {
            await saveRefreshToken(legacyState.refreshToken);
          } catch {
            return {accessToken: null, user: null};
          }
        }

        return {
          accessToken: legacyState.accessToken ?? null,
          user: legacyState.user ?? null,
        };
      },
    },
  ),
);
