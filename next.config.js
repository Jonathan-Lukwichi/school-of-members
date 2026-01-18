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
};

module.exports = nextConfig;
