import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { 
  Client, 
  Product, 
  Invoice, 
  InvoiceItem, 
  Report, 
  Chart 
} from './models';
import { supabase } from './supabase';

// Generic function to generate a unique ID
const generateId = () => uuidv4();

// Generic function to get current timestamp
const getCurrentTimestamp = () => new Date().toISOString();

// SQL Queries
const SQL_QUERIES = {
  // Client queries
  CREATE_CLIENT: `
    INSERT INTO clients (name, email, phone, address, contact_name, user_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `,
  GET_CLIENTS: `
    SELECT * FROM clients 
    WHERE user_id = $1 
    ORDER BY created_at DESC
  `,
  GET_CLIENT: `
    SELECT * FROM clients 
    WHERE id = $1 AND user_id = $2
  `,
  UPDATE_CLIENT: `
    UPDATE clients 
    SET name = $1, email = $2, phone = $3, address = $4, contact_name = $5
    WHERE id = $6 AND user_id = $7
    RETURNING *
  `,
  DELETE_CLIENT: `
    DELETE FROM clients 
    WHERE id = $1 AND user_id = $2
  `,

  // Product queries
  CREATE_PRODUCT: `
    INSERT INTO products (name, type, price, description, unit, tax_rate, user_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `,
  GET_PRODUCTS: `
    SELECT * FROM products 
    WHERE user_id = $1 
    ORDER BY created_at DESC
  `,
  GET_PRODUCT: `
    SELECT * FROM products 
    WHERE id = $1 AND user_id = $2
  `,
  UPDATE_PRODUCT: `
    UPDATE products 
    SET name = $1, type = $2, price = $3, description = $4, unit = $5, tax_rate = $6
    WHERE id = $7 AND user_id = $8
    RETURNING *
  `,
  DELETE_PRODUCT: `
    DELETE FROM products 
    WHERE id = $1 AND user_id = $2
  `,

  // Invoice queries
  CREATE_INVOICE: `
    INSERT INTO invoices (client_id, items, subtotal, tax, total, due_date, user_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `,
  GET_INVOICES: `
    SELECT i.*, c.name as client_name, c.email as client_email 
    FROM invoices i
    LEFT JOIN clients c ON i.client_id = c.id
    WHERE i.user_id = $1 
    ORDER BY i.created_at DESC
  `,
  GET_INVOICE: `
    SELECT i.*, c.name as client_name, c.email as client_email 
    FROM invoices i
    LEFT JOIN clients c ON i.client_id = c.id
    WHERE i.id = $1 AND i.user_id = $2
  `,
  UPDATE_INVOICE: `
    UPDATE invoices 
    SET client_id = $1, items = $2, subtotal = $3, tax = $4, total = $5, due_date = $6
    WHERE id = $7 AND user_id = $8
    RETURNING *
  `,
  DELETE_INVOICE: `
    DELETE FROM invoices 
    WHERE id = $1 AND user_id = $2
  `,

  // Report queries
  CREATE_REPORT: `
    INSERT INTO reports (title, period, summary, metrics, chart_data, user_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `,
  GET_REPORTS: `
    SELECT * FROM reports 
    WHERE user_id = $1 
    ORDER BY created_at DESC
  `,
  GET_REPORT: `
    SELECT * FROM reports 
    WHERE id = $1 AND user_id = $2
  `,
  UPDATE_REPORT: `
    UPDATE reports 
    SET title = $1, period = $2, summary = $3, metrics = $4, chart_data = $5
    WHERE id = $6 AND user_id = $7
    RETURNING *
  `,
  DELETE_REPORT: `
    DELETE FROM reports 
    WHERE id = $1 AND user_id = $2
  `,

  // Chart queries
  CREATE_CHART: `
    INSERT INTO charts (type, title, data, user_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `,
  GET_CHARTS: `
    SELECT * FROM charts 
    WHERE user_id = $1 
    ORDER BY created_at DESC
  `,
  GET_CHART: `
    SELECT * FROM charts 
    WHERE id = $1 AND user_id = $2
  `,
  UPDATE_CHART: `
    UPDATE charts 
    SET type = $1, title = $2, data = $3
    WHERE id = $4 AND user_id = $5
    RETURNING *
  `,
  DELETE_CHART: `
    DELETE FROM charts 
    WHERE id = $1 AND user_id = $2
  `,
};

// Client CRUD operations
export const clientService = {
  // Create a new client
  async create(userId: string, data: Partial<Client>): Promise<Client> {
    const id = generateId();
    const timestamp = getCurrentTimestamp();
    
    const newClient: Client = {
      id,
      user_id: userId,
      name: data.name || '',
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      country: data.country,
      companyName: data.companyName,
      website: data.website,
      notes: data.notes,
      taxId: data.taxId,
      status: 'active',
      created_at: timestamp,
      updated_at: timestamp,
      totalInvoices: 0,
      totalSpent: 0
    };
    
    const { data: client, error } = await supabase
      .from('clients')
      .insert(newClient)
      .select()
      .single();
      
    if (error) throw error;
    return client;
  },

  // Get all clients for a user
  async getAll(userId: string): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  // Get a client by ID
  async getById(userId: string, id: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Update a client
  async update(userId: string, id: string, updates: Partial<Client>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update({
        ...updates,
        updated_at: getCurrentTimestamp()
      })
      .eq('user_id', userId)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a client (soft delete)
  async delete(userId: string, id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .update({
        status: 'archived',
        updated_at: getCurrentTimestamp()
      })
      .eq('user_id', userId)
      .eq('id', id);

    if (error) throw error;
  },

  // Search clients
  async search(userId: string, query: string): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,companyName.ilike.%${query}%`)
      .order('name');

    if (error) throw error;
    return data || [];
  }
};

// Product CRUD operations
export const productService = {
  // Create a new product
  async create(userId: string, data: Partial<Product>): Promise<Product> {
    const id = generateId();
    const timestamp = getCurrentTimestamp();
    
    const newProduct: Product = {
      id,
      user_id: userId,
      name: data.name || '',
      type: data.type || 'product',
      description: data.description,
      price: data.price || 0,
      unit: data.unit,
      taxRate: data.taxRate,
      sku: data.sku,
      active: data.active !== false,
      status: 'active',
      created_at: timestamp,
      updated_at: timestamp
    };
    
    const { data: product, error } = await supabase
      .from('products')
      .insert(newProduct)
      .select()
      .single();
      
    if (error) throw error;
    return product;
  },

  // Get all products for a user
  async getAll(userId: string, type?: 'product' | 'service'): Promise<Product[]> {
    let query = supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active');
    
    if (type) {
      query = query.eq('type', type);
    }
    
    const { data, error } = await query.order('name');

    if (error) throw error;
    return data || [];
  },

  // Get a product by ID
  async getById(userId: string, id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Update a product
  async update(userId: string, id: string, updates: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update({
        ...updates,
        updated_at: getCurrentTimestamp()
      })
      .eq('user_id', userId)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a product (soft delete)
  async delete(userId: string, id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update({
        status: 'archived',
        updated_at: getCurrentTimestamp()
      })
      .eq('user_id', userId)
      .eq('id', id);

    if (error) throw error;
  },

  // Search products
  async search(userId: string, query: string, type?: 'product' | 'service'): Promise<Product[]> {
    let dbQuery = supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,sku.ilike.%${query}%`);
    
    if (type) {
      dbQuery = dbQuery.eq('type', type);
    }
    
    const { data, error } = await dbQuery.order('name');

    if (error) throw error;
    return data || [];
  }
};

// Invoice CRUD operations
export const invoiceService = {
  // Create a new invoice
  async create(userId: string, data: Partial<Invoice>): Promise<Invoice> {
    const id = generateId();
    const timestamp = getCurrentTimestamp();
    
    const newInvoice: Invoice = {
      id,
      user_id: userId,
      invoiceNumber: data.invoiceNumber || `INV-${Date.now().toString().slice(-6)}`,
      client_id: data.client_id || '',
      issueDate: data.issueDate || new Date().toISOString().split('T')[0],
      dueDate: data.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: data.items || [],
      notes: data.notes,
      subtotal: data.subtotal || 0,
      tax: data.tax || 0,
      total: data.total || 0,
      status: data.status || 'draft',
      created_at: timestamp,
      updated_at: timestamp
    };
    
    const { data: invoice, error } = await supabase
      .from('invoices')
      .insert(newInvoice)
      .select()
      .single();
      
    if (error) throw error;
    
    // Update client's invoice statistics if applicable
    if (data.client_id) {
      try {
        const { data: client } = await supabase
          .from('clients')
          .select('totalInvoices, totalSpent')
          .eq('id', data.client_id)
          .single();
          
        if (client) {
          await supabase
            .from('clients')
            .update({
              totalInvoices: (client.totalInvoices || 0) + 1,
              totalSpent: (client.totalSpent || 0) + (data.total || 0),
              updated_at: timestamp
            })
            .eq('id', data.client_id);
        }
      } catch (err) {
        console.error('Error updating client statistics:', err);
      }
    }
    
    return invoice;
  },

  // Get all invoices for a user
  async getAll(userId: string, status?: string): Promise<Invoice[]> {
    let query = supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId);
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get an invoice by ID
  async getById(userId: string, id: string): Promise<Invoice | null> {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Update an invoice
  async update(userId: string, id: string, updates: Partial<Invoice>): Promise<Invoice> {
    const { data, error } = await supabase
      .from('invoices')
      .update({
        ...updates,
        updated_at: getCurrentTimestamp()
      })
      .eq('user_id', userId)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete an invoice (soft delete by changing status to cancelled)
  async delete(userId: string, id: string): Promise<void> {
    const { error } = await supabase
      .from('invoices')
      .update({
        status: 'cancelled',
        updated_at: getCurrentTimestamp()
      })
      .eq('user_id', userId)
      .eq('id', id);

    if (error) throw error;
  },

  // Search invoices
  async search(userId: string, query: string): Promise<Invoice[]> {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId)
      .or(`invoiceNumber.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};

// Report CRUD operations
export const reportService = {
  // Create a new report
  async create(userId: string, data: Partial<Report>): Promise<Report> {
    const id = generateId();
    const timestamp = getCurrentTimestamp();
    
    const newReport: Report = {
      id,
      user_id: userId,
      title: data.title || 'New Report',
      description: data.description,
      period: data.period || 'monthly',
      startDate: data.startDate,
      endDate: data.endDate,
      metrics: data.metrics || [],
      created_at: timestamp,
      updated_at: timestamp
    };
    
    const { data: report, error } = await supabase
      .from('reports')
      .insert(newReport)
      .select()
      .single();
      
    if (error) throw error;
    return report;
  },

  // Get all reports for a user
  async getAll(userId: string): Promise<Report[]> {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get a report by ID
  async getById(userId: string, id: string): Promise<Report | null> {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', userId)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Update a report
  async update(userId: string, id: string, updates: Partial<Report>): Promise<Report> {
    const { data, error } = await supabase
      .from('reports')
      .update({
        ...updates,
        updated_at: getCurrentTimestamp()
      })
      .eq('user_id', userId)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a report (soft delete)
  async delete(userId: string, id: string): Promise<void> {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('user_id', userId)
      .eq('id', id);

    if (error) throw error;
  }
};

// Chart CRUD operations
export const chartService = {
  // Create a new chart
  async create(userId: string, data: Partial<Chart>): Promise<Chart> {
    const id = generateId();
    const timestamp = getCurrentTimestamp();
    
    const newChart: Chart = {
      id,
      user_id: userId,
      title: data.title || 'New Chart',
      type: data.type || 'bar',
      data: data.data || [],
      created_at: timestamp,
      updated_at: timestamp
    };
    
    const { data: chart, error } = await supabase
      .from('charts')
      .insert(newChart)
      .select()
      .single();
      
    if (error) throw error;
    return chart;
  },

  // Get all charts for a user
  async getAll(userId: string): Promise<Chart[]> {
    const { data, error } = await supabase
      .from('charts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get a chart by ID
  async getById(userId: string, id: string): Promise<Chart | null> {
    const { data, error } = await supabase
      .from('charts')
      .select('*')
      .eq('user_id', userId)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Update a chart
  async update(userId: string, id: string, updates: Partial<Chart>): Promise<Chart> {
    const { data, error } = await supabase
      .from('charts')
      .update({
        ...updates,
        updated_at: getCurrentTimestamp()
      })
      .eq('user_id', userId)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a chart (soft delete)
  async delete(userId: string, id: string): Promise<void> {
    const { error } = await supabase
      .from('charts')
      .delete()
      .eq('user_id', userId)
      .eq('id', id);

    if (error) throw error;
  }
}; 