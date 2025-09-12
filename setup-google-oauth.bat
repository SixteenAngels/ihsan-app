@echo off
echo Setting up Ihsan Platform Environment Variables...
echo.

REM Create .env.local file with Google OAuth configuration
echo # Supabase Configuration > .env.local
echo NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co >> .env.local
echo NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key >> .env.local
echo. >> .env.local
echo # Google OAuth Configuration >> .env.local
echo NEXT_PUBLIC_GOOGLE_CLIENT_ID=802398421617-8ci2seeeic748atgp9h53mshkcvu945k.apps.googleusercontent.com >> .env.local
echo. >> .env.local
echo # Paystack Configuration >> .env.local
echo NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your-paystack-public-key >> .env.local
echo PAYSTACK_SECRET_KEY=sk_test_your-paystack-secret-key >> .env.local
echo. >> .env.local
echo # Twilio Configuration (for SMS) >> .env.local
echo TWILIO_ACCOUNT_SID=your-twilio-account-sid >> .env.local
echo TWILIO_AUTH_TOKEN=your-twilio-auth-token >> .env.local
echo TWILIO_PHONE_NUMBER=your-twilio-phone-number >> .env.local
echo. >> .env.local
echo # SendGrid Configuration (for emails) >> .env.local
echo SENDGRID_API_KEY=your-sendgrid-api-key >> .env.local
echo. >> .env.local
echo # Firebase Configuration (for push notifications) >> .env.local
echo FIREBASE_PROJECT_ID=your-firebase-project-id >> .env.local
echo FIREBASE_PRIVATE_KEY=your-firebase-private-key >> .env.local
echo FIREBASE_CLIENT_EMAIL=your-firebase-client-email >> .env.local
echo. >> .env.local
echo # Google Maps API >> .env.local
echo NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key >> .env.local
echo. >> .env.local
echo # OneSignal Configuration (for push notifications) >> .env.local
echo NEXT_PUBLIC_ONESIGNAL_APP_ID=your-onesignal-app-id >> .env.local
echo ONESIGNAL_REST_API_KEY=your-onesignal-rest-api-key >> .env.local
echo. >> .env.local
echo # Socket.IO Configuration >> .env.local
echo NEXT_PUBLIC_SOCKET_URL=http://localhost:3000 >> .env.local
echo. >> .env.local
echo # App Configuration >> .env.local
echo NEXT_PUBLIC_APP_URL=http://localhost:3000 >> .env.local
echo NEXT_PUBLIC_APP_NAME=Ihsan >> .env.local
echo NEXT_PUBLIC_APP_DESCRIPTION=Modern e-commerce platform for Ghana and Africa >> .env.local

echo.
echo ✅ Environment file created successfully!
echo.
echo 📝 Next steps:
echo 1. Update your Supabase URL and keys in .env.local
echo 2. Add your Paystack keys for payment processing
echo 3. Configure other API keys as needed
echo 4. Restart your development server
echo.
echo 🔑 Google OAuth Client ID has been configured:
echo    802398421617-8ci2seeeic748atgp9h53mshkcvu945k.apps.googleusercontent.com
echo.
pause
