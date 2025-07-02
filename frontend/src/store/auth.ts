import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User,
  LoginData,
  RegisterData,
  UpdateProfileData, } from "../types/index";
import {
  login,
  register,
  updateProfile,
  updateAvatar,
  getMe,
} from "../services/api";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  // FIXED: Consistent naming convention (lowercase first letter)
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  updateAvatar: (avatar: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  setError: (error: string) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (data: LoginData) => {
        try {
          set({ isLoading: true, error: null });
          const response = await login(data);

          // Store token in localStorage for axios interceptor
          localStorage.setItem("token", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));

          set({
            user: response.user,
            token: response.token,
            isLoading: false,
            error: null,
          });
          //eslint-disable-next-line
        } catch (error: any) {
          const errorMessage =
            error?.response?.data?.error || error?.message || "Login failed";
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error; // Re-throw so component can handle it
        }
      },

      register: async (data: RegisterData) => {
        try {
          set({ isLoading: true, error: null });
          const response = await register(data);

          // Store token in localStorage for axios interceptor
          localStorage.setItem("token", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));

          set({
            user: response.user,
            token: response.token,
            isLoading: false,
            error: null,
          });
          //eslint-disable-next-line
        } catch (error: any) {
          const errorMessage =
            error?.response?.data?.error ||
            error?.message ||
            "Registration failed";
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      logout: () => {
        // Clear localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        set({ user: null, token: null, error: null });
      },

      updateProfile: async (data: UpdateProfileData) => {
        try {
          set({ isLoading: true, error: null });
          const response = await updateProfile(data);

          // Update localStorage
          localStorage.setItem("user", JSON.stringify(response.user));

          set({
            user: response.user,
            isLoading: false,
            error: null,
          });
          //eslint-disable-next-line
        } catch (error: any) {
          const errorMessage =
            error?.response?.data?.error ||
            error?.message ||
            "Profile update failed";
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      updateAvatar: async (avatar: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await updateAvatar(avatar);

          // Update localStorage
          localStorage.setItem("user", JSON.stringify(response.user));

          set({
            user: response.user,
            isLoading: false,
            error: null,
          });
          //eslint-disable-next-line
        } catch (error: any) {
          const errorMessage =
            error?.response?.data?.error ||
            error?.message ||
            "Avatar update failed";
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      refreshUser: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await getMe();

          // Update localStorage
          localStorage.setItem("user", JSON.stringify(response.user));

          set({
            user: response.user,
            isLoading: false,
            error: null,
          });
          //eslint-disable-next-line
        } catch (error: any) {
          // If token is invalid, logout
          if (error?.response?.status === 401) {
            get().logout();
          } else {
            const errorMessage =
              error?.response?.data?.error ||
              error?.message ||
              "Failed to refresh user";
            set({
              isLoading: false,
              error: errorMessage,
            });
          }
          throw error;
        }
      },

      setError: (error: string) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      // Only persist user and token, not loading states
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      // Rehydrate from localStorage on app load
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Sync with localStorage
          const token = localStorage.getItem("token");
          const userStr = localStorage.getItem("user");

          if (token && userStr) {
            try {
              const user = JSON.parse(userStr);
              state.token = token;
              state.user = user;
            } catch (error) {
              console.error("Failed to parse user from localStorage:", error);
              localStorage.removeItem("token");
              localStorage.removeItem("user");
            }
          }
        }
      },
    }
  )
);
