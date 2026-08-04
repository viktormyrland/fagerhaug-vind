/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  // Emit a self-contained server bundle for the Cloud Run container image.
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'skydiveoppdal.no',
        pathname: '/wp-content/**',
      },
    ],
  }};

export default config;
