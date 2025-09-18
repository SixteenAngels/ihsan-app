import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    // Ignore ESLint during builds to allow production build to complete
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Do not ignore type errors in production builds
    ignoreBuildErrors: false,
  },
  // External packages for server components
  serverExternalPackages: ['bcryptjs', 'jsonwebtoken'],
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Disable source maps in development to fix 404 errors
  productionBrowserSourceMaps: false,
  // Webpack configuration
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable source maps in development
      config.devtool = false;
    }
    return config;
  },
};

export default nextConfig;
