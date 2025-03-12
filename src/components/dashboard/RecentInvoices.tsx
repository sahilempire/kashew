import React from "react";
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

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  date: string;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
}

interface RecentInvoicesProps {
  invoices?: Invoice[];
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
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const RecentInvoices = ({ invoices = [], className }: RecentInvoicesProps) => {
  // Default mock data if no invoices are provided
  const defaultInvoices: Invoice[] = [
    {
      id: "INV-001",
      invoiceNumber: "INV-001",
      clientName: "Acme Corporation",
      amount: 1250.0,
      date: "2023-05-15",
      dueDate: "2023-06-15",
      status: "paid",
    },
    {
      id: "INV-002",
      invoiceNumber: "INV-002",
      clientName: "Globex Industries",
      amount: 3450.75,
      date: "2023-05-20",
      dueDate: "2023-06-20",
      status: "pending",
    },
    {
      id: "INV-003",
      invoiceNumber: "INV-003",
      clientName: "Wayne Enterprises",
      amount: 5670.25,
      date: "2023-04-10",
      dueDate: "2023-05-10",
      status: "overdue",
    },
    {
      id: "INV-004",
      invoiceNumber: "INV-004",
      clientName: "Stark Industries",
      amount: 2340.5,
      date: "2023-05-25",
      dueDate: "2023-06-25",
      status: "pending",
    },
    {
      id: "INV-005",
      invoiceNumber: "INV-005",
      clientName: "Umbrella Corporation",
      amount: 1890.0,
      date: "2023-05-05",
      dueDate: "2023-06-05",
      status: "paid",
    },
  ];

  const displayInvoices = invoices.length > 0 ? invoices : defaultInvoices;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={cn("modern-card w-full bg-background", className)}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Invoices</h2>
          <Button variant="outline" size="sm" className="rounded-full">
            View All
          </Button>
        </div>

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
            {displayInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  {invoice.invoiceNumber}
                </TableCell>
                <TableCell>{invoice.clientName}</TableCell>
                <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                <TableCell>{formatDate(invoice.date)}</TableCell>
                <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                <TableCell>
                  <Badge
                    variant={statusStyles[invoice.status].variant}
                    className={
                      statusStyles[invoice.status].className +
                      " rounded-full px-3"
                    }
                  >
                    {statusStyles[invoice.status].label}
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
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Send className="mr-2 h-4 w-4" />
                        Send Invoice
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
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
  );
};

export default RecentInvoices;
