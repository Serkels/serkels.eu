/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@1/ui", "@1/tailwindcss-config"],
};

module.exports = nextConfig;
