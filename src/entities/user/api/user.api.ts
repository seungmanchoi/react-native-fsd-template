import { api } from '@shared/api';
import { IUser } from '../types';

export const userApi = {
  getMe: async (): Promise<IUser> => {
    const response = await api.get<IUser>('/users/me');
    return response.data;
  },

  updateProfile: async (data: Partial<IUser>): Promise<IUser> => {
    const response = await api.patch<IUser>('/users/me', data);
    return response.data;
  },
};
