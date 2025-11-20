import { useMutation, type UseMutationOptions } from "@tanstack/react-query"
import axios from "../helpers/axios";

type HttpMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface ApiResponse<T> {
  data: T;
  links?: T;
  success?: boolean;
  msg?: string;
  token?: string 
}

interface MutationPayload<TReq> {
  endpoint: string
  method?: HttpMethod
  body?: TReq
}

export function useApiMutation<TReq = unknown, TRes = unknown>(
  options?: UseMutationOptions<ApiResponse<TRes>, Error, MutationPayload<TReq>>
) {
  return useMutation({
    mutationFn: async ({ endpoint, method = 'POST', body }) => {
      const response = await axios.request({
        url: endpoint,
        method,
        data: body ?? undefined,
        withCredentials: true,
      });
      return response.data;
    },
    ...options,
  })
}
