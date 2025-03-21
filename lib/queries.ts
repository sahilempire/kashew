export const getInvoices = async () => {
  const { data: invoices, error } = await supabase
    .from('invoices')
    .select(`
      *,
      client:clients (
        name,
        email
      ),
      items:invoice_items (
        description,
        quantity,
        price
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return invoices.map(invoice => {
    const isOverdue = new Date(invoice.due_date) < new Date() && invoice.status !== 'paid';

    return {
      id: invoice.id,
      number: invoice.number,
      date: invoice.date,
      due_date: invoice.due_date,
      status: isOverdue ? 'overdue' : invoice.status,
      subtotal: Number(invoice.subtotal) || 0,
      total: Number(invoice.total),
      tax: {
        rate: Number(invoice.tax_rate) || 0,
        type: invoice.tax_type || 'vat',
        amount: Number(invoice.tax_amount) || 0,
      },
      notes: invoice.notes || '',
      terms: invoice.terms || '',
      client: invoice.client,
      items: invoice.items,
    };
  });
};

export const createInvoice = async (invoiceData: any) => {
  try {
    // First, create the invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert([{
        number: invoiceData.number,
        client_id: invoiceData.client_id,
        date: invoiceData.date,
        due_date: invoiceData.due_date,
        status: invoiceData.status,
        subtotal: invoiceData.subtotal,
        total: invoiceData.total,
        tax_rate: invoiceData.tax_rate,
        tax_type: invoiceData.tax_type,
        tax_amount: invoiceData.tax_amount,
        notes: invoiceData.notes,
        terms: invoiceData.terms
      }])
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    // Then, create the invoice items
    if (invoiceData.items && invoiceData.items.length > 0) {
      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(
          invoiceData.items.map((item: any) => ({
            invoice_id: invoice.id,
            description: item.description,
            quantity: item.quantity,
            price: item.price
          }))
        );

      if (itemsError) throw itemsError;
    }

    return invoice;
  } catch (error) {
    console.error('Error in createInvoice:', error);
    throw error;
  }
}; 