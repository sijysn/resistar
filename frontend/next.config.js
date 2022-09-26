/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    emotion: true,
  },
});

module.exports = nextConfig;
