/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Désactiver le prérendu statique pour éviter les erreurs liées aux API navigateur
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
