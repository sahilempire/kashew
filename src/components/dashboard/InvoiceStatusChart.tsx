import React from "react";
import { cn } from "@/lib/utils";

interface InvoiceStatusChartProps {
  className?: string;
  data?: {
    status: string;
    value: number;
    color: string;
  }[];
}

const InvoiceStatusChart = ({
  className = "",
  data = [
    { status: "Paid", value: 65, color: "bg-green-500" },
    { status: "Pending", value: 25, color: "bg-yellow-500" },
    { status: "Overdue", value: 10, color: "bg-red-500" },
  ],
}: InvoiceStatusChartProps) => {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className={cn("modern-card h-full w-full bg-vibrant-pink", className)}>
      <div className="p-6 pb-2">
        <h2 className="text-lg font-medium text-black">Invoice Status</h2>
      </div>
      <div className="p-6 pt-0">
        <div className="flex h-[250px] items-center justify-center">
          <div className="relative h-[180px] w-[180px] rounded-full">
            {/* Pie chart segments with animation */}
            <div className="absolute inset-0 rounded-full overflow-hidden will-change-transform">
              {data.map((segment, index) => {
                const segmentPercentage = segment.value / total;
                const segmentDegrees = segmentPercentage * 360;
                const previousSegmentsDegrees = data
                  .slice(0, index)
                  .reduce((sum, d) => sum + (d.value / total) * 360, 0);

                // Define vibrant colors based on status
                const colors = [
                  "linear-gradient(135deg, #1e9f6e, #0d9488)", // Paid - green gradient
                  "linear-gradient(135deg, #f5d742, #fbbf24)", // Pending - yellow gradient
                  "linear-gradient(135deg, #f472b6, #ec4899)", // Overdue - pink gradient
                ];

                return (
                  <div
                    key={index}
                    className="absolute inset-0 animate-in fade-in zoom-in"
                    style={{
                      animationDelay: `${index * 120}ms`,
                      animationDuration: "400ms",
                      clipPath: `conic-gradient(from ${previousSegmentsDegrees}deg, currentColor ${segmentDegrees}deg, transparent ${segmentDegrees}deg)`,
                      background: colors[index],
                      opacity: 0.85,
                    }}
                  />
                );
              })}
            </div>
            <div className="absolute inset-[15%] rounded-full bg-white/90 flex items-center justify-center animate-in fade-in zoom-in duration-300 shadow-inner">
              <span className="text-3xl font-bold text-black">{total}%</span>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {data.map((item, index) => {
            // Define vibrant colors based on status
            const colors = [
              "#1e9f6e", // Paid - green
              "#f5d742", // Pending - yellow
              "#f472b6", // Overdue - pink
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
                    style={{ backgroundColor: colors[index] }}
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
