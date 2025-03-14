// Client model
export interface Client {
  id: string;
  user_id: string;
  name: string;
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
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
  totalInvoices?: number;
  totalSpent?: number;
}

// Product model
export interface Product {
  id: string;
  user_id: string;
  name: string;
  type: 'product' | 'service';
  description?: string;
  price: number;
  unit?: string;
  taxRate?: number;
  sku?: string;
  active: boolean;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
}

// Invoice item model
export interface InvoiceItem {
  productId?: string;
  description: string;
  quantity: number;
  price: number;
  taxRate: number;
}

// Invoice model
export interface Invoice {
  id: string;
  user_id: string;
  invoiceNumber: string;
  client_id: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  notes?: string;
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';
  created_at: string;
  updated_at: string;
}

// Report metric model
export interface ReportMetric {
  label: string;
  value: number;
  change?: string;
  changeType: 'increase' | 'decrease' | 'neutral';
}

// Report model
export interface Report {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  startDate?: string;
  endDate?: string;
  metrics: ReportMetric[];
  created_at: string;
  updated_at: string;
}

// Chart data point model
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

// Chart model
export interface Chart {
  id: string;
  user_id: string;
  title: string;
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  data: ChartDataPoint[];
  created_at: string;
  updated_at: string;
} 