import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

// Types derived from schema
type Product = z.infer<typeof api.products.list.responses[200]>[number];
type InsertProduct = z.infer<typeof api.products.create.input>;

export function useProducts(filters?: { search?: string; activeOnly?: 'true' | 'false' }) {
  return useQuery({
    queryKey: [api.products.list.path, filters],
    queryFn: async () => {
      // Clean undefined filters
      const params: Record<string, string> = {};
      if (filters?.search) params.search = filters.search;
      if (filters?.activeOnly) params.activeOnly = filters.activeOnly;

      const queryString = new URLSearchParams(params).toString();
      const url = `${api.products.list.path}${queryString ? `?${queryString}` : ''}`;

      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch products");
      return api.products.list.responses[200].parse(await res.json());
    },
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: [api.products.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.products.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch product");
      return api.products.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertProduct) => {
      // Ensure numeric types are handled correctly if they come as strings
      const validated = api.products.create.input.parse({
        ...data,
        price: Number(data.price),
        cost: Number(data.cost),
        stock: Number(data.stock),
        minStock: Number(data.minStock),
        supplierId: data.supplierId ? Number(data.supplierId) : undefined,
      });

      const res = await fetch(api.products.create.path, {
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
        throw new Error("Failed to create product");
      }
      return api.products.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.products.list.path] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertProduct>) => {
      // Ensure numeric types are converted
      const payload: any = { ...updates };
      if (payload.price) payload.price = Number(payload.price);
      if (payload.cost) payload.cost = Number(payload.cost);
      if (payload.stock) payload.stock = Number(payload.stock);
      if (payload.minStock) payload.minStock = Number(payload.minStock);
      if (payload.supplierId) payload.supplierId = Number(payload.supplierId);

      const validated = api.products.update.input.parse(payload);
      const url = buildUrl(api.products.update.path, { id });

      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update product");
      return api.products.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.products.list.path] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.products.delete.path, { id });
      const res = await fetch(url, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete product");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.products.list.path] });
    },
  });
}
