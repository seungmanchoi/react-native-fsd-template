import { useMutation } from '@tanstack/react-query';
import { tokenManager } from '@shared/api';
import { authApi } from '../api';
import { ISignupRequest, ISignupResponse } from '../types';

export function useSignup() {
  return useMutation<ISignupResponse, Error, ISignupRequest>({
    mutationFn: (data: ISignupRequest) => authApi.signup(data),
    onSuccess: async (data: ISignupResponse) => {
      await tokenManager.setTokens(data.accessToken, data.refreshToken);
    },
  });
}
