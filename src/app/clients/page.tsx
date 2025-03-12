"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Search, MoreHorizontal, Users } from "lucide-react";
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
import AddClientModal from "@/components/modals/AddClientModal";

export default function ClientsPage() {
  const [addClientOpen, setAddClientOpen] = useState(false);

  // Clients data
  const clientsData = [
    {
      id: "1",
      name: "Acme Corporation",
      contactName: "John Smith",
      email: "john@acmecorp.com",
      phone: "(555) 123-4567",
      totalInvoices: 5,
      totalSpent: 12500.0,
    },
    {
      id: "2",
      name: "Globex Industries",
      contactName: "Jane Doe",
      email: "jane@globex.com",
      phone: "(555) 987-6543",
      totalInvoices: 3,
      totalSpent: 8450.75,
    },
    {
      id: "3",
      name: "Wayne Enterprises",
      contactName: "Bruce Wayne",
      email: "bruce@wayne.com",
      phone: "(555) 228-6283",
      totalInvoices: 7,
      totalSpent: 32670.25,
    },
    {
      id: "4",
      name: "Stark Industries",
      contactName: "Tony Stark",
      email: "tony@stark.com",
      phone: "(555) 482-9273",
      totalInvoices: 4,
      totalSpent: 18340.5,
    },
    {
      id: "5",
      name: "Umbrella Corporation",
      contactName: "Albert Wesker",
      email: "wesker@umbrella.com",
      phone: "(555) 666-7890",
      totalInvoices: 2,
      totalSpent: 5890.0,
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleAddClient = (data: any) => {
    console.log("New client data:", data);
    // In a real app, we would add the client to the database
  };

  return (
    <DashboardLayout title="Clients">
      <div className="space-y-6 pb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Clients</h1>
            <p className="text-muted-foreground">
              Manage your client relationships
            </p>
          </div>
          <Button
            className="gap-2 rounded-full bg-vibrant-yellow text-black hover:bg-vibrant-yellow/90"
            onClick={() => setAddClientOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="modern-card bg-vibrant-yellow p-6">
            <div className="rounded-full bg-black/10 p-3 w-fit">
              <Users className="h-6 w-6 text-black" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-black/70">Total Clients</p>
              <h3 className="text-3xl font-bold text-black">5</h3>
            </div>
          </div>

          <div className="modern-card bg-vibrant-pink p-6">
            <div className="rounded-full bg-black/10 p-3 w-fit">
              <Users className="h-6 w-6 text-black" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-black/70">Active Clients</p>
              <h3 className="text-3xl font-bold text-black">4</h3>
            </div>
          </div>

          <div className="modern-card bg-vibrant-green p-6">
            <div className="rounded-full bg-white/10 p-3 w-fit">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-white/70">Total Revenue</p>
              <h3 className="text-3xl font-bold text-white">$77,850</h3>
            </div>
          </div>
        </div>

        <div className="modern-card bg-background">
          <div className="p-6 pb-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Client List</h2>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search clients..."
                  className="w-[250px] pl-8 rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="p-6 pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Invoices</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientsData.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.contactName}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>{client.totalInvoices}</TableCell>
                    <TableCell>{formatCurrency(client.totalSpent)}</TableCell>
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
                          <DropdownMenuItem>Edit Client</DropdownMenuItem>
                          <DropdownMenuItem>Create Invoice</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Delete
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

        {/* Add Client Modal */}
        <AddClientModal
          open={addClientOpen}
          onOpenChange={setAddClientOpen}
          onSubmit={handleAddClient}
        />
      </div>
    </DashboardLayout>
  );
}
