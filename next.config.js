/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "plus.unsplash.com",
      "source.unsplash.com",
      "api.dicebear.com",
      "res.cloudinary.com",
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
  output: "standalone",
};

module.exports = nextConfig;
