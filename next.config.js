const { i18n } = require('./next-i18next.config');

module.exports = {
  i18n,
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
};