-- Add new columns to products table
ALTER TABLE products


ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'Product',
ADD COLUMN IF NOT EXISTS unit TEXT NOT NULL DEFAULT 'item',
ADD COLUMN IF NOT EXISTS tax_rate DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false; 