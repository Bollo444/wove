import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['shared'],
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add alias for shared module
    config.resolve.alias = {
      ...config.resolve.alias,
      'shared': path.resolve(__dirname, '../../shared/src'),
    };
    return config;
  },
};

export default nextConfig;
