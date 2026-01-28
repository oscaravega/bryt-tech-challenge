import type { NextConfig } from "next";
import { env as _env } from "./env";

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
  experimental: {
    useCache: true,
    inlineCss: true,
  },
};

export default nextConfig;
