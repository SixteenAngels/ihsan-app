-- Add Sample Data for Testing APIs
-- Run these commands in Supabase SQL Editor after fixing RLS policies

-- ==============================================
-- ADD SAMPLE CART ITEMS
-- ==============================================

INSERT INTO cart_items (user_id, product_id, quantity, price) VALUES
('test-user-123', 'f128b621-267e-453c-bcca-68547a1c9a12', 2, 4500), -- iPhone 15 Pro
('test-user-123', '95940f15-dd4d-43c9-b684-07e221aabdd3', 1, 350),  -- Nike Air Max 270
('test-user-456', '58658193-f9a0-4ca1-89df-cf2ff49ba537', 3, 25);   -- Ghana Shea Butter

-- ==============================================
-- ADD SAMPLE ORDERS
-- ==============================================

INSERT INTO orders (user_id, order_number, status, total_amount, shipping_address) VALUES
('test-user-123', 'ORD-001', 'pending', 9350, '{"street": "123 Main St", "city": "Accra", "country": "Ghana"}'),
('test-user-456', 'ORD-002', 'processing', 75, '{"street": "456 Oak Ave", "city": "Kumasi", "country": "Ghana"}');

-- ==============================================
-- ADD SAMPLE ORDER ITEMS
-- ==============================================

-- Get the order IDs first
WITH order_ids AS (
  SELECT id, order_number FROM orders WHERE order_number IN ('ORD-001', 'ORD-002')
)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
SELECT 
  o.id,
  p.id,
  CASE 
    WHEN o.order_number = 'ORD-001' AND p.name = 'iPhone 15 Pro' THEN 2
    WHEN o.order_number = 'ORD-001' AND p.name = 'Nike Air Max 270' THEN 1
    WHEN o.order_number = 'ORD-002' AND p.name = 'Ghana Made Shea Butter' THEN 3
    ELSE 1
  END,
  p.price,
  CASE 
    WHEN o.order_number = 'ORD-001' AND p.name = 'iPhone 15 Pro' THEN p.price * 2
    WHEN o.order_number = 'ORD-001' AND p.name = 'Nike Air Max 270' THEN p.price * 1
    WHEN o.order_number = 'ORD-002' AND p.name = 'Ghana Made Shea Butter' THEN p.price * 3
    ELSE p.price
  END
FROM order_ids o
CROSS JOIN products p
WHERE (o.order_number = 'ORD-001' AND p.name IN ('iPhone 15 Pro', 'Nike Air Max 270'))
   OR (o.order_number = 'ORD-002' AND p.name = 'Ghana Made Shea Butter');

-- ==============================================
-- ADD SAMPLE NOTIFICATIONS
-- ==============================================

INSERT INTO notifications (user_id, type, title, message, is_read) VALUES
('test-user-123', 'order', 'Order Confirmed', 'Your order ORD-001 has been confirmed!', false),
('test-user-123', 'general', 'Welcome to Ihsan', 'Welcome to Ihsan! Start shopping now.', true),
('test-user-456', 'order', 'Order Processing', 'Your order ORD-002 is being processed.', false),
('test-user-456', 'group_buy', 'Group Buy Available', 'New group buy for electronics!', false);

-- ==============================================
-- ADD SAMPLE REVIEWS
-- ==============================================

INSERT INTO reviews (user_id, product_id, rating, title, comment, is_approved) VALUES
('test-user-123', 'f128b621-267e-453c-bcca-68547a1c9a12', 5, 'Amazing iPhone!', 'Best phone I have ever used. Great camera quality!', true),
('test-user-456', '95940f15-dd4d-43c9-b684-07e221aabdd3', 4, 'Comfortable Shoes', 'Very comfortable for running. Good quality.', true),
('test-user-123', '58658193-f9a0-4ca1-89df-cf2ff49ba537', 5, 'Pure Shea Butter', 'Authentic Ghana shea butter. Highly recommended!', true);

-- ==============================================
-- VERIFICATION QUERIES
-- ==============================================

-- Check cart items
SELECT 'Cart Items:' as table_name, COUNT(*) as count FROM cart_items
UNION ALL
SELECT 'Orders:', COUNT(*) FROM orders
UNION ALL  
SELECT 'Order Items:', COUNT(*) FROM order_items
UNION ALL
SELECT 'Notifications:', COUNT(*) FROM notifications
UNION ALL
SELECT 'Reviews:', COUNT(*) FROM reviews;

-- ==============================================
-- SUCCESS MESSAGE
-- ==============================================

SELECT 'Sample data added successfully! APIs should now return test data.' as status;
