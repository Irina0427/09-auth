import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/user";

export type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;


  setUser: (user: User) => void;


  clearIsAuthenticated: () => void;

  clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      clearIsAuthenticated: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),

      clearAuth: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "notehub-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
