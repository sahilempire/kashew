import React from "react";
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
    zip?: string;
    country?: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    position?: string;
    taxId?: string;
    paymentTerms?: string;
  };
}

const AddClientForm = ({
  onSubmit = () => {},
  onCancel = () => {},
  initialData = {},
}: AddClientFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get('companyName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      zip: formData.get('zip') as string,
      country: formData.get('country') as string,
      contactName: `${formData.get('firstName')} ${formData.get('lastName')}`,
      contactEmail: formData.get('contactEmail') as string,
      contactPhone: formData.get('contactPhone') as string,
      position: formData.get('position') as string,
      taxId: formData.get('taxId') as string,
      paymentTerms: formData.get('paymentTerms') as string,
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Company Information</h3>
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input id="companyName" placeholder="Enter company name" required defaultValue={initialData.name} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="company@example.com"
              required
              defaultValue={initialData.email}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" placeholder="(555) 123-4567" defaultValue={initialData.phone} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            placeholder="Enter company address"
            className="resize-none h-20"
            defaultValue={initialData.address}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" placeholder="City" defaultValue={initialData.city} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State/Province</Label>
            <Input id="state" placeholder="State/Province" defaultValue={initialData.state} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zip">Zip/Postal Code</Label>
            <Input id="zip" placeholder="Zip/Postal Code" defaultValue={initialData.zip} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select defaultValue={initialData.country}>
            <SelectTrigger id="country">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
              <SelectItem value="de">Germany</SelectItem>
              <SelectItem value="fr">France</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Primary Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" placeholder="First name" required defaultValue={initialData.contactName?.split(' ')[0]} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" placeholder="Last name" required defaultValue={initialData.contactName?.split(' ')[1]} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Email</Label>
            <Input
              id="contactEmail"
              type="email"
              placeholder="contact@example.com"
              required
              defaultValue={initialData.contactEmail}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">Phone</Label>
            <Input id="contactPhone" type="tel" placeholder="(555) 123-4567" defaultValue={initialData.contactPhone} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Input id="position" placeholder="Job title" defaultValue={initialData.position} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Billing Information</h3>
        <div className="space-y-2">
          <Label htmlFor="taxId">Tax ID / VAT Number</Label>
          <Input id="taxId" placeholder="Enter tax ID or VAT number" defaultValue={initialData.taxId} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentTerms">Payment Terms</Label>
          <Select defaultValue={initialData.paymentTerms}>
            <SelectTrigger id="paymentTerms">
              <SelectValue placeholder="Select payment terms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Net 7 - Due in 7 days</SelectItem>
              <SelectItem value="15">Net 15 - Due in 15 days</SelectItem>
              <SelectItem value="30">Net 30 - Due in 30 days</SelectItem>
              <SelectItem value="60">Net 60 - Due in 60 days</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
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
