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
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dl9phep1a/**'
      }
    ]
  }
};

export default withNextIntl(nextConfig);
