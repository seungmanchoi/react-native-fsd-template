import { create } from 'zustand';
import { IUser } from '../types';

interface IUserState {
  user: IUser | null;
  isAuthenticated: boolean;
  setUser: (user: IUser) => void;
  clearUser: () => void;
  logout: () => void;
}

export const useUserStore = create<IUserState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user: IUser) =>
    set({
      user,
      isAuthenticated: true,
    }),

  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));
