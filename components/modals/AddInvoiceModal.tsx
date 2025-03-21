import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface InvoiceFormData {
  number: string;
  client_id: string;
  date: Date;
  due_date: Date;
  items: Array<{
    description: string;
    quantity: number;
    price: number;
  }>;
  tax: {
    rate: number;
    type: string;
    amount: number;
  };
  subtotal: number;
  total: number;
  notes: string;
  terms: string;
}

const AddInvoiceModal = ({ onSubmit, onOpenChange }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<InvoiceFormData>({
    number: '',
    client_id: '',
    date: new Date(),
    due_date: new Date(new Date().setDate(new Date().getDate() + 30)),
    items: [],
    tax: {
      rate: 0,
      type: 'vat',
      amount: 0
    },
    subtotal: 0,
    total: 0,
    notes: 'Thank you for your business!',
    terms: 'Payment due within 30 days'
  });

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return (subtotal * formData.tax.rate) / 100;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    return subtotal + tax;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const subtotal = calculateSubtotal();
      const tax = calculateTax();
      const total = calculateTotal();

      const invoiceData = {
        number: formData.number,
        client_id: formData.client_id,
        date: formData.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
        due_date: formData.due_date.toISOString().split('T')[0], // Format as YYYY-MM-DD
        items: formData.items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          price: item.price,
        })),
        tax_rate: formData.tax.rate,
        tax_type: formData.tax.type,
        tax_amount: tax,
        subtotal,
        total,
        notes: formData.notes,
        terms: formData.terms,
        status: 'draft'
      };

      console.log('Submitting invoice data:', invoiceData); // Debug log
      await onSubmit(invoiceData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... other form fields ... */}
      
      <div>
        <label>Invoice Date</label>
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
        />
      </div>

      <div>
        <label>Due Date</label>
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
        />
      </div>

      {/* ... other form fields ... */}

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Invoice'}
      </button>
    </form>
  );
};

export default AddInvoiceModal; 