/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  // Produce a minimal, self-contained server for Docker runtime
  output: 'standalone'
};

export default nextConfig;
