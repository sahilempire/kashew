-- Add tax-related fields to invoices table if they don't already exist
DO $$
BEGIN
    -- Check if columns exist and add them if they don't
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'subtotal') THEN
        ALTER TABLE invoices ADD COLUMN subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'tax_amount') THEN
        ALTER TABLE invoices ADD COLUMN tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'tax_rate') THEN
        ALTER TABLE invoices ADD COLUMN tax_rate DECIMAL(5, 2) NOT NULL DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'tax_name') THEN
        ALTER TABLE invoices ADD COLUMN tax_name TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'tax_number') THEN
        ALTER TABLE invoices ADD COLUMN tax_number TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'country') THEN
        ALTER TABLE invoices ADD COLUMN country TEXT;
    END IF;

    -- Update existing invoices to set subtotal equal to total (since they didn't have tax before)
    UPDATE invoices SET subtotal = total WHERE subtotal = 0 AND tax_amount = 0;
END
$$; 