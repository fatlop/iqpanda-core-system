import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Camera, Package, Scale, Truck, Check, 
  Plus, X, Leaf, ScanLine, AlertCircle, Info, Sparkles, CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const productos = [
  { id: "1", nombre: "Manzana Roja", emoji: "🍎", diasVida: 14 },
  { id: "2", nombre: "Plátano", emoji: "🍌", diasVida: 7 },
  { id: "3", nombre: "Naranja", emoji: "🍊", diasVida: 21 },
  { id: "4", nombre: "Limón", emoji: "🍋", diasVida: 28 },
  { id: "5", nombre: "Papaya", emoji: "🥭", diasVida: 5 },
  { id: "6", nombre: "Aguacate", emoji: "🥑", diasVida: 4 },
  { id: "7", nombre: "Fresa", emoji: "🍓", diasVida: 3 },
  { id: "8", nombre: "Uva", emoji: "🍇", diasVida: 7 },
];

const proveedores = [
  { id: "1", nombre: "Finca El Paraíso" },
  { id: "2", nombre: "Cooperativa Los Andes" },
  { id: "3", nombre: "Distribuidora Central" },
  { id: "4", nombre: "Huertos del Valle" },
];

interface Recepcion {
  id: string;
  producto: typeof productos[0];
  peso: number;
  proveedor: typeof proveedores[0];
  calidad: "excelente" | "buena" | "regular";
  timestamp: Date;
}

export default function RecepcionPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<string>("");
  const [peso, setPeso] = useState<string>("");
  const [selectedProveedor, setSelectedProveedor] = useState<string>("");
  const [calidad, setCalidad] = useState<"excelente" | "buena" | "regular">("buena");
  const [recepciones, setRecepciones] = useState<Recepcion[]>([
    {
      id: "1",
      producto: productos[0],
      peso: 25,
      proveedor: proveedores[0],
      calidad: "excelente",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      producto: productos[1],
      peso: 18,
      proveedor: proveedores[1],
      calidad: "buena",
      timestamp: new Date(Date.now() - 7200000),
    },
  ]);

  const handleSubmit = () => {
    if (!selectedProducto || !peso || !selectedProveedor) return;
    
    const producto = productos.find(p => p.id === selectedProducto)!;
    const proveedor = proveedores.find(p => p.id === selectedProveedor)!;
    
    const nueva: Recepcion = {
      id: Date.now().toString(),
      producto,
      peso: parseFloat(peso),
      proveedor,
      calidad,
      timestamp: new Date(),
    };
    
    setRecepciones([nueva, ...recepciones]);
    setModalOpen(false);
    setSelectedProducto("");
    setPeso("");
    setSelectedProveedor("");
    setCalidad("buena");
  };

  const getCalidadColor = (cal: string) => {
    switch (cal) {
      case "excelente": return "bg-primary text-white";
      case "buena": return "bg-accent text-accent-foreground";
      case "regular": return "bg-orange-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-display font-bold text-lg text-foreground">Tus productos</h1>
                  <p className="text-xs text-muted-foreground font-medium">Evita pérdidas y desorden</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-full px-5 border-border font-bold text-xs uppercase tracking-widest h-10"
                onClick={() => setScanModalOpen(true)}
              >
                <ScanLine className="w-4 h-4 mr-2" />
                Escanear
              </Button>
              <Button 
                onClick={() => setModalOpen(true)}
                className="bg-primary hover:bg-primary/90 rounded-full px-8 font-bold shadow-xl shadow-primary/20 h-10 border-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ver productos
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10 p-8 rounded-[2.5rem] bg-white border border-border/50 flex items-start gap-6 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-foreground mb-2">Buen control de inventario 👍</h3>
            <p className="text-muted-foreground leading-relaxed font-medium">
              Mantener tus productos organizados es la clave para un negocio exitoso. Aquí puedes ver la cantidad disponible y recibir alertas si algo se está acabando.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-border/60 rounded-[2rem] shadow-sm">
              <CardContent className="p-8">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Stock disponible</p>
                <div className="flex items-center justify-between">
                  <p className="font-display text-4xl font-black text-foreground">
                    {recepciones.reduce((acc, r) => acc + r.peso, 0)} <span className="text-lg">kg</span>
                  </p>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Scale className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-border/60 rounded-[2rem] shadow-sm bg-accent/10">
              <CardContent className="p-8">
                <p className="text-xs font-bold uppercase tracking-widest text-accent-foreground mb-4">Poco stock</p>
                <div className="flex items-center justify-between">
                  <p className="font-display text-4xl font-black text-foreground">2 ítems</p>
                  <AlertCircle className="w-6 h-6 text-accent-foreground" />
                </div>
                <p className="text-xs text-accent-foreground font-bold mt-4 italic">“Este producto se está acabando”</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-border/60 rounded-[2rem] shadow-sm">
              <CardContent className="p-8">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Entradas de hoy</p>
                <div className="flex items-center justify-between">
                  <p className="font-display text-4xl font-black text-foreground">{recepciones.length}</p>
                  <div className="w-12 h-12 rounded-2xl bg-gris-neutro/5 flex items-center justify-center">
                    <Truck className="w-6 h-6 text-gris-neutro" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Card className="border-border/60 rounded-[2.5rem] shadow-sm overflow-hidden bg-white">
          <CardHeader className="bg-gris-neutro/5 border-b border-border/40 p-8">
            <CardTitle className="font-display flex items-center gap-3 text-xl">
              <Package className="w-6 h-6 text-primary" />
              Tus lotes actuales
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/40">
              <AnimatePresence>
                {recepciones.map((recepcion, index) => (
                  <motion.div
                    key={recepcion.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-8 hover:bg-background transition-colors"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-[2rem] bg-white border border-border/60 shadow-sm flex items-center justify-center text-4xl">
                        {recepcion.producto.emoji}
                      </div>
                      <div>
                        <p className="font-black text-foreground text-lg uppercase tracking-tight">{recepcion.producto.nombre}</p>
                        <p className="text-sm text-muted-foreground font-bold italic">{recepcion.proveedor.nombre}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-12">
                      <div className="text-right">
                        <p className="font-display font-black text-3xl text-primary">{recepcion.peso} kg</p>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                          {recepcion.timestamp.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <Badge className={`${getCalidadColor(recepcion.calidad)} border-0 rounded-full px-4 py-2 font-bold text-[10px] uppercase tracking-[0.2em]`}>
                        {recepcion.calidad}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md rounded-[3rem] p-10 border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-3 text-2xl font-black uppercase tracking-tight">
              <Package className="w-8 h-8 text-primary" />
              Registrar entrada
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-10 py-6">
            <div className="space-y-4">
              <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Producto</Label>
              <Select value={selectedProducto} onValueChange={setSelectedProducto}>
                <SelectTrigger className="h-16 rounded-2xl border-4 border-background bg-background font-bold text-lg" data-testid="select-product">
                  <SelectValue placeholder="¿Qué recibimos hoy?" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {productos.map((p) => (
                    <SelectItem key={p.id} value={p.id} className="rounded-xl py-4 font-bold">
                      <span className="flex items-center gap-4">
                        <span className="text-3xl">{p.emoji}</span>
                        <span>{p.nombre}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Peso (kg)</Label>
              <Input 
                type="number" 
                placeholder="Ej: 25.5"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                className="h-16 rounded-2xl border-4 border-background bg-background font-black text-2xl shadow-inner"
              />
            </div>
            
            <div className="space-y-4">
              <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Calidad</Label>
              <div className="grid grid-cols-3 gap-4">
                {(["excelente", "buena", "regular"] as const).map((cal) => (
                  <button
                    key={cal}
                    onClick={() => setCalidad(cal)}
                    className={`py-5 px-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                      calidad === cal 
                        ? (cal === "excelente" ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : 
                           cal === "buena" ? "bg-accent border-accent text-accent-foreground shadow-lg shadow-accent/20" : 
                           "bg-gris-neutro border-gris-neutro text-white shadow-lg shadow-gris-neutro/20")
                        : "bg-background border-transparent text-muted-foreground hover:border-border"
                    }`}
                  >
                    {cal}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button 
                variant="ghost" 
                className="flex-1 h-16 rounded-2xl font-bold text-muted-foreground"
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                className="flex-1 h-16 bg-primary hover:bg-primary/90 rounded-2xl font-black shadow-2xl shadow-primary/20 border-0"
                onClick={handleSubmit}
                disabled={!selectedProducto || !peso}
              >
                Listo, guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
