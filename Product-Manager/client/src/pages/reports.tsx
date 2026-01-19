import { useState } from "react";
import { useSalesReport } from "@/hooks/use-sales";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download } from "lucide-react";
import { format } from "date-fns";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function Reports() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const { data: salesData, isLoading } = useSalesReport({ period });

  const exportToExcel = () => {
    if (!salesData) return;
    
    const ws = XLSX.utils.json_to_sheet(salesData.map(item => ({
      Date: item.date,
      "Total Sales": item.totalSales,
      "Transaction Count": item.count
    })));
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales Report");
    XLSX.writeFile(wb, `Sales_Report_${period}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  const exportToPDF = () => {
    if (!salesData) return;

    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text(`Sales Report - ${period.charAt(0).toUpperCase() + period.slice(1)}`, 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on ${format(new Date(), 'PPP')}`, 14, 30);

    const tableData = salesData.map(item => [
      format(new Date(item.date), 'yyyy-MM-dd'),
      `$${item.totalSales.toFixed(2)}`,
      item.count.toString()
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['Date', 'Total Sales', 'Transactions']],
      body: tableData,
    });

    doc.save(`Sales_Report_${period}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Reports</h1>
          <p className="text-muted-foreground">Export and analyze your sales data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToExcel}>
            <Download className="mr-2 h-4 w-4" /> Excel
          </Button>
          <Button onClick={exportToPDF}>
            <FileText className="mr-2 h-4 w-4" /> PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="monthly" onValueChange={(val: any) => setPeriod(val)} className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="daily">Daily Cut</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">Loading chart...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSalesMain" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(str) => format(new Date(str), period === 'monthly' ? "MMM dd" : "dd/MM")}
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
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, "Revenue"]}
                    labelFormatter={(label) => format(new Date(label), "PPP")}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="totalSales" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorSalesMain)" 
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Data Table</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Total Transactions</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={3} className="text-center py-8">Loading...</TableCell></TableRow>
                ) : salesData?.length === 0 ? (
                  <TableRow><TableCell colSpan={3} className="text-center py-8">No data available for this period</TableCell></TableRow>
                ) : (
                  salesData?.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{format(new Date(row.date), 'PPP')}</TableCell>
                      <TableCell>{row.count}</TableCell>
                      <TableCell className="text-right font-medium">${row.totalSales.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
