# Supabase Configuration Setup

## Your Supabase Project Details

Based on your JWT key, here's what you need to configure:

### Project URL
```
https://ttsbhuwphtlicgwkqynv.supabase.co
```

### JWT Secret Key
```
PsUo4BF0EaEek9OYSzkMJOxw9E22PUcRXNdPp7yYXAXlfY9Q65LxLwwa31NRvH+L3MbldokwjD61oyGcXSREdA==
```

## Environment Setup

Create a `.env.local` file in your project root with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ttsbhuwphtlicgwkqynv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_from_supabase_dashboard
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_from_supabase_dashboard
SUPABASE_JWT_SECRET=PsUo4BF0EaEek9OYSzkMJOxw9E22PUcRXNdPp7yYXAXlfY9Q65LxLwwa31NRvH+L3MbldokwjD61oyGcXSREdA==

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Paystack Configuration (optional)
PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key_here
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key_here
```

## Next Steps

1. **Get Your Supabase Keys:**
   - Go to your Supabase Dashboard
   - Navigate to Settings > API
   - Copy the "anon public" key and "service_role" key
   - Replace the placeholder values in `.env.local`

2. **Run Database Setup:**
   - Go to your Supabase Dashboard
   - Navigate to SQL Editor
   - Run the `supabase-database-setup.sql` script
   - This will create all necessary tables and policies

3. **Configure Google OAuth:**
   - Go to Authentication > Providers in Supabase Dashboard
   - Enable Google provider
   - Add your Google OAuth credentials

4. **Test the Setup:**
   - Restart your development server: `npm run dev`
   - Try logging in with Google Auth
   - Test user registration

## Database Schema

The database setup script will create:
- `profiles` table for user data
- `categories` table for product categories
- `products` table for product information
- `orders` table for order management
- `payments` table for payment tracking
- Proper Row Level Security policies
- Triggers for user management

## Troubleshooting

If you're still getting database errors:

1. **Check Supabase Logs:**
   - Go to Supabase Dashboard > Logs
   - Look for any error messages

2. **Verify Database Schema:**
   - Make sure all tables were created successfully
   - Check that RLS policies are enabled

3. **Test User Creation:**
   - Try creating a user manually in Supabase Dashboard
   - Check if the profile is created automatically

4. **Check Environment Variables:**
   - Ensure all Supabase keys are correctly set
   - Restart your development server after changes

## Security Notes

- Never commit `.env.local` to version control
- Keep your JWT secret secure
- Use environment-specific Supabase projects
- Regularly rotate your API keys
