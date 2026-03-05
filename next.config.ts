/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: false, // или turbopack: { ... } с отключением кэша
  },
};

export default nextConfig;
