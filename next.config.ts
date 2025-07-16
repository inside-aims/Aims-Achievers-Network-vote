import type { NextConfig } from "next";

const MAIN_DOMAIN = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'https://campushonorshub.com';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    formats: ['image/webp'],
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rawydxgmhktdgtzfzgae.supabase.co',
        port: '',
        pathname: '/storage/**',
        search: '',
      },
    ],
    qualities: [75],
  },
  async redirects() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'vote.campushonorshub.com',
          },
        ],
        destination: MAIN_DOMAIN,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
