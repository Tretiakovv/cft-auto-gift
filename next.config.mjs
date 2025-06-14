/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NEXT_PUBLIC_IS_PROD === 'true' ? 'export' : "",
  basePath: process.env.NEXT_PUBLIC_IS_PROD === 'true' ? '/cft-auto-gift' : "",
  assetPrefix: process.env.NEXT_PUBLIC_IS_PROD === 'true' ? '/cft-auto-gift/' : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
