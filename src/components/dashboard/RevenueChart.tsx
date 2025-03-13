"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, DollarSign, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { invoiceService } from "@/lib/database";
import { Invoice } from "@/lib/models";
import { formatCurrency } from "@/lib/utils";

interface RevenueChartProps {
  className?: string;
}

interface MonthlyRevenue {
  month: string;
  revenue: number;
}

const RevenueChart = ({ className }: RevenueChartProps) => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<string>("year");
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<MonthlyRevenue[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, timeRange]);

  const loadData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const invoices = await invoiceService.getAll(user.id);
      
      // Filter paid invoices only
      const paidInvoices = invoices.filter((invoice: Invoice) => 
        invoice.status === 'paid'
      );
      
      // Get current date for filtering
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      
      // Filter invoices based on time range
      let filteredInvoices = paidInvoices;
      if (timeRange === 'month') {
        filteredInvoices = paidInvoices.filter((invoice: Invoice) => {
          const invoiceDate = new Date(invoice.issueDate);
          return invoiceDate.getMonth() === currentMonth && 
                 invoiceDate.getFullYear() === currentYear;
        });
      } else if (timeRange === 'quarter') {
        const quarterStart = new Date(currentYear, Math.floor(currentMonth / 3) * 3, 1);
        filteredInvoices = paidInvoices.filter((invoice: Invoice) => {
          const invoiceDate = new Date(invoice.issueDate);
          return invoiceDate >= quarterStart;
        });
      } else if (timeRange === 'year') {
        filteredInvoices = paidInvoices.filter((invoice: Invoice) => {
          const invoiceDate = new Date(invoice.issueDate);
          return invoiceDate.getFullYear() === currentYear;
        });
      } else if (timeRange === 'week') {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        filteredInvoices = paidInvoices.filter((invoice: Invoice) => {
          const invoiceDate = new Date(invoice.issueDate);
          return invoiceDate >= weekStart;
        });
      }
      
      // Calculate total revenue
      const total = filteredInvoices.reduce((sum, invoice: Invoice) => 
        sum + invoice.total, 0
      );
      setTotalRevenue(total);
      
      // Group by month for chart data
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      let monthlyData: MonthlyRevenue[] = [];
      
      if (timeRange === 'year') {
        // Initialize with all months
        monthlyData = monthNames.map(month => ({ month, revenue: 0 }));
        
        // Aggregate revenue by month
        filteredInvoices.forEach((invoice: Invoice) => {
          const invoiceDate = new Date(invoice.issueDate);
          const monthIndex = invoiceDate.getMonth();
          monthlyData[monthIndex].revenue += invoice.total;
        });
      } else if (timeRange === 'month') {
        // Group by day of month
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const currentMonthName = monthNames[currentMonth];
        
        // Create weekly groups
        monthlyData = [
          { month: `${currentMonthName} 1-7`, revenue: 0 },
          { month: `${currentMonthName} 8-14`, revenue: 0 },
          { month: `${currentMonthName} 15-21`, revenue: 0 },
          { month: `${currentMonthName} 22-${daysInMonth}`, revenue: 0 }
        ];
        
        filteredInvoices.forEach((invoice: Invoice) => {
          const invoiceDate = new Date(invoice.issueDate);
          const day = invoiceDate.getDate();
          let weekIndex = 0;
          
          if (day <= 7) weekIndex = 0;
          else if (day <= 14) weekIndex = 1;
          else if (day <= 21) weekIndex = 2;
          else weekIndex = 3;
          
          monthlyData[weekIndex].revenue += invoice.total;
        });
      } else if (timeRange === 'quarter') {
        // Get current quarter months
        const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
        const quarterMonths = monthNames.slice(quarterStartMonth, quarterStartMonth + 3);
        
        // Initialize with quarter months
        monthlyData = quarterMonths.map(month => ({ month, revenue: 0 }));
        
        // Aggregate revenue by month in the quarter
        filteredInvoices.forEach((invoice: Invoice) => {
          const invoiceDate = new Date(invoice.issueDate);
          const monthIndex = invoiceDate.getMonth() - quarterStartMonth;
          if (monthIndex >= 0 && monthIndex < 3) {
            monthlyData[monthIndex].revenue += invoice.total;
          }
        });
      } else if (timeRange === 'week') {
        // Group by day of week
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        
        // Initialize with all days
        monthlyData = dayNames.map(day => ({ month: day, revenue: 0 }));
        
        // Aggregate revenue by day
        filteredInvoices.forEach((invoice: Invoice) => {
          const invoiceDate = new Date(invoice.issueDate);
          const dayIndex = invoiceDate.getDay();
          monthlyData[dayIndex].revenue += invoice.total;
        });
      }
      
      setChartData(monthlyData);
    } catch (error) {
      console.error("Error loading revenue data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={cn("modern-card w-full h-[350px] bg-vibrant-yellow flex justify-center items-center", className)}>
        <Loader2 className="h-8 w-8 animate-spin text-black/70" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "modern-card w-full h-[350px] bg-vibrant-yellow",
        className,
      )}
    >
      <div className="flex flex-row items-center justify-between p-6 pb-2">
        <h2 className="text-lg font-medium text-black">Revenue Overview</h2>
        <select
          className="bg-black/10 text-black rounded-full px-4 py-1 text-sm"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>
      <div className="p-6 pt-2">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black/70">Total Revenue</p>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-black" />
                <span className="text-3xl font-bold text-black">
                  {formatCurrency(totalRevenue)}
                </span>
              </div>
            </div>
          </div>

          <div className="h-[220px] w-full relative mt-2">
            {/* Chart visualization */}
            <div className="absolute inset-0 flex items-end justify-between px-2">
              {chartData.map((item, index) => {
                // Calculate height based on revenue relative to max revenue
                const maxRevenue = Math.max(...chartData.map((d) => d.revenue));
                const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 180 : 0;
                const delay = index * 30; // Faster staggered animation delay

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-1 w-full max-w-[40px]"
                  >
                    <div
                      className="relative w-8 rounded-t-md overflow-hidden group will-change-transform"
                      style={{ height: `${height}px` }}
                    >
                      <div
                        className="absolute bottom-0 w-full bg-gradient-to-t from-black/30 to-black/10 hover:from-black/40 hover:to-black/20 transition-all duration-300 animate-in slide-in-from-bottom"
                        style={{
                          height: `${height}px`,
                          animationDelay: `${delay}ms`,
                          animationDuration: "300ms",
                        }}
                      />
                      <div className="absolute top-0 left-0 w-full opacity-0 group-hover:opacity-100 bg-black/10 p-1 text-[10px] text-black font-medium transition-opacity duration-200 text-center truncate">
                        {formatCurrency(item.revenue)}
                      </div>
                    </div>
                    <span className="text-xs text-black/70 font-medium">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
