-- COMPREHENSIVE RLS POLICY FIXES FOR IHSAAN PLATFORM
-- This script fixes all RLS policies causing 500 errors

-- 1. Fix cart_items table RLS policies
DROP POLICY IF EXISTS "cart_items_select_policy" ON cart_items;
DROP POLICY IF EXISTS "cart_items_insert_policy" ON cart_items;
DROP POLICY IF EXISTS "cart_items_update_policy" ON cart_items;
DROP POLICY IF EXISTS "cart_items_delete_policy" ON cart_items;

-- Enable RLS on cart_items
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Create new cart_items policies
CREATE POLICY "cart_items_select_policy" ON cart_items
    FOR SELECT USING (
        auth.uid()::text = user_id OR 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid()::text 
            AND profiles.role IN ('admin', 'manager')
        )
    );

CREATE POLICY "cart_items_insert_policy" ON cart_items
    FOR INSERT WITH CHECK (
        auth.uid()::text = user_id
    );

CREATE POLICY "cart_items_update_policy" ON cart_items
    FOR UPDATE USING (
        auth.uid()::text = user_id OR 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid()::text 
            AND profiles.role IN ('admin', 'manager')
        )
    );

CREATE POLICY "cart_items_delete_policy" ON cart_items
    FOR DELETE USING (
        auth.uid()::text = user_id OR 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid()::text 
            AND profiles.role IN ('admin', 'manager')
        )
    );

-- 2. Fix orders table RLS policies
DROP POLICY IF EXISTS "orders_select_policy" ON orders;
DROP POLICY IF EXISTS "orders_insert_policy" ON orders;
DROP POLICY IF EXISTS "orders_update_policy" ON orders;
DROP POLICY IF EXISTS "orders_delete_policy" ON orders;

-- Enable RLS on orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create new orders policies
CREATE POLICY "orders_select_policy" ON orders
    FOR SELECT USING (
        auth.uid()::text = user_id OR 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid()::text 
            AND profiles.role IN ('admin', 'manager', 'support_agent', 'delivery_agent')
        )
    );

CREATE POLICY "orders_insert_policy" ON orders
    FOR INSERT WITH CHECK (
        auth.uid()::text = user_id
    );

CREATE POLICY "orders_update_policy" ON orders
    FOR UPDATE USING (
        auth.uid()::text = user_id OR 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid()::text 
            AND profiles.role IN ('admin', 'manager', 'support_agent', 'delivery_agent')
        )
    );

CREATE POLICY "orders_delete_policy" ON orders
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid()::text 
            AND profiles.role IN ('admin', 'manager')
        )
    );

-- 3. Fix order_items table RLS policies
DROP POLICY IF EXISTS "order_items_select_policy" ON order_items;
DROP POLICY IF EXISTS "order_items_insert_policy" ON order_items;
DROP POLICY IF EXISTS "order_items_update_policy" ON order_items;
DROP POLICY IF EXISTS "order_items_delete_policy" ON order_items;

-- Enable RLS on order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create new order_items policies
CREATE POLICY "order_items_select_policy" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND (
                orders.user_id = auth.uid()::text OR 
                EXISTS (
                    SELECT 1 FROM profiles 
                    WHERE profiles.id = auth.uid()::text 
                    AND profiles.role IN ('admin', 'manager', 'support_agent', 'delivery_agent')
                )
            )
        )
    );

CREATE POLICY "order_items_insert_policy" ON order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()::text
        )
    );

CREATE POLICY "order_items_update_policy" ON order_items
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND (
                orders.user_id = auth.uid()::text OR 
                EXISTS (
                    SELECT 1 FROM profiles 
                    WHERE profiles.id = auth.uid()::text 
                    AND profiles.role IN ('admin', 'manager', 'support_agent', 'delivery_agent')
                )
            )
        )
    );

CREATE POLICY "order_items_delete_policy" ON order_items
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND EXISTS (
                SELECT 1 FROM profiles 
                WHERE profiles.id = auth.uid()::text 
                AND profiles.role IN ('admin', 'manager')
            )
        )
    );

-- 4. Fix notifications table RLS policies
DROP POLICY IF EXISTS "notifications_select_policy" ON notifications;
DROP POLICY IF EXISTS "notifications_insert_policy" ON notifications;
DROP POLICY IF EXISTS "notifications_update_policy" ON notifications;
DROP POLICY IF EXISTS "notifications_delete_policy" ON notifications;

-- Enable RLS on notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create new notifications policies
CREATE POLICY "notifications_select_policy" ON notifications
    FOR SELECT USING (
        auth.uid()::text = user_id OR 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid()::text 
            AND profiles.role IN ('admin', 'manager', 'support_agent')
        )
    );

CREATE POLICY "notifications_insert_policy" ON notifications
    FOR INSERT WITH CHECK (
        auth.uid()::text = user_id OR 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid()::text 
            AND profiles.role IN ('admin', 'manager', 'support_agent')
        )
    );

CREATE POLICY "notifications_update_policy" ON notifications
    FOR UPDATE USING (
        auth.uid()::text = user_id OR 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid()::text 
            AND profiles.role IN ('admin', 'manager', 'support_agent')
        )
    );

CREATE POLICY "notifications_delete_policy" ON notifications
    FOR DELETE USING (
        auth.uid()::text = user_id OR 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid()::text 
            AND profiles.role IN ('admin', 'manager')
        )
    );

-- 5. Fix reviews table RLS policies
DROP POLICY IF EXISTS "reviews_select_policy" ON reviews;
DROP POLICY IF EXISTS "reviews_insert_policy" ON reviews;
DROP POLICY IF EXISTS "reviews_update_policy" ON reviews;
DROP POLICY IF EXISTS "reviews_delete_policy" ON reviews;

-- Enable RLS on reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create new reviews policies
CREATE POLICY "reviews_select_policy" ON reviews
    FOR SELECT USING (true); -- Allow public read access

CREATE POLICY "reviews_insert_policy" ON reviews
    FOR INSERT WITH CHECK (
        auth.uid()::text = user_id
    );

CREATE POLICY "reviews_update_policy" ON reviews
    FOR UPDATE USING (
        auth.uid()::text = user_id OR 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid()::text 
            AND profiles.role IN ('admin', 'manager')
        )
    );

CREATE POLICY "reviews_delete_policy" ON reviews
    FOR DELETE USING (
        auth.uid()::text = user_id OR 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid()::text 
            AND profiles.role IN ('admin', 'manager')
        )
    );

-- 6. Fix group_buys table RLS policies
DROP POLICY IF EXISTS "group_buys_select_policy" ON group_buys;
DROP POLICY IF EXISTS "group_buys_insert_policy" ON group_buys;
DROP POLICY IF EXISTS "group_buys_update_policy" ON group_buys;
DROP POLICY IF EXISTS "group_buys_delete_policy" ON group_buys;

-- Enable RLS on group_buys
ALTER TABLE group_buys ENABLE ROW LEVEL SECURITY;

-- Create new group_buys policies
CREATE POLICY "group_buys_select_policy" ON group_buys
    FOR SELECT USING (true); -- Allow public read access

CREATE POLICY "group_buys_insert_policy" ON group_buys
    FOR INSERT WITH CHECK (
        auth.uid()::text = created_by OR 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid()::text 
            AND profiles.role IN ('admin', 'manager')
        )
    );

CREATE POLICY "group_buys_update_policy" ON group_buys
    FOR UPDATE USING (
        auth.uid()::text = created_by OR 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid()::text 
            AND profiles.role IN ('admin', 'manager')
        )
    );

CREATE POLICY "group_buys_delete_policy" ON group_buys
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid()::text 
            AND profiles.role IN ('admin', 'manager')
        )
    );

-- 7. Fix group_buy_participants table RLS policies
DROP POLICY IF EXISTS "group_buy_participants_select_policy" ON group_buy_participants;
DROP POLICY IF EXISTS "group_buy_participants_insert_policy" ON group_buy_participants;
DROP POLICY IF EXISTS "group_buy_participants_update_policy" ON group_buy_participants;
DROP POLICY IF EXISTS "group_buy_participants_delete_policy" ON group_buy_participants;

-- Enable RLS on group_buy_participants
ALTER TABLE group_buy_participants ENABLE ROW LEVEL SECURITY;

-- Create new group_buy_participants policies
CREATE POLICY "group_buy_participants_select_policy" ON group_buy_participants
    FOR SELECT USING (
        auth.uid()::text = user_id OR 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid()::text 
            AND profiles.role IN ('admin', 'manager')
        )
    );

CREATE POLICY "group_buy_participants_insert_policy" ON group_buy_participants
    FOR INSERT WITH CHECK (
        auth.uid()::text = user_id
    );

CREATE POLICY "group_buy_participants_update_policy" ON group_buy_participants
    FOR UPDATE USING (
        auth.uid()::text = user_id OR 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid()::text 
            AND profiles.role IN ('admin', 'manager')
        )
    );

CREATE POLICY "group_buy_participants_delete_policy" ON group_buy_participants
    FOR DELETE USING (
        auth.uid()::text = user_id OR 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid()::text 
            AND profiles.role IN ('admin', 'manager')
        )
    );

-- 8. Create missing tables if they don't exist
CREATE TABLE IF NOT EXISTS otp_verifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    otp VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    attempts INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS escrow_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id),
    customer_id UUID NOT NULL REFERENCES profiles(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'GHS',
    status VARCHAR(20) DEFAULT 'pending',
    paystack_reference VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    released_at TIMESTAMP WITH TIME ZONE,
    refunded_at TIMESTAMP WITH TIME ZONE,
    release_reason TEXT,
    refund_reason TEXT,
    metadata JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Add RLS policies for new tables
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_payments ENABLE ROW LEVEL SECURITY;

-- OTP verifications policies (admin only for security)
CREATE POLICY "otp_verifications_all_policy" ON otp_verifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid()::text 
            AND profiles.role IN ('admin', 'manager')
        )
    );

-- Escrow payments policies
CREATE POLICY "escrow_payments_select_policy" ON escrow_payments
    FOR SELECT USING (
        auth.uid()::text = customer_id OR 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid()::text 
            AND profiles.role IN ('admin', 'manager')
        )
    );

CREATE POLICY "escrow_payments_insert_policy" ON escrow_payments
    FOR INSERT WITH CHECK (
        auth.uid()::text = customer_id OR 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid()::text 
            AND profiles.role IN ('admin', 'manager')
        )
    );

CREATE POLICY "escrow_payments_update_policy" ON escrow_payments
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid()::text 
            AND profiles.role IN ('admin', 'manager')
        )
    );

-- 10. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_group_buys_product_id ON group_buys(product_id);
CREATE INDEX IF NOT EXISTS idx_group_buy_participants_user_id ON group_buy_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_otp_verifications_phone ON otp_verifications(phone);
CREATE INDEX IF NOT EXISTS idx_escrow_payments_order_id ON escrow_payments(order_id);

-- 11. Add sample data for testing
INSERT INTO cart_items (id, user_id, product_id, quantity, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    'test-user-123',
    p.id,
    FLOOR(RANDOM() * 3) + 1,
    NOW() - INTERVAL '1 day',
    NOW()
FROM products p 
WHERE p.is_active = true 
LIMIT 5
ON CONFLICT DO NOTHING;

INSERT INTO orders (id, user_id, order_number, status, total_amount, shipping_address, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'test-user-123',
    'ORD-' || EXTRACT(EPOCH FROM NOW())::bigint,
    'pending',
    150.00,
    '{"street": "123 Test Street", "city": "Accra", "region": "Greater Accra", "country": "Ghana"}',
    NOW(),
    NOW()
)
ON CONFLICT DO NOTHING;

-- Success message
SELECT 'RLS policies fixed successfully! All APIs should now work properly.' as status;
