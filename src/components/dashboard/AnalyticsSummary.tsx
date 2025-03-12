import React from "react";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  FileText,
  Clock,
  AlertTriangle,
} from "lucide-react";

interface AnalyticsSummaryProps {
  className?: string;
  data?: {
    totalRevenue: number;
    outstandingInvoices: number;
    paidInvoices: number;
    overdueInvoices: number;
  };
}

const AnalyticsSummary = ({
  className = "",
  data = {
    totalRevenue: 45250.75,
    outstandingInvoices: 12340.5,
    paidInvoices: 32910.25,
    overdueInvoices: 5670.25,
  },
}: AnalyticsSummaryProps) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

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
            <span className="text-sm font-medium text-black">+12.5%</span>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-black/70">Total Revenue</p>
          <h3 className="text-3xl font-bold text-black">
            {formatCurrency(data.totalRevenue)}
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
            <span className="text-sm font-medium text-black">+5.2%</span>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-black/70">Outstanding Invoices</p>
          <h3 className="text-3xl font-bold text-black">
            {formatCurrency(data.outstandingInvoices)}
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
            <span className="text-sm font-medium text-white">+18.3%</span>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-white/70">Paid Invoices</p>
          <h3 className="text-3xl font-bold text-white">
            {formatCurrency(data.paidInvoices)}
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
            <span className="text-sm font-medium text-red-500">-3.1%</span>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-white/70">Overdue Invoices</p>
          <h3 className="text-3xl font-bold text-white">
            {formatCurrency(data.overdueInvoices)}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSummary;
