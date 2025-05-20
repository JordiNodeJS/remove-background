import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/images-output/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/ext/:path*",
        destination: process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/:path*`
          : "http://localhost:3001/:path*",
      },
    ];
  },
  // Añade esta configuración para el watcher
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Ignora los directorios que causan reinicios innecesarios
      const ignored = config.watchOptions.ignored ?? [];
      config.watchOptions.ignored = [
        ...(Array.isArray(ignored) ? ignored : [ignored]),
        /public\/images-input/,
        /public\/images-output/,
        /tmp/,
      ];
    }
    return config;
  },
};

export default nextConfig;
