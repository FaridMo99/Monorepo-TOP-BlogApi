import { create } from "zustand";
import {getRefreshToken} from "./queries/auth"

interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}

type ZustandToken = string | null;

type ZustandUser = User | null
interface AuthState {
  user: ZustandUser;
  token: ZustandToken;
  setUser: (user: ZustandUser, token?: ZustandToken) => void;
  setToken: (token: ZustandToken) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  setUser: (user,token = null) => set({ user, token}),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null }),
  get isAuthenticated() {
    return get().user !== null;
  },
  get isAdmin() {
    return get().user?.isAdmin ?? false;
  },
}));

export async function restoreUser() {
  const { setUser, setToken } = useAuthStore.getState();
  try {
    const data = await getRefreshToken(); // server returns { user, accessToken }
    setUser(data.user, data.token);
  } catch (err) {
    setUser(null);
    setToken(null);
  }
}