import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, ShoppingCart, CreditCard, Banknote, Smartphone,
  Plus, Minus, X, Trash2, Zap, Tag, Sparkles, CheckCircle2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const productos = [
  { id: "1", nombre: "Manzana Roja", emoji: "🍎", precio: 2.50, stock: 45, promocion: false },
  { id: "2", nombre: "Plátano", emoji: "🍌", precio: 1.20, stock: 8, promocion: true, descuento: 50 },
  { id: "3", nombre: "Naranja", emoji: "🍊", precio: 1.80, stock: 62 },
  { id: "4", nombre: "Limón", emoji: "🍋", precio: 2.00, stock: 38 },
  { id: "5", nombre: "Papaya", emoji: "🥭", precio: 3.50, stock: 15 },
  { id: "6", nombre: "Aguacate", emoji: "🥑", precio: 4.00, stock: 22 },
  { id: "7", nombre: "Fresa", emoji: "🍓", precio: 5.50, stock: 12 },
  { id: "8", nombre: "Uva", emoji: "🍇", precio: 4.50, stock: 28 },
  { id: "9", nombre: "Sandía", emoji: "🍉", precio: 6.00, stock: 8 },
  { id: "10", nombre: "Piña", emoji: "🍍", precio: 4.00, stock: 18 },
  { id: "11", nombre: "Mango", emoji: "🥭", precio: 3.00, stock: 25 },
  { id: "12", nombre: "Cilantro", emoji: "🌿", precio: 0.50, stock: 50 },
];

const combos: Record<string, { producto: string; descuento: number; mensaje: string }> = {
  "5": { producto: "4", descuento: 15, mensaje: "¿Lleva Limón? Combo sugerido: -15% en el limón" },
  "6": { producto: "12", descuento: 20, mensaje: "¿Lleva Cilantro? Combo sugerido: -20% en el cilantro" },
};

interface CartItem {
  producto: typeof productos[0];
  cantidad: number;
  peso: number;
  descuentoCombo?: number;
}

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<typeof productos[0] | null>(null);
  const [pesoInput, setPesoInput] = useState("");
  const [comboSuggestion, setComboSuggestion] = useState<{ producto: typeof productos[0]; descuento: number; mensaje: string } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"efectivo" | "tarjeta" | "movil" | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const addToCart = () => {
    if (!selectedProduct || !pesoInput) return;
    
    const peso = parseFloat(pesoInput);
    const existingIndex = cart.findIndex(item => item.producto.id === selectedProduct.id);
    
    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex].peso += peso;
      setCart(newCart);
    } else {
      setCart([...cart, { producto: selectedProduct, cantidad: 1, peso }]);
    }

    if (combos[selectedProduct.id]) {
      const combo = combos[selectedProduct.id];
      const comboProduct = productos.find(p => p.id === combo.producto);
      if (comboProduct && !cart.find(item => item.producto.id === combo.producto)) {
        setComboSuggestion({ producto: comboProduct, descuento: combo.descuento, mensaje: combo.mensaje });
      }
    }
    
    setSelectedProduct(null);
    setPesoInput("");
  };

  const addComboItem = () => {
    if (!comboSuggestion) return;
    setCart([...cart, { 
      producto: comboSuggestion.producto, 
      cantidad: 1, 
      peso: 0.25,
      descuentoCombo: comboSuggestion.descuento 
    }]);
    setComboSuggestion(null);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const getItemPrice = (item: CartItem) => {
    let precio = item.producto.precio * item.peso;
    if (item.producto.promocion && item.producto.descuento) {
      precio = precio * (1 - item.producto.descuento / 100);
    }
    if (item.descuentoCombo) {
      precio = precio * (1 - item.descuentoCombo / 100);
    }
    return precio;
  };

  const total = cart.reduce((acc, item) => acc + getItemPrice(item), 0);

  const completeSale = () => {
    if (!paymentMethod || cart.length === 0) return;
    setShowSuccess(true);
    setCart([]);
    setPaymentMethod(null);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <button className="p-2 rounded-xl hover:bg-secondary/50 transition-colors">
                  <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-display font-bold text-lg text-foreground">Caja / POS</h1>
                  <p className="text-xs text-muted-foreground font-medium">Vender rápido, sin errores</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {productos.map((producto, index) => (
              <motion.div
                key={producto.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
              >
                <Card 
                  className={`cursor-pointer border-border/60 rounded-[2rem] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group ${
                    producto.promocion ? "ring-2 ring-primary bg-primary/5" : "bg-white"
                  }`}
                  onClick={() => setSelectedProduct(producto)}
                >
                  {producto.promocion && (
                    <div className="absolute top-0 right-0">
                      <Badge className="rounded-none rounded-bl-2xl bg-primary text-white border-0 py-2 px-4 font-bold text-[10px] uppercase tracking-widest">
                        ⭐ Oferta
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-8 text-center">
                    <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-sm">{producto.emoji}</div>
                    <h3 className="font-bold text-foreground text-sm mb-1 uppercase tracking-wider">{producto.nombre}</h3>
                    <div className="font-display font-black text-2xl text-primary">
                      ${producto.precio.toFixed(2)}
                      <span className="text-[10px] font-bold text-muted-foreground ml-1">/KG</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-[450px] border-t lg:border-t-0 lg:border-l border-border bg-white flex flex-col shadow-2xl">
          <div className="p-8 border-b border-border/40">
            <h2 className="font-display font-bold text-2xl flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-primary" />
              Tu venta actual
            </h2>
            <p className="text-sm text-muted-foreground mt-1 font-medium italic">“Revisa el pago y todo listo”</p>
          </div>
          
          <div className="flex-1 overflow-auto p-8 space-y-4">
            <AnimatePresence>
              {cart.map((item, index) => (
                <motion.div
                  key={`${item.producto.id}-${index}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-4 p-5 rounded-3xl bg-background border border-border/50 shadow-sm"
                >
                  <div className="text-4xl">{item.producto.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground text-sm truncate">{item.producto.nombre}</p>
                    <p className="text-xs text-muted-foreground font-bold">{item.peso.toFixed(2)} kg</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-black text-xl text-primary">
                      ${getItemPrice(item).toFixed(2)}
                    </p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(index)}
                    className="p-3 rounded-2xl hover:bg-gris-neutro/10 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {cart.length === 0 && !showSuccess && (
              <div className="text-center py-24 opacity-30">
                <ShoppingCart className="w-20 h-20 mx-auto mb-6" />
                <p className="text-xs font-black uppercase tracking-widest">Nada seleccionado aún</p>
              </div>
            )}

            {showSuccess && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-primary/5 rounded-[2.5rem] border-2 border-dashed border-primary/20"
              >
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <p className="text-xl font-black text-primary mb-2">Venta registrada con éxito ✅</p>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Todo listo</p>
              </motion.div>
            )}
          </div>
          
          <div className="border-t border-border p-8 space-y-8 bg-background/50">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-black text-xs uppercase tracking-[0.2em]">Total a cobrar:</span>
              <span className="font-display text-4xl font-black text-foreground">${total.toFixed(2)}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: "efectivo", icon: Banknote, label: "Efectivo" },
                { id: "tarjeta", icon: CreditCard, label: "Tarjeta" },
                { id: "movil", icon: Smartphone, label: "Móvil" },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`p-5 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${
                    paymentMethod === method.id 
                      ? "border-primary bg-primary text-white shadow-xl shadow-primary/30" 
                      : "border-border bg-white hover:border-primary/20 hover:bg-primary/5"
                  }`}
                >
                  <method.icon className="w-6 h-6" />
                  <span className="text-[10px] font-black uppercase tracking-wider">{method.label}</span>
                </button>
              ))}
            </div>
            
            <Button 
              className="w-full h-20 text-xl font-black bg-primary hover:bg-primary/90 rounded-[2rem] shadow-2xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-20 border-0"
              disabled={cart.length === 0 || !paymentMethod}
              onClick={completeSale}
            >
              Finalizar venta 🐼
            </Button>
          </div>
        </div>
      </main>

      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="sm:max-w-md rounded-[3rem] p-10 border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-center">
              <div className="w-24 h-24 rounded-[2rem] bg-background border border-border flex items-center justify-center text-6xl mx-auto mb-6 shadow-sm">
                {selectedProduct?.emoji}
              </div>
              <span className="text-3xl font-black block uppercase tracking-tight">{selectedProduct?.nombre}</span>
              <span className="text-sm font-bold text-muted-foreground mt-2 block">Selecciona el peso para agregar</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-10 py-6">
            <div className="text-center">
              <p className="text-5xl font-display font-black text-primary">
                ${selectedProduct?.precio.toFixed(2)}
                <span className="text-xs font-black text-muted-foreground ml-2">/KG</span>
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <Button 
                variant="secondary" 
                size="icon"
                className="h-16 w-16 rounded-2xl bg-background border-2 border-border hover:border-primary/50 transition-colors"
                onClick={() => setPesoInput(prev => Math.max(0.25, (parseFloat(prev) || 1) - 0.25).toString())}
              >
                <Minus className="w-6 h-6" />
              </Button>
              <Input 
                type="number"
                step="0.25"
                value={pesoInput}
                onChange={(e) => setPesoInput(e.target.value)}
                placeholder="1.00"
                className="h-20 text-center text-4xl font-black border-4 border-background focus:border-primary rounded-3xl bg-background shadow-inner"
              />
              <Button 
                variant="secondary" 
                size="icon"
                className="h-16 w-16 rounded-2xl bg-background border-2 border-border hover:border-primary/50 transition-colors"
                onClick={() => setPesoInput(prev => ((parseFloat(prev) || 0) + 0.25).toString())}
              >
                <Plus className="w-6 h-6" />
              </Button>
            </div>
            
            <Button 
              className="w-full h-20 text-xl font-black bg-primary hover:bg-primary/90 rounded-[2rem] shadow-xl shadow-primary/20"
              disabled={!pesoInput || parseFloat(pesoInput) <= 0}
              onClick={addToCart}
            >
              Agregar productos
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
