/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/cft-auto-gift' : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
