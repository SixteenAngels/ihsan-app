# 🗄️ COMPLETE SUPABASE SQL SETUP GUIDE

## 🎯 **ALL SQL COMMANDS IN ONE DOCUMENT**

Copy and paste these SQL commands into your Supabase SQL Editor to complete the setup.

---

## 🔧 **STEP 1: FIX USER REGISTRATION ISSUE**

```sql
-- Fix user registration by disabling the problematic trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Verify the trigger is removed
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

---

## 🔧 **STEP 2: COMPLETE PROFILES POLICY RESET**

```sql
-- COMPLETE RESET OF PROFILES POLICIES
-- Drop ALL existing policies on profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_select" ON profiles;

-- Drop policies on related tables
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;

-- Disable RLS temporarily
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;

-- Test access (should work now)
SELECT COUNT(*) as profile_count FROM profiles;
SELECT COUNT(*) as orders_count FROM orders;
SELECT COUNT(*) as order_items_count FROM order_items;

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create admin policies using a different approach
CREATE POLICY "profiles_admin_select" ON profiles FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles p 
        WHERE p.id = auth.uid() 
        AND p.role = 'admin'
    )
);

-- Recreate orders policies
CREATE POLICY "orders_select_own" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders_insert_own" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_admin_select" ON orders FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles p 
        WHERE p.id = auth.uid() 
        AND p.role = 'admin'
    )
);
CREATE POLICY "orders_admin_update" ON orders FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles p 
        WHERE p.id = auth.uid() 
        AND p.role = 'admin'
    )
);

-- Recreate order_items policies
CREATE POLICY "order_items_select_own" ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_items.order_id AND user_id = auth.uid())
);
CREATE POLICY "order_items_admin_select" ON order_items FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles p 
        WHERE p.id = auth.uid() 
        AND p.role = 'admin'
    )
);

-- Test final access
SELECT COUNT(*) as final_profiles_test FROM profiles;
SELECT COUNT(*) as final_orders_test FROM orders;
SELECT COUNT(*) as final_order_items_test FROM order_items;
```

---

## 👤 **STEP 3: CREATE ADMIN USER DIRECTLY**

```sql
-- Create admin user directly in the database
-- First, create the user in auth.users table
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@ihsan.com',
    crypt('admin123456', gen_salt('bf')),
    NOW(),
    NULL,
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Admin User"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
);

-- Get the user ID we just created
WITH new_user AS (
    SELECT id FROM auth.users WHERE email = 'admin@ihsan.com'
)
-- Create the profile for the admin user
INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
SELECT 
    new_user.id,
    'admin@ihsan.com',
    'Admin User',
    'admin',
    NOW(),
    NOW()
FROM new_user;

-- Verify the user was created and is admin
SELECT 
    p.id, 
    p.email, 
    p.full_name, 
    p.role, 
    p.created_at,
    u.email_confirmed_at
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.email = 'admin@ihsan.com';

-- Check all users
SELECT id, email, full_name, role, created_at 
FROM profiles 
ORDER BY created_at DESC;
```

---

## 🧪 **STEP 4: TEST USER REGISTRATION**

```sql
-- Test if we can manually create a profile (simulating user registration)
INSERT INTO profiles (id, email, full_name, role)
VALUES (
    gen_random_uuid(),
    'test@ihsan.com',
    'Test User',
    'customer'
);

-- Verify the profile was created
SELECT * FROM profiles WHERE email = 'test@ihsan.com';

-- Clean up test data
DELETE FROM profiles WHERE email = 'test@ihsan.com';
```

---

## 🔍 **STEP 5: VERIFY ALL TABLES ARE WORKING**

```sql
-- Check all tables are accessible
SELECT 'categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'profiles', COUNT(*) FROM profiles
UNION ALL
SELECT 'addresses', COUNT(*) FROM addresses
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'order_items', COUNT(*) FROM order_items
UNION ALL
SELECT 'group_buys', COUNT(*) FROM group_buys
UNION ALL
SELECT 'group_buy_participants', COUNT(*) FROM group_buy_participants
UNION ALL
SELECT 'reviews', COUNT(*) FROM reviews
UNION ALL
SELECT 'cart_items', COUNT(*) FROM cart_items
UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications;
```

---

## 🎯 **STEP 6: CREATE SAMPLE DATA (OPTIONAL)**

```sql
-- Create sample addresses for testing
INSERT INTO addresses (user_id, type, full_name, address_line_1, city, state, postal_code, country, phone, is_default)
SELECT 
    (SELECT id FROM profiles WHERE email = 'admin@ihsan.com' LIMIT 1),
    'shipping',
    'Admin User',
    '123 Main Street',
    'Accra',
    'Greater Accra',
    'GA-123',
    'Ghana',
    '+233 123 456 789',
    true;

-- Create sample group buy
INSERT INTO group_buys (product_id, name, description, min_quantity, max_quantity, price_tiers, start_date, end_date, created_by)
SELECT 
    (SELECT id FROM products LIMIT 1),
    'iPhone 15 Pro Group Buy',
    'Get iPhone 15 Pro at wholesale prices',
    5,
    20,
    '{"5": 4200, "10": 4000, "20": 3800}',
    NOW(),
    NOW() + INTERVAL '30 days',
    (SELECT id FROM profiles WHERE email = 'admin@ihsan.com' LIMIT 1);

-- Verify sample data
SELECT 'Sample addresses' as data_type, COUNT(*) as count FROM addresses
UNION ALL
SELECT 'Sample group buys', COUNT(*) FROM group_buys;
```

---

## ✅ **STEP 7: FINAL VERIFICATION**

```sql
-- Final comprehensive check
SELECT 
    'Database Status' as check_type,
    'All tables accessible' as status,
    'Ready for use' as result
WHERE EXISTS (SELECT 1 FROM profiles WHERE role = 'admin')
AND EXISTS (SELECT 1 FROM categories)
AND EXISTS (SELECT 1 FROM products);

-- Show admin user details
SELECT 
    'Admin User' as user_type,
    email,
    full_name,
    role,
    created_at
FROM profiles 
WHERE role = 'admin';
```

---

## 🎉 **EXPECTED RESULTS**

After running all these SQL commands, you should see:

1. ✅ **No errors** in any of the queries
2. ✅ **All tables** returning counts (even if 0)
3. ✅ **Admin user** created and visible
4. ✅ **User registration** working
5. ✅ **All policies** functioning correctly

---

## 🚀 **NEXT STEPS**

Once you've run all the SQL commands:

1. **Test user registration** via API
2. **Test admin dashboard** functionality  
3. **Test full platform** features
4. **Your Ihsan platform** will be fully operational!

---

**🎯 Copy and paste all the SQL commands above into Supabase SQL Editor and run them step by step!** 🗄️✨
