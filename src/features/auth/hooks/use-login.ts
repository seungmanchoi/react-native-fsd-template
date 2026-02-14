import { useMutation } from '@tanstack/react-query';
import { tokenManager } from '@shared/api';
import { authApi } from '../api';
import { ILoginRequest, ILoginResponse } from '../types';

export function useLogin() {
  return useMutation<ILoginResponse, Error, ILoginRequest>({
    mutationFn: (data: ILoginRequest) => authApi.login(data),
    onSuccess: async (data: ILoginResponse) => {
      await tokenManager.setTokens(data.accessToken, data.refreshToken);
    },
  });
}
