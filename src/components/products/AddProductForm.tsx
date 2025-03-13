import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface AddProductFormProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  type?: "product" | "service";
  initialData?: {
    name?: string;
    description?: string;
    price?: number;
    unit?: string;
    taxRate?: number;
    sku?: string;
    active?: boolean;
  };
}

const AddProductForm = ({
  onSubmit = () => {},
  onCancel = () => {},
  type = "product",
  initialData = {},
}: AddProductFormProps) => {
  const [name, setName] = useState(initialData.name || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [price, setPrice] = useState(initialData.price?.toString() || "");
  const [unit, setUnit] = useState(initialData.unit || (type === "product" ? "item" : "hour"));
  const [taxRate, setTaxRate] = useState(initialData.taxRate?.toString() || "10");
  const [sku, setSku] = useState(initialData.sku || "");
  const [active, setActive] = useState(initialData.active !== false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      newErrors.price = "Price must be a valid positive number";
    }
    
    if (taxRate && (isNaN(parseFloat(taxRate)) || parseFloat(taxRate) < 0)) {
      newErrors.taxRate = "Tax rate must be a valid positive number";
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
      name,
      description,
      price: parseFloat(price),
      unit,
      taxRate: taxRate ? parseFloat(taxRate) : undefined,
      sku,
      active,
      type
    };
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input 
            id="name" 
            placeholder={`Enter ${type} name`} 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder={`Describe your ${type}`}
            className="resize-none h-24"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger id="unit">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {type === "product" ? (
                  <>
                    <SelectItem value="item">Item</SelectItem>
                    <SelectItem value="box">Box</SelectItem>
                    <SelectItem value="kg">Kilogram</SelectItem>
                    <SelectItem value="license">License</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="hour">Hour</SelectItem>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tax">Tax Rate (%)</Label>
            <Input
              id="tax"
              type="number"
              min="0"
              step="0.1"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
            />
            {errors.taxRate && <p className="text-sm text-destructive">{errors.taxRate}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku">
              {type === "product" ? "SKU" : "Service Code"}
            </Label>
            <Input
              id="sku"
              placeholder={`Enter ${type === "product" ? "SKU" : "service code"}`}
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch 
            id="active" 
            checked={active}
            onCheckedChange={setActive}
          />
          <Label htmlFor="active">Active</Label>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="rounded-full"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="rounded-full bg-vibrant-yellow text-black hover:bg-vibrant-yellow/90"
        >
          {type === "product" ? "Add Product" : "Add Service"}
        </Button>
      </div>
    </form>
  );
};

export default AddProductForm;
