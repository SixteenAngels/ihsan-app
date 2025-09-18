const fs = require('fs')
const path = require('path')

console.log('🚀 Database Setup Helper')
console.log('========================')

// Check if .env.local exists
if (!fs.existsSync('.env.local')) {
  console.log('❌ .env.local file not found!')
  console.log('Please create .env.local with your Supabase credentials:')
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url')
  console.log('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key')
  process.exit(1)
}

console.log('✅ .env.local found')

// Check if SQL file exists
const sqlPath = path.join(__dirname, 'database', 'chat_schema.sql')
if (!fs.existsSync(sqlPath)) {
  console.log('❌ SQL file not found at:', sqlPath)
  process.exit(1)
}

console.log('✅ SQL file found:', sqlPath)

// Read SQL content
const sqlContent = fs.readFileSync(sqlPath, 'utf8')
console.log(`📝 SQL content loaded (${sqlContent.length} characters)`)

console.log('')
console.log('🔧 How to Run the SQL:')
console.log('======================')
console.log('')
console.log('Method 1: Supabase Dashboard (Recommended)')
console.log('1. Go to https://supabase.com/dashboard')
console.log('2. Select your project')
console.log('3. Click "SQL Editor" in the left sidebar')
console.log('4. Click "New Query"')
console.log('5. Copy and paste the SQL content below')
console.log('6. Click "Run" button')
console.log('')
console.log('Method 2: Copy from File')
console.log('1. Open the file: database/chat_schema.sql')
console.log('2. Copy all content (Ctrl+A, Ctrl+C)')
console.log('3. Paste into Supabase SQL Editor')
console.log('4. Click "Run"')
console.log('')

// Show first few lines of SQL
const lines = sqlContent.split('\n')
console.log('📋 SQL Content Preview (first 10 lines):')
console.log('========================================')
lines.slice(0, 10).forEach((line, index) => {
  console.log(`${(index + 1).toString().padStart(2, ' ')}: ${line}`)
})
console.log('...')
console.log(`(Total: ${lines.length} lines)`)
console.log('')

console.log('✅ After running the SQL, your chat system will be ready!')
console.log('')
console.log('🎯 Next Steps:')
console.log('1. Run the SQL in Supabase Dashboard')
console.log('2. Start your app: npm run dev')
console.log('3. Go to http://localhost:3000/chat')
console.log('4. Test the chat functionality!')
