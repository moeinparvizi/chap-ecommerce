import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@ecommerce/shared'],
  async rewrites() {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') return [];
    const backend = (process.env.API_URL || 'http://localhost:3000/api').replace(/\/$/, '');
    if (process.env.VERCEL && !process.env.API_URL && !process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('Set API_URL to the deployed NestJS /api endpoint before disabling demo mode');
    }
    return [{ source: '/api/:path*', destination: `${backend}/:path*` }];
  },
};

export default nextConfig;
