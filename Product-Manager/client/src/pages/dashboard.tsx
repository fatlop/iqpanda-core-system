import { useSales, useSalesReport } from "@/hooks/use-sales";
import { useProducts } from "@/hooks/use-products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { DollarSign, Package, AlertTriangle, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const today = format(new Date(), "yyyy-MM-dd");
  
  const { data: salesData, isLoading: loadingSales } = useSalesReport({ 
    period: 'monthly',
    date: today 
  });
  
  const { data: products, isLoading: loadingProducts } = useProducts();
  
  // Calculate stats
  const totalProducts = products?.length || 0;
  const lowStockProducts = products?.filter(p => p.stock <= (p.minStock || 5)).length || 0;
  
  const todaySales = salesData?.find(d => d.date === today);
  const totalRevenue = salesData?.reduce((acc, curr) => acc + curr.totalSales, 0) || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your store performance</p>
        </div>
        <div className="text-sm text-muted-foreground bg-muted px-4 py-2 rounded-lg border border-border">
          Today: {format(new Date(), "MMMM do, yyyy")}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Today's Revenue"
          value={`$${todaySales?.totalSales.toFixed(2) || "0.00"}`}
          icon={DollarSign}
          trend="+12% from yesterday"
          loading={loadingSales}
          className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
        />
        <StatsCard
          title="Total Products"
          value={totalProducts.toString()}
          icon={Package}
          trend="In active inventory"
          loading={loadingProducts}
        />
        <StatsCard
          title="Low Stock Alerts"
          value={lowStockProducts.toString()}
          icon={AlertTriangle}
          trend="Items need reordering"
          variant="warning"
          loading={loadingProducts}
        />
        <StatsCard
          title="Monthly Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={TrendingUp}
          trend="Current month total"
          loading={loadingSales}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loadingSales ? (
              <div className="w-full h-full flex items-center justify-center">
                <Skeleton className="w-full h-full rounded-lg" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(str) => format(new Date(str), "d")}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--popover))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: 'var(--shadow-lg)'
                    }}
                    itemStyle={{ color: 'hsl(var(--primary))' }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, "Sales"]}
                    labelFormatter={(label) => format(new Date(label), "MMM do, yyyy")}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="totalSales" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity / Low Stock List */}
        <Card className="shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto pr-2">
            {loadingProducts ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
              </div>
            ) : lowStockProducts > 0 ? (
              <div className="space-y-4">
                {products
                  ?.filter(p => p.stock <= (p.minStock || 5))
                  .slice(0, 5)
                  .map(product => (
                    <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/50">
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">SKU: {product.sku || "N/A"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-600 dark:text-orange-400">{product.stock}</p>
                        <p className="text-[10px] text-muted-foreground">Min: {product.minStock}</p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-8">
                <Package className="h-12 w-12 mb-2 opacity-20" />
                <p>All stock levels healthy!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, trend, variant = "default", loading, className }: any) {
  const colors = {
    default: "text-primary bg-primary/10",
    warning: "text-orange-600 bg-orange-100 dark:bg-orange-950/30 dark:text-orange-400",
  };

  return (
    <Card className={cn("shadow-sm hover:shadow-md transition-shadow duration-300", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-24 mt-2" />
            ) : (
              <h3 className="text-2xl font-bold font-display mt-1 tracking-tight">{value}</h3>
            )}
          </div>
          <div className={cn("p-3 rounded-xl", variant === "warning" ? colors.warning : colors.default)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center text-xs text-muted-foreground">
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
