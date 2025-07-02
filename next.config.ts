import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.tsx');

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'localhost',
        pathname: '/**'
      },
      {
        hostname: 'via.placeholder.com',
        pathname: '/**'
      }
    ]
  },
  // SEO optimizations
  experimental: {
    optimizePackageImports: ['@next/font'],
  },
  // Compress responses
  compress: true,
  // Enable trailing slash for better SEO
  trailingSlash: false,
  // Power by header removal for security
  poweredByHeader: false,
};

export default withNextIntl(nextConfig);
