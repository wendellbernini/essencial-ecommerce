/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
    appDir: true,
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
    domains: [
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
    ],
  },
  typescript: {
    // !! AVISO: Isso deve ser temporário apenas para desenvolvimento
    ignoreBuildErrors: true,
  },
  eslint: {
    // !! AVISO: Isso deve ser temporário apenas para desenvolvimento
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
  poweredByHeader: false,
};

module.exports = nextConfig;
