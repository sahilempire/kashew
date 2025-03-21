import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface InvoiceFormData {
  number: string;
  date: Date;
  due_date: Date;
  client_id: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  total: number;
  subtotal: number;
  tax_rate?: number;
  tax_amount?: number;
  tax_type?: string;
  notes?: string;
  terms?: string;
}

export const AddInvoiceModal = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<InvoiceFormData>({
    number: '',
    date: new Date(),
    due_date: new Date(new Date().setDate(new Date().getDate() + 30)), // 30 days from now
    client_id: '',
    status: 'draft',
    total: 0,
    subtotal: 0,
    tax_rate: 0,
    tax_amount: 0,
    tax_type: 'vat'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Format dates for Supabase
      const formattedData = {
        ...formData,
        date: formData.date.toISOString().split('T')[0],
        due_date: formData.due_date.toISOString().split('T')[0],
      };

      // Debug log
      console.log('Submitting data:', formattedData);

      await onSubmit(formattedData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>
            Create a new invoice. Fill in all the required fields.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Invoice Number</label>
            <input
              type="text"
              required
              value={formData.number}
              onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
              className="w-full rounded-md border p-2"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Invoice Date</label>
            <DatePicker
              selected={formData.date}
              onChange={(date: Date) => {
                if (date) {
                  const newDueDate = new Date(date);
                  newDueDate.setDate(date.getDate() + 30);
                  
                  setFormData(prev => ({
                    ...prev,
                    date: date,
                    due_date: newDueDate
                  }));
                }
              }}
              dateFormat="yyyy-MM-dd"
              required
              className="w-full rounded-md border p-2"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Due Date</label>
            <DatePicker
              selected={formData.due_date}
              onChange={(date: Date) => {
                if (date) {
                  setFormData(prev => ({
                    ...prev,
                    due_date: date
                  }));
                }
              }}
              dateFormat="yyyy-MM-dd"
              required
              minDate={formData.date}
              className="w-full rounded-md border p-2"
            />
          </div>

          {/* Add other form fields */}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md"
            >
              Create Invoice
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 