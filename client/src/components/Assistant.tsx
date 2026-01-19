import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Sparkles, Navigation } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Assistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    { role: "assistant", content: "¡Hola! Soy tu asistente de IQpanda. ¿A dónde te llevo hoy o qué necesitas revisar?" }
  ]);

  const commands = [
    { keywords: ["venta", "vender", "caja", "pos"], path: "/pos", message: "¡Claro! Abriendo la caja para que vendas rápido." },
    { keywords: ["inventario", "productos", "stock", "entrada"], path: "/recepcion", message: "Entendido. Vamos a revisar tus productos." },
    { keywords: ["negocio", "resumen", "dashboard", "estado", "gráfica"], path: "/dashboard", message: "Perfecto, vamos a ver cómo va el pulso de tu negocio." },
    { keywords: ["inicio", "home", "principal"], path: "/", message: "Volviendo al inicio." },
  ];

  const handleSend = () => {
    if (!query.trim()) return;

    const userMessage = query.toLowerCase();
    setMessages(prev => [...prev, { role: "user", content: query }]);
    setQuery("");

    const command = commands.find(cmd => 
      cmd.keywords.some(keyword => userMessage.includes(keyword))
    );

    setTimeout(() => {
      if (command) {
        setMessages(prev => [...prev, { role: "assistant", content: command.message }]);
        setTimeout(() => {
          setLocation(command.path);
          setIsOpen(false);
        }, 1000);
      } else {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: "No estoy seguro de cómo ayudarte con eso todavía, pero puedo llevarte a la Caja, Inventario o al Resumen del negocio. ¿Qué prefieres?" 
        }]);
      }
    }, 500);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[100]">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
          <MessageSquare className="w-7 h-7" />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[110]"
            />
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              className="fixed bottom-24 right-6 w-full max-w-[380px] z-[120]"
            >
              <Card className="rounded-[2.5rem] border-0 shadow-2xl overflow-hidden bg-white">
                <div className="bg-primary p-6 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-none">Asistente IQpanda</h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mt-1">En línea para ayudarte</p>
                    </div>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <CardContent className="p-0">
                  <div className="h-[350px] overflow-auto p-6 space-y-4 bg-background/30">
                    {messages.map((msg, i) => (
                      <motion.div
                        initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={i}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium shadow-sm ${
                          msg.role === 'user' 
                            ? 'bg-primary text-white rounded-tr-none' 
                            : 'bg-white text-foreground rounded-tl-none'
                        }`}>
                          {msg.content}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="p-4 bg-white border-t border-border/50">
                    <div className="relative">
                      <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Escribe algo como: 'ir a ventas'..."
                        className="h-14 pr-14 rounded-2xl border-2 border-background focus:border-primary/30"
                      />
                      <Button
                        onClick={handleSend}
                        size="icon"
                        className="absolute right-2 top-2 h-10 w-10 rounded-xl bg-primary shadow-lg shadow-primary/20"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {["Ventas", "Inventario", "Dashboard"].map(btn => (
                        <button
                          key={btn}
                          onClick={() => { setQuery(btn); }}
                          className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          {btn}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
