-- =====================================================
-- IHSAN E-COMMERCE COMPLETE DATABASE SETUP
-- =====================================================
-- This is the ONLY SQL file you need to run
-- It creates all tables, policies, functions, and fixes all errors
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- CLEAN SLATE SETUP (Optional - Uncomment if you want fresh start)
-- =====================================================
-- Uncomment the following lines if you want to start completely fresh
-- WARNING: This will delete ALL existing data!

/*
DROP TABLE IF EXISTS group_buy_participants CASCADE;
DROP TABLE IF EXISTS group_buys CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
*/

-- =====================================================
-- PROFILES TABLE (Users)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'manager', 'vendor', 'support', 'delivery')),
  vendor_status TEXT DEFAULT 'pending' CHECK (vendor_status IN ('pending', 'approved', 'suspended', 'rejected')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to profiles table if they don't exist
DO $$ 
BEGIN
    -- Add vendor_status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'vendor_status') THEN
        ALTER TABLE profiles ADD COLUMN vendor_status TEXT DEFAULT 'pending' CHECK (vendor_status IN ('pending', 'approved', 'suspended', 'rejected'));
        RAISE NOTICE 'Added vendor_status column to profiles table';
    END IF;
    
    -- Add is_active column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'is_active') THEN
        ALTER TABLE profiles ADD COLUMN is_active BOOLEAN DEFAULT true;
        RAISE NOTICE 'Added is_active column to profiles table';
    END IF;
    
    -- Add last_login column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'last_login') THEN
        ALTER TABLE profiles ADD COLUMN last_login TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Added last_login column to profiles table';
    END IF;
END $$;

-- =====================================================
-- CATEGORIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  sku TEXT UNIQUE NOT NULL,
  barcode TEXT,
  weight DECIMAL(8,2),
  dimensions TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  brand TEXT,
  tags TEXT[],
  images TEXT[],
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_ready_now BOOLEAN DEFAULT false,
  stock_quantity INTEGER DEFAULT 0,
  min_stock_level INTEGER DEFAULT 0,
  track_inventory BOOLEAN DEFAULT true,
  allow_backorder BOOLEAN DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  vendor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  approved BOOLEAN DEFAULT false,
  hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to products table if they don't exist
DO $$ 
BEGIN
    -- Add approved column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'approved') THEN
        ALTER TABLE products ADD COLUMN approved BOOLEAN DEFAULT false;
        RAISE NOTICE 'Added approved column to products table';
    END IF;
    
    -- Add hidden column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'hidden') THEN
        ALTER TABLE products ADD COLUMN hidden BOOLEAN DEFAULT false;
        RAISE NOTICE 'Added hidden column to products table';
    END IF;
    
    -- Add vendor_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'vendor_id') THEN
        ALTER TABLE products ADD COLUMN vendor_id UUID REFERENCES profiles(id) ON DELETE SET NULL;
        RAISE NOTICE 'Added vendor_id column to products table';
    END IF;
    
    -- Add is_ready_now column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'is_ready_now') THEN
        ALTER TABLE products ADD COLUMN is_ready_now BOOLEAN DEFAULT false;
        RAISE NOTICE 'Added is_ready_now column to products table';
    END IF;
    
    -- Add missing columns that might be needed
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'short_description') THEN
        ALTER TABLE products ADD COLUMN short_description TEXT;
        RAISE NOTICE 'Added short_description column to products table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'cost_price') THEN
        ALTER TABLE products ADD COLUMN cost_price DECIMAL(10,2);
        RAISE NOTICE 'Added cost_price column to products table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'barcode') THEN
        ALTER TABLE products ADD COLUMN barcode TEXT;
        RAISE NOTICE 'Added barcode column to products table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'weight') THEN
        ALTER TABLE products ADD COLUMN weight DECIMAL(8,2);
        RAISE NOTICE 'Added weight column to products table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'dimensions') THEN
        ALTER TABLE products ADD COLUMN dimensions TEXT;
        RAISE NOTICE 'Added dimensions column to products table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'tags') THEN
        ALTER TABLE products ADD COLUMN tags TEXT[];
        RAISE NOTICE 'Added tags column to products table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'images') THEN
        ALTER TABLE products ADD COLUMN images TEXT[];
        RAISE NOTICE 'Added images column to products table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'is_featured') THEN
        ALTER TABLE products ADD COLUMN is_featured BOOLEAN DEFAULT false;
        RAISE NOTICE 'Added is_featured column to products table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'min_stock_level') THEN
        ALTER TABLE products ADD COLUMN min_stock_level INTEGER DEFAULT 0;
        RAISE NOTICE 'Added min_stock_level column to products table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'track_inventory') THEN
        ALTER TABLE products ADD COLUMN track_inventory BOOLEAN DEFAULT true;
        RAISE NOTICE 'Added track_inventory column to products table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'allow_backorder') THEN
        ALTER TABLE products ADD COLUMN allow_backorder BOOLEAN DEFAULT false;
        RAISE NOTICE 'Added allow_backorder column to products table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'meta_title') THEN
        ALTER TABLE products ADD COLUMN meta_title TEXT;
        RAISE NOTICE 'Added meta_title column to products table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'meta_description') THEN
        ALTER TABLE products ADD COLUMN meta_description TEXT;
        RAISE NOTICE 'Added meta_description column to products table';
    END IF;
END $$;

-- =====================================================
-- PRODUCT VARIANTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  attributes JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ORDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'payment_confirmed', 'processing', 'shipped', 'in_transit', 'arrived', 'out_for_delivery', 'delivered', 'cancelled', 'refunded')),
  shipping_method TEXT DEFAULT 'air' CHECK (shipping_method IN ('air', 'sea')),
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'GHS',
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT,
  payment_reference TEXT,
  shipping_address JSONB NOT NULL,
  billing_address JSONB NOT NULL,
  notes TEXT,
  estimated_delivery_date TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  escrow_status TEXT DEFAULT 'pending' CHECK (escrow_status IN ('pending', 'released', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to orders table if they don't exist
DO $$ 
BEGIN
    -- Add escrow_status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'escrow_status') THEN
        ALTER TABLE orders ADD COLUMN escrow_status TEXT DEFAULT 'pending' CHECK (escrow_status IN ('pending', 'released', 'refunded'));
        RAISE NOTICE 'Added escrow_status column to orders table';
    END IF;
    
    -- Add estimated_delivery_date column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'estimated_delivery_date') THEN
        ALTER TABLE orders ADD COLUMN estimated_delivery_date TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Added estimated_delivery_date column to orders table';
    END IF;
    
    -- Add delivered_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'delivered_at') THEN
        ALTER TABLE orders ADD COLUMN delivered_at TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Added delivered_at column to orders table';
    END IF;
    
    -- Add notes column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'notes') THEN
        ALTER TABLE orders ADD COLUMN notes TEXT;
        RAISE NOTICE 'Added notes column to orders table';
    END IF;
END $$;

-- =====================================================
-- ORDER ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PAYMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reference TEXT UNIQUE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'GHS',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'cancelled')),
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  paystack_reference TEXT,
  authorization_url TEXT,
  payment_method TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CART ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id, variant_id)
);

-- =====================================================
-- WISHLIST ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id, variant_id)
);

-- =====================================================
-- ADDRESSES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('billing', 'shipping')),
  full_name TEXT NOT NULL,
  company TEXT,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Ghana',
  phone TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- REVIEWS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('order_update', 'group_buy_reminder', 'ready_now_alert', 'general', 'vendor_approval', 'product_approval')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- GROUP BUYS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS group_buys (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  min_quantity INTEGER NOT NULL,
  max_quantity INTEGER NOT NULL,
  current_quantity INTEGER DEFAULT 0,
  price_tiers JSONB NOT NULL DEFAULT '{}',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_extended BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- GROUP BUY PARTICIPANTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS group_buy_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_buy_id UUID REFERENCES group_buys(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_buys ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_buy_participants ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id::text = auth.uid()::text AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create helper function to check if user is manager
CREATE OR REPLACE FUNCTION is_manager()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id::text = auth.uid()::text AND role IN ('admin', 'manager')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create helper function to check if user is vendor
CREATE OR REPLACE FUNCTION is_vendor()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id::text = auth.uid()::text AND role = 'vendor' AND vendor_status = 'approved'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Managers can view all profiles" ON profiles;
CREATE POLICY "Managers can view all profiles" ON profiles
  FOR SELECT USING (is_manager());

-- Categories policies
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (is_admin());

-- Products policies
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (is_active = true AND approved = true AND hidden = false);

DROP POLICY IF EXISTS "Admins can manage all products" ON products;
CREATE POLICY "Admins can manage all products" ON products
  FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Managers can manage all products" ON products;
CREATE POLICY "Managers can manage all products" ON products
  FOR ALL USING (is_manager());

DROP POLICY IF EXISTS "Vendors can manage own products" ON products;
CREATE POLICY "Vendors can manage own products" ON products
  FOR ALL USING (is_vendor() AND vendor_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Vendors can view own products" ON products;
CREATE POLICY "Vendors can view own products" ON products
  FOR SELECT USING (is_vendor() AND vendor_id::text = auth.uid()::text);

-- Product variants policies
DROP POLICY IF EXISTS "Product variants are viewable by everyone" ON product_variants;
CREATE POLICY "Product variants are viewable by everyone" ON product_variants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE id::text = product_variants.product_id::text 
      AND is_active = true AND approved = true AND hidden = false
    )
  );

DROP POLICY IF EXISTS "Admins can manage product variants" ON product_variants;
CREATE POLICY "Admins can manage product variants" ON product_variants
  FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Vendors can manage own product variants" ON product_variants;
CREATE POLICY "Vendors can manage own product variants" ON product_variants
  FOR ALL USING (
    is_vendor() AND     EXISTS (
      SELECT 1 FROM products 
      WHERE id::text = product_variants.product_id::text AND vendor_id::text = auth.uid()::text
    )
  );

-- Orders policies
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "Managers can view all orders" ON orders;
CREATE POLICY "Managers can view all orders" ON orders
  FOR SELECT USING (is_manager());

DROP POLICY IF EXISTS "Users can create orders" ON orders;
CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Admins can update orders" ON orders;
CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Managers can update orders" ON orders;
CREATE POLICY "Managers can update orders" ON orders
  FOR UPDATE USING (is_manager());

-- Order items policies
DROP POLICY IF EXISTS "Order items are viewable by order owner" ON order_items;
CREATE POLICY "Order items are viewable by order owner" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE id::text = order_items.order_id::text AND user_id::text = auth.uid()::text
    )
  );

DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
CREATE POLICY "Admins can view all order items" ON order_items
  FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "Managers can view all order items" ON order_items;
CREATE POLICY "Managers can view all order items" ON order_items
  FOR SELECT USING (is_manager());

-- Payments policies
DROP POLICY IF EXISTS "Admins can view all payments" ON payments;
CREATE POLICY "Admins can view all payments" ON payments
  FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "Managers can view all payments" ON payments;
CREATE POLICY "Managers can view all payments" ON payments
  FOR SELECT USING (is_manager());

DROP POLICY IF EXISTS "Users can view own payments" ON payments;
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE id::text = payments.order_id::text AND user_id::text = auth.uid()::text
    )
  );

-- Cart items policies
DROP POLICY IF EXISTS "Users can manage own cart" ON cart_items;
CREATE POLICY "Users can manage own cart" ON cart_items
  FOR ALL USING (user_id::text = auth.uid()::text);

-- Wishlist items policies
DROP POLICY IF EXISTS "Users can manage own wishlist" ON wishlist_items;
CREATE POLICY "Users can manage own wishlist" ON wishlist_items
  FOR ALL USING (user_id::text = auth.uid()::text);

-- Addresses policies
DROP POLICY IF EXISTS "Users can manage own addresses" ON addresses;
CREATE POLICY "Users can manage own addresses" ON addresses
  FOR ALL USING (user_id::text = auth.uid()::text);

-- Reviews policies
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (is_approved = true);

DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Admins can manage all reviews" ON reviews;
CREATE POLICY "Admins can manage all reviews" ON reviews
  FOR ALL USING (is_admin());

-- Notifications policies
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Admins can manage all notifications" ON notifications;
CREATE POLICY "Admins can manage all notifications" ON notifications
  FOR ALL USING (is_admin());

-- Group buys policies
DROP POLICY IF EXISTS "Group buys are viewable by everyone" ON group_buys;
CREATE POLICY "Group buys are viewable by everyone" ON group_buys
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage group buys" ON group_buys;
CREATE POLICY "Admins can manage group buys" ON group_buys
  FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Managers can manage group buys" ON group_buys;
CREATE POLICY "Managers can manage group buys" ON group_buys
  FOR ALL USING (is_manager());

-- Group buy participants policies
DROP POLICY IF EXISTS "Group buy participants are viewable by everyone" ON group_buy_participants;
CREATE POLICY "Group buy participants are viewable by everyone" ON group_buy_participants
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can join group buys" ON group_buy_participants;
CREATE POLICY "Users can join group buys" ON group_buy_participants
  FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Users can update own group buy participation" ON group_buy_participants;
CREATE POLICY "Users can update own group buy participation" ON group_buy_participants
  FOR UPDATE USING (user_id::text = auth.uid()::text);

-- =====================================================
-- TRIGGERS AND FUNCTIONS
-- =====================================================

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to handle user updates
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET 
    email = NEW.email,
    updated_at = NOW()
  WHERE id::text = NEW.id::text;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user updates
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_variants_updated_at ON product_variants;
CREATE TRIGGER update_product_variants_updated_at
  BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_order_items_updated_at ON order_items;
CREATE TRIGGER update_order_items_updated_at
  BEFORE UPDATE ON order_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_cart_items_updated_at ON cart_items;
CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_addresses_updated_at ON addresses;
CREATE TRIGGER update_addresses_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_notifications_updated_at ON notifications;
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_group_buys_updated_at ON group_buys;
CREATE TRIGGER update_group_buys_updated_at
  BEFORE UPDATE ON group_buys
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_group_buy_participants_updated_at ON group_buy_participants;
CREATE TRIGGER update_group_buy_participants_updated_at
  BEFORE UPDATE ON group_buy_participants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_vendor_status ON profiles(vendor_status);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_approved ON products(approved);
CREATE INDEX IF NOT EXISTS idx_products_hidden ON products(hidden);
CREATE INDEX IF NOT EXISTS idx_products_is_ready_now ON products(is_ready_now);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(reference);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_id ON wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_group_buys_product_id ON group_buys(product_id);
CREATE INDEX IF NOT EXISTS idx_group_buy_participants_group_buy_id ON group_buy_participants(group_buy_id);

-- =====================================================
-- PERMISSIONS
-- =====================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- =====================================================
-- DEFAULT DATA
-- =====================================================

-- Insert default categories
INSERT INTO categories (id, name, slug, description, sort_order) VALUES
  (uuid_generate_v4(), 'Electronics', 'electronics', 'Electronic devices and accessories', 1),
  (uuid_generate_v4(), 'Fashion', 'fashion', 'Clothing and fashion accessories', 2),
  (uuid_generate_v4(), 'Home & Garden', 'home-garden', 'Home improvement and garden supplies', 3),
  (uuid_generate_v4(), 'Automotive', 'automotive', 'Car parts and automotive accessories', 4),
  (uuid_generate_v4(), 'Books & Media', 'books-media', 'Books, movies, and media', 5),
  (uuid_generate_v4(), 'Health & Beauty', 'health-beauty', 'Health and beauty products', 6),
  (uuid_generate_v4(), 'Baby & Kids', 'baby-kids', 'Products for babies and children', 7)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products (you'll need to replace the category_id with actual UUIDs from your categories)
INSERT INTO products (id, name, slug, description, price, compare_price, brand, stock_quantity, is_active, category_id, images, is_ready_now, approved, hidden, vendor_id) VALUES
('prod-iphone-15', 'iPhone 15 Pro', 'iphone-15-pro', 'Latest iPhone with advanced camera system', 4500.00, 5000.00, 'Apple', 25, true, (SELECT id FROM categories WHERE slug = 'electronics' LIMIT 1), '["/api/placeholder/400/400"]', true, true, false, NULL),
('prod-macbook-air', 'MacBook Air M2', 'macbook-air-m2', 'Powerful laptop with M2 chip', 3500.00, 4000.00, 'Apple', 15, true, (SELECT id FROM categories WHERE slug = 'electronics' LIMIT 1), '["/api/placeholder/400/400"]', true, true, false, NULL),
('prod-airpods-pro', 'AirPods Pro 2nd Gen', 'airpods-pro-2', 'Wireless earbuds with noise cancellation', 250.00, 300.00, 'Apple', 50, true, (SELECT id FROM categories WHERE slug = 'electronics' LIMIT 1), '["/api/placeholder/400/400"]', true, true, false, NULL),
('prod-ps5', 'PlayStation 5', 'playstation-5', 'Next-gen gaming console', 800.00, 900.00, 'Sony', 10, true, (SELECT id FROM categories WHERE slug = 'electronics' LIMIT 1), '["/api/placeholder/400/400"]', false, true, false, NULL),
('prod-samsung-s24', 'Samsung Galaxy S24', 'samsung-galaxy-s24', 'Flagship Android smartphone', 1200.00, 1400.00, 'Samsung', 30, true, (SELECT id FROM categories WHERE slug = 'electronics' LIMIT 1), '["/api/placeholder/400/400"]', true, true, false, NULL),
('prod-dell-xps', 'Dell XPS 13', 'dell-xps-13', 'Premium ultrabook laptop', 1800.00, 2000.00, 'Dell', 20, true, (SELECT id FROM categories WHERE slug = 'electronics' LIMIT 1), '["/api/placeholder/400/400"]', true, true, false, NULL),
('prod-sony-wh1000', 'Sony WH-1000XM5', 'sony-wh1000xm5', 'Noise-cancelling wireless headphones', 400.00, 450.00, 'Sony', 35, true, (SELECT id FROM categories WHERE slug = 'electronics' LIMIT 1), '["/api/placeholder/400/400"]', true, true, false, NULL),
('prod-nintendo-switch', 'Nintendo Switch OLED', 'nintendo-switch-oled', 'Handheld gaming console', 350.00, 400.00, 'Nintendo', 25, true, (SELECT id FROM categories WHERE slug = 'electronics' LIMIT 1), '["/api/placeholder/400/400"]', true, true, false, NULL),
('prod-nike-air-max', 'Nike Air Max 270', 'nike-air-max-270', 'Comfortable running shoes', 150.00, 180.00, 'Nike', 100, true, (SELECT id FROM categories WHERE slug = 'fashion' LIMIT 1), '["/api/placeholder/400/400"]', true, true, false, NULL),
('prod-ikea-desk', 'IKEA Bekant Desk', 'ikea-bekant-desk', 'Modern office desk', 200.00, 250.00, 'IKEA', 15, true, (SELECT id FROM categories WHERE slug = 'home-garden' LIMIT 1), '["/api/placeholder/400/400"]', false, true, false, NULL),
('prod-canon-eos', 'Canon EOS R5', 'canon-eos-r5', 'Professional mirrorless camera', 2500.00, 3000.00, 'Canon', 8, true, (SELECT id FROM categories WHERE slug = 'electronics' LIMIT 1), '["/api/placeholder/400/400"]', false, true, false, NULL),
('prod-tesla-model3', 'Tesla Model 3 Accessories', 'tesla-model3-accessories', 'Premium car accessories', 500.00, 600.00, 'Tesla', 5, true, (SELECT id FROM categories WHERE slug = 'automotive' LIMIT 1), '["/api/placeholder/400/400"]', false, true, false, NULL)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- TRACKING EVENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS tracking_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CHAT ROOMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_rooms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  support_agent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'waiting')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  subject TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  closed_at TIMESTAMP WITH TIME ZONE,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CHAT MESSAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'agent', 'system')),
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CHAT PARTICIPANTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  left_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY FOR NEW TABLES
-- =====================================================
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES FOR TRACKING EVENTS
-- =====================================================
DROP POLICY IF EXISTS "Users can view own order tracking" ON tracking_events;
CREATE POLICY "Users can view own order tracking" ON tracking_events
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders WHERE user_id::text = auth.uid()::text
    )
  );

DROP POLICY IF EXISTS "Admins can manage all tracking" ON tracking_events;
CREATE POLICY "Admins can manage all tracking" ON tracking_events
  FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Managers can manage all tracking" ON tracking_events;
CREATE POLICY "Managers can manage all tracking" ON tracking_events
  FOR ALL USING (is_manager());

-- =====================================================
-- RLS POLICIES FOR CHAT ROOMS
-- =====================================================
DROP POLICY IF EXISTS "Users can view own chat rooms" ON chat_rooms;
CREATE POLICY "Users can view own chat rooms" ON chat_rooms
  FOR SELECT USING (
    customer_id::text = auth.uid()::text OR 
    support_agent_id::text = auth.uid()::text OR
    is_admin() OR is_manager()
  );

DROP POLICY IF EXISTS "Users can create chat rooms" ON chat_rooms;
CREATE POLICY "Users can create chat rooms" ON chat_rooms
  FOR INSERT WITH CHECK (customer_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Support agents can update chat rooms" ON chat_rooms;
CREATE POLICY "Support agents can update chat rooms" ON chat_rooms
  FOR UPDATE USING (
    support_agent_id::text = auth.uid()::text OR
    is_admin() OR is_manager()
  );

-- =====================================================
-- RLS POLICIES FOR CHAT MESSAGES
-- =====================================================
DROP POLICY IF EXISTS "Users can view chat messages in their rooms" ON chat_messages;
CREATE POLICY "Users can view chat messages in their rooms" ON chat_messages
  FOR SELECT USING (
    room_id IN (
      SELECT id FROM chat_rooms 
      WHERE customer_id::text = auth.uid()::text OR 
            support_agent_id::text = auth.uid()::text OR
            is_admin() OR is_manager()
    )
  );

DROP POLICY IF EXISTS "Users can send messages in their rooms" ON chat_messages;
CREATE POLICY "Users can send messages in their rooms" ON chat_messages
  FOR INSERT WITH CHECK (
    sender_id::text = auth.uid()::text AND
    room_id IN (
      SELECT id FROM chat_rooms 
      WHERE customer_id::text = auth.uid()::text OR 
            support_agent_id::text = auth.uid()::text OR
            is_admin() OR is_manager()
    )
  );

-- =====================================================
-- RLS POLICIES FOR CHAT PARTICIPANTS
-- =====================================================
DROP POLICY IF EXISTS "Users can view participants in their rooms" ON chat_participants;
CREATE POLICY "Users can view participants in their rooms" ON chat_participants
  FOR SELECT USING (
    room_id IN (
      SELECT id FROM chat_rooms 
      WHERE customer_id::text = auth.uid()::text OR 
            support_agent_id::text = auth.uid()::text OR
            is_admin() OR is_manager()
    )
  );

DROP POLICY IF EXISTS "Users can join chat rooms" ON chat_participants;
CREATE POLICY "Users can join chat rooms" ON chat_participants
  FOR INSERT WITH CHECK (
    user_id::text = auth.uid()::text AND
    room_id IN (
      SELECT id FROM chat_rooms 
      WHERE customer_id::text = auth.uid()::text OR 
            support_agent_id::text = auth.uid()::text OR
            is_admin() OR is_manager()
    )
  );

-- =====================================================
-- INDEXES FOR NEW TABLES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_tracking_events_order_id ON tracking_events(order_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_timestamp ON tracking_events(timestamp);

CREATE INDEX IF NOT EXISTS idx_chat_rooms_customer_id ON chat_rooms(customer_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_support_agent_id ON chat_rooms(support_agent_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_status ON chat_rooms(status);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_last_message_at ON chat_rooms(last_message_at);

CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

CREATE INDEX IF NOT EXISTS idx_chat_participants_room_id ON chat_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_user_id ON chat_participants(user_id);

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT 'IHSAN E-COMMERCE DATABASE SETUP COMPLETED SUCCESSFULLY!' as message,
       'All tables, policies, functions, and triggers have been created.' as details,
       'You can now use the application without database errors.' as status;
