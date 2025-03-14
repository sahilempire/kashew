import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  clientService, 
  productService, 
  invoiceService,
  reportService,
  chartService
} from '@/lib/database';

interface EditDataFormProps {
  type: 'client' | 'product' | 'invoice' | 'report' | 'chart';
  initialData?: any;
  onSave?: (data: any) => void;
  onClose: () => void;
  isFromAI?: boolean;
}

export default function EditDataForm({
  type,
  initialData,
  onSave,
  onClose,
  isFromAI = false,
}: EditDataFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialData || {});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: Record<string, any>) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const dataWithUserId = { ...formData, user_id: user.id };
      let savedData;

      switch (type) {
        case 'client':
          savedData = formData.id
            ? await clientService.update(user.id, formData.id, dataWithUserId)
            : await clientService.create(user.id, dataWithUserId);
          break;
        case 'product':
          savedData = formData.id
            ? await productService.update(user.id, formData.id, dataWithUserId)
            : await productService.create(user.id, dataWithUserId);
          break;
        case 'invoice':
          savedData = formData.id
            ? await invoiceService.update(user.id, formData.id, dataWithUserId)
            : await invoiceService.create(user.id, dataWithUserId);
          break;
        case 'report':
          savedData = formData.id
            ? await reportService.update(user.id, formData.id, dataWithUserId)
            : await reportService.create(user.id, dataWithUserId);
          break;
        case 'chart':
          savedData = formData.id
            ? await chartService.update(user.id, formData.id, dataWithUserId)
            : await chartService.create(user.id, dataWithUserId);
          break;
        default:
          throw new Error('Invalid type');
      }

      if (!savedData) {
        throw new Error('Failed to save data');
      }

      toast({
        title: "Success",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} ${formData.id ? 'updated' : 'created'} successfully!`,
      });

      if (onSave) onSave(savedData);
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: "Error",
        description: `Failed to save ${type}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderFields = () => {
    switch (type) {
      case 'client':
        return (
          <>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  placeholder="Client name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  placeholder="client@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  placeholder="Phone number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName || ''}
                  onChange={handleInputChange}
                  placeholder="Company name"
                />
              </div>
            </div>
          </>
        );

      case 'product':
        return (
          <>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  placeholder="Product name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  placeholder="Product description"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price || ''}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  name="unit"
                  value={formData.unit || ''}
                  onChange={handleInputChange}
                  placeholder="piece, hour, etc."
                />
              </div>
            </div>
          </>
        );

      case 'invoice':
        return (
          <>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  name="invoiceNumber"
                  value={formData.invoiceNumber || ''}
                  onChange={handleInputChange}
                  placeholder="INV-001"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input
                  id="issueDate"
                  name="issueDate"
                  type="date"
                  value={formData.issueDate || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleInputChange}
                  placeholder="Invoice notes"
                />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {isFromAI ? 'Review AI Generated Data' : `${formData.id ? 'Edit' : 'New'} ${type.charAt(0).toUpperCase() + type.slice(1)}`}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          {renderFields()}
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-vibrant-yellow text-black hover:bg-vibrant-yellow/90"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}