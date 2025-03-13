"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, FileText, MoreHorizontal, Loader2 } from "lucide-react";
import AddInvoiceModal from "@/components/modals/AddInvoiceModal";
import { useAuth } from "@/contexts/AuthContext";
import { invoiceService, clientService } from "@/lib/database";
import { Invoice, Client } from "@/lib/models";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/utils";

export default function InvoicesPage() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Record<string, Client>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadInvoices();
    }
  }, [user, statusFilter]);

  const loadInvoices = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Load invoices based on status filter
      const invoicesData = await invoiceService.getAll(user.id, statusFilter !== "all" ? statusFilter : undefined);
      setInvoices(invoicesData);
      
      // Load all clients to display their names
      const clientsData = await clientService.getAll(user.id);
      const clientsMap: Record<string, Client> = {};
      clientsData.forEach(client => {
        clientsMap[client.id] = client;
      });
      setClients(clientsMap);
    } catch (error) {
      console.error("Error loading invoices:", error);
      setError("Failed to load invoices. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      if (searchQuery.trim()) {
        const results = await invoiceService.search(user.id, searchQuery);
        setInvoices(results);
      } else {
        loadInvoices();
      }
    } catch (error) {
      console.error("Error searching invoices:", error);
      toast.error("Failed to search invoices");
    } finally {
      setLoading(false);
    }
  };

  const handleAddInvoice = async (data: any) => {
    if (!user) return;
    
    setLoading(true);
    try {
      await invoiceService.create(user.id, data);
      toast.success("Invoice created successfully");
      loadInvoices();
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    if (!user) return;
    
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      setLoading(true);
      try {
        await invoiceService.delete(user.id, id);
        toast.success("Invoice deleted successfully");
        loadInvoices();
      } catch (error) {
        console.error("Error deleting invoice:", error);
        toast.error("Failed to delete invoice");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled') => {
    if (!user) return;
    
    setLoading(true);
    try {
      await invoiceService.update(user.id, id, { status: newStatus });
      toast.success(`Invoice marked as ${newStatus}`);
      loadInvoices();
    } catch (error) {
      console.error("Error updating invoice status:", error);
      toast.error("Failed to update invoice status");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "overdue":
        return <Badge className="bg-red-500">Overdue</Badge>;
      case "draft":
        return <Badge className="bg-gray-500">Draft</Badge>;
      case "cancelled":
        return <Badge className="bg-gray-400">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients[clientId];
    if (!client) return "Unknown Client";
    return client.name || client.companyName || "Unknown Client";
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="rounded-full bg-vibrant-yellow text-black hover:bg-vibrant-yellow/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Invoice
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search invoices..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Invoices</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No invoices found</h3>
          <p className="text-muted-foreground mt-2">
            {searchQuery
              ? "No invoices match your search criteria."
              : "Get started by creating your first invoice."}
          </p>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 rounded-full bg-vibrant-yellow text-black hover:bg-vibrant-yellow/90"
          >
            <Plus className="mr-2 h-4 w-4" /> Create Invoice
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    {invoice.invoiceNumber}
                  </TableCell>
                  <TableCell>{getClientName(invoice.client_id)}</TableCell>
                  <TableCell>
                    {format(new Date(invoice.issueDate), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(invoice.dueDate), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{formatCurrency(invoice.total)}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => window.location.href = `/invoices/${invoice.id}`}>
                          View Details
                        </DropdownMenuItem>
                        {invoice.status === "draft" && (
                          <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, "pending")}>
                            Mark as Pending
                          </DropdownMenuItem>
                        )}
                        {invoice.status === "pending" && (
                          <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, "paid")}>
                            Mark as Paid
                          </DropdownMenuItem>
                        )}
                        {(invoice.status === "draft" || invoice.status === "pending") && (
                          <DropdownMenuItem onClick={() => handleDeleteInvoice(invoice.id)}>
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AddInvoiceModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={handleAddInvoice}
      />
    </div>
  );
}
