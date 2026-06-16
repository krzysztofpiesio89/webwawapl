import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year cache for optimized images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ucars.pl',
      },
      {
        protocol: 'https',
        hostname: '**.copart.com',
      },
      {
        protocol: 'https',
        hostname: '**.iaai.com',
      },
      {
        protocol: 'https',
        hostname: '**.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  serverExternalPackages: ['better-sqlite3'],
  experimental: {
    optimizePackageImports: ['@apollo/server', 'lucide-react'],
  },
};

export default nextConfig;
