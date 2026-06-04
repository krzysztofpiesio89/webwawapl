import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
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
    // Enable performance optimizations for large P-SEO projects
    optimizePackageImports: ['@apollo/server'],
  },
};

export default nextConfig;
