import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@ecommerce/shared'],
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3000/api',
  },
};

export default nextConfig;
