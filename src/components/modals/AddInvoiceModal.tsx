import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { clientService, productService } from "@/lib/database";
import { Client, Product } from "@/lib/models";
import { Loader2, Plus, Trash } from "lucide-react";
import { format } from "date-fns";

interface AddInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: any) => void;
  clientId?: string;
}

const AddInvoiceModal = ({
  open,
  onOpenChange,
  onSubmit = () => {},
  clientId,
}: AddInvoiceModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>(clientId || "");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [issueDate, setIssueDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [dueDate, setDueDate] = useState(
    format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd")
  );
  const [items, setItems] = useState<Array<{
    id: string;
    productId: string;
    description: string;
    quantity: number;
    price: number;
    taxRate: number;
  }>>([]);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && user) {
      loadData();
    }
  }, [open, user]);

  const loadData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [clientsData, productsData] = await Promise.all([
        clientService.getAll(user.id),
        productService.getAll(user.id)
      ]);
      
      setClients(clientsData);
      setProducts(productsData);
      
      // Generate a unique invoice number
      const timestamp = Date.now().toString().slice(-6);
      setInvoiceNumber(`INV-${timestamp}`);
      
      // Add an empty item by default
      if (items.length === 0) {
        addItem();
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: crypto.randomUUID(),
        productId: "",
        description: "",
        quantity: 1,
        price: 0,
        taxRate: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: string, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          if (field === "productId" && value) {
            const product = products.find((p) => p.id === value);
            if (product) {
              return {
                ...item,
                [field]: value,
                description: product.description || "",
                price: product.price,
                taxRate: product.taxRate || 0,
              };
            }
          }
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  const calculateTax = () => {
    return items.reduce(
      (sum, item) => sum + (item.quantity * item.price * item.taxRate) / 100,
      0
    );
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedClient) {
      newErrors.client = "Please select a client";
    }
    
    if (!invoiceNumber.trim()) {
      newErrors.invoiceNumber = "Invoice number is required";
    }
    
    if (!issueDate) {
      newErrors.issueDate = "Issue date is required";
    }
    
    if (!dueDate) {
      newErrors.dueDate = "Due date is required";
    }
    
    if (items.length === 0) {
      newErrors.items = "At least one item is required";
    } else {
      items.forEach((item, index) => {
        if (!item.description.trim()) {
          newErrors[`item_${index}_description`] = "Description is required";
        }
        if (item.quantity <= 0) {
          newErrors[`item_${index}_quantity`] = "Quantity must be greater than 0";
        }
        if (item.price < 0) {
          newErrors[`item_${index}_price`] = "Price cannot be negative";
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    const formData = {
      client_id: selectedClient,
      invoiceNumber,
      issueDate,
      dueDate,
      items: items.map(({ id, ...rest }) => rest), // Remove the temporary id
      notes,
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      total: calculateTotal(),
      status: "draft"
    };
    
    onSubmit(formData);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>
            Create a new invoice for your client.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
                  <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger id="client">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} {client.companyName ? `(${client.companyName})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.client && <p className="text-sm text-destructive">{errors.client}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input
                    id="invoiceNumber"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="INV-001"
                  />
                  {errors.invoiceNumber && <p className="text-sm text-destructive">{errors.invoiceNumber}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                  />
                  {errors.issueDate && <p className="text-sm text-destructive">{errors.issueDate}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                  {errors.dueDate && <p className="text-sm text-destructive">{errors.dueDate}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Items</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Add Item
                </Button>
              </div>
              
              {errors.items && <p className="text-sm text-destructive">{errors.items}</p>}

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-3 items-start border p-3 rounded-md"
                  >
                    <div className="col-span-12 md:col-span-4 space-y-2">
                      <Label htmlFor={`item-${index}-product`}>Product/Service</Label>
                      <Select
                        value={item.productId}
                        onValueChange={(value) => updateItem(item.id, "productId", value)}
                      >
                        <SelectTrigger id={`item-${index}-product`}>
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Custom Item</SelectItem>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-12 md:col-span-4 space-y-2">
                      <Label htmlFor={`item-${index}-description`}>Description</Label>
                      <Input
                        id={`item-${index}-description`}
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, "description", e.target.value)
                        }
                        placeholder="Item description"
                      />
                      {errors[`item_${index}_description`] && (
                        <p className="text-sm text-destructive">{errors[`item_${index}_description`]}</p>
                      )}
                    </div>

                    <div className="col-span-3 md:col-span-1 space-y-2">
                      <Label htmlFor={`item-${index}-quantity`}>Qty</Label>
                      <Input
                        id={`item-${index}-quantity`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "quantity",
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                      {errors[`item_${index}_quantity`] && (
                        <p className="text-sm text-destructive">{errors[`item_${index}_quantity`]}</p>
                      )}
                    </div>

                    <div className="col-span-4 md:col-span-1 space-y-2">
                      <Label htmlFor={`item-${index}-price`}>Price</Label>
                      <Input
                        id={`item-${index}-price`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "price",
                            parseFloat(e.target.value) || 0
                          )
                        }
                      />
                      {errors[`item_${index}_price`] && (
                        <p className="text-sm text-destructive">{errors[`item_${index}_price`]}</p>
                      )}
                    </div>

                    <div className="col-span-4 md:col-span-1 space-y-2">
                      <Label htmlFor={`item-${index}-tax`}>Tax %</Label>
                      <Input
                        id={`item-${index}-tax`}
                        type="number"
                        min="0"
                        step="0.1"
                        value={item.taxRate}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "taxRate",
                            parseFloat(e.target.value) || 0
                          )
                        }
                      />
                    </div>

                    <div className="col-span-1 flex items-end justify-end h-full">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes or payment instructions"
                />
              </div>

              <div className="flex flex-col items-end space-y-2 pt-4 border-t">
                <div className="flex justify-between w-full md:w-1/3">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-full md:w-1/3">
                  <span className="text-muted-foreground">Tax:</span>
                  <span>${calculateTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-full md:w-1/3 font-medium text-lg">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-full bg-vibrant-yellow text-black hover:bg-vibrant-yellow/90"
              >
                Create Invoice
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddInvoiceModal;
