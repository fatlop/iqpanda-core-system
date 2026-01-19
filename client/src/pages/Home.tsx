import { Link } from "wouter";
import { motion } from "framer-motion";
import { Package, ShoppingCart, BarChart3, TrendingDown, Zap, Heart, MessageCircle, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: ShoppingCart,
    title: "Caja / POS",
    description: "Vende rápido y sin errores. Todo listo para cobrar.",
    href: "/pos",
    color: "bg-primary",
    delay: 0.1,
  },
  {
    icon: Package,
    title: "Tus productos",
    description: "Evita pérdidas y desorden. Buen control de inventario 👍",
    href: "/recepcion",
    color: "bg-slate-800",
    delay: 0.2,
  },
  {
    icon: BarChart3,
    title: "Estado general",
    description: "Ver tu negocio con claridad. ¿Cómo va tu día hoy?",
    href: "/dashboard",
    color: "bg-accent",
    textColor: "text-accent-foreground",
    delay: 0.3,
  },
];

const stats = [
  { icon: Zap, value: "Hoy", label: "Buen trabajo, hoy vas bien" },
  { icon: TrendingDown, value: "Ventas", label: "Así va tu día" },
  { icon: Sparkles, value: "Tips", label: "Ojo con esto 👀" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">🐼</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg text-foreground leading-none">
                  IQpanda <span className="text-primary">Core</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  Tecnología clara para personas reales
                </span>
              </div>
            </motion.div>
            <nav className="hidden md:flex items-center gap-8">
              {features.map((feature) => (
                <Link key={feature.href} href={feature.href}>
                  <span 
                    className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    data-testid={`nav-${feature.href.slice(1)}`}
                  >
                    {feature.title}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="pt-16">
        <section className="relative py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-8">
                Aquí puedes ver cómo <br />
                va tu <span className="text-primary">negocio hoy</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
                Entiende tu negocio, organiza tu trabajo y toma mejores decisiones sin sentirte abrumado por la tecnología.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/pos">
                <button 
                  className="px-10 py-5 rounded-2xl bg-primary text-primary-foreground font-bold shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  Abrir Caja / POS
                </button>
              </Link>
              <p className="text-sm font-medium text-muted-foreground italic">
                “Tecnología clara para personas reales”
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-8 rounded-3xl bg-background border border-border/50 flex flex-col items-center text-center group hover:border-primary/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="font-display text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <motion.div
                  key={feature.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: feature.delay }}
                >
                  <Link href={feature.href}>
                    <Card 
                      className="group h-full cursor-pointer border-border/60 bg-card hover:border-primary/40 transition-all duration-300 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl"
                    >
                      <CardContent className="p-10">
                        <div className={`w-16 h-16 rounded-2xl ${feature.color} ${feature.textColor || 'text-white'} flex items-center justify-center mb-8 shadow-lg group-hover:rotate-3 transition-transform`}>
                          <feature.icon className="w-8 h-8" />
                        </div>
                        <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                          {feature.description}
                        </p>
                        <div className="flex items-center text-primary font-bold text-sm">
                          Ir al panel
                          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-16 border-t border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold shadow-md">🐼</div>
            <span className="font-display font-bold text-xl">IQpanda <span className="text-primary">Core</span></span>
          </div>
          <p className="text-muted-foreground max-w-md mx-auto mb-8 font-medium">
            Creamos soluciones, no complicaciones. <br />
            Tecnología pensada para personas reales.
          </p>
          <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">
            Desarrollado por IQpanda Tecnovador
          </div>
        </div>
      </footer>
    </div>
  );
}

function ChevronRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
