export type Meta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  meta?: Meta;
} & (T extends void ? {} : { data: T });

type ApiErrorResponse = {
  success: false;
  message: string;
};

export type ApiResponse<T = void> = ApiSuccessResponse<T> | ApiErrorResponse;
