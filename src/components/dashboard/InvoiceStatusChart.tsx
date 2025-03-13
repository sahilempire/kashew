import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { invoiceService } from "@/lib/database";
import { Invoice } from "@/lib/models";
import { Loader2 } from "lucide-react";

interface InvoiceStatusChartProps {
  className?: string;
}

interface StatusData {
  status: string;
  value: number;
  color: string;
}

const InvoiceStatusChart = ({ className = "" }: InvoiceStatusChartProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<StatusData[]>([]);
  const [total, setTotal] = useState(0);

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
      
      // Skip if no invoices
      if (invoices.length === 0) {
        setData([
          { status: "Paid", value: 0, color: "bg-green-500" },
          { status: "Pending", value: 0, color: "bg-yellow-500" },
          { status: "Overdue", value: 0, color: "bg-red-500" },
        ]);
        setTotal(0);
        return;
      }
      
      // Count invoices by status
      const statusCounts: Record<string, number> = {
        paid: 0,
        pending: 0,
        overdue: 0,
        draft: 0,
        cancelled: 0
      };
      
      invoices.forEach((invoice: Invoice) => {
        if (statusCounts[invoice.status] !== undefined) {
          statusCounts[invoice.status]++;
        }
      });
      
      // Calculate percentages
      const totalInvoices = invoices.length;
      const paidPercentage = Math.round((statusCounts.paid / totalInvoices) * 100);
      const pendingPercentage = Math.round((statusCounts.pending / totalInvoices) * 100);
      const overduePercentage = Math.round((statusCounts.overdue / totalInvoices) * 100);
      const otherPercentage = 100 - paidPercentage - pendingPercentage - overduePercentage;
      
      // Create data array
      const chartData: StatusData[] = [
        { status: "Paid", value: paidPercentage, color: "bg-green-500" },
        { status: "Pending", value: pendingPercentage, color: "bg-yellow-500" },
        { status: "Overdue", value: overduePercentage, color: "bg-red-500" },
      ];
      
      // Add "Other" category if there are draft or cancelled invoices
      if (otherPercentage > 0) {
        chartData.push({ status: "Other", value: otherPercentage, color: "bg-gray-500" });
      }
      
      setData(chartData);
      setTotal(totalInvoices);
    } catch (error) {
      console.error("Error loading invoice status data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={cn("modern-card h-full w-full bg-vibrant-pink flex justify-center items-center", className)}>
        <Loader2 className="h-8 w-8 animate-spin text-black/70" />
      </div>
    );
  }

  return (
    <div className={cn("modern-card h-full w-full bg-vibrant-pink", className)}>
      <div className="p-6 pb-2">
        <h2 className="text-lg font-medium text-black">Invoice Status</h2>
      </div>
      <div className="p-6 pt-0">
        {total === 0 ? (
          <div className="flex h-[250px] items-center justify-center flex-col">
            <p className="text-black/70 text-center">No invoices found</p>
            <p className="text-black/50 text-sm text-center mt-2">Create invoices to see statistics</p>
          </div>
        ) : (
          <div className="flex h-[250px] items-center justify-center">
            <div className="relative h-[180px] w-[180px] rounded-full">
              {/* Pie chart segments with animation */}
              <div className="absolute inset-0 rounded-full overflow-hidden will-change-transform">
                {data.map((segment, index) => {
                  const segmentPercentage = segment.value / 100;
                  const segmentDegrees = segmentPercentage * 360;
                  const previousSegmentsDegrees = data
                    .slice(0, index)
                    .reduce((sum, d) => sum + (d.value / 100) * 360, 0);

                  // Define vibrant colors based on status
                  const colors = [
                    "linear-gradient(135deg, #1e9f6e, #0d9488)", // Paid - green gradient
                    "linear-gradient(135deg, #f5d742, #fbbf24)", // Pending - yellow gradient
                    "linear-gradient(135deg, #f472b6, #ec4899)", // Overdue - pink gradient
                    "linear-gradient(135deg, #9ca3af, #6b7280)", // Other - gray gradient
                  ];

                  return (
                    <div
                      key={index}
                      className="absolute inset-0 animate-in fade-in zoom-in"
                      style={{
                        animationDelay: `${index * 120}ms`,
                        animationDuration: "400ms",
                        clipPath: `conic-gradient(from ${previousSegmentsDegrees}deg, currentColor ${segmentDegrees}deg, transparent ${segmentDegrees}deg)`,
                        background: colors[index] || colors[3],
                        opacity: 0.85,
                      }}
                    />
                  );
                })}
              </div>
              <div className="absolute inset-[15%] rounded-full bg-white/90 flex items-center justify-center animate-in fade-in zoom-in duration-300 shadow-inner">
                <span className="text-3xl font-bold text-black">{total}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 space-y-3">
          {data.map((item, index) => {
            // Define vibrant colors based on status
            const colors = [
              "#1e9f6e", // Paid - green
              "#f5d742", // Pending - yellow
              "#f472b6", // Overdue - pink
              "#9ca3af", // Other - gray
            ];

            return (
              <div
                key={item.status}
                className="flex items-center justify-between animate-in fade-in slide-in-from-right-4"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationDuration: "300ms",
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: colors[index] || colors[3] }}
                  />
                  <span className="text-sm text-black font-medium">
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-black">{item.value}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InvoiceStatusChart;
