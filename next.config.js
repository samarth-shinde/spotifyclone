/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true
};

const withVideos = require("next-videos");
withVideos({
  basePath: "/v2",

  webpack(config, options) {
    return config;
  }
});

module.exports = withVideos;
