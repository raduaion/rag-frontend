import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Replace with your domain
        port: '', // Leave empty if not using a specific port
        pathname: '/**', // Adjust based on image paths
      },

      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com', // Replace with your domain
        port: '', // Leave empty if not using a specific port
        pathname: '/**', // Adjust based on image paths
      },      
    ],
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/backend/:path*',
  //       destination: process.env.NEXT_PUBLIC_API_ENDPOINT + '/:path*', // Proxy to the backend
  //     },
  //   ];
  // },
};

export default nextConfig;
