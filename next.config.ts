import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/pepcheck',
        destination: '/protindex',
        permanent: true,
      },
      {
        source: '/pepcheck/results',
        destination: '/protindex/results',
        permanent: true,
      },
      {
        source: '/pepcheck/:path*',
        destination: '/protindex/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
