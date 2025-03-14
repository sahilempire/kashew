"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Sparkles } from "lucide-react";
import EditDataForm from "./EditDataForm";
import { useToast } from "@/components/ui/use-toast";

interface AIChatBoxProps {
  onGenerateInvoice?: (data: any) => void;
  className?: string;
}

const AIChatBox = ({
  onGenerateInvoice = () => {},
  className = "",
}: AIChatBoxProps) => {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { role: string; content: string }[]
  >([
    {
      role: "system",
      content:
        "Hello! I can help you create clients, products, or invoices. Just tell me what you'd like to create and provide the details.",
    },
  ]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState<{
    type: 'client' | 'product' | 'invoice';
    data: any;
  } | null>(null);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message to chat history
    const newChatHistory = [...chatHistory, { role: "user", content: message }];
    setChatHistory(newChatHistory);
    setMessage("");

    // Process the message to determine the type and extract data
    const messageType = determineMessageType(message);
    if (!messageType) {
      setChatHistory([
        ...newChatHistory,
        {
          role: "assistant",
          content: "I can help you create clients, products, or invoices. Please specify what you'd like to create.",
        },
      ]);
      return;
    }

    // Extract data based on message type
    let extractedData;
    switch (messageType) {
      case 'client':
        extractedData = extractClientData(message);
        break;
      case 'product':
        extractedData = extractProductData(message);
        break;
      case 'invoice':
        extractedData = extractInvoiceData(message);
        break;
    }

    // Show the edit form with extracted data
    if (extractedData) {
      setEditData({ type: messageType, data: extractedData });
      setShowEditForm(true);
      setChatHistory([
        ...newChatHistory,
        {
          role: "assistant",
          content: `I've extracted the ${messageType} information. Please review and edit if needed.`,
        },
      ]);
    } else {
      setChatHistory([
        ...newChatHistory,
        {
          role: "assistant",
          content: `I couldn't extract enough information to create a ${messageType}. Please provide more details.`,
        },
      ]);
    }
  };

  const determineMessageType = (text: string): 'client' | 'product' | 'invoice' | null => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('client') || lowerText.includes('customer')) return 'client';
    if (lowerText.includes('product') || lowerText.includes('service')) return 'product';
    if (lowerText.includes('invoice') || lowerText.includes('bill')) return 'invoice';
    return null;
  };

  const extractClientData = (text: string) => {
    const nameMatch = text.match(/name[:\s]+([^,\.]+)/i);
    const emailMatch = text.match(/email[:\s]+([^,\.]+)/i);
    const phoneMatch = text.match(/phone[:\s]+([^,\.]+)/i);
    const companyMatch = text.match(/company[:\s]+([^,\.]+)/i);

    if (!nameMatch) return null;

    return {
      name: nameMatch[1].trim(),
      email: emailMatch ? emailMatch[1].trim() : '',
      phone: phoneMatch ? phoneMatch[1].trim() : '',
      companyName: companyMatch ? companyMatch[1].trim() : '',
    };
  };

  const extractProductData = (text: string) => {
    const nameMatch = text.match(/name[:\s]+([^,\.]+)/i);
    const priceMatch = text.match(/price[:\s]+(\d+(?:\.\d+)?)/i);
    const descriptionMatch = text.match(/description[:\s]+([^,\.]+)/i);
    const unitMatch = text.match(/unit[:\s]+([^,\.]+)/i);

    if (!nameMatch || !priceMatch) return null;

    return {
      name: nameMatch[1].trim(),
      price: parseFloat(priceMatch[1]),
      description: descriptionMatch ? descriptionMatch[1].trim() : '',
      unit: unitMatch ? unitMatch[1].trim() : 'piece',
    };
  };

  const extractInvoiceData = (text: string) => {
    const clientMatch = text.match(/client[:\s]+([^,\.]+)/i);
    const amountMatch = text.match(/amount[:\s]+(\d+(?:\.\d+)?)/i);
    const dateMatch = text.match(/date[:\s]+([^,\.]+)/i);

    if (!clientMatch || !amountMatch) return null;

    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 30);

    return {
      invoiceNumber: `INV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      client_id: clientMatch[1].trim(),
      total: parseFloat(amountMatch[1]),
      issueDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
    };
  };

  const handleSave = (savedData: any) => {
    setShowEditForm(false);
    setEditData(null);
    toast({
      title: "Success",
      description: "Data saved successfully!",
    });
    setChatHistory([
      ...chatHistory,
      {
        role: "assistant",
        content: "Great! The data has been saved. What else can I help you with?",
      },
    ]);
  };

  const handleCancel = () => {
    setShowEditForm(false);
    setEditData(null);
    setChatHistory([
      ...chatHistory,
      {
        role: "assistant",
        content: "No problem. What else can I help you with?",
      },
    ]);
  };

  return (
    <Card className={`modern-card bg-background ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-vibrant-yellow" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="h-[200px] overflow-y-auto p-4 rounded-lg bg-muted/50">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 ${msg.role === "user" ? "text-right" : "text-left"}`}
              >
                <div
                  className={`inline-block px-4 py-2 rounded-lg ${msg.role === "user" ? "bg-vibrant-yellow text-black" : "bg-muted"}`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {showEditForm && editData ? (
            <EditDataForm
              type={editData.type}
              initialData={editData.data}
              onSave={handleSave}
              onClose={handleCancel}
              isFromAI={true}
            />
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Tell me what you want to create (client, product, or invoice)..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-vibrant-yellow text-black hover:bg-vibrant-yellow/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChatBox;
