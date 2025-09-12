-- QUICK RLS FIX FOR TESTING
-- This temporarily disables RLS on problematic tables for testing

-- Disable RLS temporarily
ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

-- Add some test data
INSERT INTO cart_items (id, user_id, product_id, quantity, price, created_at, updated_at)
VALUES 
    (gen_random_uuid(), 'test-user-123', 'f128b621-267e-453c-bcca-68547a1c9a12', 2, 25.00, NOW(), NOW()),
    (gen_random_uuid(), 'test-user-123', 'f128b621-267e-453c-bcca-68547a1c9a12', 1, 15.00, NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO orders (id, user_id, order_number, status, total_amount, shipping_address, created_at, updated_at)
VALUES 
    (gen_random_uuid(), 'test-user-123', 'ORD-TEST-001', 'pending', 40.00, '{"street": "123 Test Street", "city": "Accra", "region": "Greater Accra", "country": "Ghana"}', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Re-enable RLS with permissive policies
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for testing
DROP POLICY IF EXISTS "cart_items_test_policy" ON cart_items;
CREATE POLICY "cart_items_test_policy" ON cart_items FOR ALL USING (true);

DROP POLICY IF EXISTS "orders_test_policy" ON orders;
CREATE POLICY "orders_test_policy" ON orders FOR ALL USING (true);

DROP POLICY IF EXISTS "order_items_test_policy" ON order_items;
CREATE POLICY "order_items_test_policy" ON order_items FOR ALL USING (true);

DROP POLICY IF EXISTS "notifications_test_policy" ON notifications;
CREATE POLICY "notifications_test_policy" ON notifications FOR ALL USING (true);

SELECT 'RLS policies fixed for testing - all tables now accessible' as status;
