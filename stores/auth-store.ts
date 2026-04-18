"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserOutSchema } from "@/types/api";

interface AuthState {
  token: string | null;
  profile: UserOutSchema | null;
  setAuth: (token: string, profile: UserOutSchema) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      profile: null,
      setAuth: (token, profile) => set({ token, profile }),
      clearAuth: () => set({ token: null, profile: null })
    }),
    {
      name: "luliops-auth",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
