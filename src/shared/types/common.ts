export interface IApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface IPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IPaginationParams {
  page?: number;
  limit?: number;
}

export type TLoadingState = 'idle' | 'loading' | 'success' | 'error';
