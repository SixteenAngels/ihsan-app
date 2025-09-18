@echo off
echo Opening FINAL SQL file for you to copy...
echo.
echo This version uses the ORIGINAL user roles from your database:
echo - customer
echo - admin
echo - manager
echo - support
echo - delivery
echo.
echo After copying the SQL:
echo 1. Go to https://supabase.com/dashboard
echo 2. Select your project
echo 3. Click "SQL Editor"
echo 4. Click "New Query"
echo 5. Paste the SQL and click "Run"
echo.
notepad database\chat_schema_final.sql
