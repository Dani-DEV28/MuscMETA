/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["music-metadata"],
  },
};

module.exports = nextConfig;
