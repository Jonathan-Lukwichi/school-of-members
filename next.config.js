/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable modularizeImports transformation for next/server
  // This prevents SWC from converting 'next/server' imports into broken internal paths
  modularizeImports: {
    'next/server': {
      transform: 'next/server',
      skipDefaultConversion: true,
    },
  },

  // Force cache revalidation for all pages
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
