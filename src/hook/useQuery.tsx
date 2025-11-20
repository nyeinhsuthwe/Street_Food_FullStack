import { useQuery } from "@tanstack/react-query";
import axios from "../helpers/axios";

interface QueryPayload {
  endpoint: string;
  method?: "GET" | "POST"; // <-- Added
  queryKey?: unknown[];
  params?: Record<string, any>;
}

export function useApiQuery<TData = any>(
  { endpoint, method = "GET", queryKey, params }: QueryPayload,
  options?: any
) {
  return useQuery<TData>({
    queryKey: queryKey ?? [endpoint, params],
    queryFn: async () => {
      if (method === "POST") {
        const res = await axios.post(endpoint, params);
        return res.data;
      }

      const res = await axios.get(endpoint, { params });
      return res.data;
    },
    ...options,
  });
}
