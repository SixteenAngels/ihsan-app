@echo off
echo 🚀 Supabase SQL Runner
echo ================================

REM Check if .env.local exists
if not exist ".env.local" (
    echo ❌ .env.local file not found!
    echo Please create .env.local with your Supabase credentials:
    echo NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    echo SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
    pause
    exit /b 1
)

echo ✅ .env.local found

REM Check if SQL file exists
if not exist "database\chat_schema.sql" (
    echo ❌ SQL file not found at: database\chat_schema.sql
    pause
    exit /b 1
)

echo ✅ SQL file found: database\chat_schema.sql

echo.
echo 🔧 Next Steps:
echo 1. Go to your Supabase Dashboard
echo 2. Navigate to SQL Editor
echo 3. Click 'New Query'
echo 4. Copy and paste the SQL content from the file
echo 5. Click 'Run'

echo.
echo 📋 Opening SQL file for you to copy...
notepad database\chat_schema.sql

echo.
echo 🎯 Alternative: Use the Supabase Dashboard directly
echo 1. Open: https://supabase.com/dashboard
echo 2. Select your project
echo 3. Go to SQL Editor
echo 4. Copy the SQL from the file and run it

echo.
echo ✅ After running the SQL, your chat system will be ready!
pause
