import { useState, useMemo } from "react";
import { useProducts } from "@/hooks/use-products";
import { useCreateSale } from "@/hooks/use-sales";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, Banknote, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  maxStock: number;
};

export default function PointOfSale() {
  const [search, setSearch] = useState("");
  const { data: products, isLoading } = useProducts({ activeOnly: 'true' });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const createSale = useCreateSale();
  const { toast } = useToast();

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!search) return products;
    const lower = search.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(lower) || 
      p.sku?.toLowerCase().includes(lower)
    );
  }, [products, search]);

  const addToCart = (product: any) => {
    if (product.stock <= 0) {
      toast({ title: "Out of stock", variant: "destructive" });
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        if (existing.quantity >= existing.maxStock) {
          toast({ title: "Max stock reached", variant: "destructive" });
          return prev;
        }
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: 1,
        maxStock: product.stock
      }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = item.quantity + delta;
        if (newQty > item.maxStock) return item;
        if (newQty < 1) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    createSale.mutate({
      paymentMethod,
      items: cart.map(item => ({ productId: item.productId, quantity: item.quantity }))
    }, {
      onSuccess: () => {
        setCheckoutOpen(false);
        setCart([]);
        toast({ 
          title: "Sale Completed!", 
          description: `Total: $${cartTotal.toFixed(2)}`,
          className: "bg-green-600 text-white border-none"
        });
      }
    });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
      {/* Product Grid - Left Side */}
      <div className="flex-1 flex flex-col min-h-0 bg-card rounded-2xl shadow-sm border border-border p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search products by name or SKU..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 -mr-4 pr-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
            {isLoading ? (
              [1,2,3,4,5,6].map(i => <div key={i} className="h-40 bg-muted/50 rounded-xl animate-pulse" />)
            ) : filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                disabled={product.stock <= 0}
                className={cn(
                  "flex flex-col items-start text-left p-4 rounded-xl border transition-all duration-200 group",
                  product.stock <= 0 
                    ? "opacity-50 cursor-not-allowed bg-muted border-transparent" 
                    : "bg-background border-border hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5"
                )}
              >
                <div className="w-full aspect-[4/3] bg-muted/30 rounded-lg mb-3 flex items-center justify-center text-muted-foreground group-hover:bg-primary/5 transition-colors">
                  <Package className="h-8 w-8 opacity-20" />
                </div>
                <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
                <div className="mt-2 w-full flex items-center justify-between">
                  <span className="font-bold text-primary">${Number(product.price).toFixed(2)}</span>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full", product.stock < 5 ? "bg-orange-100 text-orange-700" : "bg-muted text-muted-foreground")}>
                    {product.stock} left
                  </span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Cart - Right Side */}
      <div className="w-full lg:w-96 flex flex-col bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Current Sale
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 space-y-4">
              <ShoppingCart className="h-16 w-16" />
              <p>Cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.productId} className="flex items-center gap-3 p-3 bg-background rounded-xl border border-border shadow-sm">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.name}</h4>
                  <p className="text-xs text-primary font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                  <button 
                    onClick={() => updateQuantity(item.productId, -1)}
                    className="p-1 hover:bg-white rounded-md transition-colors"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.productId, 1)}
                    className="p-1 hover:bg-white rounded-md transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <button 
                  onClick={() => removeFromCart(item.productId)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-muted/30 border-t border-border space-y-4">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-2xl font-bold font-display">
            <span>Total</span>
            <span className="text-primary">${cartTotal.toFixed(2)}</span>
          </div>
          
          <Button 
            className="w-full h-12 text-lg shadow-lg shadow-primary/20" 
            disabled={cart.length === 0}
            onClick={() => setCheckoutOpen(true)}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>

      {/* Checkout Modal */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Sale</DialogTitle>
            <DialogDescription>
              Total amount due: <span className="font-bold text-foreground">${cartTotal.toFixed(2)}</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <button
              onClick={() => setPaymentMethod("cash")}
              className={cn(
                "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all",
                paymentMethod === "cash" 
                  ? "border-primary bg-primary/5 text-primary" 
                  : "border-muted hover:border-primary/50 text-muted-foreground"
              )}
            >
              <Banknote className="h-8 w-8" />
              <span className="font-medium">Cash</span>
              {paymentMethod === "cash" && <CheckCircle2 className="h-4 w-4 absolute top-2 right-2 text-primary" />}
            </button>
            <button
              onClick={() => setPaymentMethod("card")}
              className={cn(
                "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all",
                paymentMethod === "card" 
                  ? "border-primary bg-primary/5 text-primary" 
                  : "border-muted hover:border-primary/50 text-muted-foreground"
              )}
            >
              <CreditCard className="h-8 w-8" />
              <span className="font-medium">Card / Digital</span>
              {paymentMethod === "card" && <CheckCircle2 className="h-4 w-4 absolute top-2 right-2 text-primary" />}
            </button>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCheckoutOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleCheckout} 
              disabled={createSale.isPending}
              className="w-full sm:w-auto min-w-[120px]"
            >
              {createSale.isPending ? "Processing..." : "Confirm Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
