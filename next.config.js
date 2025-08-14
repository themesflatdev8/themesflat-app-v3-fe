/** @type {import('next').NextConfig} */
const path = require("path");
const execSync = require("child_process").execSync;
const lastCommitCommand = "git rev-parse HEAD";

const ENV = process.env.NODE_ENV;

const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  trailingSlash: ENV == "production" ? true : false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  // SVGR
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            typescript: true,
            icon: true,
          },
        },
      ],
    });
    return config;
  },
  env: {
    ROOT_API: process.env.ROOT_API,
    ROOT_URL: process.env.ROOT_URL,
    SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY,
    APP_EXTENSION_UUID: process.env.APP_EXTENSION_UUID,
    SHOPIFY_HOST: process.env.SHOPIFY_HOST,
    IS_TEST: process.env.IS_TEST,
  },
  async generateBuildId() {
    return execSync(lastCommitCommand).toString().trim();
  },
};

module.exports = nextConfig;
