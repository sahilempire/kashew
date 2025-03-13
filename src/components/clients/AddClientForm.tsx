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

interface AddClientFormProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  initialData?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    companyName?: string;
    website?: string;
    notes?: string;
    taxId?: string;
  };
}

const AddClientForm = ({
  onSubmit = () => {},
  onCancel = () => {},
  initialData = {},
}: AddClientFormProps) => {
  const [name, setName] = useState(initialData.name || "");
  const [email, setEmail] = useState(initialData.email || "");
  const [phone, setPhone] = useState(initialData.phone || "");
  const [address, setAddress] = useState(initialData.address || "");
  const [city, setCity] = useState(initialData.city || "");
  const [state, setState] = useState(initialData.state || "");
  const [zipCode, setZipCode] = useState(initialData.zipCode || "");
  const [country, setCountry] = useState(initialData.country || "United States");
  const [companyName, setCompanyName] = useState(initialData.companyName || "");
  const [website, setWebsite] = useState(initialData.website || "");
  const [notes, setNotes] = useState(initialData.notes || "");
  const [taxId, setTaxId] = useState(initialData.taxId || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
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
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      country,
      companyName,
      website,
      notes,
      taxId
    };
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              placeholder="Enter client name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company Name (Optional)</Label>
            <Input 
              id="company" 
              placeholder="Enter company name" 
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="client@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              placeholder="(123) 456-7890" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input 
            id="address" 
            placeholder="Street address" 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input 
              id="city" 
              placeholder="City" 
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State/Province</Label>
            <Input 
              id="state" 
              placeholder="State/Province" 
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zip">ZIP/Postal Code</Label>
            <Input 
              id="zip" 
              placeholder="ZIP/Postal Code" 
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger id="country">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                <SelectItem value="Australia">Australia</SelectItem>
                <SelectItem value="Germany">Germany</SelectItem>
                <SelectItem value="France">France</SelectItem>
                <SelectItem value="Japan">Japan</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website (Optional)</Label>
            <Input 
              id="website" 
              placeholder="https://example.com" 
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxId">Tax ID / VAT Number (Optional)</Label>
          <Input 
            id="taxId" 
            placeholder="Enter tax ID or VAT number" 
            value={taxId}
            onChange={(e) => setTaxId(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Add any additional information about this client"
            className="resize-none h-24"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
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
          Add Client
        </Button>
      </div>
    </form>
  );
};

export default AddClientForm;

