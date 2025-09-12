# 🗄️ STEP 4: RUN DATABASE SCHEMA IN SUPABASE

## 🎯 **EXACT STEPS TO FOLLOW**

### **Step 1: Open Supabase Dashboard**
1. **Go to**: https://supabase.com/dashboard/project/ttsbhuwphtlicgwkqynv
2. **Login** with your Supabase account
3. **Navigate to**: SQL Editor (in the left sidebar)

### **Step 2: Copy the Database Schema**
Copy the **ENTIRE** content from the `database/schema.sql` file (I'll provide it below)

### **Step 3: Paste and Run**
1. **Click** "New Query" in SQL Editor
2. **Paste** the entire schema (all 415 lines)
3. **Click** "Run" button (or press Ctrl+Enter)

## 📋 **COMPLETE DATABASE SCHEMA**

Copy this **ENTIRE** content and paste it into Supabase SQL Editor:

```sql
-- Ihsan E-commerce Database Schema
-- This file contains all the SQL commands to create the database schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'manager', 'support', 'delivery');
CREATE TYPE address_type AS ENUM ('billing', 'shipping');
CREATE TYPE order_status AS ENUM ('pending', 'payment_confirmed', 'processing', 'shipped', 'in_transit', 'arrived', 'out_for_delivery', 'delivered', 'cancelled', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE shipping_method AS ENUM ('air', 'sea');
CREATE TYPE notification_type AS ENUM ('order_update', 'group_buy_reminder', 'ready_now_alert', 'general');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
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

-- Products table
CREATE TABLE products (
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
    category_id UUID REFERENCES categories(id) ON DELETE RESTRICT,
    brand TEXT,
    tags TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_ready_now BOOLEAN DEFAULT false,
    stock_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 0,
    track_inventory BOOLEAN DEFAULT true,
    allow_backorder BOOLEAN DEFAULT false,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product variants table
CREATE TABLE product_variants (
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

-- Addresses table
CREATE TABLE addresses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type address_type NOT NULL,
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

-- Orders table
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE RESTRICT,
    status order_status DEFAULT 'pending',
    shipping_method shipping_method NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'GHS',
    payment_status payment_status DEFAULT 'pending',
    payment_method TEXT,
    payment_reference TEXT,
    shipping_address JSONB NOT NULL,
    billing_address JSONB NOT NULL,
    notes TEXT,
    estimated_delivery_date TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group buys table
CREATE TABLE group_buys (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    min_quantity INTEGER NOT NULL DEFAULT 5,
    max_quantity INTEGER NOT NULL DEFAULT 10,
    current_quantity INTEGER DEFAULT 0,
    price_tiers JSONB NOT NULL DEFAULT '{}',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_extended BOOLEAN DEFAULT false,
    created_by UUID REFERENCES profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group buy participants table
CREATE TABLE group_buy_participants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_buy_id UUID REFERENCES group_buys(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_buy_id, user_id)
);

-- Reviews table
CREATE TABLE reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    title TEXT,
    comment TEXT,
    is_verified BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT true,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, user_id, order_id)
);

-- Cart items table
CREATE TABLE cart_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id, variant_id)
);

-- Notifications table
CREATE TABLE notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_ready_now ON products(is_ready_now);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);

CREATE INDEX idx_product_variants_product ON product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_orders_number ON orders(order_number);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

CREATE INDEX idx_group_buys_product ON group_buys(product_id);
CREATE INDEX idx_group_buys_active ON group_buys(is_active);
CREATE INDEX idx_group_buys_dates ON group_buys(start_date, end_date);

CREATE INDEX idx_group_buy_participants_group ON group_buy_participants(group_buy_id);
CREATE INDEX idx_group_buy_participants_user ON group_buy_participants(user_id);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved);

CREATE INDEX idx_cart_items_user ON cart_items(user_id);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_buy_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- Addresses policies
CREATE POLICY "Users can view own addresses" ON addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own addresses" ON addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own addresses" ON addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own addresses" ON addresses FOR DELETE USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- Order items policies
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_items.order_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can view all order items" ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- Cart items policies
CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);

-- Group buy participants policies
CREATE POLICY "Users can view own group buy participation" ON group_buy_participants FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can join group buys" ON group_buy_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave group buys" ON group_buy_participants FOR DELETE USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Anyone can view approved reviews" ON reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can view own reviews" ON reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_order_items_updated_at BEFORE UPDATE ON order_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_group_buys_updated_at BEFORE UPDATE ON group_buys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_group_buy_participants_updated_at BEFORE UPDATE ON group_buy_participants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    order_num TEXT;
    counter INTEGER;
BEGIN
    -- Get current date in YYYYMMDD format
    SELECT TO_CHAR(NOW(), 'YYYYMMDD') INTO order_num;
    
    -- Get count of orders today
    SELECT COUNT(*) + 1 INTO counter 
    FROM orders 
    WHERE DATE(created_at) = CURRENT_DATE;
    
    -- Format as IH-YYYYMMDD-XXXX
    order_num := 'IH-' || order_num || '-' || LPAD(counter::TEXT, 4, '0');
    
    RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name, role)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'customer');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update group buy current quantity
CREATE OR REPLACE FUNCTION update_group_buy_quantity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE group_buys 
        SET current_quantity = current_quantity + NEW.quantity
        WHERE id = NEW.group_buy_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE group_buys 
        SET current_quantity = current_quantity - OLD.quantity
        WHERE id = OLD.group_buy_id;
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE group_buys 
        SET current_quantity = current_quantity - OLD.quantity + NEW.quantity
        WHERE id = NEW.group_buy_id;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update group buy quantity
CREATE TRIGGER update_group_buy_quantity_trigger
    AFTER INSERT OR UPDATE OR DELETE ON group_buy_participants
    FOR EACH ROW EXECUTE FUNCTION update_group_buy_quantity();

-- Insert sample categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Fashion', 'fashion', 'Clothing, shoes, and accessories', 1),
('Electronics', 'electronics', 'Phones, laptops, gadgets, and tech accessories', 2),
('Beauty', 'beauty', 'Skincare, makeup, and personal care products', 3),
('Bulk Deals', 'bulk-deals', 'Wholesale and bulk purchase opportunities', 4),
('Ready Now', 'ready-now', 'Products available for immediate delivery in Ghana', 5);

-- Insert sample products
INSERT INTO products (name, slug, description, short_description, price, compare_price, sku, category_id, brand, tags, images, is_active, is_featured, is_ready_now, stock_quantity) VALUES
('iPhone 15 Pro', 'iphone-15-pro', 'Latest iPhone with titanium design and advanced camera system', 'Premium smartphone with titanium build', 4500.00, 5000.00, 'IPH15PRO-001', (SELECT id FROM categories WHERE slug = 'electronics'), 'Apple', ARRAY['smartphone', 'premium', 'camera'], ARRAY['https://example.com/iphone15pro1.jpg', 'https://example.com/iphone15pro2.jpg'], true, true, false, 10),
('Nike Air Max 270', 'nike-air-max-270', 'Comfortable running shoes with Air Max technology', 'Comfortable running shoes', 350.00, 400.00, 'NIKE-AM270-001', (SELECT id FROM categories WHERE slug = 'fashion'), 'Nike', ARRAY['shoes', 'running', 'comfortable'], ARRAY['https://example.com/nike270-1.jpg', 'https://example.com/nike270-2.jpg'], true, true, true, 25),
('Ghana Made Shea Butter', 'ghana-shea-butter', 'Pure, organic shea butter made in Ghana', 'Pure organic shea butter', 25.00, 30.00, 'SHEA-001', (SELECT id FROM categories WHERE slug = 'beauty'), 'Ghana Naturals', ARRAY['organic', 'natural', 'skincare'], ARRAY['https://example.com/sheabutter1.jpg'], true, false, true, 100);
```

## ✅ **WHAT THIS SCHEMA CREATES**

### **Database Tables**
- ✅ **profiles** - User accounts with roles
- ✅ **categories** - Product categories  
- ✅ **products** - Product catalog
- ✅ **product_variants** - Product variations
- ✅ **addresses** - User addresses
- ✅ **orders** - Order management
- ✅ **order_items** - Order line items
- ✅ **group_buys** - Group buy campaigns
- ✅ **group_buy_participants** - Group buy users
- ✅ **reviews** - Product reviews
- ✅ **cart_items** - Shopping cart
- ✅ **notifications** - User notifications

### **User Roles**
- ✅ **customer** - Regular shoppers
- ✅ **admin** - Full system access
- ✅ **manager** - Limited admin powers
- ✅ **support** - Customer service
- ✅ **delivery** - Delivery management

### **Security Features**
- ✅ **Row Level Security (RLS)** policies
- ✅ **Role-based access control**
- ✅ **Secure authentication**
- ✅ **Data protection**

### **Sample Data**
- ✅ **5 Categories** (Fashion, Electronics, Beauty, Bulk Deals, Ready Now)
- ✅ **3 Sample Products** (iPhone 15 Pro, Nike Air Max 270, Ghana Shea Butter)

## 🎯 **AFTER RUNNING THE SCHEMA**

### **Step 4a: Create Your First Admin User**
After running the schema, create an admin user:

```sql
-- In Supabase SQL Editor (run this AFTER the main schema)
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';
```

### **Step 4b: Test Your Setup**
```bash
# Test build
npm run build

# Start development server
npm run dev

# Test API health
curl http://localhost:3000/api/health
```

## 🎉 **SUCCESS INDICATORS**

You'll know it worked when you see:
- ✅ **No errors** in Supabase SQL Editor
- ✅ **Tables created** in Supabase Table Editor
- ✅ **Sample data** visible in tables
- ✅ **Build succeeds** with `npm run build`
- ✅ **API health check** returns success

---

**🎉 Run this schema and your Ihsan platform will be fully database-powered!**

**Copy the entire SQL above, paste it into Supabase SQL Editor, and click Run!** 🗄️🚀
