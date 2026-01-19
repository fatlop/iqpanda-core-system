import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

type CreateSaleRequest = z.infer<typeof api.sales.create.input>;
type SalesReport = z.infer<typeof api.sales.report.responses[200]>;

export function useSales(filters?: { startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: [api.sales.list.path, filters],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filters?.startDate) params.startDate = filters.startDate;
      if (filters?.endDate) params.endDate = filters.endDate;

      const queryString = new URLSearchParams(params).toString();
      const url = `${api.sales.list.path}${queryString ? `?${queryString}` : ''}`;

      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch sales");
      return api.sales.list.responses[200].parse(await res.json());
    },
  });
}

export function useSalesReport(params: { period: 'daily' | 'weekly' | 'monthly'; date?: string }) {
  return useQuery({
    queryKey: [api.sales.report.path, params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.set("period", params.period);
      if (params.date) searchParams.set("date", params.date);

      const url = `${api.sales.report.path}?${searchParams.toString()}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch sales report");
      return api.sales.report.responses[200].parse(await res.json());
    },
  });
}

export function useCreateSale() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateSaleRequest) => {
      const validated = api.sales.create.input.parse(data);
      const res = await fetch(api.sales.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to process sale");
      }
      return api.sales.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.sales.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.products.list.path] }); // Update stock
      queryClient.invalidateQueries({ queryKey: [api.sales.report.path] });
    },
  });
}
