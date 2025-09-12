import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/layout/header";
import { PWAInstallPrompt } from "@/components/pwa/install-prompt";
import { AuthProvider } from "@/lib/auth-context";
import { CurrencyProvider } from "@/lib/currency-context";
import { AnimatedLayout } from "@/components/layout/animated-layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <CurrencyProvider>
            <AnimatedLayout>
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <PWAInstallPrompt />
            </AnimatedLayout>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
