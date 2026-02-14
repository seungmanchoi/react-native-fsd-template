import { api } from '@shared/api';
import { ILoginRequest, ILoginResponse, ISignupRequest, ISignupResponse } from '../types';

export const authApi = {
  login: async (data: ILoginRequest): Promise<ILoginResponse> => {
    const response = await api.post<ILoginResponse>('/auth/login', data);
    return response.data;
  },

  signup: async (data: ISignupRequest): Promise<ISignupResponse> => {
    const response = await api.post<ISignupResponse>('/auth/signup', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};
