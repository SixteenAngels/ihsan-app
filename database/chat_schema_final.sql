-- Live Chat System Database Schema (FINAL - Works with current database)
-- This extends the existing Ihsan database with chat functionality
-- Uses the ORIGINAL user roles: customer, admin, manager, support, delivery

-- Chat rooms table
CREATE TABLE IF NOT EXISTS chat_rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    support_agent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'closed', 'waiting')),
    priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    subject TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    sender_type VARCHAR(10) NOT NULL CHECK (sender_type IN ('customer', 'agent', 'system')),
    message TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
    file_url TEXT,
    file_name TEXT,
    file_size INTEGER,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat participants table (for tracking who's in the chat)
CREATE TABLE IF NOT EXISTS chat_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role VARCHAR(10) NOT NULL CHECK (role IN ('customer', 'agent', 'supervisor')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat typing indicators
CREATE TABLE IF NOT EXISTS chat_typing (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    is_typing BOOLEAN DEFAULT true,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '10 seconds')
);

-- Chat room assignments (for support agents)
CREATE TABLE IF NOT EXISTS chat_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'transferred', 'closed')),
    notes TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_rooms_customer ON chat_rooms(customer_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_agent ON chat_rooms(support_agent_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_status ON chat_rooms(status);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_created ON chat_rooms(created_at);

CREATE INDEX IF NOT EXISTS idx_chat_messages_room ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at);

CREATE INDEX IF NOT EXISTS idx_chat_participants_room ON chat_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_user ON chat_participants(user_id);

CREATE INDEX IF NOT EXISTS idx_chat_typing_room ON chat_typing(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_typing_user ON chat_typing(user_id);

-- Enable RLS
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_typing ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_rooms (FINAL - using ORIGINAL roles)
CREATE POLICY "chat_rooms_select_policy" ON chat_rooms
    FOR SELECT USING (
        auth.uid() = customer_id OR 
        auth.uid() = support_agent_id OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'manager', 'support')
        )
    );

CREATE POLICY "chat_rooms_insert_policy" ON chat_rooms
    FOR INSERT WITH CHECK (
        auth.uid() = customer_id OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'manager', 'support')
        )
    );

CREATE POLICY "chat_rooms_update_policy" ON chat_rooms
    FOR UPDATE USING (
        auth.uid() = customer_id OR 
        auth.uid() = support_agent_id OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'manager', 'support')
        )
    );

-- RLS Policies for chat_messages (FINAL)
CREATE POLICY "chat_messages_select_policy" ON chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_rooms 
            WHERE chat_rooms.id = chat_messages.room_id 
            AND (
                chat_rooms.customer_id = auth.uid() OR 
                chat_rooms.support_agent_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM profiles 
                    WHERE profiles.id = auth.uid() 
                    AND profiles.role IN ('admin', 'manager', 'support')
                )
            )
        )
    );

CREATE POLICY "chat_messages_insert_policy" ON chat_messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM chat_rooms 
            WHERE chat_rooms.id = chat_messages.room_id 
            AND (
                chat_rooms.customer_id = auth.uid() OR 
                chat_rooms.support_agent_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM profiles 
                    WHERE profiles.id = auth.uid() 
                    AND profiles.role IN ('admin', 'manager', 'support')
                )
            )
        )
    );

CREATE POLICY "chat_messages_update_policy" ON chat_messages
    FOR UPDATE USING (
        auth.uid() = sender_id OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'manager')
        )
    );

-- RLS Policies for chat_participants (FINAL)
CREATE POLICY "chat_participants_select_policy" ON chat_participants
    FOR SELECT USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM chat_rooms 
            WHERE chat_rooms.id = chat_participants.room_id 
            AND (
                chat_rooms.customer_id = auth.uid() OR 
                chat_rooms.support_agent_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM profiles 
                    WHERE profiles.id = auth.uid() 
                    AND profiles.role IN ('admin', 'manager', 'support')
                )
            )
        )
    );

CREATE POLICY "chat_participants_insert_policy" ON chat_participants
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'manager', 'support')
        )
    );

CREATE POLICY "chat_participants_update_policy" ON chat_participants
    FOR UPDATE USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'manager', 'support')
        )
    );

-- RLS Policies for chat_typing (FINAL)
CREATE POLICY "chat_typing_select_policy" ON chat_typing
    FOR SELECT USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM chat_rooms 
            WHERE chat_rooms.id = chat_typing.room_id 
            AND (
                chat_rooms.customer_id = auth.uid() OR 
                chat_rooms.support_agent_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM profiles 
                    WHERE profiles.id = auth.uid() 
                    AND profiles.role IN ('admin', 'manager', 'support')
                )
            )
        )
    );

CREATE POLICY "chat_typing_insert_policy" ON chat_typing
    FOR INSERT WITH CHECK (
        auth.uid() = user_id
    );

CREATE POLICY "chat_typing_update_policy" ON chat_typing
    FOR UPDATE USING (
        auth.uid() = user_id
    );

CREATE POLICY "chat_typing_delete_policy" ON chat_typing
    FOR DELETE USING (
        auth.uid() = user_id
    );

-- RLS Policies for chat_assignments (FINAL)
CREATE POLICY "chat_assignments_select_policy" ON chat_assignments
    FOR SELECT USING (
        auth.uid() = agent_id OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'manager', 'support')
        )
    );

CREATE POLICY "chat_assignments_insert_policy" ON chat_assignments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'manager', 'support')
        )
    );

CREATE POLICY "chat_assignments_update_policy" ON chat_assignments
    FOR UPDATE USING (
        auth.uid() = agent_id OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'manager')
        )
    );

-- Add triggers for updated_at (if the function exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        CREATE TRIGGER update_chat_rooms_updated_at BEFORE UPDATE ON chat_rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        CREATE TRIGGER update_chat_messages_updated_at BEFORE UPDATE ON chat_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Function to clean up expired typing indicators
CREATE OR REPLACE FUNCTION cleanup_expired_typing()
RETURNS void AS $$
BEGIN
    DELETE FROM chat_typing WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to update last message timestamp
CREATE OR REPLACE FUNCTION update_chat_room_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chat_rooms 
    SET last_message_at = NEW.created_at 
    WHERE id = NEW.room_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update last message timestamp
CREATE TRIGGER update_chat_room_last_message_trigger
    AFTER INSERT ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_chat_room_last_message();

SELECT 'Live chat system database schema created successfully!' as status;
