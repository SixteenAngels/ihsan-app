@echo off
echo Opening CORRECTED SQL file for you to copy...
echo.
echo This version fixes the user role enum error.
echo Uses correct roles: customer, vendor, vendor_manager, admin
echo.
echo After copying the SQL:
echo 1. Go to https://supabase.com/dashboard
echo 2. Select your project
echo 3. Click "SQL Editor"
echo 4. Click "New Query"
echo 5. Paste the SQL and click "Run"
echo.
notepad database\chat_schema_corrected.sql
