/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  transpilePackages: ["@1/ui", "@1/tailwindcss-config"],
};

module.exports = nextConfig;
