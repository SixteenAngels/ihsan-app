@echo off
echo Setting up Ihsan E-commerce Environment...
echo.

REM Check if .env.local exists
if exist .env.local (
    echo .env.local already exists. Backing up to .env.local.backup
    copy .env.local .env.local.backup
)

REM Create .env.local from template
echo Creating .env.local file...
echo # Ihsan E-commerce Environment Configuration > .env.local
echo. >> .env.local
echo # Supabase Configuration (REQUIRED for Google Auth) >> .env.local
echo NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co >> .env.local
echo NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here >> .env.local
echo SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here >> .env.local
echo. >> .env.local
echo # App Configuration >> .env.local
echo NEXT_PUBLIC_APP_URL=http://localhost:3000 >> .env.local
echo NODE_ENV=development >> .env.local
echo. >> .env.local
echo # Paystack Configuration (for payments) >> .env.local
echo PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key_here >> .env.local
echo PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key_here >> .env.local

echo.
echo ✅ .env.local created successfully!
echo.
echo 📋 Next Steps:
echo 1. Go to https://supabase.com and create a new project
echo 2. Get your project URL and anon key from Settings ^> API
echo 3. Replace the placeholder values in .env.local with your actual Supabase credentials
echo 4. Follow the Google Auth setup guide in GOOGLE_AUTH_SETUP.md
echo.
REM Demo credentials removed for production
echo Press any key to continue...
pause > nul