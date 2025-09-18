# Google Auth Setup Guide

## Issue: Google Auth Not Working

The Google Auth is not working because of missing Supabase configuration. Here's how to fix it:

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and anon key from Settings > API

## Step 2: Configure Environment Variables

Create a `.env.local` file in your project root with:

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Paystack Configuration (for payments)
PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key_here
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key_here
```

## Step 3: Configure Google OAuth in Supabase

1. Go to your Supabase Dashboard
2. Navigate to Authentication > Providers
3. Enable Google provider
4. Add your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
5. Set redirect URL: `https://your-project-id.supabase.co/auth/v1/callback`

## Step 4: Configure Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client ID
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `https://your-project-id.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for development)

## Step 5: Database Setup

Run this SQL in your Supabase SQL editor to create the profiles table:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'manager', 'vendor', 'support', 'delivery')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Step 6: Test Google Auth

1. Restart your development server: `npm run dev`
2. Go to `/login` page
3. Click "Continue with Google"
4. Complete Google OAuth flow
5. You should be redirected back to your app

## Common Issues & Solutions

### Issue 1: "Supabase environment variables are not set"
**Solution**: Make sure `.env.local` exists with correct Supabase URL and keys

### Issue 2: "Invalid redirect URI"
**Solution**: Check that redirect URI in Google Cloud Console matches Supabase callback URL

### Issue 3: "OAuth provider not enabled"
**Solution**: Enable Google provider in Supabase Dashboard > Authentication > Providers

### Issue 4: "User not found after OAuth"
**Solution**: Make sure the profiles table and trigger are created correctly

## Testing the Fix

After completing all steps:

1. **Test Google Login**: Should redirect to Google and back
2. **Test User Creation**: New users should be created in profiles table
3. **Test Role Assignment**: Users should get 'customer' role by default
4. **Test Redirects**: Should redirect to appropriate dashboard based on role

## Production Deployment

For production:

1. Update `NEXT_PUBLIC_APP_URL` to your production domain
2. Add production redirect URI to Google Cloud Console
3. Update Supabase redirect URL to production domain
4. Use production Supabase project (not development)

## Security Notes

- Never commit `.env.local` to version control
- Use environment-specific Supabase projects
- Regularly rotate API keys
- Enable RLS policies for data security
- Use HTTPS in production
