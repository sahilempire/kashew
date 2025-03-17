"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getClients, getProducts, createInvoice } from "@/lib/queries";
import { Plus, Trash2, Info } from "lucide-react";
import { 
  getCountryList, 
  countryTaxSystems, 
  generateTaxNumber, 
  calculateTax,
  getCountryName
} from "@/lib/taxUtils";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AddInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  defaultValues?: {
    number?: string;
    date?: string;
    dueDate?: string;
    clientId?: string;
    items?: InvoiceItem[];
    country?: string;
    taxNumber?: string;
  };
}

interface Client {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

export default function AddInvoiceModal({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {}
}: AddInvoiceModalProps) {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    clientId: defaultValues.clientId || "",
    date: defaultValues.date || new Date().toISOString().split('T')[0],
    dueDate: defaultValues.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: defaultValues.items || [] as InvoiceItem[],
    country: defaultValues.country || "US", // Default to US
    taxNumber: defaultValues.taxNumber || "",
  });
  const [countries] = useState(getCountryList());

  useEffect(() => {
    if (open) {
      loadClients();
      loadProducts();
      
      // Generate tax number if not provided
      if (!formData.taxNumber) {
        const taxNumber = generateTaxNumber(formData.country);
        setFormData(prev => ({ ...prev, taxNumber }));
      }
    }
  }, [open]);

  // Update tax number when country changes
  useEffect(() => {
    const taxNumber = generateTaxNumber(formData.country);
    setFormData(prev => ({ ...prev, taxNumber }));
  }, [formData.country]);

  const loadClients = async () => {
    try {
      const { clients } = await getClients();
      setClients(clients);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const { products } = await getProducts();
      setProducts(products);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { description: "", quantity: 1, price: 0 },
      ],
    });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === 'quantity' || field === 'price' ? Number(value) : value,
    };
    setFormData({ ...formData, items: newItems });
  };

  const handleProductSelect = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const newItems = [...formData.items];
      newItems[index] = {
        description: product.description || product.name,
        quantity: 1,
        price: product.price,
      };
      setFormData({ ...formData, items: newItems });
    }
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const calculateTaxAmount = () => {
    const subtotal = calculateSubtotal();
    return calculateTax(formData.country, subtotal);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTaxAmount();
    return subtotal + tax;
  };

  const getCurrentTaxInfo = () => {
    return countryTaxSystems[formData.country];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const invoiceNumber = defaultValues.number || `INV-${Date.now().toString().slice(-6)}`;
      const data = {
        number: invoiceNumber,
        date: formData.date,
        dueDate: formData.dueDate,
        clientId: formData.clientId,
        items: formData.items,
        country: formData.country,
        taxNumber: formData.taxNumber,
        taxRate: getCurrentTaxInfo()?.rate || 0,
        taxName: getCurrentTaxInfo()?.name || "",
        subtotal: calculateSubtotal(),
        taxAmount: calculateTaxAmount(),
        total: calculateTotal()
      };

      onSubmit(data);
      onOpenChange(false);
      setFormData({
        clientId: "",
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [],
        country: "US",
        taxNumber: "",
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const taxInfo = getCurrentTaxInfo();
  const subtotal = calculateSubtotal();
  const taxAmount = calculateTaxAmount();
  const total = calculateTotal();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{defaultValues.number ? 'Edit Invoice' : 'Create New Invoice'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) => setFormData({ ...formData, clientId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Invoice Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                value={formData.country}
                onValueChange={(value) => setFormData({ ...formData, country: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="taxNumber">
                {taxInfo?.name} Number
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{taxInfo?.description}</p>
                    <p>Format: {taxInfo?.format}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="taxNumber"
              value={formData.taxNumber}
              onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
              placeholder={`Enter ${taxInfo?.name} number`}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Items</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-start">
                <div className="col-span-5">
                  <Select
                    value={products.find(p => 
                      p.description === item.description || p.name === item.description
                    )?.id}
                    onValueChange={(value) => handleProductSelect(index, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) => updateItem(index, 'price', e.target.value)}
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{taxInfo?.name} ({taxInfo?.rate}%):</span>
              <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(taxAmount)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || formData.items.length === 0 || !formData.clientId}>
              {loading ? "Creating..." : defaultValues.number ? "Update Invoice" : "Create Invoice"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
