/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Uncomment and modify these lines if you're not using a custom domain
  // basePath: '/your-repo-name',
  // assetPrefix: '/your-repo-name/',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
