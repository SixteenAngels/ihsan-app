import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer } from "@/components/layout/header";
import { AppChrome } from "@/components/layout/app-chrome";
import { PWAInstallPrompt } from "@/components/pwa/install-prompt";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { NotificationProvider } from "@/lib/notifications-context";
import { CurrencyProvider } from "@/lib/currency-context";
import { AnimatedLayout } from "@/components/layout/animated-layout";
import { ClientSplashScreen } from "@/components/ui/client-splash-screen";
import { LiveChatWidget } from "@/components/chat/live-chat-widget";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: "Ihsan - Modern E-commerce for Ghana & Africa",
  description: "Modern, mobile-first e-commerce platform for Ghana and Africa. Shop with Air/Sea shipping options, Ready Now local stock, and Group Buy discounts.",
  keywords: ["e-commerce", "Ghana", "Africa", "shopping", "online store", "mobile commerce"],
  authors: [{ name: "Ihsan Team" }],
  creator: "Ihsan",
  publisher: "Ihsan",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ihsan.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GH',
    url: 'https://ihsan.com',
    title: 'Ihsan - Modern E-commerce for Ghana & Africa',
    description: 'Modern, mobile-first e-commerce platform for Ghana and Africa. Shop with Air/Sea shipping options, Ready Now local stock, and Group Buy discounts.',
    siteName: 'Ihsan',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ihsan - Modern E-commerce for Ghana & Africa',
    description: 'Modern, mobile-first e-commerce platform for Ghana and Africa. Shop with Air/Sea shipping options, Ready Now local stock, and Group Buy discounts.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Ihsan',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icons/icon-192x192.png',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Ihsan',
    'application-name': 'Ihsan',
    'msapplication-TileColor': '#2563eb',
    'theme-color': '#2563eb',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="font-sans antialiased"
        suppressHydrationWarning={true}
      >
        <ClientSplashScreen />
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <NotificationProvider>
                <CurrencyProvider>
                  <AnimatedLayout>
                    <AppChrome>
                      {children}
                    </AppChrome>
                    <PWAInstallPrompt />
                  </AnimatedLayout>
                  <LiveChatWidget />
                </CurrencyProvider>
              </NotificationProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
