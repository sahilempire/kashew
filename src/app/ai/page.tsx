"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Send,
  Sparkles,
  FileText,
  RotateCcw,
  PieChart,
  BarChart3,
} from "lucide-react";
import dynamic from "next/dynamic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const InvoicePreview = dynamic(
  () => import("@/components/invoices/InvoicePreview"),
  {
    ssr: false,
  }
);
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AIPage() {
  const router = useRouter();
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
  const [previewData, setPreviewData] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>(null);

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

          // Update only the fields mentioned in the message
          if (nameMatch) updatedData.name = nameMatch[1].trim();
          if (emailMatch) updatedData.email = emailMatch[1].trim();
          if (phoneMatch) updatedData.phone = phoneMatch[1].trim();
          if (addressMatch) updatedData.address = addressMatch[1].trim();
          if (contactNameMatch)
            updatedData.contactName = contactNameMatch[1].trim();

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

          // Update only the fields mentioned in the message
          if (productNameMatch) updatedData.name = productNameMatch[1].trim();
          if (typeMatch) {
            const type = typeMatch[1].trim().toLowerCase();
            updatedData.type = type.includes("service") ? "Service" : "Product";
          }
          if (priceMatch)
            updatedData.price = parseFloat(priceMatch[1].replace("$", ""));
          if (descriptionMatch)
            updatedData.description = descriptionMatch[1].trim();
          if (unitMatch) updatedData.unit = unitMatch[1].trim();
          if (taxRateMatch) updatedData.taxRate = parseFloat(taxRateMatch[1]);

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

          // Update client information if mentioned
          if (clientNameMatch || clientEmailMatch) {
            const updatedClient = { ...updatedData.client };
            if (clientNameMatch) updatedClient.name = clientNameMatch[1].trim();
            if (clientEmailMatch)
              updatedClient.email = clientEmailMatch[1].trim();
            updatedData.client = updatedClient;
          }

          // Update due date if mentioned
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
                };
              } else if (index < updatedItems.length) {
                // Update item at current index
                updatedItems[index] = {
                  description,
                  quantity,
                  price,
                };
              } else {
                // Add new item
                updatedItems.push({
                  description,
                  quantity,
                  price,
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

          // Update chart title if mentioned
          if (chartTitleMatch) updatedData.title = chartTitleMatch[1].trim();

          // Update chart type if mentioned
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

          // Update report fields if mentioned
          if (reportTitleMatch) updatedData.title = reportTitleMatch[1].trim();
          if (periodMatch) updatedData.period = periodMatch[1].trim();
          if (summaryMatch) updatedData.summary = summaryMatch[1].trim();

          // Check for metric updates
          const metricMatches = message.matchAll(
            /([\w\s]+)[:\s]+(\$?[\d,\.]+)(?:[,\s]+([+\-][\d\.]+%?))?/gi
          );

          const metricsArray = Array.from(metricMatches);
          if (metricsArray.length > 0) {
            const updatedMetrics = [...updatedData.metrics];

            metricsArray.forEach((match, index) => {
              const name = match[1].trim();
              const value = match[2].trim();
              const change = match[3] ? match[3].trim() : "";

              // Try to find an existing metric with similar name
              const existingMetricIndex = updatedMetrics.findIndex(
                (metric) =>
                  metric.name.toLowerCase().includes(name.toLowerCase()) ||
                  name.toLowerCase().includes(metric.name.toLowerCase())
              );

              if (existingMetricIndex !== -1) {
                // Update existing metric
                updatedMetrics[existingMetricIndex] = {
                  name,
                  value,
                  change: change || updatedMetrics[existingMetricIndex].change,
                };
              } else if (index < updatedMetrics.length) {
                // Update metric at current index
                updatedMetrics[index] = {
                  name,
                  value,
                  change: change || "+0%",
                };
              }
            });

            updatedData.metrics = updatedMetrics;
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
        type: isService ? "Service" : "Product",
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
        });
      }

      // If no items were extracted, add a default item
      if (items.length === 0) {
        items.push({
          description: "Professional Services",
          quantity: 1,
          price: 100,
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
      const chartType = isPieChart ? "pie" : "bar";

      // Determine data to visualize
      const showPaid = lowerMessage.includes("paid");
      const showOverdue = lowerMessage.includes("overdue");
      const showPending =
        lowerMessage.includes("pending") || lowerMessage.includes("due");

      // Default to showing all if none specified
      const showAll = !showPaid && !showOverdue && !showPending;

      // Create chart data
      const chartData = {
        type: chartType,
        title: `Invoice ${chartType === "pie" ? "Distribution" : "Summary"}`,
        data: [
          showPaid || showAll
            ? { label: "Paid", value: 32910, color: "#1e9f6e" }
            : null,
          showPending || showAll
            ? { label: "Pending", value: 12340, color: "#f5d742" }
            : null,
          showOverdue || showAll
            ? { label: "Overdue", value: 5670, color: "#f472b6" }
            : null,
        ].filter(Boolean),
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

      newPreviewData = {
        title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
        period: lowerMessage.includes("month")
          ? "Monthly"
          : lowerMessage.includes("year")
            ? "Yearly"
            : lowerMessage.includes("week")
              ? "Weekly"
              : "Custom",
        summary:
          "This is an AI-generated report summary based on your request.",
        metrics: [
          { name: "Total Revenue", value: "$45,250", change: "+12.5%" },
          { name: "Average Invoice", value: "$2,850", change: "+5.2%" },
          { name: "Active Clients", value: "18", change: "+4" },
          { name: "Outstanding Invoices", value: "$12,340", change: "-3.1%" },
        ],
        chartData: "Chart visualization would appear here",
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

  const handleConfirm = () => {
    // Debugging logs
    console.log('Confirm & Save clicked');
    console.log('Preview Type:', previewType);
    console.log('Preview Data:', previewData);

    // Save data to the backend
    const saveToBackend = async () => {
      try {
        // In a real app, this would be an API call to save the data
        // For now, we'll simulate a successful save
        console.log(`Saving ${previewType} data to backend:`, previewData);

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Add confirmation message to chat history
        const confirmationMessage = `I've saved the ${previewType} to your dashboard. You can access it there anytime.`;
        setChatHistory([
          ...chatHistory,
          { role: "assistant", content: confirmationMessage },
        ]);

        // Store in localStorage as a temporary backend
        const existingData = JSON.parse(
          localStorage.getItem("kashewData") || "{}"
        );
        const updatedData = {
          ...existingData,
          [previewType]: [
            ...(existingData[previewType] || []),
            {
              id: Date.now().toString(),
              ...previewData,
              createdAt: new Date().toISOString(),
            },
          ],
        };
        localStorage.setItem("kashewData", JSON.stringify(updatedData));

        // Reset preview state
        setPreviewType("none");
        setPreviewData(null);
      } catch (error) {
        console.error("Error saving data:", error);
        setChatHistory([
          ...chatHistory,
          {
            role: "assistant",
            content:
              "Sorry, there was an error saving your data. Please try again.",
          },
        ]);
      }
    };

    // Execute the save function
    saveToBackend();
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
      const chartType = isPieChart ? "pie" : "bar";

      // Determine data to visualize
      const showPaid = lowerMessage.includes("paid");
      const showOverdue = lowerMessage.includes("overdue");
      const showPending =
        lowerMessage.includes("pending") || lowerMessage.includes("due");

      // Default to showing all if none specified
      const showAll = !showPaid && !showOverdue && !showPending;

      // Create chart data
      const chartData = {
        type: chartType,
        title: `Invoice ${chartType === "pie" ? "Distribution" : "Summary"}`,
        data: [
          showPaid || showAll
            ? { label: "Paid", value: 32910, color: "#1e9f6e" }
            : null,
          showPending || showAll
            ? { label: "Pending", value: 12340, color: "#f5d742" }
            : null,
          showOverdue || showAll
            ? { label: "Overdue", value: 5670, color: "#f472b6" }
            : null,
        ].filter(Boolean),
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
        type: isService ? "Service" : "Product",
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
        });
      }

      // If no items were extracted, add a default item
      if (items.length === 0) {
        items.push({
          description: "Professional Services",
          quantity: 1,
          price: 100,
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

      setPreviewData({
        title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
        period: lowerMessage.includes("month")
          ? "Monthly"
          : lowerMessage.includes("year")
            ? "Yearly"
            : lowerMessage.includes("week")
              ? "Weekly"
              : "Custom",
        summary:
          "This is an AI-generated report summary based on your request.",
        metrics: [
          { name: "Total Revenue", value: "$45,250", change: "+12.5%" },
          { name: "Average Invoice", value: "$2,850", change: "+5.2%" },
          { name: "Active Clients", value: "18", change: "+4" },
          { name: "Outstanding Invoices", value: "$12,340", change: "-3.1%" },
        ],
        chartData: "Chart visualization would appear here",
      });
    } else if (newMessage.trim() === "") {
      // Clear preview if message is empty
      setPreviewType("none");
      setPreviewData(null);
    }
  };

  const handleEdit = () => {
    // If using the button to edit, provide guidance in the chat about text editing
    if (previewType !== "none" && previewData) {
      const editGuidanceMessage = getEditGuidanceMessage(previewType);
      setChatHistory([
        ...chatHistory,
        { role: "assistant", content: editGuidanceMessage },
      ]);
    }

    setIsEditing(true);
    setEditedData({ ...previewData });
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

  const handleSaveEdit = () => {
    // Update the preview data with edited data
    setPreviewData(editedData);
    setIsEditing(false);

    // Add a message to the chat history
    const editMessage = `I've updated the ${previewType} with your changes. Click "Confirm & Save" to save it to your dashboard.`;
    setChatHistory([
      ...chatHistory,
      { role: "assistant", content: editMessage },
    ]);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedData(null);
  };

  const handleEditChange = (field: string, value: any) => {
    setEditedData({
      ...editedData,
      [field]: value,
    });
  };

  const renderPreview = () => {
    if (previewType === "none" || !previewData) {
      return (
        <div className="flex items-center justify-center h-full bg-muted/30 rounded-xl p-8 text-center border-2 border-dashed border-vibrant-yellow/30 hover:border-vibrant-yellow/60 transition-all duration-300 shadow-[0_0_15px_rgba(245,215,66,0.1)]">
          <div>
            <Sparkles className="h-12 w-12 text-vibrant-yellow mx-auto mb-4 animate-pulse-subtle" />
            <h3 className="text-lg font-medium">AI Assistant</h3>
            <p className="text-muted-foreground mt-2">
              Ask me to create clients, products, invoices, or generate reports.
            </p>
          </div>
        </div>
      );
    }

    switch (previewType) {
      case "chart":
        return (
          <Card className="modern-card overflow-hidden border-2 border-vibrant-yellow/30 hover:border-vibrant-yellow/60 shadow-[0_0_15px_rgba(245,215,66,0.15)] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold">{previewData.title}</h3>
                  <p className="text-muted-foreground">Custom visualization</p>
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
                    onClick={handleConfirm}
                    className="rounded-full bg-vibrant-yellow text-vibrant-black hover:bg-vibrant-yellow/90"
                  >
                    Save Chart
                  </Button>
                </div>
              </div>

              {previewData.type === "pie" ? (
                <div className="h-[300px] flex items-center justify-center relative">
                  <div className="w-[250px] h-[250px] rounded-full relative overflow-hidden">
                    {previewData.data.map((item: any, index: number) => {
                      const total = previewData.data.reduce(
                        (sum: number, d: any) => sum + d.value,
                        0
                      );
                      const startAngle = previewData.data
                        .slice(0, index)
                        .reduce(
                          (sum: number, d: any) =>
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
                    {previewData.data.map((item: any, index: number) => (
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
                    {previewData.data.map((item: any, index: number) => {
                      const maxValue = Math.max(
                        ...previewData.data.map((d: any) => d.value)
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
              )}
            </CardContent>
          </Card>
        );

      case "client":
        return (
          <Card className="modern-card overflow-hidden border-2 border-vibrant-yellow/30 hover:border-vibrant-yellow/60 shadow-[0_0_15px_rgba(245,215,66,0.15)] transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Client Preview</h3>
              {isEditing && previewType === "client" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Company Name
                      </p>
                      <Input
                        value={editedData.name}
                        onChange={(e) =>
                          handleEditChange("name", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Contact Name
                      </p>
                      <Input
                        value={editedData.contactName}
                        onChange={(e) =>
                          handleEditChange("contactName", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <Input
                        value={editedData.email}
                        onChange={(e) =>
                          handleEditChange("email", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <Input
                        value={editedData.phone}
                        onChange={(e) =>
                          handleEditChange("phone", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <Input
                      value={editedData.address}
                      onChange={(e) =>
                        handleEditChange("address", e.target.value)
                      }
                    />
                  </div>
                  <div className="pt-4 flex justify-end gap-3">
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="rounded-full"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveEdit}
                      className="rounded-full bg-vibrant-yellow text-vibrant-black hover:bg-vibrant-yellow/90"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Company Name
                      </p>
                      <p className="font-medium">{previewData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Contact Name
                      </p>
                      <p className="font-medium">{previewData.contactName}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{previewData.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{previewData.phone}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{previewData.address}</p>
                  </div>
                  <div className="pt-4 flex justify-end gap-3">
                    <Button
                      onClick={handleEdit}
                      variant="outline"
                      className="rounded-full"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={handleConfirm}
                      className="rounded-full bg-vibrant-yellow text-vibrant-black hover:bg-vibrant-yellow/90"
                    >
                      Confirm & Save
                    </Button>
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
              <h3 className="text-xl font-bold mb-4">
                {previewData.type} Preview
              </h3>
              {isEditing && previewType === "product" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <Input
                        value={editedData.name}
                        onChange={(e) =>
                          handleEditChange("name", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <Select
                        value={editedData.type}
                        onValueChange={(value) =>
                          handleEditChange("type", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Product">Product</SelectItem>
                          <SelectItem value="Service">Service</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <Textarea
                      value={editedData.description}
                      onChange={(e) =>
                        handleEditChange("description", e.target.value)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <Input
                        type="number"
                        value={editedData.price}
                        onChange={(e) =>
                          handleEditChange("price", parseFloat(e.target.value))
                        }
                      />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Unit</p>
                      <Input
                        value={editedData.unit}
                        onChange={(e) =>
                          handleEditChange("unit", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tax Rate</p>
                      <Input
                        type="number"
                        value={editedData.taxRate}
                        onChange={(e) =>
                          handleEditChange(
                            "taxRate",
                            parseFloat(e.target.value)
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end gap-3">
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="rounded-full"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveEdit}
                      className="rounded-full bg-vibrant-yellow text-vibrant-black hover:bg-vibrant-yellow/90"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{previewData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="font-medium">{previewData.type}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="font-medium">{previewData.description}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="font-medium">
                        ${previewData.price.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Unit</p>
                      <p className="font-medium">{previewData.unit}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tax Rate</p>
                      <p className="font-medium">{previewData.taxRate}%</p>
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end gap-3">
                    <Button
                      onClick={handleEdit}
                      variant="outline"
                      className="rounded-full"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={handleConfirm}
                      className="rounded-full bg-vibrant-yellow text-vibrant-black hover:bg-vibrant-yellow/90"
                    >
                      Confirm & Save
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case "invoice":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Invoice Preview</h3>
              {isEditing && previewType === "invoice" ? (
                <div className="flex gap-3">
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    className="rounded-full"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    className="rounded-full bg-vibrant-yellow text-vibrant-black hover:bg-vibrant-yellow/90"
                  >
                    Save Changes
                  </Button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    className="rounded-full"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    className="rounded-full bg-vibrant-yellow text-vibrant-black hover:bg-vibrant-yellow/90"
                  >
                    Confirm & Save
                  </Button>
                </div>
              )}
            </div>

            {isEditing && previewType === "invoice" ? (
              <Card className="modern-card overflow-hidden border-2 border-vibrant-yellow/30 hover:border-vibrant-yellow/60 shadow-[0_0_15px_rgba(245,215,66,0.15)] transition-all duration-300">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium mb-2">
                        Client Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Client
                          </p>
                          <Input
                            value={editedData.client.name}
                            onChange={(e) => {
                              const updatedClient = {
                                ...editedData.client,
                                name: e.target.value,
                              };
                              handleEditChange("client", updatedClient);
                            }}
                          />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Due Date
                          </p>
                          <Input
                            value={editedData.dueDate}
                            onChange={(e) =>
                              handleEditChange("dueDate", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">
                        Invoice Items
                      </h4>
                      {editedData.items.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="grid grid-cols-12 gap-2 mb-2"
                        >
                          <div className="col-span-6">
                            <Input
                              value={item.description}
                              onChange={(e) => {
                                const updatedItems = [...editedData.items];
                                updatedItems[index] = {
                                  ...item,
                                  description: e.target.value,
                                };
                                handleEditChange("items", updatedItems);
                              }}
                              placeholder="Description"
                            />
                          </div>
                          <div className="col-span-2">
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const updatedItems = [...editedData.items];
                                updatedItems[index] = {
                                  ...item,
                                  quantity: parseInt(e.target.value),
                                };

                                // Recalculate totals
                                const subtotal = updatedItems.reduce(
                                  (sum, item) =>
                                    sum + item.quantity * item.price,
                                  0
                                );
                                const tax = subtotal * 0.1;
                                const total = subtotal + tax;

                                setEditedData({
                                  ...editedData,
                                  items: updatedItems,
                                  subtotal,
                                  tax,
                                  total,
                                });
                              }}
                              placeholder="Qty"
                            />
                          </div>
                          <div className="col-span-2">
                            <Input
                              type="number"
                              value={item.price}
                              onChange={(e) => {
                                const updatedItems = [...editedData.items];
                                updatedItems[index] = {
                                  ...item,
                                  price: parseFloat(e.target.value),
                                };

                                // Recalculate totals
                                const subtotal = updatedItems.reduce(
                                  (sum, item) =>
                                    sum + item.quantity * item.price,
                                  0
                                );
                                const tax = subtotal * 0.1;
                                const total = subtotal + tax;

                                setEditedData({
                                  ...editedData,
                                  items: updatedItems,
                                  subtotal,
                                  tax,
                                  total,
                                });
                              }}
                              placeholder="Price"
                            />
                          </div>
                          <div className="col-span-2 flex items-center">
                            ${(item.quantity * item.price).toFixed(2)}
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        className="mt-2"
                        onClick={() => {
                          const updatedItems = [
                            ...editedData.items,
                            {
                              description: "New Item",
                              quantity: 1,
                              price: 0,
                            },
                          ];
                          handleEditChange("items", updatedItems);
                        }}
                      >
                        Add Item
                      </Button>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-2">
                        <span>Subtotal:</span>
                        <span>${editedData.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Tax (10%):</span>
                        <span>${editedData.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>${editedData.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="modern-card overflow-hidden border-2 border-vibrant-yellow/30 hover:border-vibrant-yellow/60 shadow-[0_0_15px_rgba(245,215,66,0.15)] transition-all duration-300">
                <CardContent className="p-0">
                  <Tabs defaultValue="preview">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                      <TabsTrigger value="templates">Templates</TabsTrigger>
                    </TabsList>
                    <TabsContent value="preview" className="mt-0">
                      <InvoicePreview
                        invoiceData={previewData}
                        templateId={selectedTemplate}
                      />
                    </TabsContent>
                    <TabsContent value="templates" className="mt-0">
                      <div className="grid grid-cols-3 gap-4 p-4">
                        <div
                          className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                            selectedTemplate === 1
                              ? "border-vibrant-yellow"
                              : "border-transparent"
                          }`}
                          onClick={() => setSelectedTemplate(1)}
                        >
                          <InvoicePreview
                            invoiceData={previewData}
                            templateId={1}
                            scale={0.8}
                          />
                        </div>
                        <div
                          className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                            selectedTemplate === 2
                              ? "border-vibrant-yellow"
                              : "border-transparent"
                          }`}
                          onClick={() => setSelectedTemplate(2)}
                        >
                          <InvoicePreview
                            invoiceData={previewData}
                            templateId={2}
                            scale={0.8}
                          />
                        </div>
                        <div
                          className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                            selectedTemplate === 3
                              ? "border-vibrant-yellow"
                              : "border-transparent"
                          }`}
                          onClick={() => setSelectedTemplate(3)}
                        >
                          <InvoicePreview
                            invoiceData={previewData}
                            templateId={3}
                            scale={0.8}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "report":
        return (
          <Card className="modern-card overflow-hidden border-2 border-vibrant-yellow/30 hover:border-vibrant-yellow/60 shadow-[0_0_15px_rgba(245,215,66,0.15)] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold">{previewData.title}</h3>
                  <p className="text-muted-foreground">
                    {previewData.period} Report
                  </p>
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
                    onClick={handleConfirm}
                    className="rounded-full bg-vibrant-yellow text-vibrant-black hover:bg-vibrant-yellow/90"
                  >
                    Confirm & Save
                  </Button>
                </div>
              </div>

              <p className="mb-6">{previewData.summary}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {previewData.metrics.map((metric: any, index: number) => (
                  <div key={index} className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {metric.name}
                    </p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p
                      className={`text-sm ${metric.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                    >
                      {metric.change}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-muted/30 p-6 rounded-lg text-center">
                <p className="text-muted-foreground">{previewData.chartData}</p>
              </div>
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
              <Sparkles className="h-6 w-6 text-vibrant-yellow mr-2" />
              Kashew
            </h1>
            <p className="text-muted-foreground">
              Your intelligent business companion
            </p>
          </div>
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
              <div className="flex items-center justify-center h-full bg-muted/30 rounded-xl p-8 text-center border-2 border-dashed border-vibrant-yellow/30 hover:border-vibrant-yellow/60 transition-all duration-300 shadow-[0_0_15px_rgba(245,215,66,0.1)] relative overflow-hidden group">
                {/* AI-themed animated background */}
                <div className="absolute inset-0 pointer-events-none opacity-30">
                  <div className="absolute top-0 left-0 w-full h-full bg-grid-vibrant-yellow/10 bg-[size:20px_20px] animate-grid-flow"></div>
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-vibrant-yellow/20 via-transparent to-transparent"></div>
                </div>
                <div className="relative">
                  <Sparkles className="h-12 w-12 text-vibrant-yellow mx-auto mb-4 animate-pulse-subtle" />
                  <h3 className="text-lg font-medium">AI Assistant</h3>
                  <p className="text-muted-foreground mt-2">
                    Ask me to create clients, products, invoices, or generate
                    reports.
                  </p>
                </div>
              </div>
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
