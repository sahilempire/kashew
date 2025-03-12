"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Download,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("year");

  return (
    <DashboardLayout title="Reports">
      <div className="space-y-6 pb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Reports</h1>
            <p className="text-muted-foreground">
              Analyze your business performance
            </p>
          </div>
          <div className="flex gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px] rounded-full">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2 rounded-full">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="revenue" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 rounded-full h-12 p-1">
            <TabsTrigger
              value="revenue"
              className="rounded-full data-[state=active]:bg-vibrant-yellow data-[state=active]:text-black"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Revenue
            </TabsTrigger>
            <TabsTrigger
              value="invoices"
              className="rounded-full data-[state=active]:bg-vibrant-yellow data-[state=active]:text-black"
            >
              <LineChart className="mr-2 h-4 w-4" />
              Invoices
            </TabsTrigger>
            <TabsTrigger
              value="clients"
              className="rounded-full data-[state=active]:bg-vibrant-yellow data-[state=active]:text-black"
            >
              <PieChart className="mr-2 h-4 w-4" />
              Clients
            </TabsTrigger>
            <TabsTrigger
              value="expenses"
              className="rounded-full data-[state=active]:bg-vibrant-yellow data-[state=active]:text-black"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Expenses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="modern-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Revenue</CardTitle>
                  <CardDescription>Year to date</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$45,250</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    +12.5% from last year
                  </p>
                </CardContent>
              </Card>
              <Card className="modern-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Average Invoice</CardTitle>
                  <CardDescription>Year to date</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$2,850</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    +5.2% from last year
                  </p>
                </CardContent>
              </Card>
              <Card className="modern-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Revenue Growth</CardTitle>
                  <CardDescription>Year over year</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">12.5%</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    +3.1% from previous period
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>
                  Monthly revenue for{" "}
                  {timeRange === "year" ? "2023" : "current period"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="mx-auto h-16 w-16 opacity-50" />
                    <p className="mt-2">
                      Revenue chart visualization would appear here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="modern-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Invoices</CardTitle>
                  <CardDescription>Year to date</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">156</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    +8.3% from last year
                  </p>
                </CardContent>
              </Card>
              <Card className="modern-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Paid Invoices</CardTitle>
                  <CardDescription>Year to date</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">124</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    79.5% of total
                  </p>
                </CardContent>
              </Card>
              <Card className="modern-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Overdue Invoices</CardTitle>
                  <CardDescription>Current</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">12</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    -3.1% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Invoice Status Trends</CardTitle>
                <CardDescription>
                  Monthly breakdown for{" "}
                  {timeRange === "year" ? "2023" : "current period"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <LineChart className="mx-auto h-16 w-16 opacity-50" />
                    <p className="mt-2">
                      Invoice trend visualization would appear here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="modern-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Clients</CardTitle>
                  <CardDescription>All time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">24</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    +4 from last year
                  </p>
                </CardContent>
              </Card>
              <Card className="modern-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Active Clients</CardTitle>
                  <CardDescription>Last 90 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">18</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    75% of total clients
                  </p>
                </CardContent>
              </Card>
              <Card className="modern-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">New Clients</CardTitle>
                  <CardDescription>This year</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">7</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    +2 from last year
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Client Revenue Distribution</CardTitle>
                <CardDescription>Top clients by revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <PieChart className="mx-auto h-16 w-16 opacity-50" />
                    <p className="mt-2">
                      Client revenue distribution would appear here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="modern-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Expenses</CardTitle>
                  <CardDescription>Year to date</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$18,450</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    +5.2% from last year
                  </p>
                </CardContent>
              </Card>
              <Card className="modern-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Profit Margin</CardTitle>
                  <CardDescription>Year to date</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">59.2%</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    +2.1% from last year
                  </p>
                </CardContent>
              </Card>
              <Card className="modern-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Largest Expense</CardTitle>
                  <CardDescription>Category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">Software</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    $4,250 (23% of total)
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Expense Categories</CardTitle>
                <CardDescription>
                  Breakdown by category for{" "}
                  {timeRange === "year" ? "2023" : "current period"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="mx-auto h-16 w-16 opacity-50" />
                    <p className="mt-2">
                      Expense category visualization would appear here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
