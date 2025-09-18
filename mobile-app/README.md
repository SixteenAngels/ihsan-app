# Mobile App

## Quick start

1. Install deps
```bash
npm install
```

2. Configure environment
- Use Expo public env vars or secrets.
- Required:
  - EXPO_PUBLIC_API_BASE_URL (e.g. http://localhost:3000)
  - EXPO_PUBLIC_SUPABASE_URL
  - EXPO_PUBLIC_SUPABASE_ANON_KEY

3. Run
```bash
npm run ios
# or
npm run android
# or
npm start
```

## Notes
- Products tab fetches from `${EXPO_PUBLIC_API_BASE_URL}/api/products`.
- Supabase client is configured in `src/lib/supabase.ts`.
- iOS styling: large titles, system colors, safe areas.
- Push Notifications: requires EAS project and native build. Token is registered on app start.
- Sentry: set `EXPO_PUBLIC_SENTRY_DSN` to enable error reporting.