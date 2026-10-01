import type { NextConfig } from 'next';

const publicBackendUrl = new URL(
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000',
);

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: publicBackendUrl.protocol === 'https:' ? 'https' : 'http',
        hostname: publicBackendUrl.hostname,
        port: publicBackendUrl.port,
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
