import { useState } from "react";
import { useSuppliers, useCreateSupplier, useUpdateSupplier, useDeleteSupplier } from "@/hooks/use-suppliers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Plus, Edit2, Trash2, Phone, Mail, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertSupplierSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

type FormValues = z.infer<typeof insertSupplierSchema>;

export default function Suppliers() {
  const { data: suppliers, isLoading } = useSuppliers();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Suppliers</h1>
          <p className="text-muted-foreground">Manage your vendor relationships</p>
        </div>
        <Button 
          onClick={() => { setEditingSupplier(null); setIsDialogOpen(true); }}
          className="shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Supplier
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
           [1,2,3].map(i => <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />)
        ) : suppliers?.map((supplier) => (
          <div key={supplier.id} className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all p-6 relative group">
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => { setEditingSupplier(supplier); setIsDialogOpen(true); }}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <DeleteSupplierButton id={supplier.id} name={supplier.name} />
            </div>

            <h3 className="text-xl font-bold mb-1">{supplier.name}</h3>
            <p className="text-sm text-primary mb-4">{supplier.contactName || "No contact person"}</p>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {supplier.email || "No email"}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {supplier.phone || "No phone"}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {supplier.address || "No address"}
              </div>
            </div>
          </div>
        ))}
        
        {suppliers?.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
            <p>No suppliers added yet.</p>
          </div>
        )}
      </div>

      <SupplierDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        supplier={editingSupplier} 
      />
    </div>
  );
}

function SupplierDialog({ open, onOpenChange, supplier }: { open: boolean, onOpenChange: (open: boolean) => void, supplier?: any }) {
  const { toast } = useToast();
  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();

  const form = useForm<FormValues>({
    resolver: zodResolver(insertSupplierSchema),
    defaultValues: { name: "", contactName: "", email: "", phone: "", address: "", active: true }
  });

  useState(() => {
    if (open) {
      if (supplier) {
        form.reset({
          name: supplier.name,
          contactName: supplier.contactName || "",
          email: supplier.email || "",
          phone: supplier.phone || "",
          address: supplier.address || "",
          active: supplier.active,
        });
      } else {
        form.reset({ name: "", contactName: "", email: "", phone: "", address: "", active: true });
      }
    }
  });

  const onSubmit = (data: FormValues) => {
    const mutation = supplier ? updateSupplier : createSupplier;
    const payload = supplier ? { id: supplier.id, ...data } : data;

    mutation.mutate(payload as any, {
      onSuccess: () => {
        toast({ title: `Supplier ${supplier ? 'updated' : 'created'} successfully` });
        onOpenChange(false);
      },
      onError: (err) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{supplier ? "Edit Supplier" : "New Supplier"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Company Name</Label>
            <Input {...form.register("name")} placeholder="Acme Corp" />
            {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Contact Person</Label>
              <Input {...form.register("contactName")} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input {...form.register("phone")} placeholder="+1 (555) 000-0000" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" {...form.register("email")} placeholder="contact@supplier.com" />
          </div>

          <div className="space-y-2">
            <Label>Address</Label>
            <Input {...form.register("address")} placeholder="123 Warehouse Dr" />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={createSupplier.isPending || updateSupplier.isPending}>
              {createSupplier.isPending || updateSupplier.isPending ? "Saving..." : "Save Supplier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteSupplierButton({ id, name }: { id: number, name: string }) {
  const deleteSupplier = useDeleteSupplier();
  const { toast } = useToast();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" size="icon" className="h-8 w-8 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Supplier?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{name}"? This will remove them from your contacts.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => {
              deleteSupplier.mutate(id, {
                onSuccess: () => toast({ title: "Supplier deleted" }),
                onError: () => toast({ title: "Failed to delete", variant: "destructive" })
              });
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
