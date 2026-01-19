import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

type Supplier = z.infer<typeof api.suppliers.list.responses[200]>[number];
type InsertSupplier = z.infer<typeof api.suppliers.create.input>;

export function useSuppliers() {
  return useQuery({
    queryKey: [api.suppliers.list.path],
    queryFn: async () => {
      const res = await fetch(api.suppliers.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch suppliers");
      return api.suppliers.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertSupplier) => {
      const validated = api.suppliers.create.input.parse(data);
      const res = await fetch(api.suppliers.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to create supplier");
      return api.suppliers.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.suppliers.list.path] });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertSupplier>) => {
      const validated = api.suppliers.update.input.parse(updates);
      const url = buildUrl(api.suppliers.update.path, { id });

      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update supplier");
      return api.suppliers.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.suppliers.list.path] });
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.suppliers.delete.path, { id });
      const res = await fetch(url, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete supplier");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.suppliers.list.path] });
    },
  });
}
