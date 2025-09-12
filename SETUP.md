# Ihsan Configuration Guide

## 🔧 Environment Setup

### 1. Create Environment File
Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Ihsan

# SMS Configuration (for OTP)
SMS_API_KEY=your-sms-api-key-here
SMS_API_URL=your-sms-api-url-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Payment Gateway (Paystack)
PAYSTACK_PUBLIC_KEY=pk_test_your-public-key-here
PAYSTACK_SECRET_KEY=sk_test_your-secret-key-here

# Maps API (Mapbox)
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token-here
```

### 2. Supabase Setup
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > API
4. Copy your Project URL and anon key
5. Go to SQL Editor and run the schema from `database/schema.sql`

### 3. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://your-domain.com/auth/callback` (production)

### 4. Paystack Setup
1. Go to [paystack.com](https://paystack.com)
2. Create an account
3. Get your API keys from the dashboard
4. Configure webhook endpoints

### 5. SMS Provider Setup
For Ghana/Africa, consider:
- **Africa's Talking**: Popular in East Africa
- **Twilio**: Global provider
- **MessageBird**: European provider

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 📱 Testing the App

1. **Homepage**: Visit `http://localhost:3000`
2. **Categories**: Browse products at `/categories`
3. **Ready Now**: Check fast delivery at `/ready-now`
4. **Group Buy**: See campaigns at `/group-buy`
5. **Cart**: Add items and test checkout
6. **Admin**: Access dashboard at `/admin`

## 🔍 Key Features to Test

- ✅ Product browsing and filtering
- ✅ Shopping cart functionality
- ✅ Checkout with shipping options
- ✅ Order tracking
- ✅ PWA installation prompt
- ✅ Mobile responsiveness
- ✅ Admin dashboard

## 🛠️ Development Tips

1. **Hot Reload**: Changes reflect immediately
2. **TypeScript**: Full type safety
3. **ESLint**: Code quality checks
4. **Tailwind**: Utility-first CSS
5. **Supabase**: Real-time database

## 📊 Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Supabase Dashboard**: Database monitoring
- **Browser DevTools**: Client-side debugging
- **Console Logs**: Server-side debugging

Your Ihsan platform is ready to go! 🎉
