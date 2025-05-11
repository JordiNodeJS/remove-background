import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/ext/:path*",
        destination: process.env.API_URL
          ? `${process.env.API_URL}/:path*`
          : "http://localhost:3001/:path*",
      },
    ];
  },
};

export default nextConfig;
