import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Assistant } from "@/components/Assistant";
import Home from "@/pages/Home";
import Recepcion from "@/pages/Recepcion";
import POS from "@/pages/POS";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/recepcion" component={Recepcion} />
      <Route path="/pos" component={POS} />
      <Route path="/dashboard" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <Assistant />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;