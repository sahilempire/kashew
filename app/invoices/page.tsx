'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AddInvoiceModal } from '@/components/AddInvoiceModal';

export default function InvoicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateInvoice = async (formData: any) => {
    try {
      // Validate required fields
      if (!formData.due_date) {
        throw new Error('Due date is required');
      }

      // Debug log
      console.log('Creating invoice with data:', formData);

      const { data: userData } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('invoices')
        .insert([{
          ...formData,
          user_id: userData.user?.id,
          // Ensure these are properly formatted dates
          date: formData.date,
          due_date: formData.due_date,
        }])
        .select();

      if (error) throw error;

      console.log('Invoice created successfully:', data);
      setIsModalOpen(false);
      // Refresh your invoices list here
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice. Please check all required fields.');
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-primary text-white rounded-md"
      >
        Create Invoice
      </button>

      <AddInvoiceModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateInvoice}
      />

      {/* Rest of your page content */}
    </div>
  );
} 