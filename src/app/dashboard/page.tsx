"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles, LayoutDashboard } from "lucide-react";
import dynamic from "next/dynamic";

const ProtectedRoute = dynamic(
  () => import("@/components/layout/ProtectedRoute"),
  { ssr: false },
);
import AnalyticsSummary from "@/components/dashboard/AnalyticsSummary";
import RecentInvoices from "@/components/dashboard/RecentInvoices";
import RevenueChart from "@/components/dashboard/RevenueChart";
import InvoiceStatusChart from "@/components/dashboard/InvoiceStatusChart";
import { ThemeSwitcher } from "@/components/theme-switcher";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function DashboardPage() {
  const router = useRouter();

  const handleSwitchToAI = () => {
    router.push("/ai");
  };

  return (
    <ProtectedRoute>
      <DashboardLayout title="Dashboard">
        <div className="space-y-6 pb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-vibrant-yellow p-2">
                <LayoutDashboard className="h-6 w-6 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                  Overview of your business performance
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="gap-2 rounded-full"
                onClick={handleSwitchToAI}
              >
                <Sparkles className="h-4 w-4" />
                Switch to AI Mode
              </Button>
            </div>
          </div>

          {/* Analytics Summary */}
          <AnalyticsSummary />
          <div className="text-right text-xs text-muted-foreground">
            Response time: 0.24s
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative animate-in fade-in duration-300 delay-200">
            <div className="absolute -top-6 right-0 text-xs text-muted-foreground">
              Response time: 0.18s
            </div>
            <RevenueChart className="lg:col-span-2" />
            <InvoiceStatusChart />
          </div>

          {/* Recent Invoices */}
          <div className="relative animate-in fade-in duration-300 delay-300">
            <div className="absolute -top-6 right-0 text-xs text-muted-foreground">
              Response time: 0.31s
            </div>
            <RecentInvoices />
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
