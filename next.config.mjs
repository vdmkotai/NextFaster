/** @type {import('next').NextConfig} */
const nextConfig = {
  // Note: cacheComponents disabled for now due to build timeouts
  // Enable this when ready to migrate to Cache Components mode
  // cacheComponents: true,
  reactCompiler: true,
  experimental: {
    inlineCss: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    minimumCacheTTL: 31536000,
    qualities: [65, 75, 80], // Added qualities used by images in the app
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bevgyjm5apuichhj.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
