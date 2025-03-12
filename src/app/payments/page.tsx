"use client";

import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  MoreHorizontal,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function PaymentsPage() {
  // Payments data
  const paymentsData = [
    {
      id: "1",
      invoiceNumber: "INV-001",
      clientName: "Acme Corporation",
      amount: 1250.0,
      date: "2023-05-15",
      method: "Credit Card",
      status: "completed",
    },
    {
      id: "2",
      invoiceNumber: "INV-002",
      clientName: "Globex Industries",
      amount: 3450.75,
      date: "2023-05-20",
      method: "Bank Transfer",
      status: "pending",
    },
    {
      id: "3",
      invoiceNumber: "INV-005",
      clientName: "Umbrella Corporation",
      amount: 1890.0,
      date: "2023-05-05",
      method: "PayPal",
      status: "completed",
    },
    {
      id: "4",
      invoiceNumber: "INV-007",
      clientName: "LexCorp",
      amount: 7800.0,
      date: "2023-05-02",
      method: "Credit Card",
      status: "completed",
    },
    {
      id: "5",
      invoiceNumber: "INV-008",
      clientName: "Cyberdyne Systems",
      amount: 3200.0,
      date: "2023-04-20",
      method: "Bank Transfer",
      status: "failed",
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const statusStyles = {
    completed: {
      variant: "secondary" as const,
      label: "Completed",
      className: "bg-vibrant-green text-white hover:bg-vibrant-green",
    },
    pending: {
      variant: "outline" as const,
      label: "Pending",
      className: "bg-vibrant-yellow text-black hover:bg-vibrant-yellow",
    },
    failed: {
      variant: "destructive" as const,
      label: "Failed",
      className: "bg-vibrant-pink text-black hover:bg-vibrant-pink",
    },
  };

  return (
    <DashboardLayout title="Payments">
      <div className="space-y-6 pb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Payments</h1>
            <p className="text-muted-foreground">
              Manage and track your payments
            </p>
          </div>
          <Button className="gap-2 rounded-full bg-vibrant-yellow text-black hover:bg-vibrant-yellow/90">
            <Plus className="h-4 w-4" />
            Record Payment
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="modern-card bg-vibrant-green p-6">
            <div className="rounded-full bg-white/10 p-3 w-fit">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-white/70">Total Received</p>
              <h3 className="text-3xl font-bold text-white">$10,940</h3>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-4 w-4 text-white/70" />
                <span className="text-sm text-white/70">
                  +12.5% from last month
                </span>
              </div>
            </div>
          </div>

          <div className="modern-card bg-vibrant-yellow p-6">
            <div className="rounded-full bg-black/10 p-3 w-fit">
              <CreditCard className="h-6 w-6 text-black" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-black/70">Pending</p>
              <h3 className="text-3xl font-bold text-black">$3,450</h3>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-4 w-4 text-black/70" />
                <span className="text-sm text-black/70">
                  +5.2% from last month
                </span>
              </div>
            </div>
          </div>

          <div className="modern-card bg-vibrant-pink p-6">
            <div className="rounded-full bg-black/10 p-3 w-fit">
              <CreditCard className="h-6 w-6 text-black" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-black/70">Failed</p>
              <h3 className="text-3xl font-bold text-black">$3,200</h3>
              <div className="flex items-center gap-1 mt-1">
                <ArrowDownRight className="h-4 w-4 text-black/70" />
                <span className="text-sm text-black/70">
                  -3.1% from last month
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="modern-card bg-background">
          <div className="p-6 pb-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Payment History</h2>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search payments..."
                  className="w-[250px] pl-8 rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="p-6 pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentsData.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {payment.invoiceNumber}
                    </TableCell>
                    <TableCell>{payment.clientName}</TableCell>
                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>{formatDate(payment.date)}</TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell>
                      <Badge
                        variant={statusStyles[payment.status].variant}
                        className={
                          statusStyles[payment.status].className +
                          " rounded-full px-3"
                        }
                      >
                        {statusStyles[payment.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Send Receipt</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Void Payment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
