#!/bin/bash

# Ihsan E-commerce Platform - Environment Setup Script
# This script helps you set up the environment variables for your Supabase database

echo "🚀 Setting up Ihsan E-commerce Platform Environment"
echo "=================================================="

# Create .env.local file
echo "Creating .env.local file..."

cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ttsbhuwphtlicgwkqynv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Database Connection (for direct access if needed)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.ttsbhuwphtlicgwkqynv.supabase.co:5432/postgres
EOF

echo "✅ .env.local file created successfully!"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Go to your Supabase dashboard: https://supabase.com/dashboard"
echo "2. Navigate to Settings → API"
echo "3. Copy your Project URL and API keys"
echo "4. Replace the placeholder values in .env.local:"
echo "   - Replace 'your_supabase_anon_key_here' with your anon key"
echo "   - Replace 'your_supabase_service_role_key_here' with your service role key"
echo "   - Replace '[YOUR-PASSWORD]' with your database password"
echo ""
echo "5. Run the database schema:"
echo "   - Go to Supabase → SQL Editor"
echo "   - Copy and paste the content from database/schema.sql"
echo "   - Click Run to create all tables"
echo ""
echo "6. Test your setup:"
echo "   npm run build"
echo "   npm run dev"
echo ""
echo "🎉 Your Ihsan platform will be ready to use!"
