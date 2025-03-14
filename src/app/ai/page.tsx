"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Send,
  Sparkles,
  FileText,
  RotateCcw,
  PieChart,
  BarChart3,
} from "lucide-react";
import { 
  clientService, 
  productService, 
  invoiceService, 
  reportService, 
  chartService 
} from "@/lib/database";
import SQLEditor from "@/components/sql/SQLEditor";
import { 
  Client,
  Product,
  Invoice,
  InvoiceItem as ModelInvoiceItem,
  Report,
  Chart,
  ChartDataPoint,
  ReportMetric
} from "@/lib/models";

const InvoicePreview = dynamic(
  () => import("@/components/invoices/InvoicePreview"),
  {
    ssr: false,
  }
);

// Add these interfaces at the top of the file after imports
interface ClientData extends Partial<Client> {
  name: string;
  email: string;
  phone: string;
  address: string;
  contactName: string;
}

interface ProductData extends Partial<Product> {
  name: string;
  type: "product" | "service";
  price: number;
  description: string;
  unit: string;
  taxRate: number;
}

interface InvoiceItem extends ModelInvoiceItem {
  description: string;
  quantity: number;
  price: number;
  taxRate: number;
}

interface InvoiceData extends Partial<Invoice> {
  client: {
    name: string;
    email: string;
    address: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  dueDate: string;
}

interface ChartData extends Partial<Chart> {
  type: "bar" | "pie";
  title: string;
  data: ChartDataPoint[];
}

interface ReportData extends Partial<Report> {
  title: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  summary: string;
  metrics: ReportMetric[];
  chartData: string;
}

type PreviewData = ClientData | ProductData | InvoiceData | ChartData | ReportData;

// Add these type guard functions after the interfaces and before the component
const isClientData = (data: PreviewData): data is ClientData => {
  return 'email' in data && 'phone' in data;
};

const isProductData = (data: PreviewData): data is ProductData => {
  return 'type' in data && 'price' in data;
};

const isInvoiceData = (data: PreviewData): data is InvoiceData => {
  return 'items' in data && 'subtotal' in data;
};

const isChartData = (data: PreviewData): data is ChartData => {
  return 'type' in data && 'data' in data;
};

const isReportData = (data: PreviewData): data is ReportData => {
  return 'period' in data && 'metrics' in data;
};

// Add this helper function after the type guards
const validatePeriod = (period: string): 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom' => {
  const validPeriods = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom'] as const;
  const normalizedPeriod = period.toLowerCase().trim();
  return validPeriods.includes(normalizedPeriod as any) 
    ? normalizedPeriod as typeof validPeriods[number]
    : 'custom';
};

export default function AIPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { role: string; content: string }[]
  >([
    {
      role: "system",
      content:
        "Hello! I'm your AI assistant. I can help you manage clients, products, invoices, and reports. Just tell me what you need.",
    },
  ]);

  const [previewType, setPreviewType] = useState<
    "none" | "client" | "product" | "invoice" | "report" | "chart"
  >("none");
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<PreviewData | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vibrant-yellow"></div>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message to chat history
    const newChatHistory = [...chatHistory, { role: "user", content: message }];
    setChatHistory(newChatHistory);

    // Process the message to determine intent
    const lowerMessage = message.toLowerCase();
    let aiResponse = "";
    let newPreviewType:
      | "none"
      | "client"
      | "product"
      | "invoice"
      | "report"
      | "chart" = previewType;
    let newPreviewData = previewData;

    // Check for edit intent
    if (
      (lowerMessage.includes("edit") ||
        lowerMessage.includes("update") ||
        lowerMessage.includes("change")) &&
      previewType !== "none" &&
      previewData
    ) {
      // User wants to edit the current preview
      aiResponse = `I've updated the ${previewType} with your changes.`;

      // Create a copy of the current preview data for editing
      let updatedData = { ...previewData };

      // Process based on preview type
      switch (previewType) {
        case "client":
          // Extract client information
          const nameMatch = message.match(
            /(?:company|client|name)[:\s]+([\w\s]+)[,\.\n]?/i
          );
          const emailMatch = message.match(/email[:\s]+([\w@\.]+)[,\.\n]?/i);
          const phoneMatch = message.match(
            /(?:phone|contact|number)[:\s]+([\d\-\(\)\s]+)[,\.\n]?/i
          );
          const addressMatch = message.match(
            /address[:\s]+([\w\s,\.]+)[,\.\n]?/i
          );
          const contactNameMatch = message.match(
            /(?:contact|person)[:\s]+([\w\s]+)[,\.\n]?/i
          );

          if (isClientData(updatedData)) {
            if (nameMatch) updatedData.name = nameMatch[1].trim();
            if (emailMatch) updatedData.email = emailMatch[1].trim();
            if (phoneMatch) updatedData.phone = phoneMatch[1].trim();
            if (addressMatch) updatedData.address = addressMatch[1].trim();
            if (contactNameMatch) updatedData.contactName = contactNameMatch[1].trim();
          }

          newPreviewData = updatedData;
          break;

        case "product":
          // Extract product information
          const productNameMatch = message.match(
            /(?:product|name)[:\s]+([\w\s]+)[,\.\n]?/i
          );
          const typeMatch = message.match(/type[:\s]+([\w\s]+)[,\.\n]?/i);
          const priceMatch = message.match(/price[:\s]+(\$?[\d\.]+)[,\.\n]?/i);
          const descriptionMatch = message.match(
            /description[:\s]+([\w\s,\.]+)[,\.\n]?/i
          );
          const unitMatch = message.match(/unit[:\s]+([\w\s]+)[,\.\n]?/i);
          const taxRateMatch = message.match(
            /(?:tax|rate)[:\s]+(\d+(?:\.\d+)?)[,\.\n%]?/i
          );

          if (isProductData(updatedData)) {
            if (productNameMatch) updatedData.name = productNameMatch[1].trim();
            if (typeMatch) {
              const type = typeMatch[1].trim().toLowerCase();
              updatedData.type = type.includes("service") ? "service" : "product";
            }
            if (priceMatch) updatedData.price = parseFloat(priceMatch[1].replace("$", ""));
            if (descriptionMatch) updatedData.description = descriptionMatch[1].trim();
            if (unitMatch) updatedData.unit = unitMatch[1].trim();
            if (taxRateMatch) updatedData.taxRate = parseFloat(taxRateMatch[1]);
          }

          newPreviewData = updatedData;
          break;

        case "invoice":
          // Extract invoice information
          const clientNameMatch = message.match(
            /client[:\s]+([\w\s]+)[,\.\n]?/i
          );
          const clientEmailMatch = message.match(
            /client\s+email[:\s]+([\w@\.]+)[,\.\n]?/i
          );
          const dueDateMatch = message.match(
            /(?:due|date)[:\s]+(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}-\d{1,2}-\d{1,2})[,\.\n]?/i
          );

          if (isInvoiceData(updatedData)) {
            if (clientNameMatch || clientEmailMatch) {
              const updatedClient = { ...updatedData.client };
              if (clientNameMatch) updatedClient.name = clientNameMatch[1].trim();
              if (clientEmailMatch) updatedClient.email = clientEmailMatch[1].trim();
              updatedData.client = updatedClient;
            }
            if (dueDateMatch) updatedData.dueDate = dueDateMatch[1].trim();

            // Check for item updates or additions
            const itemMatches = message.matchAll(
              /item[:\s]+([\w\s]+)[\s,]+(?:qty|quantity)?[:\s]*(\d+)[\s,]+(?:price)?[:\s]*\$?(\d+(?:\.\d+)?)/gi
            );

            const itemsArray = Array.from(itemMatches);
            if (itemsArray.length > 0) {
              // If specific items are mentioned, update or add them
              const updatedItems = [...updatedData.items];

              itemsArray.forEach((match, index) => {
                const description = match[1].trim();
                const quantity = parseInt(match[2], 10);
                const price = parseFloat(match[3]);

                // Try to find an existing item with similar description
                const existingItemIndex = updatedItems.findIndex(
                  (item) =>
                    item.description
                      .toLowerCase()
                      .includes(description.toLowerCase()) ||
                    description
                      .toLowerCase()
                      .includes(item.description.toLowerCase())
                );

                if (existingItemIndex !== -1) {
                  // Update existing item
                  updatedItems[existingItemIndex] = {
                    description,
                    quantity,
                    price,
                    taxRate: updatedItems[existingItemIndex].taxRate,
                  };
                } else if (index < updatedItems.length) {
                  // Update item at current index
                  updatedItems[index] = {
                    description,
                    quantity,
                    price,
                    taxRate: updatedItems[index].taxRate,
                  };
                } else {
                  // Add new item
                  updatedItems.push({
                    description,
                    quantity,
                    price,
                    taxRate: updatedItems[index].taxRate,
                  });
                }
              });

              // Recalculate totals
              const subtotal = updatedItems.reduce(
                (sum, item) => sum + item.quantity * item.price,
                0
              );
              const tax = subtotal * 0.1; // 10% tax

              updatedData.items = updatedItems;
              updatedData.subtotal = subtotal;
              updatedData.tax = tax;
              updatedData.total = subtotal + tax;
            }
          }

          newPreviewData = updatedData;
          break;

        case "chart":
          // Extract chart information
          const chartTitleMatch = message.match(
            /title[:\s]+([\w\s]+)[,\.\n]?/i
          );
          const chartTypeMatch = message.match(
            /(?:type|chart)[:\s]+([\w\s]+)[,\.\n]?/i
          );

          if (isChartData(updatedData)) {
            if (chartTitleMatch) updatedData.title = chartTitleMatch[1].trim();
            if (chartTypeMatch) {
              const type = chartTypeMatch[1].trim().toLowerCase();
              updatedData.type = type.includes("pie") ? "pie" : "bar";
            }
            // Check for data updates
            const dataMatches = message.matchAll(
              /([\w\s]+)[:\s]+\$?(\d+(?:\.\d+)?)[,\.\n]?/gi
            );

            const dataArray = Array.from(dataMatches);
            if (dataArray.length > 0) {
              const updatedChartData = [...updatedData.data];

              dataArray.forEach((match, index) => {
                const label = match[1].trim();
                const value = parseFloat(match[2]);

                // Try to find an existing data point with similar label
                const existingDataIndex = updatedChartData.findIndex(
                  (data) =>
                    data.label.toLowerCase().includes(label.toLowerCase()) ||
                    label.toLowerCase().includes(data.label.toLowerCase())
                );

                if (existingDataIndex !== -1) {
                  // Update existing data point
                  updatedChartData[existingDataIndex] = {
                    ...updatedChartData[existingDataIndex],
                    label,
                    value,
                  };
                } else if (index < updatedChartData.length) {
                  // Update data point at current index
                  updatedChartData[index] = {
                    ...updatedChartData[index],
                    label,
                    value,
                  };
                }
              });

              updatedData.data = updatedChartData;
            }
          }

          newPreviewData = updatedData;
          break;

        case "report":
          // Extract report information
          const reportTitleMatch = message.match(
            /title[:\s]+([\w\s]+)[,\.\n]?/i
          );
          const periodMatch = message.match(/period[:\s]+([\w\s]+)[,\.\n]?/i);
          const summaryMatch = message.match(
            /summary[:\s]+([\w\s,\.]+)[,\.\n]?/i
          );

          if (isReportData(updatedData)) {
            if (reportTitleMatch) updatedData.title = reportTitleMatch[1].trim();
            if (periodMatch) updatedData.period = validatePeriod(periodMatch[1]);
            if (summaryMatch) updatedData.summary = summaryMatch[1].trim();

            // Check for metric updates
            const metricRegex = /([\w\s]+)[:\s]+(\$?[\d,\.]+)(?:[,\s]+([+\-][\d\.]+%?))?/gi;
            let match;
            const updatedMetrics = [...updatedData.metrics];
            let index = 0;

            while ((match = metricRegex.exec(message)) !== null) {
              const [_, label, valueStr, changeStr] = match;
              if (label && valueStr) {
                const value = parseFloat(valueStr.replace(/[$,]/g, ''));
                const change = changeStr || '';
                const changeType = change.startsWith('+') ? 'increase' : change.startsWith('-') ? 'decrease' : 'neutral';

                if (index === updatedMetrics.length) {
                  updatedMetrics.push({
                    label: label.trim(),
                    value,
                    change,
                    changeType
                  });
                } else if (index < updatedMetrics.length) {
                  updatedMetrics[index] = {
                    ...updatedMetrics[index],
                    label: label.trim(),
                    value,
                    change,
                    changeType
                  };
                }
                index++;
              }
            }

            if (updatedMetrics.length > 0) {
              updatedData = {
                ...updatedData,
                metrics: updatedMetrics
              };
            }
          }

          newPreviewData = updatedData;
          break;
      }

      setPreviewData(newPreviewData);
    }
    // Check for client creation intent
    else if (
      lowerMessage.includes("add client") ||
      lowerMessage.includes("new client") ||
      lowerMessage.includes("create client")
    ) {
      aiResponse =
        "I've prepared a new client based on the information you provided. Please review the details and confirm if everything looks correct.";
      newPreviewType = "client";

      // Extract client information (simplified example)
      const nameMatch = message.match(/name[:\s]+([\w\s]+)[,\.\n]?/i);
      const emailMatch = message.match(/email[:\s]+([\w@\.]+)[,\.\n]?/i);
      const phoneMatch = message.match(/phone[:\s]+([\d\-\(\)\s]+)[,\.\n]?/i);

      newPreviewData = {
        name: nameMatch ? nameMatch[1].trim() : "New Client",
        email: emailMatch ? emailMatch[1].trim() : "client@example.com",
        phone: phoneMatch ? phoneMatch[1].trim() : "(555) 123-4567",
        address: "123 Business St, City",
        contactName: nameMatch ? nameMatch[1].trim().split(" ")[0] : "Contact",
      };
    }
    // Check for product/service creation intent
    else if (
      lowerMessage.includes("add product") ||
      lowerMessage.includes("new product") ||
      lowerMessage.includes("add service") ||
      lowerMessage.includes("new service")
    ) {
      aiResponse =
        "I've prepared a new product/service based on the information you provided. Please review the details and confirm if everything looks correct.";
      newPreviewType = "product";

      const isService = lowerMessage.includes("service");
      const nameMatch = message.match(/name[:\s]+([\w\s]+)[,\.\n]?/i);
      const priceMatch = message.match(/price[:\s]+(\$?[\d\.]+)[,\.\n]?/i);
      const descriptionMatch = message.match(
        /description[:\s]+([\w\s,\.]+)[,\.\n]?/i
      );

      newPreviewData = {
        name: nameMatch
          ? nameMatch[1].trim()
          : isService
            ? "New Service"
            : "New Product",
        type: isService ? "service" : "product",
        price: priceMatch ? parseFloat(priceMatch[1].replace("$", "")) : 99.99,
        description: descriptionMatch
          ? descriptionMatch[1].trim()
          : "Description not provided",
        unit: isService ? "Hour" : "Item",
        taxRate: 10,
      };
    }
    // Check for invoice creation intent
    else if (
      lowerMessage.includes("create invoice") ||
      lowerMessage.includes("new invoice") ||
      lowerMessage.includes("generate invoice")
    ) {
      aiResponse =
        "I've prepared an invoice based on the information you provided. Please review the details and confirm if everything looks correct.";
      newPreviewType = "invoice";

      const clientMatch = message.match(/client[:\s]+([\w\s]+)[,\.\n]?/i);
      const clientName = clientMatch ? clientMatch[1].trim() : "Sample Client";

      // Try to extract items (very simplified)
      const items = [];
      const itemMatches = message.matchAll(
        /item[:\s]+([\w\s]+)[\s,]+(?:qty|quantity)?[:\s]*(\d+)[\s,]+(?:price)?[:\s]*\$?(\d+(?:\.\d+)?)/gi
      );

      for (const match of Array.from(itemMatches)) {
        items.push({
          description: match[1].trim(),
          quantity: parseInt(match[2], 10),
          price: parseFloat(match[3]),
          taxRate: 10,
        });
      }

      // If no items were extracted, add a default item
      if (items.length === 0) {
        items.push({
          description: "Professional Services",
          quantity: 1,
          price: 100,
          taxRate: 10,
        });
      }

      const subtotal = items.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );
      const tax = subtotal * 0.1; // 10% tax

      newPreviewData = {
        client: {
          name: clientName,
          email: `${clientName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
          address: "123 Client Street, City",
        },
        items: items,
        subtotal: subtotal,
        tax: tax,
        total: subtotal + tax,
        dueDate: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
      };
    }
    // Check for chart/graph creation intent
    else if (
      lowerMessage.includes("chart") ||
      lowerMessage.includes("graph") ||
      lowerMessage.includes("visualization")
    ) {
      aiResponse =
        "I've created a custom chart based on your request. You can view it in the preview panel.";
      newPreviewType = "chart";

      // Determine chart type
      const isPieChart = lowerMessage.includes("pie");
      const chartType = isPieChart ? "pie" as const : "bar" as const;

      // Determine data to visualize
      const showPaid = lowerMessage.includes("paid");
      const showOverdue = lowerMessage.includes("overdue");
      const showPending =
        lowerMessage.includes("pending") || lowerMessage.includes("due");

      // Default to showing all if none specified
      const showAll = !showPaid && !showOverdue && !showPending;

      // Create chart data
      const chartData: ChartData = {
        type: chartType,
        title: `Invoice ${chartType === "pie" ? "Distribution" : "Summary"}`,
        data: [
          { label: "Paid", value: 32910, color: "#1e9f6e" },
          { label: "Pending", value: 12340, color: "#f5d742" },
          { label: "Overdue", value: 5670, color: "#f472b6" }
        ].filter((item, index) => {
          if (showAll) return true;
          if (index === 0 && showPaid) return true;
          if (index === 1 && showPending) return true;
          if (index === 2 && showOverdue) return true;
          return false;
        })
      };

      newPreviewData = chartData;
    }
    // Check for report generation intent
    else if (
      lowerMessage.includes("report") ||
      lowerMessage.includes("analytics") ||
      lowerMessage.includes("summary")
    ) {
      aiResponse =
        "I've generated a report based on your request. Please review the summary below.";
      newPreviewType = "report";

      const reportType = lowerMessage.includes("revenue")
        ? "revenue"
        : lowerMessage.includes("client")
          ? "clients"
          : lowerMessage.includes("invoice")
            ? "invoices"
            : "general";

      let period = "custom";
      if (lowerMessage.includes("month")) period = "monthly";
      else if (lowerMessage.includes("year")) period = "yearly";
      else if (lowerMessage.includes("week")) period = "weekly";
      else if (lowerMessage.includes("quarter")) period = "quarterly";
      else if (lowerMessage.includes("day")) period = "daily";

      const defaultMetrics: ReportMetric[] = [
        { label: "Total Revenue", value: 45250, change: "+12.5%", changeType: "increase" as const },
        { label: "Average Invoice", value: 2850, change: "+5.2%", changeType: "increase" as const },
        { label: "Active Clients", value: 18, change: "+4", changeType: "increase" as const },
        { label: "Outstanding Invoices", value: 12340, change: "-3.1%", changeType: "decrease" as const }
      ];

      newPreviewData = {
        title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
        period: validatePeriod(period),
        summary: "This is an AI-generated report summary based on your request.",
        metrics: [...defaultMetrics],
        chartData: "Chart visualization would appear here"
      };
    } else {
      aiResponse =
        "I'm here to help you manage clients, products, invoices, and reports. You can ask me to create a new client, add a product or service, generate an invoice, create a chart, or create a report.";
    }

    // Update preview state
    setPreviewType(newPreviewType);
    setPreviewData(newPreviewData);

    // Add AI response to chat history
    setTimeout(() => {
      setChatHistory([
        ...newChatHistory,
        { role: "assistant", content: aiResponse },
      ]);
    }, 500);

    // Clear message after processing
    setMessage("");
  };

  const handleEdit = () => {
    if (previewType !== "none" && previewData) {
      setIsEditing(true);
      setEditedData({ ...previewData });
      
      // Add guidance message to chat
      const editGuidanceMessage = getEditGuidanceMessage(previewType);
      setChatHistory([
        ...chatHistory,
        { role: "assistant", content: editGuidanceMessage },
      ]);
    }
  };

  const handleSaveToSupabase = async () => {
    if (!user || !previewType || !previewData) return;

    try {
      let savedData;
      switch (previewType) {
        case "client":
          if (isClientData(previewData)) {
            savedData = await clientService.create(user.id, {
              ...previewData,
              user_id: user.id
            });
          }
          break;
        case "product":
          if (isProductData(previewData)) {
            savedData = await productService.create(user.id, {
              ...previewData,
              user_id: user.id
            });
          }
          break;
        case "invoice":
          if (isInvoiceData(previewData)) {
            savedData = await invoiceService.create(user.id, {
              ...previewData,
              user_id: user.id
            });
          }
          break;
        case "report":
          if (isReportData(previewData)) {
            savedData = await reportService.create(user.id, {
              ...previewData,
              user_id: user.id
            });
          }
          break;
        case "chart":
          if (isChartData(previewData)) {
            savedData = await chartService.create(user.id, {
              ...previewData,
              user_id: user.id
            });
          }
          break;
      }

      if (!savedData) {
        throw new Error("Failed to save data");
      }

      // Add success message to chat
      setChatHistory([
        ...chatHistory,
        {
          role: "assistant",
          content: `Successfully saved the ${previewType} to your dashboard! ID: ${savedData.id}`,
        },
      ]);

      // Clear preview
      setPreviewType("none");
      setPreviewData(null);
    } catch (error) {
      console.error("Error saving data:", error);
      setChatHistory([
        ...chatHistory,
        {
          role: "assistant",
          content: `Error saving the ${previewType}. Please try again. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      ]);
    }
  };

  const handleSaveEdit = async () => {
    if (!user || !editedData) return;
    
    try {
      let savedData;
      // Save to Supabase
      switch (previewType) {
        case "client":
          if (isClientData(editedData)) {
            savedData = await clientService.create(user.id, {
              ...editedData,
              user_id: user.id
            });
          }
          break;
        case "product":
          if (isProductData(editedData)) {
            savedData = await productService.create(user.id, {
              ...editedData,
              user_id: user.id
            });
          }
          break;
        case "invoice":
          if (isInvoiceData(editedData)) {
            savedData = await invoiceService.create(user.id, {
              ...editedData,
              user_id: user.id
            });
          }
          break;
        case "report":
          if (isReportData(editedData)) {
            savedData = await reportService.create(user.id, {
              ...editedData,
              user_id: user.id
            });
          }
          break;
        case "chart":
          if (isChartData(editedData)) {
            savedData = await chartService.create(user.id, {
              ...editedData,
              user_id: user.id
            });
          }
          break;
      }

      if (!savedData) {
        throw new Error("Failed to save edited data");
      }

      setPreviewData(editedData);
      setIsEditing(false);

      // Add success message
      setChatHistory([
        ...chatHistory,
        {
          role: "assistant",
          content: `Successfully saved the edited ${previewType} to your dashboard! ID: ${savedData.id}`,
        },
      ]);

      // Clear states
      setPreviewType("none");
      setPreviewData(null);
      setEditedData(null);
    } catch (error) {
      console.error("Error saving edited data:", error);
      setChatHistory([
        ...chatHistory,
        {
          role: "assistant",
          content: `Error saving the edited ${previewType}. Please try again. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      ]);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Helper function to validate data before saving
  const validateData = (type: string, data: any): boolean => {
    switch (type) {
      case "client":
        return !!(data.name && data.email);
      case "product":
        return !!(data.name && data.price && data.type);
      case "invoice":
        return !!(data.client && data.items && data.items.length > 0);
      case "report":
        return !!(data.title && data.period && data.metrics);
      case "chart":
        return !!(data.title && data.type);
      default:
        return false;
    }
  };

  // Helper function to generate guidance messages for editing through chat
  const getEditGuidanceMessage = (type: string): string => {
    switch (type) {
      case "client":
        return (
          "You can edit this client by typing in the chat. For example:\n\n" +
          '"Update the client with company name: Ampersand, email: contact@ampersand.co, phone: (555) 123-4567, address: 123 Tech Lane, San Francisco"'
        );

      case "product":
        return (
          "You can edit this product by typing in the chat. For example:\n\n" +
          '"Update the product with name: Premium Package, type: service, price: 299.99, description: Comprehensive service package, unit: hour, tax rate: 8.5"'
        );

      case "invoice":
        return (
          "You can edit this invoice by typing in the chat. For example:\n\n" +
          '"Update the invoice with client: Ampersand, due date: 12/31/2023, item: Web Development, qty: 40, price: 125, item: UI Design, qty: 20, price: 150"'
        );

      case "chart":
        return (
          "You can edit this chart by typing in the chat. For example:\n\n" +
          '"Update the chart with title: Revenue by Quarter, type: pie, Paid: $45000, Pending: $12500, Overdue: $3200"'
        );

      case "report":
        return (
          "You can edit this report by typing in the chat. For example:\n\n" +
          '"Update the report with title: Q4 Performance, period: Quarterly, summary: Strong growth in all key metrics, Total Revenue: $125,000 +15%, New Clients: 12 +20%"'
        );

      default:
        return "You can edit this by typing your changes in the chat.";
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedData(null);
  };

  const handleSwitchToRetro = () => {
    router.push("/dashboard");
  };

  // Real-time preview update as user types
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage);

    // Process message in real-time for preview
    const lowerMessage = newMessage.toLowerCase();

    // Check for chart/graph creation intent
    if (
      lowerMessage.includes("chart") ||
      lowerMessage.includes("graph") ||
      lowerMessage.includes("visualization")
    ) {
      setPreviewType("chart");

      // Determine chart type
      const isPieChart = lowerMessage.includes("pie");
      const chartType = isPieChart ? "pie" as const : "bar" as const;

      // Determine data to visualize
      const showPaid = lowerMessage.includes("paid");
      const showOverdue = lowerMessage.includes("overdue");
      const showPending =
        lowerMessage.includes("pending") || lowerMessage.includes("due");

      // Default to showing all if none specified
      const showAll = !showPaid && !showOverdue && !showPending;

      // Create chart data
      const chartData: ChartData = {
        type: chartType,
        title: `Invoice ${chartType === "pie" ? "Distribution" : "Summary"}`,
        data: [
          { label: "Paid", value: 32910, color: "#1e9f6e" },
          { label: "Pending", value: 12340, color: "#f5d742" },
          { label: "Overdue", value: 5670, color: "#f472b6" }
        ].filter((item, index) => {
          if (showAll) return true;
          if (index === 0 && showPaid) return true;
          if (index === 1 && showPending) return true;
          if (index === 2 && showOverdue) return true;
          return false;
        })
      };

      setPreviewData(chartData);
    }
    // Check for client creation intent
    else if (lowerMessage.includes("client")) {
      setPreviewType("client");

      // Extract client information in real-time
      const nameMatch = newMessage.match(/name[:\s]+([\w\s]+)[,\.\n]?/i);
      const emailMatch = newMessage.match(/email[:\s]+([\w@\.]+)[,\.\n]?/i);
      const phoneMatch = newMessage.match(
        /phone[:\s]+([\d\-\(\)\s]+)[,\.\n]?/i
      );

      setPreviewData({
        name: nameMatch ? nameMatch[1].trim() : "New Client",
        email: emailMatch ? emailMatch[1].trim() : "client@example.com",
        phone: phoneMatch ? phoneMatch[1].trim() : "(555) 123-4567",
        address: "123 Business St, City",
        contactName: nameMatch ? nameMatch[1].trim().split(" ")[0] : "Contact",
      });
    }
    // Check for product/service creation intent
    else if (
      lowerMessage.includes("product") ||
      lowerMessage.includes("service")
    ) {
      setPreviewType("product");

      const isService = lowerMessage.includes("service");
      const nameMatch = newMessage.match(/name[:\s]+([\w\s]+)[,\.\n]?/i);
      const priceMatch = newMessage.match(/price[:\s]+(\$?[\d\.]+)[,\.\n]?/i);
      const descriptionMatch = newMessage.match(
        /description[:\s]+([\w\s,\.]+)[,\.\n]?/i
      );

      setPreviewData({
        name: nameMatch
          ? nameMatch[1].trim()
          : isService
            ? "New Service"
            : "New Product",
        type: isService ? "service" : "product",
        price: priceMatch ? parseFloat(priceMatch[1].replace("$", "")) : 99.99,
        description: descriptionMatch
          ? descriptionMatch[1].trim()
          : "Description not provided",
        unit: isService ? "Hour" : "Item",
        taxRate: 10,
      });
    }
    // Check for invoice creation intent
    else if (lowerMessage.includes("invoice")) {
      setPreviewType("invoice");

      const clientMatch = newMessage.match(/client[:\s]+([\w\s]+)[,\.\n]?/i);
      const clientName = clientMatch ? clientMatch[1].trim() : "Sample Client";

      // Try to extract items in real-time
      const items = [];
      const itemMatches = newMessage.matchAll(
        /item[:\s]+([\w\s]+)[\s,]+(?:qty|quantity)?[:\s]*(\d+)[\s,]+(?:price)?[:\s]*\$?(\d+(?:\.\d+)?)/gi
      );

      for (const match of Array.from(itemMatches)) {
        items.push({
          description: match[1].trim(),
          quantity: parseInt(match[2], 10),
          price: parseFloat(match[3]),
          taxRate: 10,
        });
      }

      // If no items were extracted, add a default item
      if (items.length === 0) {
        items.push({
          description: "Professional Services",
          quantity: 1,
          price: 100,
          taxRate: 10,
        });
      }

      const subtotal = items.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );
      const tax = subtotal * 0.1; // 10% tax

      setPreviewData({
        client: {
          name: clientName,
          email: `${clientName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
          address: "123 Client Street, City",
        },
        items: items,
        subtotal: subtotal,
        tax: tax,
        total: subtotal + tax,
        dueDate: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
      });
    }
    // Check for report generation intent
    else if (
      lowerMessage.includes("report") ||
      lowerMessage.includes("analytics") ||
      lowerMessage.includes("summary")
    ) {
      setPreviewType("report");

      const reportType = lowerMessage.includes("revenue")
        ? "revenue"
        : lowerMessage.includes("client")
          ? "clients"
          : lowerMessage.includes("invoice")
            ? "invoices"
            : "general";

      let period = "custom";
      if (lowerMessage.includes("month")) period = "monthly";
      else if (lowerMessage.includes("year")) period = "yearly";
      else if (lowerMessage.includes("week")) period = "weekly";
      else if (lowerMessage.includes("quarter")) period = "quarterly";
      else if (lowerMessage.includes("day")) period = "daily";

      const defaultMetrics: ReportMetric[] = [
        { label: "Total Revenue", value: 45250, change: "+12.5%", changeType: "increase" as const },
        { label: "Average Invoice", value: 2850, change: "+5.2%", changeType: "increase" as const },
        { label: "Active Clients", value: 18, change: "+4", changeType: "increase" as const },
        { label: "Outstanding Invoices", value: 12340, change: "-3.1%", changeType: "decrease" as const }
      ];

      setPreviewData({
        title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
        period: validatePeriod(period),
        summary: "This is an AI-generated report summary based on your request.",
        metrics: [...defaultMetrics],
        chartData: "Chart visualization would appear here"
      });
    } else if (newMessage.trim() === "") {
      // Clear preview if message is empty
      setPreviewType("none");
      setPreviewData(null);
    }
  };

  const handleEditChange = (field: string, value: any) => {
    setEditedData((prev: PreviewData | null) => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const getDefaultQuery = (type: string, data: any) => {
    switch (type) {
      case "client":
        return `
-- Create a new client
INSERT INTO clients (name, email, phone, address, contact_name, user_id)
VALUES (
  '${data.name}',
  '${data.email}',
  '${data.phone}',
  '${data.address}',
  '${data.contactName}',
  '${user?.id}'
);

-- Get all clients for current user
SELECT * FROM clients WHERE user_id = '${user?.id}';
        `.trim();

      case "product":
        return `
-- Create a new product
INSERT INTO products (name, type, price, description, unit, tax_rate, user_id)
VALUES (
  '${data.name}',
  '${data.type}',
  ${data.price},
  '${data.description}',
  '${data.unit}',
  ${data.taxRate},
  '${user?.id}'
);

-- Get all products for current user
SELECT * FROM products WHERE user_id = '${user?.id}';
        `.trim();

      case "invoice":
        return `
-- Create a new invoice
INSERT INTO invoices (client_id, items, subtotal, tax, total, due_date, user_id)
VALUES (
  '${data.client.id}',
  '${JSON.stringify(data.items)}',
  ${data.subtotal},
  ${data.tax},
  ${data.total},
  '${data.dueDate}',
  '${user?.id}'
);

-- Get all invoices with client details for current user
SELECT i.*, c.name as client_name, c.email as client_email 
FROM invoices i
LEFT JOIN clients c ON i.client_id = c.id
WHERE i.user_id = '${user?.id}';
        `.trim();

      case "report":
        return `
-- Create a new report
INSERT INTO reports (title, period, summary, metrics, chart_data, user_id)
VALUES (
  '${data.title}',
  '${data.period}',
  '${data.summary}',
  '${JSON.stringify(data.metrics)}',
  '${data.chartData}',
  '${user?.id}'
);

-- Get all reports for current user
SELECT * FROM reports WHERE user_id = '${user?.id}';
        `.trim();

      case "chart":
        return `
-- Create a new chart
INSERT INTO charts (type, title, data, user_id)
VALUES (
  '${data.type}',
  '${data.title}',
  '${JSON.stringify(data.data)}',
  '${user?.id}'
);

-- Get all charts for current user
SELECT * FROM charts WHERE user_id = '${user?.id}';
        `.trim();

      default:
        return "";
    }
  };

  const renderPreview = () => {
    if (!previewData) return null;

    switch (previewType) {
      case "client":
        return (
          <Card className="modern-card overflow-hidden border-2 border-vibrant-yellow/30 hover:border-vibrant-yellow/60 shadow-[0_0_15px_rgba(245,215,66,0.15)] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  {isClientData(previewData) && (
                    <>
                      <h3 className="text-xl font-bold">{previewData.name}</h3>
                      <p className="text-muted-foreground">Client Information</p>
                    </>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    className="rounded-full"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={handleSaveToSupabase}
                    className="rounded-full bg-vibrant-yellow text-vibrant-black hover:bg-vibrant-yellow/90"
                  >
                    Save Client
                  </Button>
                </div>
              </div>

              {isClientData(previewData) && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p>{previewData.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <p>{previewData.phone}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Address</p>
                    <p>{previewData.address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contact Person</p>
                    <p>{previewData.contactName}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case "product":
        return (
          <Card className="modern-card overflow-hidden border-2 border-vibrant-yellow/30 hover:border-vibrant-yellow/60 shadow-[0_0_15px_rgba(245,215,66,0.15)] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  {isProductData(previewData) && (
                    <>
                      <h3 className="text-xl font-bold">{previewData.name}</h3>
                      <p className="text-muted-foreground">Product Information</p>
                    </>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    className="rounded-full"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={handleSaveToSupabase}
                    className="rounded-full bg-vibrant-yellow text-vibrant-black hover:bg-vibrant-yellow/90"
                  >
                    Save Product
                  </Button>
                </div>
              </div>

              {isProductData(previewData) && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Type</p>
                      <p className="capitalize">{previewData.type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Price</p>
                      <p>${previewData.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p>{previewData.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Unit</p>
                      <p>{previewData.unit}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tax Rate</p>
                      <p>{previewData.taxRate}%</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case "invoice":
        return (
          <Card className="modern-card overflow-hidden border-2 border-vibrant-yellow/30 hover:border-vibrant-yellow/60 shadow-[0_0_15px_rgba(245,215,66,0.15)] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  {isInvoiceData(previewData) && (
                    <>
                      <h3 className="text-xl font-bold">Invoice for {previewData.client.name}</h3>
                      <p className="text-muted-foreground">Due on {new Date(previewData.dueDate).toLocaleDateString()}</p>
                    </>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    className="rounded-full"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={handleSaveToSupabase}
                    className="rounded-full bg-vibrant-yellow text-vibrant-black hover:bg-vibrant-yellow/90"
                  >
                    Save Invoice
                  </Button>
                </div>
              </div>

              {isInvoiceData(previewData) && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="font-medium">Client Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p>{previewData.client.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Address</p>
                        <p>{previewData.client.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Items</h4>
                    <div className="space-y-2">
                      {previewData.items.map((item, index) => (
                        <div key={index} className="grid grid-cols-4 gap-4 p-2 rounded-lg bg-muted/50">
                          <div className="col-span-2">
                            <p className="font-medium">{item.description}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} x ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p>${(item.quantity * item.price).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Subtotal</p>
                      <p>${previewData.subtotal.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Tax</p>
                      <p>${previewData.tax.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between font-medium">
                      <p>Total</p>
                      <p>${previewData.total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case "report":
        return (
          <Card className="modern-card overflow-hidden border-2 border-vibrant-yellow/30 hover:border-vibrant-yellow/60 shadow-[0_0_15px_rgba(245,215,66,0.15)] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  {isReportData(previewData) && (
                    <>
                      <h3 className="text-xl font-bold">{previewData.title}</h3>
                      <p className="text-muted-foreground capitalize">{previewData.period} Report</p>
                    </>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    className="rounded-full"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={handleSaveToSupabase}
                    className="rounded-full bg-vibrant-yellow text-vibrant-black hover:bg-vibrant-yellow/90"
                  >
                    Save Report
                  </Button>
                </div>
              </div>

              {isReportData(previewData) && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Summary</h4>
                    <p className="text-muted-foreground">{previewData.summary}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Key Metrics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {previewData.metrics.map((metric, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg bg-muted/50"
                        >
                          <p className="text-sm font-medium">{metric.label}</p>
                          <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold">
                              ${metric.value.toLocaleString()}
                            </p>
                            {metric.change && (
                              <p
                                className={
                                  metric.change.startsWith("+")
                                    ? "text-green-500"
                                    : "text-red-500"
                                }
                              >
                                {metric.change}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case "chart":
        return (
          <Card className="modern-card overflow-hidden border-2 border-vibrant-yellow/30 hover:border-vibrant-yellow/60 shadow-[0_0_15px_rgba(245,215,66,0.15)] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  {isChartData(previewData) && (
                    <>
                      <h3 className="text-xl font-bold">{previewData.title}</h3>
                      <p className="text-muted-foreground">Custom visualization</p>
                    </>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    className="rounded-full"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={handleSaveToSupabase}
                    className="rounded-full bg-vibrant-yellow text-vibrant-black hover:bg-vibrant-yellow/90"
                  >
                    Save Chart
                  </Button>
                </div>
              </div>

              {isChartData(previewData) && (
                previewData.type === "pie" ? (
                  <div className="h-[300px] flex items-center justify-center relative">
                    <div className="w-[250px] h-[250px] rounded-full relative overflow-hidden">
                      {previewData.data.map((item, index) => {
                        const total = previewData.data.reduce(
                          (sum, d) => sum + d.value,
                          0
                        );
                        const startAngle = previewData.data
                          .slice(0, index)
                          .reduce(
                            (sum, d) =>
                              sum + (d.value / total) * 360,
                            0
                          );
                        const angle = (item.value / total) * 360;

                        return (
                          <div
                            key={index}
                            className="absolute top-0 left-0 w-full h-full origin-center"
                            style={{
                              transform: `rotate(${startAngle}deg)`,
                              clipPath: `polygon(50% 50%, 50% 0%, ${angle <= 180 ? "100% 0%" : "100% 0%, 100% 100%"}, ${angle <= 90 ? "50% 50%" : angle <= 180 ? "100% 100%, 50% 50%" : angle <= 270 ? "100% 100%, 0% 100%, 50% 50%" : "100% 100%, 0% 100%, 0% 0%, 50% 50%"})`,
                            }}
                          >
                            <div
                              className="w-full h-full"
                              style={{ backgroundColor: item.color }}
                            />
                          </div>
                        );
                      })}
                      <div className="absolute inset-[25%] rounded-full bg-background flex items-center justify-center">
                        <span className="text-xl font-bold">Total</span>
                      </div>
                    </div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 space-y-2">
                      {previewData.data.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-sm"
                            style={{ backgroundColor: item.color }}
                          />
                          <span>
                            {item.label}: ${item.value.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-[300px] w-full pt-6">
                    <div className="flex h-full items-end justify-between gap-4 border-b border-l">
                      {previewData.data.map((item, index) => {
                        const maxValue = Math.max(
                          ...previewData.data.map((d) => d.value)
                        );
                        const height = (item.value / maxValue) * 100;

                        return (
                          <div
                            key={index}
                            className="flex flex-col items-center gap-2 w-full"
                          >
                            <div
                              className="w-full max-w-[80px] rounded-t-md transition-all duration-500 animate-in slide-in-from-bottom-4"
                              style={{
                                height: `${height * 2}px`,
                                backgroundColor: item.color,
                                animationDelay: `${index * 150}ms`,
                              }}
                            />
                            <div className="text-sm font-medium">
                              {item.label}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ${item.value.toLocaleString()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-[100px] py-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Image
                src="/images/Kashew.png"
                alt="Kashew Logo"
                height={24}
                width={24}
                className="object-contain"
              />
              <span className="ml-2">Kashew</span>
            </h1>

            <p className="text-muted-foreground">
              Your intelligent business companion
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="gap-2 rounded-full border border-vibrant-yellow text-vibrant-black/80 
              relative overflow-hidden transition-all duration-300 ease-in-out 
              bg-gradient-to-r from-vibrant-yellow/10 to-transparent 
              shadow-[0_0_10px_rgba(255,223,0,0.4)] 
              before:absolute before:inset-0 before:bg-gradient-radial 
              before:from-vibrant-yellow/10 before:via-transparent before:to-transparent 
              before:opacity-50 before:blur-lg before:transition-opacity before:duration-500 
              hover:bg-vibrant-yellow/20 hover:shadow-[0_0_20px_rgba(255,223,0,0.8)] 
              hover:scale-105 hover:before:opacity-100"
              onClick={handleSwitchToRetro}
            >
              <RotateCcw className="h-4 w-4" />
              Switch to Retro Mode
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-full"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-220px)]">
          {/* Chat Section */}
          <Card className="modern-card bg-background h-full flex flex-col overflow-hidden border-2 border-vibrant-yellow/30 hover:border-vibrant-yellow/60 shadow-[0_0_15px_rgba(245,215,66,0.15)] transition-all duration-300 relative">
            {/* AI-themed decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-vibrant-yellow/10 via-transparent to-transparent rounded-br-full"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-vibrant-yellow/10 via-transparent to-transparent rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-vibrant-yellow/10 via-transparent to-transparent rounded-tr-full"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-vibrant-yellow/10 via-transparent to-transparent rounded-tl-full"></div>
            </div>

            <CardContent className="p-6 flex-1 flex flex-col h-full relative">
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-vibrant-yellow/30 scrollbar-track-transparent pr-2">
                {chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-xl shadow-sm ${
                        msg.role === "user"
                          ? "bg-vibrant-yellow text-vibrant-black font-medium border-2 border-vibrant-yellow relative after:absolute after:top-1/2 after:-right-2 after:w-2 after:h-2 after:bg-vibrant-yellow after:transform after:-translate-y-1/2 after:rotate-45"
                          : "bg-muted border border-border backdrop-blur-sm bg-opacity-80 relative after:absolute after:top-1/2 after:-left-2 after:w-2 after:h-2 after:bg-muted after:transform after:-translate-y-1/2 after:rotate-45 after:border-l after:border-b after:border-border"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 sticky bottom-0 mt-auto">
                <div className="relative flex-1 group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-vibrant-yellow via-vibrant-yellow/70 to-vibrant-yellow rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-300 group-hover:duration-200 animate-gradient-x"></div>
                  <Input
                    placeholder={
                      previewType !== "none" && previewData
                        ? `Edit this ${previewType} or ask me to create something new...`
                        : "Ask me to create clients, products, invoices, charts, or generate reports..."
                    }
                    value={message}
                    onChange={handleMessageChange}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="relative bg-background rounded-lg border-0 focus-visible:ring-2 focus-visible:ring-vibrant-yellow focus-visible:ring-offset-0 transition-all duration-300 shadow-sm"
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  className="bg-vibrant-yellow text-vibrant-black hover:bg-vibrant-yellow/90 transition-all duration-300 hover:scale-105 active:scale-95 rounded-lg shadow-md relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-vibrant-yellow via-vibrant-yellow/70 to-vibrant-yellow opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Send className="h-4 w-4 relative z-10" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <div className="h-full flex flex-col">
            {previewType === "none" || !previewData ? (
              renderPreview()
            ) : (
              <div className="relative">
                {/* AI-themed decorative elements for preview */}
                <div className="absolute -inset-4 bg-gradient-to-r from-vibrant-yellow/20 via-transparent to-vibrant-yellow/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {renderPreview()}
              </div>
            )}
          </div>
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
  );
} 