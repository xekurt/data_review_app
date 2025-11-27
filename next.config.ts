import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NODE_ENV === "production" ? "/data_review_app" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
