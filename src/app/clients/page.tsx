"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Search, MoreHorizontal, Loader2 } from "lucide-react";
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
import { useAuth } from "@/contexts/AuthContext";
import { clientService } from "@/lib/database";
import { Client } from "@/lib/models";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";

export default function ClientsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadClients();
    }
  }, [user]);

  const loadClients = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await clientService.getAll(user.id);
      setClients(data);
      setError(null);
    } catch (err) {
      console.error("Error loading clients:", err);
      setError("Failed to load clients. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!user || !searchQuery.trim()) {
      await loadClients();
      return;
    }
    
    try {
      setLoading(true);
      const data = await clientService.search(user.id, searchQuery);
      setClients(data);
      setError(null);
    } catch (err) {
      console.error("Error searching clients:", err);
      setError("Failed to search clients. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (data: any) => {
    if (!user) return;
    
    try {
      setLoading(true);
      await clientService.create(user.id, data);
      await loadClients();
    } catch (err) {
      console.error("Error adding client:", err);
      setError("Failed to add client. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (!user) return;
    
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        setLoading(true);
        await clientService.delete(user.id, id);
        await loadClients();
      } catch (err) {
        console.error("Error deleting client:", err);
        setError("Failed to delete client. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewClient = (id: string) => {
    router.push(`/clients/${id}`);
  };

  const handleEditClient = (id: string) => {
    router.push(`/clients/${id}/edit`);
  };

  const handleCreateInvoice = (clientId: string) => {
    router.push(`/invoices/new?client=${clientId}`);
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

        <div className="modern-card bg-background">
          <div className="p-6 pb-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Client List</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search clients..."
                    className="w-[250px] pl-8 rounded-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button 
                  variant="outline" 
                  className="rounded-full"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-6 text-red-500">
              {error}
            </div>
          )}

          <div className="p-6 pt-0">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-vibrant-yellow" />
              </div>
            ) : clients.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? "No clients found matching your search." : "No clients yet. Add your first client to get started."}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Invoices</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.companyName || '-'}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phone || '-'}</TableCell>
                      <TableCell>{client.totalInvoices || 0}</TableCell>
                      <TableCell>{formatCurrency(client.totalSpent || 0)}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleViewClient(client.id)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditClient(client.id)}>
                              Edit Client
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCreateInvoice(client.id)}>
                              Create Invoice
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeleteClient(client.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
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
