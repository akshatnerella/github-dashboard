/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  metadataBase: new URL("http://localhost:3000"), // Set the base URL for metadata resolution
};

module.exports = nextConfig;
