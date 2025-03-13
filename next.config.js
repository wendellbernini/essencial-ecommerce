/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
    ],
  },
  typescript: {
    // Não falha o build se houver erros de tipo
    ignoreBuildErrors: true,
  },
  eslint: {
    // Não falha o build se houver erros de lint
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
  poweredByHeader: false,
};

module.exports = nextConfig;
