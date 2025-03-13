import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  FileText,
  Clock,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { invoiceService } from "@/lib/database";
import { Invoice } from "@/lib/models";
import { formatCurrency } from "@/lib/utils";

interface AnalyticsSummaryProps {
  className?: string;
}

const AnalyticsSummary = ({ className = "" }: AnalyticsSummaryProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    outstandingInvoices: 0,
    paidInvoices: 0,
    overdueInvoices: 0,
  });

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const invoices = await invoiceService.getAll(user.id);
      
      // Calculate analytics
      let totalRevenue = 0;
      let outstandingInvoices = 0;
      let paidInvoices = 0;
      let overdueInvoices = 0;
      
      invoices.forEach((invoice: Invoice) => {
        if (invoice.status === 'paid') {
          totalRevenue += invoice.total;
          paidInvoices += invoice.total;
        } else if (invoice.status === 'pending') {
          outstandingInvoices += invoice.total;
        } else if (invoice.status === 'overdue') {
          overdueInvoices += invoice.total;
          outstandingInvoices += invoice.total;
        }
      });
      
      setAnalytics({
        totalRevenue,
        outstandingInvoices,
        paidInvoices,
        overdueInvoices,
      });
    } catch (error) {
      console.error("Error loading analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full",
        className,
      )}
    >
      {/* Total Revenue */}
      <div className="modern-card bg-gradient-to-br from-vibrant-yellow to-amber-400 p-6 transform transition-all duration-300 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 duration-300 will-change-transform">
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-black/10 p-3">
            <DollarSign className="h-6 w-6 text-black" />
          </div>
          <div className="flex items-center gap-1">
            <ArrowUpRight className="h-4 w-4 text-black" />
            <span className="text-sm font-medium text-black">Total</span>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-black/70">Total Revenue</p>
          <h3 className="text-3xl font-bold text-black">
            {formatCurrency(analytics.totalRevenue)}
          </h3>
        </div>
      </div>

      {/* Outstanding Invoices */}
      <div
        className="modern-card bg-gradient-to-br from-vibrant-pink to-pink-400 p-6 transform transition-all duration-300 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 duration-300 will-change-transform"
        style={{ animationDelay: "80ms" }}
      >
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-black/10 p-3">
            <Clock className="h-6 w-6 text-black" />
          </div>
          <div className="flex items-center gap-1">
            <ArrowUpRight className="h-4 w-4 text-black" />
            <span className="text-sm font-medium text-black">Pending</span>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-black/70">Outstanding Invoices</p>
          <h3 className="text-3xl font-bold text-black">
            {formatCurrency(analytics.outstandingInvoices)}
          </h3>
        </div>
      </div>

      {/* Paid Invoices */}
      <div
        className="modern-card bg-gradient-to-br from-vibrant-green to-emerald-500 p-6 transform transition-all duration-300 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 duration-300 will-change-transform"
        style={{ animationDelay: "160ms" }}
      >
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-white/20 p-3">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div className="flex items-center gap-1">
            <ArrowUpRight className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">Paid</span>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-white/70">Paid Invoices</p>
          <h3 className="text-3xl font-bold text-white">
            {formatCurrency(analytics.paidInvoices)}
          </h3>
        </div>
      </div>

      {/* Overdue Invoices */}
      <div
        className="modern-card bg-gradient-to-br from-vibrant-black to-gray-700 p-6 transform transition-all duration-300 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 duration-300 will-change-transform"
        style={{ animationDelay: "240ms" }}
      >
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-white/10 p-3">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <div className="flex items-center gap-1">
            <ArrowDownRight className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-red-500">Overdue</span>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-white/70">Overdue Invoices</p>
          <h3 className="text-3xl font-bold text-white">
            {formatCurrency(analytics.overdueInvoices)}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSummary;
