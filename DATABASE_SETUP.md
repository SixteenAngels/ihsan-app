# 🗄️ SUPABASE DATABASE SETUP GUIDE

## ✅ **YOUR SUPABASE CONNECTION DETAILS**

From your connection string, I can extract:
- **Host**: `db.ttsbhuwphtlicgwkqynv.supabase.co`
- **Port**: `5432`
- **Database**: `postgres`
- **Username**: `postgres`
- **Password**: `[YOUR-PASSWORD]` (you'll need to replace this)

## 🔧 **ENVIRONMENT VARIABLES SETUP**

Create a `.env.local` file in your project root with these variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ttsbhuwphtlicgwkqynv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Database Connection (for direct access if needed)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.ttsbhuwphtlicgwkqynv.supabase.co:5432/postgres
```

## 📋 **STEP-BY-STEP SETUP**

### **Step 1: Get Supabase Keys**
1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### **Step 2: Create Environment File**
```bash
# In your project root directory
touch .env.local
```

### **Step 3: Add Environment Variables**
Copy the template above and replace:
- `[YOUR-PASSWORD]` with your actual database password
- `your_supabase_anon_key_here` with your anon key
- `your_supabase_service_role_key_here` with your service role key

### **Step 4: Run Database Schema**
1. Go to Supabase Dashboard → **SQL Editor**
2. Copy and paste the entire content from `database/schema.sql`
3. Click **Run** to create all tables, types, and policies

### **Step 5: Test Connection**
```bash
# Test the build with new environment
npm run build
```

## 🗃️ **DATABASE SCHEMA OVERVIEW**

Your database will include:

### **Core Tables**
- ✅ **profiles** - User profiles with roles
- ✅ **categories** - Product categories
- ✅ **products** - Product catalog
- ✅ **orders** - Order management
- ✅ **order_items** - Order line items
- ✅ **group_buys** - Group buy campaigns
- ✅ **group_buy_participants** - Group buy users
- ✅ **addresses** - User addresses
- ✅ **payment_methods** - User payment methods
- ✅ **notifications** - User notifications
- ✅ **support_tickets** - Customer support
- ✅ **support_messages** - Support conversations

### **User Roles**
- ✅ **customer** - Regular shoppers
- ✅ **admin** - Full system access
- ✅ **manager** - Limited admin powers
- ✅ **support** - Customer service
- ✅ **delivery** - Delivery management

### **Security Features**
- ✅ **Row Level Security (RLS)** policies
- ✅ **Role-based access control**
- ✅ **Secure authentication**
- ✅ **Data protection**

## 🚀 **QUICK START COMMANDS**

```bash
# 1. Install dependencies (if not already done)
npm install

# 2. Create environment file
echo "NEXT_PUBLIC_SUPABASE_URL=https://ttsbhuwphtlicgwkqynv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_key_here" > .env.local

# 3. Test build
npm run build

# 4. Start development server
npm run dev

# 5. Start production server
npm start
```

## 🔐 **SECURITY CHECKLIST**

- ✅ **Environment variables** properly configured
- ✅ **Database password** secured
- ✅ **Service role key** kept secret
- ✅ **RLS policies** enabled
- ✅ **Role permissions** configured
- ✅ **API keys** not exposed in code

## 📱 **TESTING YOUR SETUP**

### **1. Test Database Connection**
Visit: `http://localhost:3000/api/health`

### **2. Test Authentication**
- Go to `/login` or `/signup`
- Try creating an account

### **3. Test Role System**
- Create an admin user in database
- Test role assignment in `/admin/users`

### **4. Test E-commerce Flow**
- Browse products at `/categories`
- Add items to cart
- Test checkout process

## 🎯 **NEXT STEPS AFTER SETUP**

1. **Create Admin User**
   ```sql
   -- In Supabase SQL Editor
   UPDATE profiles 
   SET role = 'admin' 
   WHERE email = 'your-admin-email@example.com';
   ```

2. **Add Sample Products**
   - Use the admin dashboard to add products
   - Test the product management features

3. **Configure Payment Gateway**
   - Set up payment processing
   - Test checkout flow

4. **Deploy to Production**
   - Push to Vercel or your hosting platform
   - Configure production environment variables

## 🆘 **TROUBLESHOOTING**

### **Common Issues**

**Build Errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**Database Connection Issues**
- Check your password in the connection string
- Verify Supabase project is active
- Ensure IP is whitelisted (if using IP restrictions)

**Environment Variable Issues**
- Make sure `.env.local` is in project root
- Restart development server after changes
- Check for typos in variable names

**Permission Errors**
- Verify RLS policies are enabled
- Check user roles in database
- Ensure service role key has correct permissions

## 📞 **SUPPORT**

If you encounter issues:
1. Check Supabase dashboard for errors
2. Verify environment variables
3. Test database connection
4. Review console logs for specific errors

---

**🎉 Your Ihsan platform is ready for database integration!**

**Follow these steps to connect your Supabase database and start using the full role-based system!** 🗄️🔐
