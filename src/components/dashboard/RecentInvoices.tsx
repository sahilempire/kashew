import React, { useState, useEffect } from "react";
import { FileText, MoreHorizontal, Eye, Trash, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
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
import { useAuth } from "@/contexts/AuthContext";
import { invoiceService, clientService } from "@/lib/database";
import { Invoice, Client } from "@/lib/models";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface RecentInvoicesProps {
  className?: string;
}

const statusStyles = {
  paid: {
    variant: "secondary" as const,
    label: "Paid",
    className: "bg-vibrant-green text-white hover:bg-vibrant-green",
  },
  pending: {
    variant: "outline" as const,
    label: "Pending",
    className: "bg-vibrant-yellow text-black hover:bg-vibrant-yellow",
  },
  overdue: {
    variant: "destructive" as const,
    label: "Overdue",
    className: "bg-vibrant-pink text-black hover:bg-vibrant-pink",
  },
  draft: {
    variant: "outline" as const,
    label: "Draft",
    className: "bg-gray-500 text-white hover:bg-gray-500",
  },
  cancelled: {
    variant: "outline" as const,
    label: "Cancelled",
    className: "bg-gray-400 text-white hover:bg-gray-400",
  },
};

const RecentInvoices = ({ className }: RecentInvoicesProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Record<string, Client>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get the 5 most recent invoices
      const invoicesData = await invoiceService.getAll(user.id);
      const recentInvoices = invoicesData
        .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
        .slice(0, 5);
      setInvoices(recentInvoices);
      
      // Load all clients to display their names
      const clientsData = await clientService.getAll(user.id);
      const clientsMap: Record<string, Client> = {};
      clientsData.forEach(client => {
        clientsMap[client.id] = client;
      });
      setClients(clientsMap);
    } catch (error) {
      console.error("Error loading recent invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients[clientId];
    if (!client) return "Unknown Client";
    return client.companyName || client.name || "Unknown Client";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewAll = () => {
    router.push("/invoices");
  };

  const handleViewDetails = (invoiceId: string) => {
    router.push(`/invoices/${invoiceId}`);
  };

  return (
    <div className={cn("modern-card w-full bg-background", className)}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Invoices</h2>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full"
            onClick={handleViewAll}
          >
            View All
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No invoices found</h3>
            <p className="text-muted-foreground mt-2">
              Create your first invoice to see it here.
            </p>
            <Button
              onClick={() => router.push("/invoices")}
              className="mt-4 rounded-full bg-vibrant-yellow text-black hover:bg-vibrant-yellow/90"
            >
              Create Invoice
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {invoice.invoiceNumber}
                  </TableCell>
                  <TableCell>{getClientName(invoice.client_id)}</TableCell>
                  <TableCell>{formatCurrency(invoice.total)}</TableCell>
                  <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                  <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={statusStyles[invoice.status as keyof typeof statusStyles]?.variant || "outline"}
                      className={
                        (statusStyles[invoice.status as keyof typeof statusStyles]?.className || "") +
                        " rounded-full px-3"
                      }
                    >
                      {statusStyles[invoice.status as keyof typeof statusStyles]?.label || invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewDetails(invoice.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Send className="mr-2 h-4 w-4" />
                          Send Invoice
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
  );
};

export default RecentInvoices;
