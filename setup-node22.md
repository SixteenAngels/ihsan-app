# Node.js 22 Setup Guide for Ihsan Project

## Prerequisites
- Node.js 22.x or higher
- npm 10.x or higher

## Quick Setup

1. **Install Node.js 22:**
   ```bash
   # Using nvm (recommended)
   nvm install 22
   nvm use 22
   
   # Or download from https://nodejs.org/
   ```

2. **Verify installation:**
   ```bash
   node --version  # Should show v22.x.x
   npm --version   # Should show 10.x.x
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

## Project Configuration

### TypeScript Configuration
- Updated to target ES2022 for better Node.js 22 compatibility
- Added strict type checking options
- Configured for modern JavaScript features

### Next.js Configuration
- Optimized for Node.js 22
- Enabled SWC minification
- Configured external packages for server components
- Console log removal in production

### Package.json Updates
- Added Node.js engine requirements
- Updated @types/node to version 22
- Added helpful scripts for linting and type checking

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run type-check` - Run TypeScript type checking

## Troubleshooting

### Common Issues

1. **Node.js not found:**
   - Ensure Node.js 22 is installed and in PATH
   - Use nvm to manage Node.js versions

2. **Permission errors:**
   - On Windows, run PowerShell as Administrator
   - On macOS/Linux, use sudo if necessary

3. **Port already in use:**
   - Kill existing processes: `npx kill-port 3000`
   - Or use different port: `npm run dev -- -p 3001`

### Performance Optimizations

- Turbopack is enabled for faster builds
- SWC minification for better performance
- Console logs removed in production
- Modern ES2022 target for better optimization

## Environment Variables

Create a `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
PAYSTACK_SECRET_KEY=your_paystack_secret
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

## Development Tips

1. Use the `.nvmrc` file to ensure consistent Node.js version
2. Enable TypeScript strict mode for better code quality
3. Use the provided ESLint configuration for code consistency
4. Leverage Turbopack for faster development builds
