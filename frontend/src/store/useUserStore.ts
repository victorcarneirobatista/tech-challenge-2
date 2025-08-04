import { create } from "zustand";

interface UserState {
  user: string;
  token: string;
  accountId: string;
  setUser: (user: string) => void;
  setToken: (token: string) => void;
  setAccountId: (id: string) => void;
  clearUser: () => void;
}

const useUserStore = create<UserState>((set) => ({
  user: "",
  token: "",
  accountId: "",
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setAccountId: (id) => set({ accountId: id }),
  clearUser: () =>
    set({
      user: "",
      token: "",
      accountId: "",
    }),
}));

export default useUserStore;
