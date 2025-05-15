/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    domains: ['files.cdn.printful.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'files.cdn.printful.com',
        pathname: '/**',
      },
    ],
  },
  // Vypnout statickou generaci pro API routes
  output: 'standalone',
};

module.exports = nextConfig; 