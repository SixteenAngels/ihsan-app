# Ihsan - Modern E‑commerce Platform for Ghana & Africa

🌍 Vision: A modern, mobile‑first e‑commerce platform for Ghana and Africa, designed to make shopping simple, fast, and affordable.

## What’s New

- Dynamic homepage banner powered by Supabase (`homepage_banners` table)
- Admin/Manager Flash Deals manager at `/admin/flash-deals`
- Improved outline button colors for better contrast on white backgrounds
- Mapped common CTA buttons to routes (Search, Categories, Flash Deals, Support)
- Picture Search is temporarily disabled (page shows a friendly notice)
- Added FAQ `/faq` and Contact `/contact` pages
- Favicon added at `/favicon.svg`

## ✨ Key Features

### 🚀 Core
- Flexible Shipping: Air (fast) or Sea (economical)
- Ready Now: Ghana‑stocked products with 24–48h delivery
- Group Buy: Community‑driven bulk purchases with tiered discounts
- PWA: Web + mobile app from one codebase
- Role‑based Access: Admin, Manager, Support, Delivery

### 🛍️ Shopping
- Product catalog with categories and filters
- Mobile‑optimized product pages
- Cart and wishlist
- Order tracking with status history
- Reviews & ratings (schema ready)

### 👥 Roles
- Customer: Browse, buy, track orders
- Admin: Full control (products, orders, users, analytics)
- Manager: Operational control (products, orders, group buys)
- Support: Chat and customer help
- Delivery: Assigned deliveries and updates

## 🛠️ Tech Stack

### Frontend
- Framework: Next.js 15.5.2 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS v4
- UI: Radix UI primitives
- Icons: Lucide React
- Forms: React Hook Form + Zod

### Backend & Data
- Database: Supabase (PostgreSQL)
- Auth: Supabase Auth
- Storage: Supabase Storage
- Realtime: Supabase Realtime

### Integrations
- Payments: Paystack
- Email: Resend (server‑side)
- Maps: Google Maps JavaScript API (via @react-google-maps/api)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm (or yarn/pnpm)
- Supabase project

### Install
```bash
npm install
```

### Environment Variables
Create a `.env.local` (gitignored) for local dev. On Vercel, add the same variables in Project → Settings → Environment Variables.

Public (client) – must start with `NEXT_PUBLIC_`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your-paystack-public-key
NEXT_PUBLIC_APP_NAME=Ihsan
NEXT_PUBLIC_APP_DESCRIPTION=Modern e-commerce platform for Ghana and Africa
```
Server‑only (secrets) – DO NOT prefix with `NEXT_PUBLIC_`:
```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PAYSTACK_SECRET_KEY=your-paystack-secret-key
RESEND_API_KEY=your-resend-api-key
# For migrations/jobs only; not needed at runtime
DATABASE_URL=postgresql://user:password@host:5432/postgres?sslmode=require
```

Tip (Vercel CLI):
```bash
vercel login
vercel link
vercel env pull .env.local --environment=production
```

### Database Setup
Run the main schema:
- Open Supabase → SQL Editor → run `database/schema.sql`

Flash Deals (optional, or use the helper script):
```bash
npm run migrate:flash-deals
```
This creates `flash_deals` table + policies and safe triggers.

Dynamic Homepage Banner:
- Create `homepage_banners` table and policies (see snippet in README changes or run the SQL you’ve saved during setup). Add a row with:
  - `title`, optional `subtitle`
  - `cta_label` + `cta_href`, optional `secondary_label` + `secondary_href`
  - `bg_gradient` (e.g. `from-slate-50 via-white to-red-50`)
  - `is_active=true` and optional `starts_at`/`ends_at`
- Home page reads the first active banner.

### Development
```bash
npm run dev
```
Open: http://localhost:3000

## 🔧 Admin & Management
- Admin dashboard: `/admin`
- Flash Deals manager: `/admin/flash-deals` (create/update deals)
- Banners: currently visible in the Flash Deals admin page (quick view). A dedicated editor can be added.

## 🧭 Notes & Status
- Picture Search: Currently disabled; page displays a notice with links to Search/Categories. Re‑enable later by restoring the component render in `src/app/picture-search/page.tsx`.
- Google OAuth: Configure in Supabase (Providers) and Google Cloud. Ensure redirect `https://your-domain.com/auth/callback` and Supabase callback URL.
- Payments (Paystack): Use live keys in production; rotate secrets periodically.
- Favicon: Provided at `/favicon.svg`, referenced from the App Router metadata.

## 📁 Project Structure
```
src/
  app/                # Next.js App Router
  components/         # UI & feature components
  lib/                # Supabase client, helpers, services
  pages/              # Legacy pages/api (if any)
database/
  schema.sql          # Main schema
scripts/
  migrate-flash-deals.js  # Flash deals migration helper
```

## 🗺️ Roadmap (excerpt)
- Admin banner editor UI
- Vendor onboarding & moderation workflows
- Advanced analytics & dashboards
- Loyalty & promotions

## 🧪 Contributing
1. Create a branch: `git checkout -b feature/awesome`
2. Commit: `git commit -m "feat: add awesome"`
3. Push: `git push origin feature/awesome`
4. Open a PR

## 📄 License
MIT – see [LICENSE](LICENSE)

---
Made with ❤️ for Ghana and Africa