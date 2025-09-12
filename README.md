# Ihsan - Modern E-commerce Platform for Ghana & Africa

🌍 **Vision**: A modern, mobile-first e-commerce platform for Ghana and Africa, designed to make shopping simple, fast, and affordable.

## ✨ Key Features

### 🚀 Core Features
- **Flexible Shipping**: Air (fast) or Sea (economical) shipping options
- **Ready Now**: Ghana-stocked products with 24-48h delivery
- **Group Buy**: Community-driven bulk purchases with tiered discounts
- **PWA Technology**: Web + mobile app with one codebase
- **Role-based Access**: Admin, Manager, Support, and Delivery roles

### 🛍️ Shopping Experience
- Product catalog with categories and filters
- Mobile-optimized product pages with buy-now modals
- Shopping cart and wishlist functionality
- Order tracking with real-time updates
- Review and rating system for verified buyers

### 👥 User Roles
- **Customer**: Browse, buy, join group buys, track orders
- **Admin**: Full control over products, orders, users, analytics
- **Manager**: Limited admin access (products, orders, group buys)
- **Support Agent**: Handle live chat and customer inquiries
- **Delivery Agent**: Manage assigned deliveries with GPS tracking

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime subscriptions

### Additional Services
- **Maps**: OpenStreetMap/Mapbox integration
- **Notifications**: OneSignal/Firebase Cloud Messaging
- **Payments**: Paystack integration (future)
- **SMS**: SMTP → SMS gateway for OTP

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ihsan
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Set up the database**
   - Create a new Supabase project
   - Run the SQL commands from `database/schema.sql` in your Supabase SQL editor
   - This will create all tables, indexes, RLS policies, and sample data

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ihsan/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/                # Reusable UI components
│   │   └── layout/            # Layout components
│   └── lib/                   # Utility functions
│       ├── supabase.ts        # Supabase client & types
│       ├── auth.ts            # Authentication helpers
│       ├── api.ts             # API functions
│       └── utils.ts           # Utility functions
├── database/
│   └── schema.sql             # Database schema
└── public/                    # Static assets
```

## 🗄️ Database Schema

The database includes the following main tables:

- **profiles**: User profiles extending Supabase auth
- **categories**: Product categories with hierarchy
- **products**: Product catalog with variants
- **product_variants**: Product variations (size, color, etc.)
- **orders**: Order management with status tracking
- **order_items**: Individual items in orders
- **group_buys**: Group buying campaigns
- **group_buy_participants**: Users participating in group buys
- **addresses**: User shipping/billing addresses
- **cart_items**: Shopping cart items
- **reviews**: Product reviews from verified buyers
- **notifications**: User notifications

## 🔐 Authentication

The app supports multiple authentication methods:

1. **Email + Password**: Traditional signup/login
2. **Google OAuth**: Social login integration
3. **Phone OTP**: SMS-based verification

## 🛒 Shopping Flow

1. **Browse**: Users can browse products by category or search
2. **Product Page**: Detailed product view with variants and options
3. **Add to Cart**: Add products to shopping cart
4. **Checkout**: Select shipping method (Air/Sea) and address
5. **Payment**: Simulated payment confirmation (MVP)
6. **Order Tracking**: Real-time order status updates
7. **Delivery**: GPS tracking for delivery agents

## 📱 PWA Features

The app is built as a Progressive Web App with:

- **Installable**: Can be installed on mobile devices
- **Offline Support**: Basic offline functionality
- **Push Notifications**: Order updates and promotions
- **Mobile-optimized**: Responsive design for all screen sizes

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📈 Roadmap

### Phase 1 (MVP) - Current
- ✅ Basic project setup and database schema
- ✅ Homepage and UI components
- 🔄 Authentication system
- 🔄 Product catalog
- 🔄 Checkout flow
- 🔄 Order tracking

### Phase 2
- Reviews & ratings
- Push notifications
- Live chat support
- Delivery agent tracking
- Support role features

### Phase 3
- AI product search
- Advanced analytics
- Loyalty points system
- 3D/AR shopping features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@ihsan.com or join our community Discord.

## 🙏 Acknowledgments

- Built with Next.js and Supabase
- UI components from Radix UI
- Icons from Lucide React
- Styling with Tailwind CSS

---

**Made with ❤️ for Ghana and Africa**