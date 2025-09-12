-- Updated Role System for Ihsan E-commerce Platform
-- This updates the existing schema to support the new 4-role system

-- Update the user_role enum to match the new system
DROP TYPE IF EXISTS user_role CASCADE;
CREATE TYPE user_role AS ENUM (
  'customer', 
  'vendor', 
  'vendor_manager', 
  'admin'
);

-- Update profiles table to use new role system
ALTER TABLE profiles DROP COLUMN IF EXISTS role;
ALTER TABLE profiles ADD COLUMN role user_role DEFAULT 'customer';

-- Add vendor-specific fields to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_name VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_type VARCHAR(100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_registration VARCHAR(100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS payout_details JSONB;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS vendor_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS vendor_approved_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS vendor_approved_by UUID REFERENCES profiles(id);

-- Create vendors table for detailed vendor information
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_name VARCHAR(255) NOT NULL,
  business_type VARCHAR(100) NOT NULL,
  business_registration VARCHAR(100),
  business_address TEXT,
  contact_person VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  payout_method VARCHAR(50) DEFAULT 'bank_transfer',
  payout_details JSONB,
  status VARCHAR(50) DEFAULT 'pending',
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vendor_products table to link products to vendors
CREATE TABLE IF NOT EXISTS vendor_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  vendor_price DECIMAL(10,2) NOT NULL,
  vendor_stock INTEGER DEFAULT 0,
  is_ready_now BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(vendor_id, product_id)
);

-- Create vendor_orders table for vendor-specific order management
CREATE TABLE IF NOT EXISTS vendor_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  escrow_released BOOLEAN DEFAULT false,
  escrow_released_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vendor_analytics table for vendor performance tracking
CREATE TABLE IF NOT EXISTS vendor_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_sales DECIMAL(10,2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  total_products_sold INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(vendor_id, date)
);

-- Update RLS policies for new role system
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- New RLS policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'vendor_manager')
    )
  );

CREATE POLICY "Admins can update profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'vendor_manager')
    )
  );

-- RLS policies for vendors table
CREATE POLICY "Vendors can view own vendor info" ON vendors
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Vendors can update own vendor info" ON vendors
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all vendors" ON vendors
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'vendor_manager')
    )
  );

CREATE POLICY "Admins can update vendors" ON vendors
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'vendor_manager')
    )
  );

-- RLS policies for vendor_products table
CREATE POLICY "Vendors can view own products" ON vendor_products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM vendors 
      WHERE id = vendor_products.vendor_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Vendors can manage own products" ON vendor_products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM vendors 
      WHERE id = vendor_products.vendor_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all vendor products" ON vendor_products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'vendor_manager')
    )
  );

-- RLS policies for vendor_orders table
CREATE POLICY "Vendors can view own orders" ON vendor_orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM vendors 
      WHERE id = vendor_orders.vendor_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Vendors can update own orders" ON vendor_orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM vendors 
      WHERE id = vendor_orders.vendor_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all vendor orders" ON vendor_orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'vendor_manager')
    )
  );

-- RLS policies for vendor_analytics table
CREATE POLICY "Vendors can view own analytics" ON vendor_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM vendors 
      WHERE id = vendor_analytics.vendor_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all vendor analytics" ON vendor_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'vendor_manager')
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vendors_user_id ON vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_status ON vendors(status);
CREATE INDEX IF NOT EXISTS idx_vendor_products_vendor_id ON vendor_products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_products_product_id ON vendor_products(product_id);
CREATE INDEX IF NOT EXISTS idx_vendor_orders_vendor_id ON vendor_orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_orders_order_id ON vendor_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_vendor_analytics_vendor_id ON vendor_analytics(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_analytics_date ON vendor_analytics(date);

-- Create functions for vendor management
CREATE OR REPLACE FUNCTION update_vendor_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update profile role when vendor is approved
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    UPDATE profiles 
    SET role = 'vendor', 
        vendor_approved_at = NOW(),
        vendor_approved_by = NEW.approved_by
    WHERE id = NEW.user_id;
  END IF;
  
  -- Revert profile role when vendor is rejected
  IF NEW.status = 'rejected' AND OLD.status != 'rejected' THEN
    UPDATE profiles 
    SET role = 'customer'
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for vendor status updates
CREATE TRIGGER trigger_update_vendor_status
  AFTER UPDATE ON vendors
  FOR EACH ROW
  EXECUTE FUNCTION update_vendor_status();

-- Create function to calculate vendor analytics
CREATE OR REPLACE FUNCTION calculate_vendor_analytics(vendor_uuid UUID, target_date DATE)
RETURNS VOID AS $$
DECLARE
  sales_total DECIMAL(10,2);
  orders_count INTEGER;
  products_sold INTEGER;
  avg_rating DECIMAL(3,2);
  reviews_count INTEGER;
BEGIN
  -- Calculate total sales for the day
  SELECT COALESCE(SUM(total_price), 0)
  INTO sales_total
  FROM vendor_orders
  WHERE vendor_id = vendor_uuid
    AND DATE(created_at) = target_date
    AND status = 'completed';
  
  -- Calculate total orders for the day
  SELECT COUNT(DISTINCT order_id)
  INTO orders_count
  FROM vendor_orders
  WHERE vendor_id = vendor_uuid
    AND DATE(created_at) = target_date
    AND status = 'completed';
  
  -- Calculate total products sold for the day
  SELECT COALESCE(SUM(quantity), 0)
  INTO products_sold
  FROM vendor_orders
  WHERE vendor_id = vendor_uuid
    AND DATE(created_at) = target_date
    AND status = 'completed';
  
  -- Calculate average rating for vendor's products
  SELECT COALESCE(AVG(rating), 0), COUNT(*)
  INTO avg_rating, reviews_count
  FROM reviews r
  JOIN vendor_products vp ON r.product_id = vp.product_id
  WHERE vp.vendor_id = vendor_uuid
    AND DATE(r.created_at) = target_date;
  
  -- Insert or update analytics record
  INSERT INTO vendor_analytics (
    vendor_id, 
    date, 
    total_sales, 
    total_orders, 
    total_products_sold, 
    average_rating, 
    total_reviews
  ) VALUES (
    vendor_uuid, 
    target_date, 
    sales_total, 
    orders_count, 
    products_sold, 
    avg_rating, 
    reviews_count
  )
  ON CONFLICT (vendor_id, date)
  DO UPDATE SET
    total_sales = EXCLUDED.total_sales,
    total_orders = EXCLUDED.total_orders,
    total_products_sold = EXCLUDED.total_products_sold,
    average_rating = EXCLUDED.average_rating,
    total_reviews = EXCLUDED.total_reviews,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Create function to assign vendor manager role
CREATE OR REPLACE FUNCTION assign_vendor_manager(user_uuid UUID, assigned_by UUID)
RETURNS VOID AS $$
BEGIN
  -- Check if assigner is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = assigned_by 
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can assign vendor manager role';
  END IF;
  
  -- Update user role to vendor_manager
  UPDATE profiles 
  SET role = 'vendor_manager',
      updated_at = NOW()
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Create function to promote customer to vendor
CREATE OR REPLACE FUNCTION promote_to_vendor(user_uuid UUID, business_info JSONB, assigned_by UUID)
RETURNS UUID AS $$
DECLARE
  vendor_id UUID;
BEGIN
  -- Check if assigner is admin or vendor_manager
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = assigned_by 
    AND role IN ('admin', 'vendor_manager')
  ) THEN
    RAISE EXCEPTION 'Only admins or vendor managers can promote users to vendors';
  END IF;
  
  -- Create vendor record
  INSERT INTO vendors (
    user_id,
    business_name,
    business_type,
    business_registration,
    business_address,
    contact_person,
    contact_email,
    contact_phone,
    payout_method,
    payout_details,
    status,
    approved_by
  ) VALUES (
    user_uuid,
    business_info->>'business_name',
    business_info->>'business_type',
    business_info->>'business_registration',
    business_info->>'business_address',
    business_info->>'contact_person',
    business_info->>'contact_email',
    business_info->>'contact_phone',
    COALESCE(business_info->>'payout_method', 'bank_transfer'),
    business_info->'payout_details',
    'pending',
    assigned_by
  ) RETURNING id INTO vendor_id;
  
  RETURN vendor_id;
END;
$$ LANGUAGE plpgsql;

-- Sample data for testing
INSERT INTO profiles (id, email, full_name, role) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@ihsan.com', 'System Admin', 'admin'),
  ('00000000-0000-0000-0000-000000000002', 'manager@ihsan.com', 'Vendor Manager', 'vendor_manager'),
  ('00000000-0000-0000-0000-000000000003', 'vendor@ihsan.com', 'Test Vendor', 'vendor'),
  ('00000000-0000-0000-0000-000000000004', 'customer@ihsan.com', 'Test Customer', 'customer')
ON CONFLICT (id) DO NOTHING;

-- Sample vendor data
INSERT INTO vendors (
  id,
  user_id,
  business_name,
  business_type,
  business_registration,
  business_address,
  contact_person,
  contact_email,
  contact_phone,
  status,
  approved_by
) VALUES (
  '00000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0000-000000000003',
  'Test Vendor Store',
  'retail',
  'REG123456',
  '123 Business Street, Accra, Ghana',
  'John Vendor',
  'vendor@ihsan.com',
  '+233123456789',
  'approved',
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (id) DO NOTHING;

-- Enable RLS on new tables
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_analytics ENABLE ROW LEVEL SECURITY;

-- Create updated_at triggers for new tables
CREATE TRIGGER update_vendors_updated_at
  BEFORE UPDATE ON vendors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_products_updated_at
  BEFORE UPDATE ON vendor_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_orders_updated_at
  BEFORE UPDATE ON vendor_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_analytics_updated_at
  BEFORE UPDATE ON vendor_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
