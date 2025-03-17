"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getCountryName } from "@/lib/taxUtils";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface InvoicePreviewProps {
  invoice: {
    number: string;
    date: string;
    dueDate: string;
    client?: {
      name: string;
      email: string;
    };
    clientName?: string;
    items: Array<{
      description: string;
      quantity: number;
      price: number;
    }>;
    country: string;
    taxRate: number;
    taxName: string;
    subtotal: number;
    taxAmount: number;
    total: number;
  };
}

export default function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Check if there are any items to display
  const hasItems = invoice.items && invoice.items.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-end print:hidden">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handlePrint}
          className="flex items-center gap-2"
          disabled={!hasItems}
        >
          <Printer className="h-4 w-4" />
          Print Invoice
        </Button>
      </div>
      
      {!hasItems ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground">Add at least one item to preview the invoice</p>
        </div>
      ) : (
        <Card className="border-dashed border-2 border-gray-200 bg-gray-50 print:border-none print:bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold">INVOICE</h2>
                <p className="text-muted-foreground">#{invoice.number}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">Your Company Name</p>
                <p className="text-sm text-muted-foreground">123 Business Street</p>
                <p className="text-sm text-muted-foreground">City, Country</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-2">Bill To:</h3>
                <p className="font-medium">{invoice.client?.name || invoice.clientName || "Client Name"}</p>
                <p className="text-sm text-muted-foreground">{invoice.client?.email || "client@example.com"}</p>
              </div>
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-2">Invoice Date:</h3>
                    <p>{formatDate(invoice.date)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-2">Due Date:</h3>
                    <p>{formatDate(invoice.dueDate)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-2">Country:</h3>
                    <p>{invoice.country ? getCountryName(invoice.country) : "Not specified"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold uppercase text-muted-foreground">Description</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold uppercase text-muted-foreground">Quantity</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold uppercase text-muted-foreground">Price</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold uppercase text-muted-foreground">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">{item.description || "No description"}</td>
                      <td className="text-right py-3 px-4">{item.quantity}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(item.price)}</td>
                      <td className="text-right py-3 px-4">
                        {formatCurrency(item.quantity * item.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <div className="w-1/3">
                <div className="flex justify-between py-2">
                  <span className="font-medium">Subtotal:</span>
                  <span>{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">{invoice.taxName} ({invoice.taxRate}%):</span>
                  <span>{formatCurrency(invoice.taxAmount)}</span>
                </div>
                <div className="flex justify-between py-2 text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>Thank you for your business!</p>
              <p className="mt-1">Payment is due by {formatDate(invoice.dueDate)}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 