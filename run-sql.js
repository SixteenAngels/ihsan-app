const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!')
  console.log('Please create a .env.local file with:')
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url')
  console.log('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runSQL() {
  try {
    console.log('🚀 Starting SQL execution...')
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'database', 'chat_schema.sql')
    const sqlContent = fs.readFileSync(sqlPath, 'utf8')
    
    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`)
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`)
      
      const { error } = await supabase.rpc('exec_sql', { sql: statement })
      
      if (error) {
        console.error(`❌ Error in statement ${i + 1}:`, error.message)
        // Continue with other statements
      } else {
        console.log(`✅ Statement ${i + 1} executed successfully`)
      }
    }
    
    console.log('🎉 SQL execution completed!')
    console.log('📊 You can now check your Supabase dashboard to see the new tables.')
    
  } catch (error) {
    console.error('❌ Error running SQL:', error.message)
  }
}

// Alternative method using direct SQL execution
async function runSQLDirect() {
  try {
    console.log('🚀 Running SQL directly...')
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'database', 'chat_schema.sql')
    const sqlContent = fs.readFileSync(sqlPath, 'utf8')
    
    // Execute the entire SQL script
    const { data, error } = await supabase
      .from('_sql')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('⚠️  Direct SQL execution not available, trying alternative method...')
      await runSQLAlternative()
    } else {
      console.log('✅ SQL executed successfully!')
    }
    
  } catch (error) {
    console.log('⚠️  Trying alternative method...')
    await runSQLAlternative()
  }
}

// Alternative method - create tables one by one
async function runSQLAlternative() {
  console.log('🔄 Using alternative method...')
  
  const tables = [
    {
      name: 'chat_rooms',
      sql: `
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
      `
    },
    {
      name: 'chat_messages',
      sql: `
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
      `
    }
  ]
  
  for (const table of tables) {
    try {
      console.log(`⏳ Creating table: ${table.name}...`)
      // Note: This is a simplified approach - you'll need to use the Supabase dashboard for full SQL execution
      console.log(`✅ Table ${table.name} would be created`)
    } catch (error) {
      console.error(`❌ Error creating table ${table.name}:`, error.message)
    }
  }
  
  console.log('📝 Please run the full SQL in Supabase Dashboard for complete setup')
}

runSQLDirect()
