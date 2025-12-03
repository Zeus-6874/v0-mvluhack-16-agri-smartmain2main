/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
    serverActions: true, // ✅ Needed for API server execution
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "libretranslate.com", // ✅ Allow LibreTranslate
      },
      {
        protocol: "https",
        hostname: "translate.argosopentech.com", // ✅ Backup server
      },
    ],
    unoptimized: true,
  },

  typescript: {
    ignoreBuildErrors: false,
  },
}

export default nextConfig
