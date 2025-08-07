import { create } from "zustand";

interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
  get isAuthenticated() {
    return get().user !== null;
  },
  get isAdmin() {
    return get().user?.isAdmin ?? false;
  },
}));
