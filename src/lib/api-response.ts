export interface ApiPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccessResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: ApiPagination;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export function unwrapData<T>(response: ApiSuccessResponse<T>): T {
  return response.data;
}

export function unwrapPaginated<T>(response: ApiSuccessResponse<T[]>): PaginatedResult<T> {
  const pagination = response.pagination ?? { page: 1, limit: 10, total: 0, totalPages: 0 };
  return {
    data: response.data ?? [],
    total: pagination.total,
    page: pagination.page,
    limit: pagination.limit,
    total_pages: pagination.totalPages,
  };
}
