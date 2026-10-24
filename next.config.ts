import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/pepcheck',
        destination: '/protchem',
        permanent: true,
      },
      {
        source: '/pepcheck/results',
        destination: '/protchem/results',
        permanent: true,
      },
      {
        source: '/pepcheck/:path*',
        destination: '/protchem/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
