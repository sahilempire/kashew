"use client";

import React, { useState } from "react";
import AIInvoiceGenerator from "@/components/ai/AIInvoiceGenerator";
import InvoiceTemplateCustomizer from "@/components/invoices/InvoiceTemplateCustomizer";
import InvoiceTemplateSelector from "@/components/invoices/InvoiceTemplateSelector";
import dynamic from "next/dynamic";

const InvoicePreview = dynamic(
  () => import("@/components/invoices/InvoicePreview"),
  {
    ssr: false,
  },
);
import { Button } from "@/components/ui/button";
import {
  FileText,
  Plus,
  Sparkles,
  Send,
  LayoutDashboard,
  Users,
  ShoppingBag,
  CreditCard,
  BarChart3,
  Settings,
} from "lucide-react";
import AddInvoiceModal from "@/components/modals/AddInvoiceModal";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

export default function InvoicesPage() {
  const router = useRouter();
  const [addInvoiceOpen, setAddInvoiceOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [customization, setCustomization] = useState({
    colors: {
      primary: "#f5d742", // vibrant-yellow
      secondary: "#ffffff",
      text: "#000000",
    },
    typography: {
      font: "inter",
      size: 14,
    },
    logo: {
      enabled: false,
      url: "",
    },
  });
  const [showPreview, setShowPreview] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>({
    client: {
      name: "Sample Client",
      email: "client@example.com",
      address: "123 Client Street, City",
    },
    items: [
      { description: "Website Design", quantity: 1, price: 1200 },
      { description: "Hosting (1 year)", quantity: 1, price: 200 },
    ],
    subtotal: 1400,
    tax: 140,
    total: 1540,
    dueDate: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    ).toLocaleDateString(),
  });

  // Recent invoices data
  const invoicesData = [
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
    {
      id: "INV-006",
      invoiceNumber: "INV-006",
      clientName: "Oscorp Industries",
      amount: 4250.0,
      date: "2023-05-28",
      dueDate: "2023-06-28",
      status: "pending",
    },
    {
      id: "INV-007",
      invoiceNumber: "INV-007",
      clientName: "LexCorp",
      amount: 7800.0,
      date: "2023-05-02",
      dueDate: "2023-06-02",
      status: "paid",
    },
    {
      id: "INV-008",
      invoiceNumber: "INV-008",
      clientName: "Cyberdyne Systems",
      amount: 3200.0,
      date: "2023-04-20",
      dueDate: "2023-05-20",
      status: "overdue",
    },
  ];

  const handleAddInvoice = (data: any) => {
    console.log("New invoice data:", data);
    // In a real app, we would add the invoice to the database
  };

  const handleGenerateInvoice = (data: any) => {
    setInvoiceData(data);
    setShowPreview(true);
  };

  const handleSendInvoice = () => {
    // In a real app, we would send the invoice
    console.log("Sending invoice:", invoiceData);
    setShowPreview(false);
    // Show success message or redirect
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar for retro mode */}
        <div className="w-[300px] bg-vibrant-black text-white h-screen fixed left-0 top-0 transition-all duration-300 ease-in-out">
          <div className="flex h-16 items-center px-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-vibrant-yellow p-1">
                <FileText className="h-6 w-6 text-black" />
              </div>
              <span className="font-bold text-xl text-white">Kashew</span>
            </div>
          </div>

          <nav
            className="flex flex-col gap-1 p-4 mt-4"
            style={{ contain: "content" }}
          >
            {[
              {
                title: "Dashboard",
                href: "/",
                icon: <LayoutDashboard className="h-5 w-5" />,
              },
              {
                title: "Invoices",
                href: "/invoices",
                icon: <FileText className="h-5 w-5" />,
              },
              {
                title: "Clients",
                href: "/clients",
                icon: <Users className="h-5 w-5" />,
              },
              {
                title: "Products & Services",
                href: "/products",
                icon: <ShoppingBag className="h-5 w-5" />,
              },
              {
                title: "Payments",
                href: "/payments",
                icon: <CreditCard className="h-5 w-5" />,
              },
              {
                title: "Reports",
                href: "/reports",
                icon: <BarChart3 className="h-5 w-5" />,
              },
              {
                title: "Settings",
                href: "/settings",
                icon: <Settings className="h-5 w-5" />,
              },
            ].map((item) => (
              <Button
                key={item.href}
                variant={item.href === "/invoices" ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 px-3 py-2 h-10 ${item.href === "/invoices" ? "bg-vibrant-yellow text-black font-medium" : "text-white/80 font-normal hover:text-white hover:bg-white/10"}`}
                onClick={() => router.push(item.href)}
              >
                {item.icon}
                <span>{item.title}</span>
              </Button>
            ))}
          </nav>
        </div>

        {/* Main content with proper spacing */}
        <div className="ml-[300px] mr-[100px] flex-1 p-6 transition-all duration-300 ease-in-out">
          <div className="space-y-6 pb-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-vibrant-yellow p-2">
                  <FileText className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Invoices</h1>
                  <p className="text-muted-foreground">
                    Manage and track your invoices
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="gap-2 rounded-full"
                  onClick={() => router.push("/ai")}
                >
                  <Sparkles className="h-4 w-4" />
                  Switch to AI Mode
                </Button>
                <Button
                  className="gap-2 rounded-full bg-vibrant-yellow text-black hover:bg-vibrant-yellow/90"
                  onClick={() => setAddInvoiceOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  New Invoice
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="modern-card bg-vibrant-green p-6 transform transition-all duration-300 hover:scale-[1.02]">
                <div className="rounded-full bg-white/10 p-3 w-fit">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-white/70">Paid Invoices</p>
                  <h3 className="text-3xl font-bold text-white">$32,910</h3>
                  <p className="text-sm text-white/70 mt-1">3 invoices</p>
                </div>
                <div className="text-right text-xs text-white/50 mt-2">
                  Response time: 0.14s
                </div>
              </div>

              <div className="modern-card bg-vibrant-yellow p-6 transform transition-all duration-300 hover:scale-[1.02]">
                <div className="rounded-full bg-black/10 p-3 w-fit">
                  <FileText className="h-6 w-6 text-black" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-black/70">Pending Invoices</p>
                  <h3 className="text-3xl font-bold text-black">$12,340</h3>
                  <p className="text-sm text-black/70 mt-1">3 invoices</p>
                </div>
                <div className="text-right text-xs text-black/50 mt-2">
                  Response time: 0.12s
                </div>
              </div>

              <div className="modern-card bg-vibrant-pink p-6 transform transition-all duration-300 hover:scale-[1.02]">
                <div className="rounded-full bg-black/10 p-3 w-fit">
                  <FileText className="h-6 w-6 text-black" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-black/70">Overdue Invoices</p>
                  <h3 className="text-3xl font-bold text-black">$5,670</h3>
                  <p className="text-sm text-black/70 mt-1">2 invoices</p>
                </div>
                <div className="text-right text-xs text-black/50 mt-2">
                  Response time: 0.11s
                </div>
              </div>
            </div>

            {/* AI Chat and Invoice Preview Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AIInvoiceGenerator onGenerate={handleGenerateInvoice} />

              {showPreview ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Invoice Preview</h3>
                    <Button
                      onClick={handleSendInvoice}
                      className="gap-2 rounded-full bg-vibrant-green text-white hover:bg-vibrant-green/90"
                    >
                      <Send className="h-4 w-4" />
                      Send Invoice
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Select Template</h4>
                    <InvoiceTemplateSelector
                      selectedTemplate={selectedTemplate}
                      onSelectTemplate={setSelectedTemplate}
                      className="mb-4"
                    />
                    <h4 className="text-sm font-medium mt-8">
                      Customize Invoice
                    </h4>
                    <InvoiceTemplateCustomizer
                      templateId={selectedTemplate}
                      onTemplateChange={setSelectedTemplate}
                      customization={customization}
                      onCustomizationChange={setCustomization}
                    />
                  </div>
                  <InvoicePreview
                    templateId={selectedTemplate}
                    invoiceData={invoiceData}
                    className="mt-4"
                    customization={customization}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full bg-muted/30 rounded-xl p-8 text-center">
                  <div>
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No Invoice Preview</h3>
                    <p className="text-muted-foreground mt-2">
                      Use the AI assistant to generate an invoice or create one
                      manually.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Add Invoice Modal */}
            <AddInvoiceModal
              open={addInvoiceOpen}
              onOpenChange={setAddInvoiceOpen}
              onSubmit={handleAddInvoice}
            />
          </div>
          {/* Footer */}
          <div className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
            <p>
              Kashew by{" "}
              <a
                href="https://ampvc.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vibrant-yellow hover:underline"
              >
                Ampersand
              </a>
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
