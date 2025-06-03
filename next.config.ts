import type {NextConfig} from 'next';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWAConstructor = require('next-pwa');

const pwaConfig = {
  dest: 'public',
  register: true, // auto register service worker
  skipWaiting: true, // auto skip waiting phase when new SW is activated
  // disable: process.env.NODE_ENV === 'development', // uncomment to disable PWA in development
};

const withPWA = withPWAConstructor(pwaConfig);

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withPWA(nextConfig);
