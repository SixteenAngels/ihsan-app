import * as Sentry from 'sentry-expo';

export function initSentry() {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || undefined,
    enableInExpoDevelopment: true,
    debug: false,
  });
}

