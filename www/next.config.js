/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    STRAPI_API_URL: process.env.STRAPI_API_URL,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  transpilePackages: ["@1/ui", "@1/tailwindcss-config"],
};

module.exports = nextConfig;
