/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['better-sqlite3']
  },
  // Ensure SQLite works properly by allowing native bindings
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mark better-sqlite3 as external dependency to avoid bundling
      config.externals.push('better-sqlite3');
    }
    return config;
  },
};

module.exports = nextConfig;
