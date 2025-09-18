# IHSAN E-COMMERCE DATABASE SETUP GUIDE

## 🚀 Quick Setup (Recommended)

### Step 1: Run the Complete Database Script
1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy and paste the entire contents of `ihsan-complete-database.sql`
4. Click **Run** to execute the script

### Step 2: Verify Setup
The script will show a success message when completed:
```
IHSAN E-COMMERCE DATABASE SETUP COMPLETED SUCCESSFULLY!
All tables, policies, functions, and triggers have been created.
You can now use the application without database errors.
```

## 📋 What This Script Does

### ✅ **Creates All Required Tables:**
- `profiles` - User accounts with roles
- `categories` - Product categories and subcategories
- `products` - Product catalog with vendor support
- `product_variants` - Product variations (size, color, etc.)
- `orders` - Customer orders with escrow support
- `order_items` - Individual items in orders
- `payments` - Payment processing with Paystack integration
- `cart_items` - Shopping cart functionality
- `addresses` - Customer shipping/billing addresses
- `reviews` - Product reviews and ratings
- `notifications` - User notifications system
- `group_buys` - Group buying campaigns
- `group_buy_participants` - Group buy participants

### ✅ **Fixes All Database Errors:**
- Adds missing `approved` column to products
- Adds missing `hidden` column to products
- Adds missing `vendor_id` column to products
- Adds missing `is_ready_now` column to products
- Adds missing `vendor_status` column to profiles
- Adds missing `is_active` column to profiles
- Adds missing `escrow_status` column to orders
- And many more missing columns...

### ✅ **Sets Up Security:**
- Row Level Security (RLS) on all tables
- Role-based access policies
- Admin, Manager, Vendor, Customer permissions
- Secure user authentication triggers

### ✅ **Performance Optimization:**
- Database indexes on all important columns
- Optimized queries for fast performance
- Proper foreign key relationships

### ✅ **User Management:**
- Automatic profile creation on signup
- Role-based user permissions
- Vendor approval workflow
- User invitation system support

## 🔧 Environment Variables Required

Make sure your `.env.local` file has:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ttsbhuwphtlicgwkqynv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_JWT_SECRET=PsUo4BF0EaEek9OYSzkMJOxw9E22PUcRXNdPp7yYXAXlfY9Q65LxLwwa31NRvH+L3MbldokwjD61oyGcXSREdA==
```

## 🎯 Features Enabled After Setup

### **Admin Panel:**
- User management and invitations
- Product approval workflow
- Vendor management
- Order management
- Category management
- Analytics dashboard

### **Vendor Features:**
- Product listing and management
- Order fulfillment
- Sales analytics
- Store settings

### **Customer Features:**
- Shopping cart
- Order tracking
- Product reviews
- Group buying
- Ready Now delivery
- Multiple payment methods

### **Manager Features:**
- Escrow management
- Product moderation
- Homepage management
- Notification system
- Ready Now verification

## 🚨 Troubleshooting

### If you get "column does not exist" errors:
The script automatically adds all missing columns, so this should be resolved.

### If you get permission errors:
Make sure you're running the script as a database owner/admin in Supabase.

### If tables already exist:
The script uses `CREATE TABLE IF NOT EXISTS` and `ALTER TABLE` statements, so it's safe to run multiple times.

## 📞 Support

If you encounter any issues:
1. Check the Supabase logs for detailed error messages
2. Verify your environment variables are correct
3. Ensure you have the proper permissions in Supabase
4. The script includes detailed logging to help identify issues

---

**🎉 That's it! Your Ihsan e-commerce database is now fully set up and ready to use!**
