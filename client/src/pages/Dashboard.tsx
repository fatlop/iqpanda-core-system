import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  ArrowLeft, BarChart3, TrendingUp, TrendingDown, AlertTriangle,
  Sun, Cloud, Thermometer, Package, DollarSign, Trash2, Phone,
  ChevronRight, Calendar, ExternalLink, Sparkles, Info, Heart
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from "recharts";

const ventasSemana = [
  { dia: "Lun", ventas: 245, merma: 12 },
  { dia: "Mar", ventas: 312, merma: 8 },
  { dia: "Mié", ventas: 287, merma: 15 },
  { dia: "Jue", ventas: 356, merma: 6 },
  { dia: "Vie", ventas: 421, merma: 9 },
  { dia: "Sáb", ventas: 534, merma: 18 },
  { dia: "Dom", ventas: 398, merma: 11 },
];

const inventarioCritico = [
  { id: "1", nombre: "Plátano", emoji: "🍌", stock: 8, diasRestantes: 1, accion: "promocion" },
  { id: "2", nombre: "Fresa", emoji: "🍓", stock: 12, diasRestantes: 2, accion: "promocion" },
  { id: "3", nombre: "Aguacate", emoji: "🥑", stock: 5, diasRestantes: 1, accion: "comprar" },
  { id: "4", nombre: "Mango", emoji: "🥭", stock: 3, diasRestantes: 2, accion: "comprar" },
];

const distribucionMerma = [
  { name: "Madurez", value: 45, color: "#FFD166" },
  { name: "Daño", value: 30, color: "#1DB954" },
  { name: "Vencimiento", value: 25, color: "#121212" },
];

const proyeccionVentas = [
  { hora: "8am", real: 0, proyeccion: 45 },
  { hora: "10am", real: 52, proyeccion: 85 },
  { hora: "12pm", real: 120, proyeccion: 145 },
  { hora: "2pm", real: 180, proyeccion: 195 },
  { hora: "4pm", real: 245, proyeccion: 260 },
  { hora: "6pm", real: 0, proyeccion: 320 },
  { hora: "8pm", real: 0, proyeccion: 280 },
];

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<"dia" | "semana" | "mes">("semana");
  
  const mermaTotal = ventasSemana.reduce((acc, d) => acc + d.merma, 0);
  const ventasTotal = ventasSemana.reduce((acc, d) => acc + d.ventas, 0);
  const porcentajeMerma = ((mermaTotal / ventasTotal) * 100).toFixed(1);
  
  const getMermaStatus = () => {
    const pct = parseFloat(porcentajeMerma);
    if (pct < 3) return { color: "bg-primary", label: "Buen trabajo", textColor: "text-white" };
    if (pct < 5) return { color: "bg-accent", label: "Aquí podrías mejorar", textColor: "text-accent-foreground" };
    return { color: "bg-red-500", label: "Ojo con esto 👀", textColor: "text-white" };
  };

  const mermaStatus = getMermaStatus();

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
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-display font-bold text-lg text-foreground">Estado general</h1>
                  <p className="text-xs text-muted-foreground font-medium">Ver el negocio con claridad</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {(["dia", "semana", "mes"] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    selectedPeriod === period
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 p-6 rounded-3xl bg-white border border-border/50 flex items-start gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground mb-1">Hoy vendiste más que ayer 🎉</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tu negocio está creciendo. Este dato te puede ayudar a mejorar tu stock para mañana. ¡Buen trabajo!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-border/60 rounded-3xl shadow-sm">
              <CardContent className="p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Ventas de hoy</p>
                <div className="flex items-center justify-between">
                  <p className="font-display text-3xl font-bold text-foreground">${ventasTotal}</p>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <p className="text-xs text-primary font-bold mt-3">Buen trabajo, hoy vas bien</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-border/60 rounded-3xl shadow-sm">
              <CardContent className="p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Merma total</p>
                <div className="flex items-center justify-between">
                  <p className="font-display text-3xl font-bold text-foreground">{mermaTotal} kg</p>
                  <Badge className={`${mermaStatus.color} ${mermaStatus.textColor} border-0 rounded-full px-3`}>
                    {mermaStatus.label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-3 font-medium">Representa el {porcentajeMerma}% de tu stock</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-border/60 rounded-3xl shadow-sm">
              <CardContent className="p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Productos estrella</p>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🍊</div>
                  <div className="text-3xl">🍌</div>
                  <div className="text-3xl">🥑</div>
                </div>
                <p className="text-xs text-muted-foreground mt-4 font-medium">Este producto se mueve mucho</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-border/60 rounded-3xl shadow-sm bg-accent/20">
              <CardContent className="p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-accent-foreground mb-4">Alertas de stock</p>
                <div className="flex items-center justify-between">
                  <p className="font-display text-3xl font-bold text-foreground">4 items</p>
                  <AlertTriangle className="w-6 h-6 text-accent-foreground" />
                </div>
                <p className="text-xs text-accent-foreground font-bold mt-3">Ojo con esto 👀</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div className="lg:col-span-2">
            <Card className="border-border/60 rounded-[2rem] shadow-sm overflow-hidden bg-white">
              <CardHeader className="border-b border-border/40 p-8">
                <CardTitle className="font-display flex items-center justify-between">
                  <span className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    Comparación semanal
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">hoy vs ayer</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ventasSemana}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                      <XAxis dataKey="dia" axisLine={false} tickLine={false} fontSize={12} />
                      <YAxis axisLine={false} tickLine={false} fontSize={12} />
                      <Tooltip 
                        cursor={{ fill: "#F5F5F5" }}
                        contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                      />
                      <Bar dataKey="ventas" name="Ventas" fill="#1DB954" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="merma" name="Merma" fill="#2A2A2A" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <Card className="border-border/60 rounded-[2rem] shadow-sm overflow-hidden bg-white">
            <CardHeader className="border-b border-border/40 p-8">
              <CardTitle className="font-display flex items-center gap-3">
                <Heart className="w-6 h-6 text-primary" />
                Causas de merma
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distribucionMerma}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {distribucionMerma.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4 mt-8">
                {distribucionMerma.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-bold text-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium text-muted-foreground">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <motion.div>
          <Card className="border-0 bg-gris-neutro text-white rounded-[2rem] shadow-2xl p-8 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-transform">
              <BarChart3 className="w-48 h-48" />
            </div>
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-2xl mb-2">Este dato te puede ayudar a mejorar</h3>
                  <p className="text-white/70 max-w-lg font-medium">
                    Mañana se espera un aumento del 15% en cítricos debido al clima soleado. Podrías pedir más de este artículo para no quedarte sin stock.
                  </p>
                </div>
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-16 px-10 rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 shrink-0 border-0">
                Pedir a proveedor ahora
              </Button>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
