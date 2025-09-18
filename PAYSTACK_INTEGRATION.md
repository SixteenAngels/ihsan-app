# Paystack Payment Integration

## Setup Instructions

### 1. Install Dependencies
```bash
npm install paystack
```

### 2. Environment Variables
Add these to your `.env.local` file:

```env
# Paystack Configuration
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Schema
Create a `payments` table in your Supabase database:

```sql
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference TEXT UNIQUE NOT NULL,
  order_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'GHS',
  status TEXT DEFAULT 'pending',
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  paystack_reference TEXT,
  authorization_url TEXT,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## How It Works

### 1. Checkout Process
- User fills in their details including phone number
- Selects "Paystack (Mobile Money/Card)" payment method
- Clicks "Pay with Paystack" button

### 2. Payment Initialization
- System generates a unique reference
- Creates/retrieves customer in Paystack
- Initializes payment with Paystack API
- Stores payment record in database

### 3. Payment Processing
- User is redirected to Paystack payment page
- User completes payment (Mobile Money/Card)
- Paystack redirects back to callback URL

### 4. Payment Verification
- Callback page verifies payment with Paystack
- Updates payment status in database
- Shows success/failure message to user

## API Endpoints

### POST /api/payment
Initialize a new payment with Paystack.

**Request Body:**
```json
{
  "email": "user@example.com",
  "phone": "+233123456789",
  "amount": 100.00,
  "currency": "GHS",
  "reference": "IHSAN_1234567890_abc123",
  "customerName": "John Doe",
  "orderId": "ORDER_1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "authorization_url": "https://checkout.paystack.com/...",
    "access_code": "access_code_here",
    "reference": "reference_here"
  }
}
```

### GET /api/payment?reference=REFERENCE
Verify payment status with Paystack.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "success",
    "amount": 100.00,
    "currency": "GHS",
    "reference": "reference_here",
    "paid_at": "2024-01-01T12:00:00Z",
    "customer": {...}
  }
}
```

## Features

- ✅ **Mobile Money Integration**: Supports MTN, Vodafone, AirtelTigo
- ✅ **Card Payments**: Visa, Mastercard support
- ✅ **Customer Management**: Automatic customer creation/retrieval
- ✅ **Payment Verification**: Real-time payment status checking
- ✅ **Database Tracking**: All payments stored for record keeping
- ✅ **Error Handling**: Comprehensive error handling and user feedback
- ✅ **Security**: Secure payment processing with Paystack

## Testing

Use Paystack test credentials:
- **Test Cards**: Use Paystack test card numbers
- **Test Mobile Money**: Use test phone numbers
- **Test Keys**: Use `sk_test_` and `pk_test_` keys

## Production Deployment

1. Replace test keys with live keys
2. Update `NEXT_PUBLIC_APP_URL` to production URL
3. Ensure HTTPS is enabled
4. Test with real payment methods
5. Monitor payment logs and errors
