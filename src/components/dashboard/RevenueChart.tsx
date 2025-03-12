"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react";

interface RevenueChartProps {
  className?: string;
  data?: {
    month: string;
    revenue: number;
  }[];
}

const RevenueChart = ({ className, data = defaultData }: RevenueChartProps) => {
  const [timeRange, setTimeRange] = useState<string>("year");

  // Calculate total revenue and growth
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const growth = 12.5; // Placeholder growth percentage
  const isPositiveGrowth = growth > 0;

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
                  {totalRevenue.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-black/10 px-3 py-1 rounded-full">
              {isPositiveGrowth ? (
                <ArrowUpRight className="h-4 w-4 text-black" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-black" />
              )}
              <span className="text-sm font-medium text-black">
                {isPositiveGrowth ? "+" : ""}
                {growth}%
              </span>
            </div>
          </div>

          <div className="h-[220px] w-full relative mt-2">
            {/* Chart visualization */}
            <div className="absolute inset-0 flex items-end justify-between px-2">
              {data.map((item, index) => {
                // Calculate height based on revenue relative to max revenue
                const maxRevenue = Math.max(...data.map((d) => d.revenue));
                const height = (item.revenue / maxRevenue) * 180;
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
                        ${item.revenue.toLocaleString()}
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

// Default data for the chart
const defaultData = [
  { month: "Jan", revenue: 4500 },
  { month: "Feb", revenue: 6200 },
  { month: "Mar", revenue: 5100 },
  { month: "Apr", revenue: 7800 },
  { month: "May", revenue: 6800 },
  { month: "Jun", revenue: 9200 },
  { month: "Jul", revenue: 8100 },
  { month: "Aug", revenue: 10500 },
  { month: "Sep", revenue: 9300 },
  { month: "Oct", revenue: 11200 },
  { month: "Nov", revenue: 9800 },
  { month: "Dec", revenue: 12500 },
];

export default RevenueChart;
